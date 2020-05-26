import request from 'umi-request';

export async function queryRule() {
  return request('http://www.test.com/backend/admins');
}
