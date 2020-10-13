// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    name: 'Ant Design Pro',
    locale: true,
    siderWidth: 208,
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },

    {
      path: '/basic-list/:app/:controller',
      component: './BasicList',
    },
    {
      path: '/basic-list/:app/:controller/:action',
      component: './BasicList/SinglePage',
    },

    // {
    //   path: '/basic-list/:page*',
    //   component: './BasicList',
    // },
    // {
    //   path: '/single-page/:page*',
    //   component: './BasicList/SinglePage',
    // },
    {
      path: '/',
      redirect: '/welcome',
    },
    {
      component: './404',
    },

    // {
    //   path: '/welcome',
    //   name: 'welcome',
    //   icon: 'smile',
    //   component: './Welcome',
    // },
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
    // {
    //   name: 'list.table-list',
    //   icon: 'table',
    //   path: '/list',
    //   component: './ListTableList',
    // },
    // {
    //   name: 'admin-list',
    //   icon: 'table',
    //   path: '/search-list/backend/admins',
    //   component: './BasicList',
    // },
    // {
    //   name: 'group-list',
    //   icon: 'table',
    //   path: '/search-list/backend/groups',
    //   component: './BasicList',
    // },
    // {
    //   name: 'rule-list',
    //   icon: 'table',
    //   path: '/search-list/backend/rules',
    //   component: './BasicList',
    // },
    // {
    //   name: 'model-list',
    //   icon: 'table',
    //   path: '/search-list/backend/models',
    //   component: './BasicList',
    // },
    // {
    //   path: '/search-list/page',
    //   component: './BasicList/SinglePage',
    // },
    // {
    //   path: '/model-design/page',
    //   component: './ModelDesign',
    // },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
