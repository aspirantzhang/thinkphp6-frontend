import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

const fields = [
  {
    name: 'single_line_text',
    title: 'Single-line Text',
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
    name: 'multi_line_text',
    title: 'Multi-line Text',
    type: 'textarea',
    data: [],
    hideInColumn: true,
    sorter: null,
    editDisabled: null,
    mode: null,
  },
  {
    name: 'number',
    title: 'Number',
    type: 'number',
    data: [],
    hideInColumn: null,
    sorter: null,
    editDisabled: null,
    mode: null,
  },
  {
    name: 'datetime',
    title: 'Datetime',
    type: 'datetime',
    data: [],
    hideInColumn: null,
    sorter: null,
    editDisabled: null,
    mode: null,
  },
  {
    name: 'switch',
    title: 'Switch',
    type: 'switch',
    data: [
      {
        title: 'On',
        value: 1,
      },
      {
        title: 'Off',
        value: 0,
      },
    ],
    hideInColumn: null,
    sorter: null,
    editDisabled: null,
    mode: null,
  },
  {
    name: 'radio',
    title: 'Radio',
    type: 'radio',
    data: [
      {
        title: 'Mx',
        value: 'mx',
      },
      {
        title: 'Mr',
        value: 'mr',
      },
      {
        title: 'Ms',
        value: 'ms',
      },
    ],
    hideInColumn: null,
    sorter: null,
    editDisabled: null,
    mode: null,
  },
  {
    name: 'tree',
    title: 'Tree',
    type: 'tree',
    data: [
      {
        id: 1,
        parent_id: 0,
        title: 'Option 1',
        value: 1,
        children: [
          {
            id: 3,
            parent_id: 1,
            title: 'Option 1-1',
            value: 3,
          },
          {
            id: 4,
            parent_id: 1,
            title: 'Option 1-2',
            value: 4,
          },
        ],
      },
      {
        id: 2,
        parent_id: 0,
        title: 'Option 2',
        value: 2,
      },
    ],
    hideInColumn: true,
    sorter: null,
    editDisabled: null,
    mode: null,
  },
  {
    name: 'parent',
    title: 'Parent',
    type: 'parent',
    data: [
      {
        id: 1,
        parent_id: 0,
        title: 'Option 1',
        value: 1,
        children: [
          {
            id: 3,
            parent_id: 1,
            title: 'Option 1-1',
            value: 3,
          },
          {
            id: 4,
            parent_id: 1,
            title: 'Option 1-2',
            value: 4,
          },
        ],
      },
      {
        id: 2,
        parent_id: 0,
        title: 'Option 2',
        value: 2,
      },
    ],
    hideInColumn: false,
    sorter: null,
    editDisabled: null,
    mode: null,
  },
];

const dataSource = {
  id: 1,
  single_line_text: 'single-line-text-value',
  number: 99999,
  datetime: '2021-04-13T13:28:28+08:00',
  switch: 1,
  radio: 'mr',
  tree: [
    {
      id: 2,
      parent_id: 0,
      title: 'Option 2',
      value: 2,
    },
  ],
  parent: 3,
  create_time: '2021-04-13T13:28:28+08:00',
  delete_time: null,
  status: 1,
};

const editDataSource = {
  id: 1,
  single_line_text: 'single-line-text-value',
  multi_line_text: 'multi-line-text-value',
  number: 99999,
  datetime: '2021-04-13T13:28:28+08:00',
  switch: 1,
  radio: 'mr',
  tree: [2, 4],
  parent: 3,
  create_time: '2021-04-13T13:28:28+08:00',
  update_time: '2021-04-13T13:32:52+08:00',
  status: 1,
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
                ...fields,
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
                ...fields,
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
        dataSource: editDataSource,
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
                title: 'Single-line Text',
                type: 'input',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'multi_line_text',
                title: 'Multi-line Text',
                type: 'textarea',
                data: [],
                hideInColumn: true,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'number',
                title: 'Number',
                type: 'number',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'datetime',
                title: 'Datetime',
                type: 'datetime',
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
                name: 'delete_permanently',
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
          dataSource: [dataSource],
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
            ...fields,
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
        dataSource: [dataSource],
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
  'PUT /api/tests/:id': async (req: Request, res: Response) => {
    await waitTime(500);
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
  'GET /api/tests/:id/i18n': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: '',
      data: {
        page: { title: 'Admin Internationalization' },
        layout: [
          {
            name: 'en-us',
            data: [
              {
                name: 'display_name',
                title: 'Display Name',
                type: 'input',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'comment',
                title: 'Comment',
                type: 'textarea',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
            ],
          },
          {
            name: 'zh-cn',
            data: [
              {
                name: 'display_name',
                title: 'Display Name',
                type: 'input',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
              {
                name: 'comment',
                title: 'Comment',
                type: 'textarea',
                data: [],
                hideInColumn: null,
                sorter: null,
                editDisabled: null,
                mode: null,
              },
            ],
          },
        ],
        dataSource: {
          'en-us': {
            display_name: 'Administrator',
            comment: 'The highest authority',
            translate_time: '2021-06-28 15:03:26',
          },
          'zh-cn': {
            display_name: '网站管理员',
            comment: '最高权限',
            translate_time: '2021-06-28 15:03:26',
          },
        },
      },
    });
  },
  'PATCH /api/tests/:id/i18n': async (req: Request, res: Response) => {
    await waitTime(500);
    res.send({
      success: true,
      message: 'Update successfully.',
      data: [],
    });
  },
  'GET /api/tests/:id/revisions': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({
      success: true,
      message: '',
      data: {
        dataSource: [
          {
            id: 1,
            table_name: 'tests',
            original_id: 1,
            title: 'test revision',
            main_data: '',
            i18n_data: '',
            extra_data: '',
            create_time: '2021-06-28 15:03:26',
            update_time: '2021-06-28 15:03:26',
            delete_time: null,
            status: 1,
          },
          {
            id: 2,
            table_name: 'tests 2',
            original_id: 2,
            title: 'test revision 2',
            main_data: '',
            i18n_data: '',
            extra_data: '',
            create_time: '2021-06-28 15:03:26',
            update_time: '2021-06-28 15:03:26',
            delete_time: null,
            status: 1,
          },
        ],
        meta: {
          total: 2,
          page: 1,
        },
      },
    });
  },
  'GET /api/tests/:id/revisions/:id': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({
      success: true,
      message: '',
      data: {
        dataSource: {
          id: 1,
          table_name: 'tests',
          original_id: 1,
          title: 'test revision',
          main_data:
            '{"admin_name":"test01","password":"$2y$10$kHVB\\/2q7WqkVnSX9s1bJ1uwgOUQt1LCoS9z6TePuHPVLyV8Vz\\/oAm","create_time":"2020-02-20 20:20:20","update_time":"2020-02-20 20:20:20","delete_time":null,"status":1}',
          i18n_data:
            '[{"original_id":2,"lang_code":"zh-cn","display_name":"\\u6d4b\\u8bd501","comment":"","translate_time":"2020-02-20 20:20:20"}]',
          extra_data:
            '{"auth_group_rule":[{"group_id":1,"rule_id":1},{"group_id":1,"rule_id":2},{"group_id":1,"rule_id":3},{"group_id":1,"rule_id":4},{"group_id":1,"rule_id":5},{"group_id":1,"rule_id":6},{"group_id":1,"rule_id":7},{"group_id":1,"rule_id":8},{"group_id":1,"rule_id":9},{"group_id":1,"rule_id":10},{"group_id":1,"rule_id":11},{"group_id":1,"rule_id":12},{"group_id":1,"rule_id":13},{"group_id":1,"rule_id":14},{"group_id":1,"rule_id":15},{"group_id":1,"rule_id":16},{"group_id":1,"rule_id":17},{"group_id":1,"rule_id":18},{"group_id":1,"rule_id":19},{"group_id":1,"rule_id":20},{"group_id":1,"rule_id":21},{"group_id":1,"rule_id":22},{"group_id":1,"rule_id":23},{"group_id":1,"rule_id":24},{"group_id":1,"rule_id":25},{"group_id":1,"rule_id":26},{"group_id":1,"rule_id":27},{"group_id":1,"rule_id":28},{"group_id":1,"rule_id":29},{"group_id":1,"rule_id":30},{"group_id":1,"rule_id":31},{"group_id":1,"rule_id":32},{"group_id":1,"rule_id":33},{"group_id":1,"rule_id":34},{"group_id":1,"rule_id":35},{"group_id":1,"rule_id":36},{"group_id":1,"rule_id":37},{"group_id":1,"rule_id":38},{"group_id":1,"rule_id":39},{"group_id":1,"rule_id":40},{"group_id":1,"rule_id":41},{"group_id":1,"rule_id":42},{"group_id":1,"rule_id":43},{"group_id":1,"rule_id":44},{"group_id":1,"rule_id":45},{"group_id":1,"rule_id":46},{"group_id":1,"rule_id":47},{"group_id":1,"rule_id":48},{"group_id":1,"rule_id":49},{"group_id":1,"rule_id":50},{"group_id":1,"rule_id":51},{"group_id":1,"rule_id":52},{"group_id":1,"rule_id":53},{"group_id":1,"rule_id":54},{"group_id":1,"rule_id":55},{"group_id":1,"rule_id":56},{"group_id":1,"rule_id":57},{"group_id":1,"rule_id":58},{"group_id":1,"rule_id":59},{"group_id":1,"rule_id":60},{"group_id":1,"rule_id":61},{"group_id":1,"rule_id":62},{"group_id":1,"rule_id":63},{"group_id":1,"rule_id":64},{"group_id":1,"rule_id":65},{"group_id":1,"rule_id":66},{"group_id":1,"rule_id":67}]}',
          create_time: '2021-06-28 15:03:26',
          update_time: '2021-06-28 15:03:26',
          delete_time: null,
          status: 1,
        },
      },
    });
  },
  'POST /api/tests/:id/revisions': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: 'revision restore successfully',
      data: [],
    });
  },
};
