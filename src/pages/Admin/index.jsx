import React, { useContext, useState, useEffect, useRef } from 'react';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Card, Form, Input, Button, Col, Row, Select } from 'antd';
import EditableTable from './components/EditableTable';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'umi';

class Admin extends React.Component {
  state = {
    users: [],
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUsers',
      callback: res => {
        this.setState({
          users: res,
        })
      }
    });
  }

  onFinish = values => {
    console.log('Received values of form:', values);
  }

  handleSave = field => {
    let { users } = this.state;
    users[field.index] = { ...users[field.index], ...field.values }
    this.setState({
      users: users,
    })
  }

  render() {
    const { loading } = this.props;
    const { users } = this.state;

    return (
      <PageHeaderWrapper>
        <Card
          title="账号信息"
          style={{
            marginBottom: 24,
          }}
          bordered={false} 
          loading={loading}       
        >
          <EditableTable 
            users={users}
          />
        </Card>
      </PageHeaderWrapper>  
    )
  }
}

export default connect(({ userdata, loading }) => ({
  userdata,
  loading: loading.effects[''],
}))(Admin);
