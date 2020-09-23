import React from 'react';
import { Form, Input, DatePicker, Switch, TreeSelect } from 'antd';

export const buildFields = (mainData: any) => {
  return mainData?.layout.map((column: any) => {
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
      case 'actions':
        return null;
      default:
        if (column.disabled === true) {
          return (
            <Form.Item label={column.title} key={column.key}>
              {mainData.dataSource[column.key]}
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
