import { queryAdvancedProfile, queryLabInfo, queryPrescriptionInfo, queryCptInfo, addAdmission, updatePatientInfo } from './service';
import moment from 'moment';

const Model = {
  namespace: 'profileAndadvanced',
  state: {
    admissions: [],
    lab: [],
    drug: [],
    cpt: [],
  },
  effects: {
    *fetchAdvanced({ payload, callback }, { call, put }) {
      const response = yield call(queryAdvancedProfile, payload);
      yield put({
        type: 'show',
        payload: response,
      });
      if (callback) callback(response.admissions);
    },
    *fetchLabInfo({ payload }, { call, put }) {
      const response = yield call(queryLabInfo, payload);
      yield put({
        type: 'addLab',
        payload: response,
      });
    },
    *fetchPrescriptionInfo({ payload }, { call, put }) {
      const response = yield call(queryPrescriptionInfo, payload);
      yield put({
        type: 'addPrescription',
        payload: response,
      });
    },
    *fetchCptInfo({ payload }, { call, put }) {
      const response = yield call(queryCptInfo, payload);
      yield put({
        type: 'addCpt',
        payload: response,
      });
    },
    *addAdmissions({ payload, callback }, { call, put }) {
      const response = yield call(addAdmission, payload);
      yield put({
        type: 'addAdmission',
        payload: { ...payload, hadm_id: response.new_hadm_id },
      });
      if (callback) callback(response.hadm_id);
    },
    *updatePatient({ payload, callback }, { call, put }) {
      const response = yield call(updatePatientInfo, payload);
      yield put({
        type: 'afterupdatePatient',
        payload: { ...payload, status: response},
      });
      if(callback) callback(payload);
    }
  },
  reducers: {
    show(state, { payload }) {
      return { ...state, ...payload };
    },
    addLab(state, { payload }) {
      return { ...state, ...payload };
    },
    addPrescription(state, { payload }) {
      return { ...state, ...payload };
    },
    addCpt(state, { payload }) {
      return { ...state, ...payload };
    },
    addAdmission(state, { payload }) {
      let newAdmissions = state.admissions;
      let stay_days = moment(payload.dischtime).diff(moment(payload.admittime), 'days');
      newAdmissions.push({
        subject_id: payload.subject_id,
        hadm_id: payload.hadm_id,
        admittime: payload.admittime,
        dischtime: payload.dischtime,
        deathtime: payload.deathtime,
        admission_type: payload.admission_type,
        admission_location: payload.admission_location,
        discharge_location: payload.discharge_location,
        insurance: payload.insurance,
        edregtime: payload.edregtime,
        edouttime: payload.edouttime,
        diagnosis: payload.diagnosis,
        hospital_expire_flag: payload.hospital_expire_flag,
        stay_days: stay_days,
      })
      return { 
        ...state,
        admissions: newAdmissions,
      }
    },
    afterupdatePatient(state, { payload }) {
      return { ...state };
    },
  },
};
export default Model;
