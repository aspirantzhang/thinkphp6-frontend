import { request } from 'umi';
import { getApiBase } from '@/utils/utils';

export async function query() {
  return request<API.CurrentUser[]>('/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>(getApiBase() + '/backend/admins/info');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/notices');
}

export async function queryMenu() {
  return request(getApiBase() + '/backend/menus/backend');
}
