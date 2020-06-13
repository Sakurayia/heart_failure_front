import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Typography, Alert } from 'antd';
import styles from './Welcome.less';
import numeral from 'numeral';

const yuan = val => `¥ ${numeral(val).format('0,0')}`;

const CodePreview = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

class Welcome extends Component {
  componentDidMount() {
    console.log("finish");
  }

  render() {
    return (
      <PageHeaderWrapper>
      </PageHeaderWrapper>  
    );
  }
}

export default Welcome;
