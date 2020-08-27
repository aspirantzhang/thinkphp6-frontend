import React from 'react';
import moment from 'moment';
import { Form, Input, DatePicker, Select, TreeSelect } from 'antd';

const { RangePicker } = DatePicker;

export const buildSearchFields = (tableColumn: any) => {
  return tableColumn.map((column: any) => {
    switch (column.type) {
      case 'datetime':
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                'Last 7 Days': [moment().subtract(7, 'd'), moment()],
                'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                'Last Month': [
                  moment().subtract(1, 'months').startOf('month'),
                  moment().subtract(1, 'months').endOf('month'),
                ],
              }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        );
      case 'tag':
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <Select mode="multiple" placeholder="Please select" style={{ width: '100px' }}>
              {column.data.map((item: any, key: number) => (
                <Select.Option value={key} key={item}>
                  {item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        );
      case 'tree':
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <TreeSelect
              showSearch
              style={{ width: '250px' }}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              treeData={column.data}
              placeholder="Please select"
              multiple
              treeDefaultExpandAll
              treeCheckable
              showCheckedStrategy="SHOW_PARENT"
              allowClear
            />
          </Form.Item>
        );
      case 'actions':
        return null;
      default:
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <Input />
          </Form.Item>
        );
    }
  });
};
