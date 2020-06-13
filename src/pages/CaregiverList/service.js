import request from '@/utils/request';

export async function queryCaregivers(params) {
  return request('http://host/fetch_caregiver', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}
export async function removeCaregivers(params) {
  return request('http://host/delete_caregiver', {
    method: 'POST',
    data: JSON.stringify({ ...params, method: 'delete' }),
  });
}
export async function addCaregivers(params) {
  return request('http://host/add_caregiver', {
    method: 'POST',
    data: JSON.stringify({ ...params, method: 'post' }),
  });
}
export async function updateCaregivers(params) {
  return request('http://host/modify_caregiver', {
    method: 'POST',
    body: JSON.stringify({ ...params, method: 'update' }),
  });
}
