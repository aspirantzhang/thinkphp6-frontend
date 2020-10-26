import React from 'react';
import moment from 'moment';
import { Space, Tag, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';

export const ColumnBuilder = (tableColumn: any, actionHandler: any) => {
  const tagRender = (data: any, value: any) => {
    let result: any[] = [];
    data.forEach((optionValue: any, optionKey: number) => {
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

  const actionsRender = (data: any, record: any) => {
    return data.map((action: any) => {
      switch (action.component) {
        case 'button':
          return (
            <Button
              type={action.type}
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

  let columns: ColumnsType<ListAPI.Record> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      fixed: 'left',
    },
  ];

  if (tableColumn) {
    tableColumn.forEach((column: any) => {
      if (column.hideInColumn !== true) {
        switch (column.type) {
          case 'tag':
          case 'tree':
            column.render = (text: string) => {
              return <Space>{tagRender(column.data, text)}</Space>;
            };
            break;
          case 'datetime':
            column.render = (text: string) => {
              return moment(text).format('YYYY-MM-DD HH:mm:ss');
            };
            break;
          case 'actions':
            column.render = (_: string, record: any) => {
              return <Space>{actionsRender(column.actions, record)}</Space>;
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
