import request from '@/utils/request';

export async function queryPatients(params) {
  return request('http://host/fetch_patients', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function removePatients(params) {
  return request('http://host/delete_patient', {
    method: 'POST',
    data: JSON.stringify({ ...params, method: 'delete' }),
  });
}
export async function addPatients(params) {
  return request('http://host/add_patient', {
    method: 'POST',
    data: JSON.stringify({ ...params, method: 'post' }),
  });
}
export async function updatePatients(params) {
  return request('http://host/modify_patient', {
    method: 'POST',
    body: JSON.stringify({ ...params, method: 'update' }),
  });
}
