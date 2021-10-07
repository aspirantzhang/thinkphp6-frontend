import React from 'react';
import { Input, Form, DatePicker, TreeSelect, Switch, InputNumber, Radio } from 'antd';
import TinyMCEEditor from '../form/TinyMCEEditor';

const FormBuilder = (data: BasicListApi.Field[] | undefined, prefix?: string) => {
  return (Array.isArray(data) ? data : []).map((field) => {
    const ignore = ['update_time', '_path'];
    if (ignore.includes(field.name)) {
      return null;
    }
    const formItemAttr = {
      label: field.title,
      name: prefix ? [prefix, field.name] : field.name,
      key: prefix ? `${prefix}.${field.name}` : field.name,
    };
    const componentAttr = {
      disabled: field.editDisabled,
    };
    switch (field.type) {
      case 'input':
        return (
          <Form.Item {...formItemAttr}>
            <Input {...componentAttr} />
          </Form.Item>
        );
      case 'password':
        return (
          <Form.Item {...formItemAttr}>
            <Input.Password {...componentAttr} />
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item {...formItemAttr}>
            <Input.TextArea {...componentAttr} />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item {...formItemAttr}>
            <InputNumber {...componentAttr} />
          </Form.Item>
        );
      case 'datetime':
        return (
          <Form.Item {...formItemAttr}>
            <DatePicker showTime {...componentAttr} />
          </Form.Item>
        );
      case 'switch':
        return (
          <Form.Item {...formItemAttr} valuePropName="checked">
            <Switch {...componentAttr} />
          </Form.Item>
        );
      case 'radio':
        return (
          <Form.Item {...formItemAttr}>
            <Radio.Group buttonStyle="solid" {...componentAttr}>
              {(field.data || []).map((item: any) => {
                return (
                  <Radio.Button key={item.value} value={item.value}>
                    {item.title}
                  </Radio.Button>
                );
              })}
            </Radio.Group>
          </Form.Item>
        );
      case 'tree':
        return (
          <Form.Item {...formItemAttr}>
            <TreeSelect treeData={field.data} {...componentAttr} treeCheckable />
          </Form.Item>
        );
      case 'parent':
        return (
          <Form.Item {...formItemAttr}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              treeData={field.data}
              placeholder="Please select"
              treeDefaultExpandAll
              allowClear
              {...componentAttr}
            />
          </Form.Item>
        );
      case 'textEditor':
        return (
          <Form.Item {...formItemAttr}>
            {/* @ts-ignore */}
            <TinyMCEEditor />
          </Form.Item>
        );
      default:
        return null;
    }
  });
};

export default FormBuilder;
