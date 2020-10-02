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
  const result = request('/api/backend/models');
  const old = [
    {
      name: 'admin-list',
      icon: 'icon-user',
      path: '/search-list/backend/admins',
      component: './BasicList',
    },
    {
      name: 'group-list',
      icon: 'icon-team',
      path: '/search-list/backend/groups',
      component: './BasicList',
    },
    {
      name: 'rule-list',
      icon: 'icon-table',
      path: '/search-list/backend/rules',
      component: './BasicList',
    },
    {
      name: 'model-design',
      icon: 'icon-table',
      path: '/model-design',
      component: './ModelDesign',
    },
    {
      path: '/search-list/page',
      // layout: false,
      component: './BasicList/SinglePage',
    },
  ];
  return old.concat(result);
}
