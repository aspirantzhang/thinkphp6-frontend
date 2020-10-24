import React from 'react';
import moment from 'moment';
import { Space, Tag, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SingleColumnType } from './data.d';

export const buildColumns = (tableColumn: any, actionHandler: any) => {
  const idColumn: ColumnsType<SingleColumnType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      fixed: 'left',
    },
  ];
  if (tableColumn) {
    return idColumn.concat(
      tableColumn
        .filter((item: any, index: number) => {
          return item.hideInColumn !== true;
        })
        .map((column: any) => {
          switch (column.type) {
            case 'tag':
            case 'tree':
              column.render = (text: any) => {
                return (
                  <Space>
                    {column.data
                      .filter((item: any, index: number) => index === text)
                      .map((item: any) => {
                        return (
                          <Tag color={text === 0 ? 'red' : 'blue'} key={text}>
                            {item}
                          </Tag>
                        );
                      })}
                  </Space>
                );
              };
              return column;
            case 'datetime':
              column.render = (text: any) => {
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
              };
              return column;
            case 'actions':
              column.render = (text: any, record: any) => {
                return (
                  <Space>
                    {column.actions.map((action: any) => {
                      if (action.component === 'button') {
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
                      }
                      return null;
                    })}
                  </Space>
                );
              };
              return column;
            default:
              return column;
          }
        }),
    );
  } else {
    return idColumn;
  }
};
