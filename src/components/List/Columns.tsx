import React from 'react';
import moment from 'moment';
import { Space, Tag, Button } from 'antd';
import { ButtonType } from 'antd/lib/button';

export const ColumnBuilder = (
  tableColumn: ListAPI.TableColumn[],
  actionHandler: API.ActionHandler,
) => {
  const tagRender = (data: API.Store, value: API.StoreValue) => {
    let result: React.ReactNode[] = [];
    data.forEach((optionValue: API.StoreValue, optionKey: API.StoreValue) => {
      if (optionKey === value) {
        result.push(
          <Tag color={value === 0 ? 'red' : 'blue'} key={value}>
            {optionValue}
          </Tag>,
        );
      }
    });
    return result;
  };

  const actionsRender = (data: ListAPI.Action[], record: ListAPI.Record) => {
    return data.map((action: ListAPI.Action) => {
      switch (action.component) {
        case 'button':
          return (
            <Button
              type={action.type as ButtonType}
              onClick={() => {
                actionHandler(action, record);
              }}
              key={action.action}
            >
              {action.text}
            </Button>
          );
        default:
          return null;
      }
    });
  };

  let columns: ListAPI.TableColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      fixed: 'left',
    },
  ];

  if (tableColumn) {
    tableColumn.forEach((column: ListAPI.TableColumn) => {
      if (column.hideInColumn !== true) {
        switch (column.type) {
          case 'tag':
          case 'tree':
            column.render = (text: React.Key) => {
              return <Space>{tagRender(column.data, text)}</Space>;
            };
            break;
          case 'datetime':
            column.render = (text: React.Key) => {
              return moment(text).format('YYYY-MM-DD HH:mm:ss');
            };
            break;
          case 'actions':
            column.render = (_: React.Key, record: any) => {
              return <Space>{actionsRender(column.actions as ListAPI.Action[], record)}</Space>;
            };
            break;
          default:
            break;
        }
        columns.push(column);
      }
    });
  }
  return columns;
};
