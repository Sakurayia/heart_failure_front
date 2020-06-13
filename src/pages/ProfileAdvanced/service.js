import request from 'umi-request';

export async function queryAdvancedProfile(params) {
  return request('http://host/fetch_admission_info', {
    method: 'POST',
    data: JSON.stringify(params),
  });
}

export async function queryLabInfo(params) {
  return request('http://host/fetch_lab_info', {
    method: 'POST',
    data: JSON.stringify(params),
  })
}

export async function queryPrescriptionInfo(params) {
  return request('http://host/fetch_prescription', {
    method: 'POST',
    data: JSON.stringify(params),
  })
}

export async function queryCptInfo(params) {
  return request('http://host/fetch_cpt_info', {
    method: 'POST',
    data: JSON.stringify(params),
  })
}

export async function addAdmission(params) {
  return request('http://host/add_admission', {
    method: 'POST',
    data: JSON.stringify(params),
  })
}

export async function updatePatientInfo(params) {
  return request('http://host/modify_patient', {
    method: 'POST',
    data: JSON.stringify(params),
  })
}
