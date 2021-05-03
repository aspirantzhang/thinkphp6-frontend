import { Request, Response } from 'express';

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export default {
  'GET /api/models': (req: Request, res: Response) => {
    res.send({
      success: true,
      message: '',
      data: {
        page: { name: 'model-list', title: 'Model List', type: 'basic-list', searchBar: true },
        layout: {
          tableColumn: [
            {
              name: 'title',
              title: 'Title',
              type: 'text',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'table_name',
              title: 'Table Name',
              type: 'text',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
            {
              name: 'route_name',
              title: 'Route Name',
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
                { title: 'Enabled', value: 1 },
                { title: 'Disabled', value: 0 },
              ],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
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
                  call: 'page',
                  method: null,
                  uri: '/api/models/:id',
                },
                {
                  component: 'button',
                  type: 'primary',
                  name: 'design',
                  title: 'Design',
                  call: 'modelDesign',
                  method: null,
                  uri: '/api/models/design/:id',
                },
                {
                  component: 'button',
                  type: 'danger',
                  name: 'deletePermanently',
                  title: 'Delete Permanently',
                  call: 'deletePermanently',
                  method: 'post',
                  uri: '/api/models/delete',
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
              uri: '/api/models/add',
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
          batchToolBar: [],
        },
        dataSource: [
          {
            id: 1,
            title: 'E2E',
            table_name: 'e2e',
            route_name: 'e2es',
            status: 1,
            data: { routeName: 'e2es' },
            create_time: '2021-05-03T14:32:29+08:00',
            delete_time: null,
          },
        ],
        meta: { total: 1, per_page: 10, page: 1 },
      },
    });
  },
  'GET /api/models/design/:id': async (req: Request, res: Response) => {
    await waitTime(1000);
    res.send({ success: true, message: '', data: { data: { routeName: 'e2es' } } });
  },
};
