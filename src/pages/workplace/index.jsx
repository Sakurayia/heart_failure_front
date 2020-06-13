import { Avatar, Card, Col, List, Skeleton, Row, Statistic } from 'antd';
import { MehTwoTone } from '@ant-design/icons';
import React, { Component } from 'react';
import { Link, connect } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import Bar from '../../components/Charts/Bar'
import EditableLinkGroup from './components/EditableLinkGroup';
import PatientMale from '../../../public/Patient-male.png';
import PatientMan from '../../../public/Patient-man.png';
import { getAuthority } from '../../utils/authority';
import styles from './style.less';

const links = [
  {
    title: '病人管理',
    href: '/list',
  },
  {
    title: '医生管理',
    href: '/caregiver',
  },
  {
    title: '权限分配',
    href: '/admin',
  },
];

const PageHeaderContent = ({ username, authority }) => {

  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={PatientMan} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          欢迎，
          {username}
          ，祝你开心每一天！
        </div>
        <div>
          {authority == 'admin' ? '系统管理员 | 管理维护组' : '用户 | 用户组'}
        </div>
      </div>
    </div>
  );
};

const ExtraContent = ({ statistic }) => (
  <div className={styles.extraContent}>
    <div className={styles.statItem}>
      <Statistic title="现存病人" value={statistic ? statistic.healthyPatient : 0} suffix={`/ ${statistic ? statistic.totalPatient : 0}`} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="住院记录数" value={statistic ? statistic.totalAdmission : 0} />
    </div>
    <div className={styles.statItem}>
      <Statistic title="医生总数" value={statistic ? statistic.totalCaregiver: 0} />
    </div>
  </div>
);

class Workplace extends Component {
  state = {
    username: '',
    authority: '',
  }
  componentDidMount() {
    const { dispatch } = this.props;
    let username = localStorage.getItem('antd-pro-username') || 'user';
    let authority = getAuthority();
    this.setState({
      username: username,
      authority: authority[0],
    })
    dispatch({
      type: 'dashboardAndworkplace/fetchStatistic',
    });
    dispatch({
      type: 'dashboardAndworkplace/fetchMonthPatient',
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboardAndworkplace/clear',
    });
  }

  renderActivities = item => {
    return (
      <List.Item key={item.row_id}>
        <List.Item.Meta
          avatar={<Avatar src={PatientMale} />}
          title={
            <span>
              <Link to={{
                pathname: '/list/profileadvanced',
                state: { 
                  subject_id: item.subject_id,
                  name: item.subject_id__name,
                  gender: item.subject__gender,
                  age: item.subject__age,
                  language: item.subject__language,
                  religion: item.subject__religion,
                  marital_status: item.subject__marital_status,
                  ethnicity: item.subject__ethnicity,
                  expire_flag: item.subject__expire_flag,
                 }
              }}>
                <span className={styles.username}>{item.subject_id__name}</span>
              </Link>
              &nbsp;
              <span className={styles.event}>{`因前往 ${item.discharge_location} 出院`}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={moment(moment(item.dischtime).subtract(100, 'y')).format("YYYY-MM-DD")}>
              {moment(moment(item.dischtime).subtract(100, 'y')).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  render() {
    const { statisticLoading, chartLoading, statistic, monthNumber } = this.props;
    const { username, authority } = this.state;

    let latestPatient, latestAdmission, latestCaregiver;
    if(statistic == null || statistic == undefined || Object.keys(statistic).length == 0){
      latestPatient = [];
      latestAdmission = [];
      latestCaregiver = [];
    } else {
      latestPatient = statistic.latestPatient;
      latestAdmission = statistic.latestAdmission;
      latestCaregiver = statistic.latestCaregiver;
    }

    return (
      <PageHeaderWrapper
        content={<PageHeaderContent username={username} authority={authority} />}
        extraContent={<ExtraContent statistic={statistic}/>}
      >
        <Row gutter={24}>
          <Col xl={16} lg={24} md={24} sm={24} xs={24}>
            <Card
              className={styles.projectList}
              style={{
                marginBottom: 24,
              }}
              title="最新添加的病人"
              bordered={false}
              extra={<Link to="/list">全部病人</Link>}
              loading={statisticLoading}
              bodyStyle={{
                padding: 0,
              }}
            >
              {latestPatient.map(item => (
                <Card.Grid className={styles.projectGrid} key={item.row_id}>
                  <Card
                    bodyStyle={{
                      padding: 0,
                    }}
                    bordered={false}
                  >
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Avatar size="small" src={PatientMale} />
                          <Link to={{
                            pathname: '/list/profileadvanced',
                            state: { ...item }
                          }}>
                            <span>{item.name}</span>
                          </Link>
                        </div>
                      }
                      description={`${item.gender == 'M'? '男' : '女'}，${item.age}岁（病人详情及住院记录请点击上方姓名）`}
                    />
                    <div className={styles.projectItemContent}>
                      <span>{item.marital_status || ''}</span>
                      {item.expire_flag && (
                        <span className={styles.datetime} >
                          {item.expire_flag == 0 ? '健康': '死亡'}
                        </span>
                      )}
                    </div>
                  </Card>
                </Card.Grid>
              ))}
            </Card>
            <Card
              bodyStyle={{
                padding: 0,
              }}
              bordered={false}
              className={styles.activeCard}
              title="动态"
              loading={statisticLoading}
            >
              <List
                loading={statisticLoading}
                renderItem={item => this.renderActivities(item)}
                dataSource={latestAdmission}
                className={styles.activitiesList}
                size="large"
              />
            </Card>
          </Col>
          <Col xl={8} lg={24} md={24} sm={24} xs={24}>
            <Card
              style={{
                marginBottom: 24,
              }}
              title="快速开始 / 便捷导航"
              bordered={false}
              bodyStyle={{
                padding: 0,
              }}
            >
              <EditableLinkGroup onAdd={() => {}} links={links} linkElement={Link} />
            </Card>
            <Card
              style={{
                marginBottom: 24,
              }}
              bordered={false}
              title="人流量统计"
              loading={chartLoading}
            >
              <div className={styles.chart}>
                <Bar height={200} data={monthNumber} />
              </div>
            </Card>
            <Card
              bodyStyle={{
                paddingTop: 12,
                paddingBottom: 12,
              }}
              bordered={false}
              title="医生团队"
              loading={statisticLoading}
            >
              <div className={styles.members}>
                <Row gutter={48}>
                  {latestCaregiver.map(item => (
                    <Col span={12} key={`members-item-${item.row_id}`}>
                      <Link>
                      <Avatar src={PatientMan} size="small" />
                      <span className={styles.member}>{`${item.name}`}</span>
                      </Link>
                    </Col>
                  ))}
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </PageHeaderWrapper>
    );
  }
}

export default connect(
  ({ dashboardAndworkplace: { statistic, monthNumber }, loading }) => ({
    statistic,
    monthNumber,
    statisticLoading: loading.effects['dashboardAndworkplace/fetchStatistic'],
    chartLoading: loading.effects['dashboardAndworkplace/fetchMonthPatient'],
  }),
)(Workplace);
