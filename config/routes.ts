export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
    ],
  },
  {
    path: '/basic-list/api/models/field-design/*',
    component: './ModelDesign/design/Field',
  },
  {
    path: '/basic-list/api/models/layout-design/*',
    component: './ModelDesign/design/Layout',
  },
  {
    path: '/basic-list/translate/api/*/*',
    component: './BasicList/component/Translate',
  },
  {
    path: '/basic-list/api/*/*',
    component: './BasicList/component/Page',
  },
  {
    name: 'basic-list',
    icon: 'table',
    path: '/basic-list/*',
    component: './BasicList',
  },
  {
    path: '/api',
    component: './Api',
    layout: false,
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
