/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { setIntl } from '@@/plugin-locale/localeExports';
import { _LocaleContainer as LocaleContainer } from '@@/plugin-locale/locale';
import Renderer from 'react-test-renderer';
import { createMemoryHistory, Router } from 'umi';
import '@testing-library/jest-dom/extend-expect';

import Index from '../../index';

test('Basic List -> Index', () => {
  const listMock = {
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
        total: 1,
        per_page: 10,
        page: 1,
      },
    },
  };

  // jest.spyOn(Index, 'init').mockReturnValue(listMock);
  // jest.spyOn(Index, 'request').mockReturnValue({});

  jest.mock('../../index', () => ({
    ...jest.requireActual('../../index'),
    init: jest.fn().mockReturnValue(listMock),
    request: jest.fn().mockReturnValue({}),
  }));

  // jest.mock('umi', () => ({
  //   ...jest.requireActual('umi'),
  //   useRequest: jest.fn().mockReturnValue(listMock),
  // }));

  setIntl('en-US');
  const history = createMemoryHistory();
  history.push('/basic-list/api/admins');
  const dom = render(
    <Router history={history}>
      <LocaleContainer>
        <Index />
      </LocaleContainer>
    </Router>,
  );

  expect(dom).toMatchSnapshot();
});
