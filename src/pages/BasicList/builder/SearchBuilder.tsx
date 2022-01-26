import React from 'react';
import moment from 'moment';
import { Input, InputNumber, Form, DatePicker, TreeSelect, Col, Select, Radio } from 'antd';

const SearchBuilder = (data: BasicListApi.Field[] | undefined) => {
  return (Array.isArray(data) ? data : []).map((field) => {
    const formItemAttr = {
      label: field.title,
      name: field.name,
      key: field.name,
    };
    switch (field.type) {
      case 'input':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr}>
              <Input />
            </Form.Item>
          </Col>
        );
      case 'textarea':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr}>
              <Input />
            </Form.Item>
          </Col>
        );
      case 'number':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr}>
              <InputNumber style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        );
      case 'datetime':
        return (
          <Col sm={12} key={field.name}>
            <Form.Item {...formItemAttr}>
              <DatePicker.RangePicker
                showTime
                style={{ width: '100%' }}
                ranges={{
                  Today: [moment().startOf('day'), moment().endOf('day')],
                  'Last 7 Days': [moment().subtract(7, 'd'), moment()],
                  'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                  'Last Month': [
                    moment().subtract(1, 'months').startOf('month'),
                    moment().subtract(1, 'months').endOf('month'),
                  ],
                }}
              />
            </Form.Item>
          </Col>
        );
      case 'switch':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr} valuePropName="checked">
              <Select>
                {(Array.isArray(field.data) ? field.data : []).map((option: any) => {
                  return (
                    <Select.Option value={option.value} key={option.value}>
                      {option.title}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        );
      case 'radio':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr}>
              <Radio.Group buttonStyle="solid">
                {(field.data || []).map((item: any) => {
                  return (
                    <Radio.Button key={item.value} value={item.value}>
                      {item.title}
                    </Radio.Button>
                  );
                })}
              </Radio.Group>
            </Form.Item>
          </Col>
        );
      case 'category':
      case 'tree':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr}>
              <TreeSelect treeData={field.data} treeCheckable />
            </Form.Item>
          </Col>
        );
      case 'parent':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr}>
              <TreeSelect treeData={field.data} treeDefaultExpandAll allowClear />
            </Form.Item>
          </Col>
        );
      case 'select':
        return (
          <Col sm={6} key={field.name}>
            <Form.Item {...formItemAttr} valuePropName="checked">
              <Select>
                {(Array.isArray(field.data) ? field.data : []).map((option: any) => {
                  return (
                    <Select.Option value={option.value} key={option.value}>
                      {option.title}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
        );

      default:
        return null;
    }
  });
};

export default SearchBuilder;
