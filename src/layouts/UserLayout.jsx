import { DefaultFooter, getMenuData, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { Link, useIntl, connect } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import React from 'react';
import SelectLang from '@/components/SelectLang';
import logo from '../assets/Hospitalstandards.svg';
import styles from './UserLayout.less';

const UserLayout = props => {
  const {
    route = {
      routes: [],
    },
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: '',
    },
  } = props;
  const { formatMessage } = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
    breadcrumb,
    ...props,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>Heart Failure</span>
            </div>
            <div className={styles.desc}>心力衰竭病人管理系统</div>
          </div>
          {children}
        </div>
        <DefaultFooter
          copyright="2020 浙江大学数据库系统原理-ZJR"
          links={[
            {
              key: '浙江大学',
              title: '浙江大学',
              href: 'http://www.zju.edu.cn/',
              blankTarget: true,
            },
            {
              key: 'github',
              title: <GithubOutlined />,
              href: 'https://github.com/Zhoujiarui/heart_failure_front',
              blankTarget: true,
            },
            {
              key: '生仪学院',
              title: '生仪学院',
              href: 'http://www.cbeis.zju.edu.cn/cbeiscn/',
              blankTarget: true,
            },
          ]}          
        />
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }) => ({ ...settings }))(UserLayout);
