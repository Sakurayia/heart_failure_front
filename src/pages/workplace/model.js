import { queryStatistic, queryMonthPatient } from './service';

const Model = {
  namespace: 'dashboardAndworkplace',
  state: {
    statistic: {},
    monthNumber: []
  },
  effects: {
    *fetchStatistic(_, { call, put }) {
      const response = yield call(queryStatistic);
      yield put({
        type: 'save',
        payload: {
          statistic: response.data,
        },
      });
    },

    *fetchMonthPatient(_, { call, put }) {
      const response = yield call(queryMonthPatient);
      let monthNumber = response.data.map((item, index) => {
        return {
          x: `${index + 1}月`,
          y: item,
        }
      })
      yield put({
        type: 'save',
        payload: {
          monthNumber: monthNumber,
        }
      })
    }
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },

    clear() {
      return {
        statistic: {},
        monthNumber: []    
      };
    },
  },
};
export default Model;
