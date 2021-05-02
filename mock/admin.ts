import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default {
  'GET /api/admins/info': (req: Request, res: Response) => {
    res.send({
      name: 'admin',
      avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      email: 'antdesign@alipay.com',
      signature: '海纳百川，有容乃大',
      title: '交互专家',
      group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
      tags: [
        {
          key: '0',
          label: '很有想法的',
        },
        {
          key: '1',
          label: '专注设计',
        },
        {
          key: '2',
          label: '辣~',
        },
        {
          key: '3',
          label: '大长腿',
        },
        {
          key: '4',
          label: '川妹子',
        },
        {
          key: '5',
          label: '海纳百川',
        },
      ],
      notifyCount: 12,
      unreadCount: 11,
      country: 'China',
      access: 'admin',
      geographic: {
        province: {
          label: '浙江省',
          key: '330000',
        },
        city: {
          label: '杭州市',
          key: '330100',
        },
      },
      address: '西湖区工专路 77 号',
      phone: '0752-268888888',
    });
  },
  'POST /api/admins/login': async (req: Request, res: Response) => {
    const { password, username } = req.body;
    await waitTime(1000);

    if (username === 'admin' && password === 'admin') {
      res.send({
        success: true,
        message: '',
        data: {
          id: 1,
          admin_name: 'admin',
        },
        currentAuthority: 'admin',
        type: 'account',
      });
      return;
    }

    res.send({
      success: false,
      message: 'Login failed',
    });
  },
  'GET /api/admins/add': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: '',
      data: {
        page: {
          name: 'admin-add',
          title: 'Admin Add',
          type: 'page',
        },
        layout: {
          tabs: [
            {
              name: 'basic',
              title: 'Basic',
              data: [
                {
                  name: 'admin_name',
                  title: 'Admin Name',
                  type: 'text',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'password',
                  title: 'Password',
                  type: 'text',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'display_name',
                  title: 'Display Name',
                  type: 'text',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'groups',
                  title: 'Groups',
                  type: 'tree',
                  data: [
                    {
                      id: 53,
                      parent_id: 0,
                      group_name: 'Admin Group',
                      create_time: '2020-09-21T00:10:30+08:00',
                      delete_time: null,
                      status: 1,
                      value: 53,
                      title: 'Admin Group',
                      depth: 1,
                    },
                  ],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'create_time',
                  title: 'Create Time',
                  type: 'datetime',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'update_time',
                  title: 'Update Time',
                  type: 'datetime',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'status',
                  title: 'Status',
                  type: 'switch',
                  data: [
                    {
                      title: 'Enabled',
                      value: 1,
                    },
                    {
                      title: 'Disabled',
                      value: 0,
                    },
                  ],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
              ],
            },
          ],
          actions: [
            {
              name: 'actions',
              title: 'Actions',
              data: [
                {
                  component: 'button',
                  type: 'dashed',
                  name: 'reset',
                  title: 'Reset',
                  call: 'reset',
                  method: null,
                  uri: null,
                },
                {
                  component: 'button',
                  type: 'default',
                  name: 'cancel',
                  title: 'Cancel',
                  call: 'cancel',
                  method: null,
                  uri: null,
                },
                {
                  component: 'button',
                  type: 'primary',
                  name: 'submit',
                  title: 'Submit',
                  call: 'submit',
                  method: 'post',
                  uri: '/api/admins',
                },
              ],
            },
          ],
        },
      },
    });
  },
  'GET /api/admins/:id': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: '',
      data: {
        page: { name: 'admin-edit', title: 'Admin Edit', type: 'page' },
        layout: {
          tabs: [
            {
              name: 'basic',
              title: 'Basic',
              data: [
                {
                  name: 'admin_name',
                  title: 'Admin Name',
                  type: 'text',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: true,
                  mode: null,
                },
                {
                  name: 'display_name',
                  title: 'Display Name',
                  type: 'text',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'groups',
                  title: 'Groups',
                  type: 'tree',
                  data: [
                    {
                      id: 53,
                      parent_id: 0,
                      group_name: 'Admin Group',
                      create_time: '2020-09-21T00:10:30+08:00',
                      delete_time: null,
                      status: 1,
                      value: 53,
                      title: 'Admin Group',
                      depth: 1,
                    },
                  ],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'create_time',
                  title: 'Create Time',
                  type: 'datetime',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'update_time',
                  title: 'Update Time',
                  type: 'datetime',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'status',
                  title: 'Status',
                  type: 'switch',
                  data: [
                    { title: 'Enabled', value: 1 },
                    { title: 'Disabled', value: 0 },
                  ],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
              ],
            },
          ],
          actions: [
            {
              name: 'actions',
              title: 'Actions',
              data: [
                {
                  component: 'button',
                  type: 'dashed',
                  name: 'reset',
                  title: 'Reset',
                  call: 'reset',
                  method: null,
                  uri: null,
                },
                {
                  component: 'button',
                  type: 'default',
                  name: 'cancel',
                  title: 'Cancel',
                  call: 'cancel',
                  method: null,
                  uri: null,
                },
                {
                  component: 'button',
                  type: 'primary',
                  name: 'submit',
                  title: 'Submit',
                  call: 'submit',
                  method: 'put',
                  uri: '/api/admins/1',
                },
              ],
            },
          ],
        },
        dataSource: {
          id: 1,
          admin_name: 'admin',
          display_name: 'Admin',
          create_time: '2021-04-13T13:28:28+08:00',
          update_time: '2021-04-13T13:32:52+08:00',
          status: 1,
          groups: [53],
        },
      },
    });
  },
  'GET /api/admins': (req: Request, res: Response) => {
    // in trash
    if (req.query.trash === 'onlyTrashed') {
      res.send({
        success: true,
        message: '',
        data: {
          page: {
            name: 'admin-list',
            title: 'Admin List',
            type: 'basic-list',
            searchBar: true,
          },
          layout: {
            tableColumn: [
              {
                name: 'admin_name',
                title: 'Admin Name',
                type: 'text',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'groups',
                title: 'Groups',
                type: 'tree',
                data: [
                  {
                    id: 53,
                    parent_id: 0,
                    group_name: 'Admin Group',
                    create_time: '2020-09-21T00:10:30+08:00',
                    delete_time: null,
                    status: 1,
                    value: 53,
                    title: 'Admin Group',
                    depth: 1,
                  },
                ],
                hideInColumn: true,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'display_name',
                title: 'Display Name',
                type: 'text',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'create_time',
                title: 'Create Time',
                type: 'datetime',
                data: [],
                hideInColumn: null,
                sorter: true,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'status',
                title: 'Status',
                type: 'switch',
                data: [
                  {
                    title: 'Enabled',
                    value: 1,
                  },
                  {
                    title: 'Disabled',
                    value: 0,
                  },
                ],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'trash',
                title: 'Trash',
                type: 'select',
                data: [
                  {
                    title: 'Only Trashed',
                    value: 'onlyTrashed',
                  },
                  {
                    title: 'With Trashed',
                    value: 'withTrashed',
                  },
                  {
                    title: 'Without Trashed',
                    value: 'withoutTrashed',
                  },
                ],
                hideInColumn: true,
                sorter: null,
                editDisabled: null,
                mode: '',
              },
              {
                name: 'actions',
                title: 'Actions',
                type: 'actions',
                data: [
                  {
                    component: 'button',
                    type: 'primary',
                    name: 'edit',
                    title: 'Edit',
                    call: 'modal',
                    method: null,
                    uri: '/api/admins/:id',
                  },
                  {
                    component: 'button',
                    type: 'default',
                    name: 'delete',
                    title: 'Delete',
                    call: 'delete',
                    method: 'post',
                    uri: '/api/admins/delete',
                  },
                ],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
            ],
            tableToolBar: [
              {
                component: 'button',
                type: 'primary',
                name: 'add',
                title: 'Add',
                call: 'modal',
                method: null,
                uri: '/api/admins/add',
              },
              {
                component: 'button',
                type: 'default',
                name: 'reload',
                title: 'Reload',
                call: 'reload',
                method: null,
                uri: null,
              },
            ],
            batchToolBar: [
              {
                component: 'button',
                type: 'danger',
                name: 'delete-permanently',
                title: 'Delete Permanently',
                call: 'deletePermanently',
                method: 'post',
                uri: '/api/admins/delete',
              },
              {
                component: 'button',
                type: 'default',
                name: 'restore',
                title: 'Restore',
                call: 'restore',
                method: 'post',
                uri: '/api/admins/restore',
              },
            ],
          },
          dataSource: [
            {
              id: 1001,
              admin_name: 'trashUser',
              display_name: '',
              create_time: '2021-04-29T17:34:15+08:00',
              delete_time: null,
              status: 1,
              groups: [],
            },
          ],
          meta: {
            total: 1,
            per_page: 10,
            page: 1,
          },
        },
      });
      return;
    }
    res.send({
      success: true,
      message: '',
      data: {
        page: {
          name: 'admin-list',
          title: 'Admin List',
          type: 'basic-list',
          searchBar: true,
        },
        layout: {
          tableColumn: [
            {
              name: 'admin_name',
              title: 'Admin Name',
              type: 'text',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'groups',
              title: 'Groups',
              type: 'tree',
              data: [
                {
                  id: 53,
                  parent_id: 0,
                  group_name: 'Admin Group',
                  create_time: '2020-09-21T00:10:30+08:00',
                  delete_time: null,
                  status: 1,
                  value: 53,
                  title: 'Admin Group',
                  depth: 1,
                },
              ],
              hideInColumn: true,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'display_name',
              title: 'Display Name',
              type: 'text',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'create_time',
              title: 'Create Time',
              type: 'datetime',
              data: [],
              hideInColumn: null,
              sorter: true,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'status',
              title: 'Status',
              type: 'switch',
              data: [
                {
                  title: 'Enabled',
                  value: 1,
                },
                {
                  title: 'Disabled',
                  value: 0,
                },
              ],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'trash',
              title: 'Trash',
              type: 'select',
              data: [
                {
                  title: 'Only Trashed',
                  value: 'onlyTrashed',
                },
                {
                  title: 'With Trashed',
                  value: 'withTrashed',
                },
                {
                  title: 'Without Trashed',
                  value: 'withoutTrashed',
                },
              ],
              hideInColumn: true,
              sorter: null,
              editDisabled: null,
              mode: '',
            },
            {
              name: 'actions',
              title: 'Actions',
              type: 'actions',
              data: [
                {
                  component: 'button',
                  type: 'primary',
                  name: 'edit',
                  title: 'Edit',
                  call: 'modal',
                  method: null,
                  uri: '/api/admins/:id',
                },
                {
                  component: 'button',
                  type: 'default',
                  name: 'delete',
                  title: 'Delete',
                  call: 'delete',
                  method: 'post',
                  uri: '/api/admins/delete',
                },
              ],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
          ],
          tableToolBar: [
            {
              component: 'button',
              type: 'primary',
              name: 'add',
              title: 'Add',
              call: 'modal',
              method: null,
              uri: '/api/admins/add',
            },
            {
              component: 'button',
              type: 'default',
              name: 'reload',
              title: 'Reload',
              call: 'reload',
              method: null,
              uri: null,
            },
          ],
          batchToolBar: [
            {
              component: 'button',
              type: 'danger',
              name: 'delete',
              title: 'Delete',
              call: 'delete',
              method: 'post',
              uri: '/api/admins/delete',
            },
            {
              component: 'button',
              type: 'default',
              name: 'disable',
              title: 'Disable',
              call: 'disable',
              method: 'post',
              uri: '/api/admins/delete',
            },
          ],
        },
        dataSource: [
          {
            id: 1,
            admin_name: 'admin',
            display_name: 'Admin',
            create_time: '2021-04-13T13:28:28+08:00',
            delete_time: null,
            status: 1,
            groups: [
              {
                id: 53,
                parent_id: 0,
                group_name: 'Admin Group',
                create_time: '2020-09-21T00:10:30+08:00',
                update_time: '2021-04-09T23:57:46+08:00',
                delete_time: null,
                status: 1,
                pivot: {
                  id: 225,
                  admin_id: 1,
                  group_id: 53,
                  create_time: '0000-00-00 00:00:00',
                  update_time: '0000-00-00 00:00:00',
                  delete_time: null,
                  status: 1,
                },
              },
            ],
          },
        ],
        meta: {
          total: 2,
          per_page: 10,
          page: 1,
        },
      },
    });
  },
  'POST /api/admins': async (req: Request, res: Response) => {
    const { admin_name, password } = req.body;
    await waitTime(1000);
    if (admin_name === 'invalid' && password === 'invalid') {
      res.send({
        success: false,
        message: 'Error Message.',
        data: [],
      });
      return;
    }
    res.send({
      success: true,
      message: 'Add successfully.',
      data: [],
    });
  },
  'PUT /api/admins/:id': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: 'Edit successfully.',
      data: [],
    });
  },
  'POST /api/admins/delete': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: 'Delete successfully.',
      data: [],
    });
  },
};
