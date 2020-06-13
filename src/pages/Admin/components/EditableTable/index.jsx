import React, { useContext, useState, useEffect, useRef } from 'react';
import { Table, Input, Button, Popconfirm, Form, Switch, Row, Col, Modal, message, Select, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { updateUser } from '../../../../services/user';

import './index.css'

const { Option } = Select;
const { Text } = Typography;
const formLayout = {
    labelCol: {
        span: 7,
    },
    wrapperCol: {
        span: 13,
    },
};  

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
        <Form form={form} component={false}>
            <EditableContext.Provider value={form}>
                <tr {...props} />
            </EditableContext.Provider>
        </Form>
    );
};

const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleChange,
    ...restProps
}) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef();
    const form = useContext(EditableContext);
    useEffect(() => {
        if (editing) {
            inputRef.current.focus();
        }
    }, [editing]);

    const toggleEdit = () => {
        setEditing(!editing);
        form.setFieldsValue({
            [dataIndex]: record[dataIndex],
        });
    };

    const save = async e => {
        try {
            const values = await form.validateFields();
            toggleEdit();
            handleChange({ ...record, ...values });
        } catch (errInfo) {
            console.log('Save failed:', errInfo);
        }
    };

    let childNode = children;

    if (editable) {
        childNode = editing ? (
            <Form.Item
                style={{
                    margin: 0,
                }}
                name={dataIndex}
                rules={[
                    {
                        required: true,
                        message: `${title}不能为空.`,
                    },
                ]}
            >
                <Input ref={inputRef} onPressEnter={save} onBlur={save} />
            </Form.Item>
        ) : (
                <div
                    className="editable-cell-value-wrap"
                    style={{
                        paddingRight: 24,
                    }}
                    onClick={toggleEdit}
                >
                    {children}
                </div>
            );
    }

    return <td {...restProps}>{childNode}</td>;
};

const handleUser = async (add, update, deleteUser) => {
    const hide = message.loading('正在保存');
  
    try {
      await updateUser({
          add: add,
          update: update,
          delete: deleteUser,
      });
      hide();
      message.success('保存成功');
      return true;
    } catch (error) {
      hide();
      message.error('保存失败请重试！');
      return false;
    }
  };  

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            isModalOpen: false,
            originArrayLength: 0,
            originUser: [],
        };
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                width: '20%',
                editable: true,
            },
            {
                title: '密码',
                dataIndex: 'password',
                width: '20%',
                editable: true,
            },
            {
                title: '权限',
                dataIndex: 'authority',
                editable: false,
                render: (text, record) => {
                    return (
                        <Form.Item
                            className="authority-form"
                            name="authority"
                            initialValue={record.authority}
                            rules={[
                                {
                                    required: true,
                                    message: '请选择权限'
                                },
                            ]}
                        >
                            <Select
                                placeholder="权限"
                                onChange={(value) => this.handleAuthorityChange(record.row_id, value)}
                            >
                                <Option value="admin">ADMIN</Option>
                                <Option value="user">USER</Option>
                            </Select>
                        </Form.Item>
                    )
                }
            },
            {
                title: '状态',
                dataIndex: 'status',
                render: (text, record) => {
                    return (
                        record.status?<Text strong>正常</Text>:<Text type="danger">禁用</Text>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    if(record.isDeletable) {
                        return (
                            <div>
                                <a onClick={() => this.handleStatusChange(record.row_id)}>{record.status?'禁用':'启用'}</a>
                                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                <Popconfirm title="确定要删除吗？" onConfirm={() => this.handleDelete(record.row_id)}>
                                    <a>删除</a>
                                </Popconfirm>
                            </div>
                        )    
                    } else {
                        return (
                            <div>
                                <Text disabled>{record.status?'禁用':'启用'}</Text>
                                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                                <Text disabled>删除</Text>
                            </div>
                        )
                    }
                }
            }    
        ];
        this.formRef = React.createRef();
    }

    componentDidMount(){
        let users_id = this.props.users.map((item, index) => {
            return item.row_id;
        })
        this.setState({
            users: this.props.users,
            originArrayLength: this.props.users.length,
            originUser: users_id,
        })
    }

    componentWillReceiveProps(nextProps){
        let users_id = nextProps.users.map((item, index) => {
            return item.row_id;
        })
        this.setState({
            users: nextProps.users,
            originArrayLength: nextProps.users.length,
            originUser: users_id,
        })
    }

    handleDelete = id => {
        const users = [...this.state.users];
        this.setState({
            users: users.filter(item => item.row_id != id),
        });
    };

    handleAdd = () => {
        this.setState({
            isModalOpen: true
        });
    };

    handleCancel = () => {
        this.setState({
            isModalOpen: false,
        })
    };

    handleOk = async () => {
        this.formRef.current.validateFields().then(values => {
            let newFormVals = values;

            let max = 0;
            let countSet = new Set();
            let id;
            let users = [...this.state.users]; 
    
            for(let i = 0; i < users.length; i ++) {
                if(users[i].row_id > max && users[i].row_id > 0) {
                    max = users[i].row_id;
                }
                countSet.add(users[i].row_id);
            }
            for(let i = 1; i < max; i ++) {
                if(!countSet.has(i)) id = i;
            }
            if(id == undefined) id = max + 1;
    
            let newuser = {
                row_id: id,
                ...newFormVals,
                status: 1,
                isDeletable: 1,
            }
            users.push(newuser);
            this.setState({
                users: users,
                isModalOpen: false,
            })    
        })
    }

    handleChange = row => {
        const newData = [...this.state.users];
        const index = newData.findIndex(item => row.row_id === item.row_id);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            users: newData,
        });
    }

    handleAuthorityChange = (id, value) => {
        let users = [...this.state.users];
        let index = users.findIndex(item => id === item.row_id);
        let item = users[index];
        users.splice(index, 1, { ...item, authority: value });
        this.setState({
            users: users,
        })
    }

    handleStatusChange = id => {
        let users = [...this.state.users];
        let index = users.findIndex(item => id === item.row_id);
        let item = users[index];
        let status = 1;
        if(item.status) { status = 0;}
        users.splice(index, 1, { ...item, status: status });
        this.setState({
            users: users,
        })
    }

    saveChange(){
        let users = [...this.state.users];
        let modifyUser = [];
        let addUser = [];
        let deleteUser = [];

        if(users.length >= this.state.originArrayLength) {
            addUser = users.filter((item, index) => index + 1 > this.state.originArrayLength);
            modifyUser = users.filter((item, index) => index + 1 <= this.state.originArrayLength);    
        } else {
            let new_id = users.map((item, index) => { return item.row_id;})
            let id = this.state.originUser.filter((item, index) => !new_id.includes(item));
            modifyUser = users;
            deleteUser = id;
        }
        if(handleUser(addUser, modifyUser, deleteUser)){
            let users_id = users.map((item, index) => {
                return item.row_id;
            })    
            this.setState({
                originArrayLength: users.length,
                originUser: users_id,
            })
        }
    }

    render() {
        const { users } = this.state;
        const components = {
            body: {
                row: EditableRow,
                cell: EditableCell,
            },
        };
        const columns = this.columns.map(col => {
            if (!col.editable) {
                return col;
            }

            return {
                ...col,
                onCell: record => ({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleChange: this.handleChange,
                }),
            };
        });

        return (
            <div className="EditableTableBox">
                <Row justify="end">
                    <Col span={4}>
                        <Button
                            icon={<PlusOutlined />}
                            onClick={this.handleAdd}
                            type="primary"
                            style={{
                                marginBottom: 16,
                            }}
                        >
                            添加账号
                        </Button>
                        <Modal
                            width={640}
                            bodyStyle={{
                                padding: '32px 35px 48px',
                            }}                        
                            title="添加账号"
                            visible={this.state.isModalOpen}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            destroyOnClose={true}
                        >
                            <Form ref={this.formRef} {...formLayout}>
                                <Form.Item
                                    name="username"
                                    label='用户名'
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                        },
                                    ]}
                                >
                                    <Input placeholder="请输入用户名" allowClear={true}/>
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    label='密码'
                                    validateTrigger={['onChange', 'onBlur']}
                                    rules={[
                                        {
                                            required: true,
                                            whitespace: true,
                                        },
                                    ]}
                                >
                                    <Input.Password placeholder="请输入密码"/>
                                </Form.Item>
                                <Form.Item
                                    name="authority"
                                    label='权限'
                                    rules={[
                                        {
                                            required: true,
                                            message: '请选择权限'
                                        },
                                    ]}
                                >
                                    <Select
                                        placeholder="权限"
                                    >
                                        <Option value="admin">ADMIN</Option>
                                        <Option value="user">USER</Option>
                                    </Select>
                                </Form.Item>
                            </Form>
                        </Modal>
                    </Col>
                </Row>
                <Table
                    components={components}
                    rowClassName={() => 'editable-row'}
                    rowKey={(text, record) => text.row_id}
                    dataSource={users}
                    columns={columns}
                />
                <Row justify="end">
                    <Col span={4}>
                        <Popconfirm title="确定要保存吗？" onConfirm={this.saveChange.bind(this)}>
                            <Button
                                icon={<CheckOutlined />}
                                type="primary"
                                style={{
                                    marginTop: 16,
                                }}
                            >
                                保存更改
                            </Button>
                        </Popconfirm>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default EditableTable;