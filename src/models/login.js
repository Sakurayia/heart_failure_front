import { stringify } from 'querystring';
import { history } from 'umi';
import { fakeAccountLogin, Login } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';

const Model = {
  namespace: 'login',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(Login, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 200) {
        localStorage.setItem('antd-pro-username', payload.username);
        const urlParams = new URL(window.location.href);
        //const params = getPageQuery();
        let redirect = urlParams.origin + '/home';

        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/home';
            return;
          }
        }

        history.replace('/home');
      }
    },

    logout() {
      const { redirect } = getPageQuery(); // Note: There may be security issues, please note

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.authority);
      return { ...state, status: payload.status, type: 'account' };
    },
  },
};
export default Model;
