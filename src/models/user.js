import { queryCurrent, query as queryUsers, queryAllUsers } from '@/services/user';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    users: [],
  },
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },

    *fetchUsers({ callback }, { call, put }) {
      const response = yield call(queryAllUsers);
      yield put({
        type: 'saveUsers',
        payload: response.data,
      });
      if(callback) callback(response.data);
    }
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },

    saveUsers(state, { payload }) {
      return {
        ...state,
        users: payload,
      };
    },
  },
};
export default UserModel;
