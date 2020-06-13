import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Dropdown, Menu, message, Input, Popconfirm, Row, Col, Card } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Link } from 'umi';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import Pie from '../../components/Charts/Pie';
import Bar from '../../components/Charts/Bar';
import WaterWave from '../../components/Charts/WaterWave';
import { getAuthority } from '../../utils/authority';
import { queryPatients, updatePatients, addPatients, removePatients } from './service';
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addPatients({
      name: fields.name,
      gender: fields.gender,
      age: fields.age,
      language: fields.language || null,
      religion: fields.religion || null,
      marital_status: fields.marital_status || null,
      ethnicity: fields.ethnicity || null,
      expire_flag: fields.expire_flag
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
    await updatePatients({
      subject_id: fields.subject_id,
      name: fields.name,
      gender: fields.gender,
      age: fields.age,
      language: fields.language,
      religion: fields.religion,
      marital_status: fields.marital_status,
      ethnicity: fields.ethnicity,
      expire_flag: fields.expire_flag
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
    await removePatients({
      subject_id: selectedRows.map(row => row.subject_id),
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
  const [gender, setGender] = useState([]);
  const [age, setAge] = useState([]);
  const [status, setStatus] = useState(0);
  const [chartLoading, handleChartLoading] = useState(true);
  const actionRef = useRef();
  const columns = [
    {
      title: '病人编号',
      dataIndex: 'subject_id',
      sorter: (a, b) => {
        return a.subject_id - b.subject_id;
      }
    },
    {
      title: '姓名',
      dataIndex: 'name',
      render: (text, record) => {
        return (
          <Link to={{
            pathname: '/list/profileadvanced',
            state: { ...record }
          }}>
            <span>{text}</span>
          </Link>
        )
      }
    },
    {
      title: '性别',
      dataIndex: 'gender',
      filters: [
        {
          text: 'M',
          value: 'M',
        },
        {
          text: 'F',
          value: 'F',
        },
      ],
      onFilter: (value, record) => record.gender == value,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      sorter: (a, b) => {
        return a.age - b.age;
      }
    },
    {
      title: '语言',
      dataIndex: 'language',
    },
    {
      title: '宗教信仰',
      dataIndex: 'religion',
    },
    {
      title: '婚姻状况',
      dataIndex: 'marital_status',
    },
    {
      title: '种族',
      dataIndex: 'ethnicity',
    },
    {
      title: '状态',
      dataIndex: 'expire_flag',
      valueEnum: {
        0: {
          text: '健康',
          status: 'Success',
        },
        1: {
          text: '逝世',
          status: 'Default',
        },
      },
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

  const handleData = data => {
    handleChartLoading(true)
    if(data.length == 0){
      setGender([{x: '男', y: 0}, {x: '女', y: 0}]);
      setAge([{x: '30岁以下', y: 0}, {x: '30~40', y: 0}, {x: '40~50', y: 0}, {x: '50~60', y: 0}, {x: '60~70', y: 0}, {x: '70~80', y: 0}, {x: '80岁以上', y: 0}]);
      setStatus(0);
      handleChartLoading(false);
      return;
    }
    let male = data.filter((item, index) => item.gender == 'M').length;
    let female = data.filter((item, index) => item.gender == 'F').length;
    let genderData = [
      {
        x: '男',
        y: male
      },
      {
        x: '女',
        y: female
      }
    ];
    setGender(genderData)

    let ageData = [{x: '30岁以下', y: 0}, {x: '30~40', y: 0}, {x: '40~50', y: 0}, {x: '50~60', y: 0}, {x: '60~70', y: 0}, {x: '70~80', y: 0}, {x: '80岁以上', y: 0}]
    data.forEach((item, index) => {
      if(item.age <= 30) ageData[0].y ++;
      else if(item.age > 30 && item.age <= 40) ageData[1].y ++;
      else if(item.age > 40 && item.age <= 50) ageData[2].y ++;
      else if(item.age > 50 && item.age <= 60) ageData[3].y ++;
      else if(item.age > 60 && item.age <= 70) ageData[4].y ++;
      else if(item.age > 70 && item.age <= 80) ageData[5].y ++;
      else if(item.age >= 80) ageData[6].y ++;
    });
    setAge(ageData)

    let healthy = data.filter((item, index) => item.expire_flag == 0).length;
    setStatus(parseInt(healthy/data.length * 100));

    handleChartLoading(false);
  }

  return (
    <PageHeaderWrapper>
      <Row gutter={24} style={{marginTop: 24}}>
        <Col span={8}>
          <Card
            style={{
              marginBottom: 24,
            }}
            title="性别"
            bordered={false}
            loading={chartLoading}            
          >
            <Pie
              hasLegend
              title="性别分布"
              subTitle="性别分布"
              total={() => (
                <span
                  dangerouslySetInnerHTML={{
                    __html: gender.reduce((pre, now) => now.y + pre, 0),
                  }}
                />
              )}
              data={gender}
              height={204}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              marginBottom: 24,
            }}
            title="年龄"
            bordered={false}
            loading={chartLoading}                        
          >
            <Bar height={294} title="年龄分布" data={age} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            style={{
              marginBottom: 24,
            }}
            title="状态"
            bordered={false}
            loading={chartLoading}                                    
          >
            <div style={{ textAlign: 'center' }}>
              <WaterWave height={294} title="出院比例" percent={status} />
            </div>
          </Card>
        </Col>
      </Row>
      <ProTable
        headerTitle="病人一览"
        actionRef={actionRef}
        rowKey={(text, record) => text.row_id}
        onChange={(_, _filter, _sorter, {currentDataSource}) => {
          const sorterResult = _sorter;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
          if(_filter.gender || _filter.expire_flag){
            handleData(currentDataSource);
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
        request={params => queryPatients(params)}
        onLoad={(data) => handleData(data)}
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
