import { request } from 'umi';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/currentUser');
}

export async function queryNotices(): Promise<any> {
  return request<{ data: API.NoticeIconData[] }>('/api/notices');
}

export async function queryMenu() {
  // const result = request('/api/backend/models');
  // const old = [
  //   {
  //     name: 'model-list',
  //     icon: 'icon-table',
  //     path: '/basic-list/backend/models',
  //     component: './BasicList/index',
  //   },
  //   {
  //     name: 'admin-list',
  //     icon: 'icon-user',
  //     path: '/basic-list/backend/admins',
  //     component: './BasicList/index',
  //   },
  //   {
  //     name: 'group-list',
  //     icon: 'icon-team',
  //     path: '/basic-list/backend/groups',
  //     component: './BasicList/index',
  //   },
  //   {
  //     name: 'rule-list',
  //     icon: 'icon-table',
  //     path: '/basic-list/backend/rules',
  //     component: './BasicList/index',
  //   },
  //   // {
  //   //   name: 'model-design',
  //   //   icon: 'icon-table',
  //   //   path: '/model-design',
  //   //   component: './ModelDesign/index',
  //   // },
  //   {
  //     path: '/basic-list/page',
  //     // layout: false,
  //     component: './BasicList/SinglePage/index',
  //   },
  // ];
  // return old.concat(result);
}
