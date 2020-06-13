import request from 'umi-request';

export async function queryStatistic() {
  return request('http://host/fetch_home_statistic');
}
export async function queryMonthPatient() {
  return request('http://host/fetch_month_patient');
}
