import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input, Popconfirm } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link } from 'umi';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { getAuthority } from '../../utils/authority';
import { queryCaregivers, updateCaregivers, addCaregivers, removeCaregivers } from './service';
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addCaregivers({
      name: fields.name,
      label: fields.label || null,
      description: fields.description || null,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在更新');

  try {
    await updateCaregivers({
      cgid: fields.cgid,
      name: fields.name,
      label: fields.label || null,
      description: fields.description || null,
    });
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeCaregivers({
      cgid: selectedRows.map(row => row.cgid),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

const TableList = () => {
  const [sorter, setSorter] = useState('');
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: '医生编号',
      dataIndex: 'cgid',
      sorter: (a, b) => {
        return a.cgid - b.cgid;
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <span>{text}</span>
        )
      }
    },
    {
      title: '标签',
      dataIndex: 'label',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              let authority = getAuthority();
              if(authority[0] == 'user') {
                message.error('权限不足！');
              } else {
                handleUpdateModalVisible(true);
                setStepFormValues(record);
              }              
            }}
          >
            修改
          </a>
          <Divider type="vertical" />
          <Popconfirm
            placement="topRight"
            title="确定要删除吗？"
            onConfirm={async () => {
              let authority = getAuthority();
              if(authority[0] == 'user') {
                message.error('权限不足！');
              } else {  
                await handleRemove([record]);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              }
            }}
            okText="确定"
            cancelText="取消"
          >
            <a>删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="医生一览"
        actionRef={actionRef}
        rowKey={(text, record) => text.row_id}
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter;

          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button 
            type="primary" 
            onClick={() => {
              let authority = getAuthority();
              if(authority[0] == 'user') {
                message.error('权限不足！');
              } else {
                handleModalVisible(true)
              }            
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Popconfirm
              placement="topRight"
              title="确定要删除吗？"
              onConfirm={async () => {
                let authority = getAuthority();
                if(authority[0] == 'user') {
                  message.error('权限不足！');
                } else {  
                  await handleRemove(selectedRows);
                  action.reload();
                }
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button>
                批量删除
              </Button>
            </Popconfirm>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys, selectedRows }) => (
          <div>
            已选择{' '}
            <a
              style={{
                fontWeight: 600,
              }}
            >
              {selectedRowKeys.length}
            </a>{' '}
            项
          </div>
        )}
        request={params => queryCaregivers(params)}
        columns={columns}
        rowSelection={{}}
      />
      <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);
      
          if (success) {
            handleModalVisible(false);
        
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}        
        onCancel={() => handleModalVisible(false)} 
        modalVisible={createModalVisible}>
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};

export default TableList;
