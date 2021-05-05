import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default {
  'GET /api/tests/add': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: '',
      data: {
        page: {
          name: 'test-add',
          title: 'Test Add',
          type: 'page',
        },
        layout: {
          tabs: [
            {
              name: 'basic',
              title: 'Basic',
              data: [
                {
                  name: 'single_line_text',
                  title: 'Single Line Text',
                  type: 'input',
                  data: [],
                  hideInColumn: null,
                  sorter: null,
                  editDisabled: null,
                  mode: null,
                },
                {
                  name: 'password',
                  title: 'Password',
                  type: 'password',
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
                      group_name: 'Test Group',
                      create_time: '2020-09-21T00:10:30+08:00',
                      delete_time: null,
                      status: 1,
                      value: 53,
                      title: 'Test Group',
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
                  uri: '/api/tests',
                },
              ],
            },
          ],
        },
      },
    });
  },
  'GET /api/tests/:id': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: '',
      data: {
        page: { name: 'test-edit', title: 'Test Edit', type: 'page' },
        layout: {
          tabs: [
            {
              name: 'basic',
              title: 'Basic',
              data: [
                {
                  name: 'single_line_text',
                  title: 'Single Line Text',
                  type: 'input',
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
                      group_name: 'Test Group',
                      create_time: '2020-09-21T00:10:30+08:00',
                      delete_time: null,
                      status: 1,
                      value: 53,
                      title: 'Test Group',
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
                  uri: '/api/tests/1',
                },
              ],
            },
          ],
        },
        dataSource: {
          id: 1,
          single_line_text: 'single-line-text-value',
          create_time: '2021-04-13T13:28:28+08:00',
          update_time: '2021-04-13T13:32:52+08:00',
          status: 1,
          groups: [53],
        },
      },
    });
  },
  'GET /api/tests': (req: Request, res: Response) => {
    // in trash
    if (req.query.trash === 'onlyTrashed') {
      res.send({
        success: true,
        message: '',
        data: {
          page: {
            name: 'test-list',
            title: 'Test List',
            type: 'basic-list',
            searchBar: true,
          },
          layout: {
            tableColumn: [
              {
                name: 'single_line_text',
                title: 'Single Line Text',
                type: 'input',
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
                    group_name: 'Test Group',
                    create_time: '2020-09-21T00:10:30+08:00',
                    delete_time: null,
                    status: 1,
                    value: 53,
                    title: 'Test Group',
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
                    uri: '/api/tests/:id',
                  },
                  {
                    component: 'button',
                    type: 'default',
                    name: 'delete',
                    title: 'Delete',
                    call: 'delete',
                    method: 'post',
                    uri: '/api/tests/delete',
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
                uri: '/api/tests/add',
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
                uri: '/api/tests/delete',
              },
              {
                component: 'button',
                type: 'default',
                name: 'restore',
                title: 'Restore',
                call: 'restore',
                method: 'post',
                uri: '/api/tests/restore',
              },
            ],
          },
          dataSource: [
            {
              id: 1001,
              single_line_text: 'single-line-text-value',
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
          name: 'test-list',
          title: 'Test List',
          type: 'basic-list',
          searchBar: true,
        },
        layout: {
          tableColumn: [
            {
              name: 'single_line_text',
              title: 'Single Line Text',
              type: 'input',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'password',
              title: 'Password',
              type: 'password',
              data: [],
              hideInColumn: true,
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
                  group_name: 'Test Group',
                  create_time: '2020-09-21T00:10:30+08:00',
                  delete_time: null,
                  status: 1,
                  value: 53,
                  title: 'Test Group',
                  depth: 1,
                },
              ],
              hideInColumn: true,
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
                  uri: '/api/tests/:id',
                },
                {
                  component: 'button',
                  type: 'default',
                  name: 'delete',
                  title: 'Delete',
                  call: 'delete',
                  method: 'post',
                  uri: '/api/tests/delete',
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
              uri: '/api/tests/add',
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
              uri: '/api/tests/delete',
            },
            {
              component: 'button',
              type: 'default',
              name: 'disable',
              title: 'Disable',
              call: 'disable',
              method: 'post',
              uri: '/api/tests/delete',
            },
          ],
        },
        dataSource: [
          {
            id: 1,
            single_line_text: 'single-line-text-value',
            create_time: '2021-04-13T13:28:28+08:00',
            delete_time: null,
            status: 1,
            groups: [
              {
                id: 53,
                parent_id: 0,
                group_name: 'Test Group',
                create_time: '2020-09-21T00:10:30+08:00',
                update_time: '2021-04-09T23:57:46+08:00',
                delete_time: null,
                status: 1,
                pivot: {
                  id: 225,
                  test_id: 1,
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
          total: 1,
          per_page: 10,
          page: 1,
        },
      },
    });
  },
  'POST /api/tests': async (req: Request, res: Response) => {
    const { single_line_text, password } = req.body;
    await waitTime(1000);
    if (single_line_text === 'invalid' && password === 'invalid') {
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
  'PUT /api/tests/:id': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: 'Edit successfully.',
      data: [],
    });
  },
  'POST /api/tests/delete': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: 'Delete successfully.',
      data: [],
    });
  },
};
