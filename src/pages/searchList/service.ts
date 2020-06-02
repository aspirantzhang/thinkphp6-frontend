import request from 'umi-request';

export async function queryRule() {
  return request('http://www.test.com/backend/admins');
}

export async function searchExpand(value: boolean) {
  return request(`http://www.test.com/backend/admins?searchExpand=${value ? 'true' : 'false'}`);
}
