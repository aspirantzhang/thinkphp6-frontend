import React from 'react';
import { Input, Form, DatePicker, TreeSelect, Switch, InputNumber, Radio } from 'antd';
import TinyMCEEditor from '../form/TinyMCEEditor';

const FormBuilder = (
  data: BasicListApi.Field[] | undefined,
  prefix?: string,
  ignoreField: string[] = [],
) => {
  return (Array.isArray(data) ? data : []).map((field) => {
    const ignore = ['update_time', 'pathname', ...ignoreField];
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

    let result: JSX.Element | null = null;
    switch (field.type) {
      case 'input':
        result = (
          <Form.Item {...formItemAttr}>
            <Input {...componentAttr} />
          </Form.Item>
        );
        break;
      case 'password':
        result = (
          <Form.Item {...formItemAttr}>
            <Input.Password {...componentAttr} />
          </Form.Item>
        );
        break;
      case 'textarea':
        result = (
          <Form.Item {...formItemAttr}>
            <Input.TextArea {...componentAttr} />
          </Form.Item>
        );
        break;
      case 'number':
        result = (
          <Form.Item {...formItemAttr}>
            <InputNumber {...componentAttr} />
          </Form.Item>
        );
        break;
      case 'datetime':
        result = (
          <Form.Item {...formItemAttr}>
            <DatePicker showTime {...componentAttr} />
          </Form.Item>
        );
        break;
      case 'switch':
        result = (
          <Form.Item {...formItemAttr} valuePropName="checked">
            <Switch {...componentAttr} />
          </Form.Item>
        );
        break;
      case 'radio':
        result = (
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
        break;
      case 'category':
      case 'tree':
        result = (
          <Form.Item {...formItemAttr}>
            <TreeSelect treeData={field.data} {...componentAttr} treeCheckable />
          </Form.Item>
        );
        break;
      case 'parent':
        result = (
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
        break;
      case 'textEditor':
        result = (
          <Form.Item {...formItemAttr}>
            {/* @ts-ignore */}
            <TinyMCEEditor />
          </Form.Item>
        );
        break;
      default:
      // return null;
    }

    if (field.reactions && field.reactions[0].type === 'passive') {
      const dependencyField = field.reactions[0].conditions[0].dependency;
      const dependencyValue = field.reactions[0].conditions[0].when;
      return (
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues[dependencyField] !== currentValues[dependencyField]
          }
        >
          {({ getFieldValue }) =>
            getFieldValue(dependencyField) === dependencyValue ? result : null
          }
        </Form.Item>
      );
    }
    return result;
  });
};

export default FormBuilder;
