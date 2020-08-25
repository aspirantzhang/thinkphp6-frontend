import React from 'react';
import moment from 'moment';
import { Space, Tag, Popconfirm, Button } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { SingleColumnType } from './data.d';

export const buildColumns = (mainData: any, actionHandler: any) => {
  const columns: ColumnsType<SingleColumnType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      fixed: 'left',
    },
  ];
  // Build Column
  if (mainData?.layout) {
    mainData.layout.tableColumn.forEach((column: any) => {
      const thisColumn = column;

      // tag
      if (thisColumn.type === 'tag' || thisColumn.type === 'tree') {
        thisColumn.render = (text: any) => {
          return (
            <Space>
              {thisColumn.data
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
      }

      if (thisColumn.type === 'datetime') {
        thisColumn.render = (text: any) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        };
      }

      // action
      if (thisColumn.type === 'actions') {
        thisColumn.render = (text: any, record: any) => {
          return (
            <Space>
              {thisColumn.actions.map((action: any) => {
                if (action.component === 'button') {
                  // Popconfirm
                  if (action.action === 'delete') {
                    return (
                      <Popconfirm
                        title={`${record[Object.keys(record)[1]]} - (ID:${record.id})`}
                        onConfirm={() => {
                          actionHandler(action.action, action.uri, action.method, record);
                        }}
                        okText="Delete"
                        okType="danger"
                        key={action.action}
                      >
                        <Button type={action.type}>{action.text}</Button>
                      </Popconfirm>
                    );
                  }

                  return (
                    <Button
                      type={action.type}
                      onClick={() => {
                        actionHandler(action.action, action.uri, action.method, record);
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
      }

      if (thisColumn.hideInColumn !== true) {
        columns.push(thisColumn);
      }
    });
  }

  return columns;
};
