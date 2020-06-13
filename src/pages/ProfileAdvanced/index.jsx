import { PlusOutlined, DownOutlined, EllipsisOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Badge, Button, Card, Statistic, Descriptions, Divider, Dropdown, Menu, Popover, Steps, Table, Tooltip, Empty, Tabs, message } from 'antd';
import { GridContent, PageHeaderWrapper, RouteContext } from '@ant-design/pro-layout';
import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { connect } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import UpdatePatientForm from './components/UpdatePatientForm';
import { getAuthority } from '../../utils/authority';
import moment from 'moment';
import styles from './style.less';

const { Step } = Steps;
const { TabPane } = Tabs;
const ButtonGroup = Button.Group;
const mobileMenu = (
  <Menu>
    <Menu.Item key="1">修改病人信息</Menu.Item>
  </Menu>
);

const operationTabList = [
  {
    key: 'tab1',
    tab: '实验室测量结果',
  },
  {
    key: 'tab2',
    tab: '处方信息',
  },
  {
    key: 'tab3',
    tab: 'ICU治疗程序',
  },
];

const columns1 = [
  {
    title: '测量编号',
    dataIndex: 'itemid',
    key: 'itemid',
  },
  {
    title: '测量项目',
    dataIndex: 'itemid__label',
    key: 'itemid__label',
  },
  {
    title: '测量值',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: '单位',
    dataIndex: 'valueuom',
    key: 'valueuom',
  },
  {
    title: '测量液体',
    dataIndex: 'itemid__fluid',
    key: 'itemid__fluid',
  },
  {
    title: '数据类型',
    dataIndex: 'itemid__category',
    key: 'itemid__category',
  },
  {
    title: '状态',
    dataIndex: 'flag',
    key: 'flag',
    render: text => {
      if (text === 'abnormal') {
        return <Badge status="error" text="异常" />;
      }
      return <Badge status="success" text="正常" />;
    },
    filters: [
      {
        text: '正常',
        value: null,
      },
      {
        text: '异常',
        value: 'abnormal',
      }
    ],
    onFilter: (value, record) => record.flag == value
  },
];

const columns2 = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render: (text, record, index) => {
      return <span>{index + 1}</span>;
    },
  },
  {
    title: '标准药品编码',
    dataIndex: 'formulary_drug_cd',
    key: 'formulary_drug_cd',
  },
  {
    title: '通用序列号',
    dataIndex: 'gsn',
    key: 'gsn',
  },
  {
    title: '美国国家药品编码',
    dataIndex: 'ndc',
    key: 'ndc',
  },
  {
    title: '药品名称',
    dataIndex: 'drug',
    key: 'drug',
  },
  {
    title: '药品类型',
    dataIndex: 'drug_type',
    key: 'drug_type',
  },
  {
    title: '剂量',
    dataIndex: 'prod_strength',
    key: 'prod_strength',
  },
  {
    title: '给药途径',
    dataIndex: 'route',
    key: 'route',
  }
];

const columns3 = [
  {
    title: '治疗代码',
    dataIndex: 'cpt_number',
    key: 'cpt_number',
  },
  {
    title: '成本中心',
    dataIndex: 'costcenter',
    key: 'costcenter',
    render: (text, record, index) => {
      if(record.description) {
        return (
          <span>
            {text}
              <Tooltip title={record.description}>
                <InfoCircleOutlined
                  style={{
                    color: 'rgba(0, 0, 0, 0.43)',
                    marginLeft: 4,
                  }}
                />
              </Tooltip>
          </span>
        );
      } else
        return <span>{text}</span>;
    },
  },
  {
    title: '程序标题',
    dataIndex: 'sectionheader',
    key: 'sectionheader',
  },
  {
    title: '程序子标题',
    dataIndex: 'subsectionheader',
    key: 'subsectionheader',
  },
];

class Advanced extends Component {
  state = {
    operationKey: 'tab1',
    tabActiveKey: 'admissions1',
    admission: 0,
    patient: {},
    createModalVisible: false,
    patientModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const patient = this.props.location.state;
    this.setState({
      patient: patient
    })
    dispatch({
      type: 'profileAndadvanced/fetchAdvanced',
      payload: { subject_id: patient.subject_id },
      callback: res => {
        let hadm_id = res.map(item => item.hadm_id)
        dispatch({
          type: 'profileAndadvanced/fetchLabInfo',
          payload: { hadm_id: hadm_id }
        });
        dispatch({
          type: 'profileAndadvanced/fetchPrescriptionInfo',
          payload: { hadm_id: hadm_id }
        });
        dispatch({
          type: 'profileAndadvanced/fetchCptInfo',
          payload: { hadm_id: hadm_id }
        });
     }
    });
  }

  onOperationTabChange = key => {
    this.setState({
      operationKey: key,
    });
  };

  onTabChange = tabActiveKey => {
    let admission = tabActiveKey.replace(/[^0-9]/ig,"");
    this.setState({
      tabActiveKey,
      operationKey: 'tab1',
      admission: parseInt(admission) - 1,
    });
  };

  openCreateModal = () => {
    let authority = getAuthority();
    if(authority[0] == 'user') {
      message.error('权限不足！');
      return;
    }                   
    this.setState({
      createModalVisible: true,
    })
  };

  closeCreateModal = () => {
    this.setState({
      createModalVisible: false,
    })
  }

  openPatientModal = () => {
    let authority = getAuthority();
    if(authority[0] == 'user') {
      message.error('权限不足！');
      return;
    }                   
    this.setState({
      patientModalVisible: true,
    })
  }

  closePatientModal = () => {
    this.setState({
      patientModalVisible: false,
    })
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    const hide = message.loading('正在添加');
    try {
      dispatch({
        type: 'profileAndadvanced/addAdmissions',
        payload: { 
          subject_id: fields.subject_id,
          admittime: moment(fields.admittime).format("YYYY-MM-DD HH:mm:ss"),
          dischtime: moment(fields.dischtime).format("YYYY-MM-DD HH:mm:ss"),
          deathtime: fields.deathtime ? moment(fields.deathtime).format("YYYY-MM-DD HH:mm:ss") : null,
          admission_type: fields.admission_type,
          admission_location: fields.admission_location,
          discharge_location: fields.discharge_location,
          insurance: fields.insurance,
          language: this.state.patient.language,
          religion: this.state.patient.religion,
          marital_status: this.state.patient.marital_status,
          ethnicity: this.state.patient.ethnicity,
          edregtime: fields.edregtime ? moment(fields.edregtime).format("YYYY-MM-DD HH:mm:ss") : null,
          edouttime: fields.edouttime ? moment(fields.edouttime).format("YYYY-MM-DD HH:mm:ss") : null,
          diagnosis: fields.diagnosis || null,
          hospital_expire_flag: parseInt(fields.hospital_expire_flag),
          has_chartevents_data: 0,
        },
        callback: res => {
          let hadm_id = res.map(item => item.hadm_id)
          console.log(res)
          dispatch({
            type: 'profileAndadvanced/fetchLabInfo',
            payload: { hadm_id: hadm_id }
          });
          dispatch({
            type: 'profileAndadvanced/fetchPrescriptionInfo',
            payload: { hadm_id: hadm_id }
          });
          dispatch({
            type: 'profileAndadvanced/fetchCptInfo',
            payload: { hadm_id: hadm_id }
          });
        }
      })
      hide();
      message.success('添加成功');
      this.closeCreateModal();
    } catch (error) {
      hide();
      message.error('添加失败请重试！');
    }
  }

  handleUpdatePatient = fields => {
    const { dispatch } = this.props;
    const hide = message.loading('正在更新');

    try {
      dispatch({
        type: 'profileAndadvanced/updatePatient',
        payload: { ...fields },
        callback: res => {
          this.setState({
            patient: res,
          })
        }
      });
      hide();
      message.success('更新成功');
      this.closePatientModal();
    } catch (error) {
      hide();
      message.error('更新失败请重试！');
    }
  }

  render() {
    const { operationKey, tabActiveKey, admission, patient, createModalVisible, patientModalVisible } = this.state;
    const { profileAndadvanced, loading } = this.props;
    const { admissions, lab, drug, cpt } = profileAndadvanced;

    const action = (
      <RouteContext.Consumer>
        {({ isMobile }) => {
          if (isMobile) {
            return (
              <Dropdown.Button
                type="primary"
                icon={<DownOutlined />}
                overlay={  
                  <Menu>
                    <Menu.Item key="1"
                      onClick={this.openPatientModal.bind(this)}                      
                    >修改病人信息</Menu.Item>
                  </Menu>
                }
                placement="bottomRight"
                onClick={this.openCreateModal.bind(this)}
              >
                新增住院记录
              </Dropdown.Button>
            );
          }
    
          return (
            <Fragment>
              <ButtonGroup>
                <Button 
                  onClick={this.openPatientModal.bind(this)}
                >
                  修改病人信息
                </Button>
              </ButtonGroup>
              <Button 
                type="primary" 
                onClick={this.openCreateModal.bind(this)}
              >
                <PlusOutlined /> 新增住院记录
              </Button>
            </Fragment>
          );
        }}
      </RouteContext.Consumer>
    );    
    const description = (
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <Descriptions className={styles.headerList} size="small" column={isMobile ? 1 : 3}>
            <Descriptions.Item label="姓名">{patient.name}</Descriptions.Item>
            <Descriptions.Item label="性别">{patient.gender}</Descriptions.Item>
            <Descriptions.Item label="语言">{patient.language ? patient.language : '暂无数据'}</Descriptions.Item>
            <Descriptions.Item label="宗教信仰">{patient.religion ? patient.religion : '暂无数据'}</Descriptions.Item>
            <Descriptions.Item label="婚姻状况">{patient.marital_status ? patient.marital_status : '暂无数据'}</Descriptions.Item>
            <Descriptions.Item label="种族">{patient.ethnicity ? patient.ethnicity : '暂无数据'}</Descriptions.Item>
          </Descriptions>
        )}
      </RouteContext.Consumer>
    );
    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="年龄" value={patient.age} />
        <Statistic title="状态" value={patient.expire_flag == 1 ? '死亡' : '健康'} />
      </div>
    );    
    const tabList = admissions.map((item, index) => {
      return {
        key: `admissions${index + 1}`,
        tab: `住院记录${index + 1}`,
      }
    });
    const renderTabBar = (props, DefaultTabBar) => (
      <div></div>
    );
    const customDot = (dot, { index, status, title, description }) => {
      if (title === '入院') {
        return (
          <Tooltip placement="top" arrowPointAtCenter title={admissions[admission].admission_location}>
            {dot}
          </Tooltip>
        );
      } else if (title === '出院') {
        return (
          <Tooltip placement="top" arrowPointAtCenter title={admissions[admission].discharge_location}>
            {dot}
          </Tooltip>
        );
      }
      return dot;
    };    
    const contentList = {
      tab1: (
        <Table
          pagination={true}
          loading={loading}
          dataSource={lab[admission]}
          columns={columns1}
          rowKey={(text, record) => text.itemid}
        />
      ),
      tab2: (
        <Table
          pagination={true}
          loading={loading}
          dataSource={drug[admission]}
          columns={columns2}
          rowKey={(text, record) => text.row_id}
        />
      ),
      tab3: (
        <Table
          pagination={true}
          loading={loading}
          dataSource={cpt[admission]}
          columns={columns3}
          rowKey={(text, record) => text.row_id}
        />
      ),
    };
    return (
      <PageHeaderWrapper
        title={`病人编号：${patient.subject_id}`}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
        tabList={tabList}
      >
        <div className={styles.main}>
          <GridContent>
            <Tabs activeKey={tabActiveKey} renderTabBar={renderTabBar}>
              {admissions.map((item, index) => {
                const admittime = (
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <div>{item.admittime.replace(/T/," ")}</div>
                  </div>
                );
                const edregtime = (
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <div>{item.edregtime ? item.edregtime.replace(/T/," ") : null}</div>
                  </div>
                );
                const edouttime = (
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <div>{item.edouttime ? item.edouttime.replace(/T/," ") : null}</div>
                  </div>
                );
                const dischtime = (
                  <div className={classNames(styles.textSecondary, styles.stepDescription)}>
                    <div>{item.dischtime.replace(/T/," ")}</div>
                  </div>
                );
                return (
                  <TabPane key={`admissions${index + 1}`} tab={`admissions${index + 1}`}>
                    <Card
                      title="住院一览"
                      style={{
                        marginBottom: 24,
                      }}
                    >
                      <RouteContext.Consumer>
                        {({ isMobile }) => (
                          <Steps
                            direction={isMobile ? 'vertical' : 'horizontal'}
                            progressDot={customDot}
                            current={item.edouttime ? 3 : 1}
                            status={item.hospital_expire_flag ? "error" : "finish"}
                          >
                            {item.edregtime ? <Step title="进入急诊室" description={edregtime} /> : null}
                            <Step title="入院" description={admittime} />
                            {item.edouttime ? <Step title="离开急诊室" description={edouttime} /> : null}
                            <Step title={item.hospital_expire_flag ? "死亡" : "出院"} description={dischtime}/>
                          </Steps>
                        )}
                      </RouteContext.Consumer>
                    </Card>
                    <Card
                      title="住院信息"
                      style={{
                        marginBottom: 24,
                      }}
                      bordered={false}
                    >
                      <Descriptions
                        style={{
                          marginBottom: 16,
                        }}
                      >
                        <Descriptions.Item label="住院记录号">{item.hadm_id}</Descriptions.Item>
                        <Descriptions.Item label="住院类型">{item.admission_type}</Descriptions.Item>
                        <Descriptions.Item label="保险">{item.insurance}</Descriptions.Item>
                        <Descriptions.Item label="入院位置">{item.admission_location}</Descriptions.Item>
                        <Descriptions.Item label="出院位置">{item.discharge_location}</Descriptions.Item>
                        <Descriptions.Item label="住院时长">{item.stay_days + '天'}</Descriptions.Item>
                        <Descriptions.Item label="诊断信息">{item.diagnosis ? item.diagnosis : '暂无'}</Descriptions.Item>
                      </Descriptions>
                    </Card>
                    <Card
                      className={styles.tabsCard}
                      bordered={false}
                      tabList={operationTabList}
                      onTabChange={this.onOperationTabChange}
                    >
                      {contentList[operationKey]}
                    </Card>
                  </TabPane>
                )
              })}
            </Tabs>
          </GridContent>
        </div>
        <CreateForm
          onSubmit={async value => {
            this.handleAdd(value);   
          }}        
          onCancel={this.closeCreateModal} 
          modalVisible={createModalVisible}
          subject_id={patient.subject_id}>
        </CreateForm>
        <UpdatePatientForm
          onSubmit={async value => {
            this.handleUpdatePatient(value);
          }}
          onCancel={this.closePatientModal}
          updateModalVisible={patientModalVisible}
          values={patient}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ profileAndadvanced, loading }) => ({
  profileAndadvanced,
  loading: loading.effects['profileAndadvanced/fetchCptInfo'],
}))(Advanced);
