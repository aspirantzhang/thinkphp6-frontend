import React from 'react';
import { Input, Form, DatePicker, TreeSelect, Switch, InputNumber, Radio } from 'antd';

const FormBuilder = (data: BasicListApi.Field[] | undefined) => {
  return (Array.isArray(data) ? data : []).map((field) => {
    const basicAttr = {
      label: field.title,
      name: field.name,
      key: field.name,
    };
    switch (field.type) {
      case 'input':
        return (
          <Form.Item {...basicAttr}>
            <Input disabled={field.disabled} />
          </Form.Item>
        );
      case 'password':
        return (
          <Form.Item {...basicAttr}>
            <Input.Password disabled={field.disabled} />
          </Form.Item>
        );
      case 'textarea':
        return (
          <Form.Item {...basicAttr}>
            <Input.TextArea disabled={field.disabled} />
          </Form.Item>
        );
      case 'number':
        return (
          <Form.Item {...basicAttr}>
            <InputNumber disabled={field.disabled} />
          </Form.Item>
        );
      case 'datetime':
        if (field.name !== 'update_time') {
          return (
            <Form.Item {...basicAttr}>
              <DatePicker showTime disabled={field.disabled} />
            </Form.Item>
          );
        }
        return null;
      case 'switch':
        return (
          <Form.Item {...basicAttr} valuePropName="checked">
            <Switch disabled={field.disabled} defaultChecked />
          </Form.Item>
        );
      case 'radio':
        return (
          <Form.Item {...basicAttr}>
            <Radio.Group buttonStyle="solid" defaultValue={field.data[0]?.value}>
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
          <Form.Item {...basicAttr}>
            <TreeSelect treeData={field.data} disabled={field.disabled} treeCheckable />
          </Form.Item>
        );

      case 'parent':
        return (
          <Form.Item {...basicAttr}>
            <TreeSelect
              showSearch
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
              treeData={field.data}
              placeholder="Please select"
              treeDefaultExpandAll
              allowClear
            />
          </Form.Item>
        );
      default:
        return null;
    }
  });
};

export default FormBuilder;
