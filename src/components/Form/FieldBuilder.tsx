import React from 'react';
import { Form, Input, DatePicker, Switch, TreeSelect } from 'antd';

export const FieldBuilder = (data: PageAPI.FormData[]) => {
  return data?.map((column: any) => {
    switch (column.type) {
      case 'datetime':
        if (column.key !== 'update_time') {
          return (
            <Form.Item name={column.key} label={column.title} key={column.key}>
              <DatePicker showTime />
            </Form.Item>
          );
        }
        return null;
      case 'password':
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <Input type="password" />
          </Form.Item>
        );
      case 'tag':
        return (
          <Form.Item
            name={column.key}
            label={column.title}
            key={column.key}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        );
      case 'parent':
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              treeData={column.data}
              placeholder="Please select"
              treeDefaultExpandAll
              allowClear
            />
          </Form.Item>
        );
      case 'tree':
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              treeData={column.data}
              placeholder="Please select"
              multiple
              treeDefaultExpandAll
              treeCheckable
              // showCheckedStrategy="SHOW_PARENT"
              allowClear
            />
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 25 }} />
          </Form.Item>
        );
      case 'actions':
        return null;
      default:
        if (column.disabled === true) {
          return (
            <Form.Item name={column.key} label={column.title} key={column.key}>
              <Input bordered={false} disabled style={{ paddingLeft: '2px' }} />
            </Form.Item>
          );
        }
        return (
          <Form.Item name={column.key} label={column.title} key={column.key}>
            <Input />
          </Form.Item>
        );
    }
  });
};
