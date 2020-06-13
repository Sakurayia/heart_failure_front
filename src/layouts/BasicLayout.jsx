/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, useIntl, connect } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/Hospitalstandards.svg';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="对不起，您没有权限查看此页面！"
    extra={
      <Button type="primary">
        <Link to="/user/login">前往重新登录</Link>
      </Button>
    }
  />
);

/**
 * use Authorized check all menu item
 */
const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item, children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  });

const defaultFooterDom = (
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
);

const BasicLayout = props => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  /**
   * constructor
   */

  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };
  const { formatMessage } = useIntl();
  return (
    <ProLayout
      logo={logo}
      formatMessage={formatMessage}
      menuHeaderRender={(logoDom, titleDom) => (
        <Link to="/home">
          {logoDom}
          {titleDom}
        </Link>
      )}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }

        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/main',
          breadcrumbName: formatMessage({
            id: 'menu.home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings }) => ({
  collapsed: global.collapsed,
  settings,
}))(BasicLayout);
