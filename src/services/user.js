import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}
export async function queryAllUsers(params) {
  return request('http://host/fetch_user', {
    method: 'POST',
    data: JSON.stringify(params),
  })
}
export async function updateUser(params) {
  console.log(params)
  return request('http://host/update_user', {
    method: 'POST',
    data: JSON.stringify(params),
  })
}
