import React, { FC } from 'react';
import { Form, Input, Button, message, Icon } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useDynamicList } from 'ahooks';

const Index = () => {
  const [form] = Form.useForm();
  const { list, remove, getKey, push } = useDynamicList(['David', 'Jack']);

  const onFinish = (values) => {
    console.log(values);
    message.info(JSON.stringify(values));
  };

  const buildRow = (index: number, item: any) => {
    return (
      <>
        <Form.Item key={getKey(index)} required={false}>
          <Form.Item {...item} noStyle>
            <Input style={{ width: 300 }} />
          </Form.Item>
          <MinusCircleOutlined
            style={{ marginLeft: 8 }}
            onClick={() => {
              remove(index);
            }}
          />
          <PlusCircleOutlined
            style={{ marginLeft: 8 }}
            onClick={() => {
              push('');
            }}
          />
        </Form.Item>
      </>
    );
  };

  return (
    <>
      <Form form={form} name="control-hooks" onFinish={onFinish}>
        <Form.List name="names">
          {list.map((ele, index) => {
            console.log(ele, index);
            // return buildRow(index, ele);
          })}
        </Form.List>
      </Form>
      <Button
        style={{ marginTop: 8 }}
        type="primary"
        onClick={() => {
          form.submit();
        }}
      >
        Submit
      </Button>
    </>
  );
};

export default Index;
