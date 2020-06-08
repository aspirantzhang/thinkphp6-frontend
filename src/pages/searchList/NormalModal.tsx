import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Switch } from 'antd';
import moment from 'moment';
import { request } from 'umi';
import { PageDataState } from './data.d';

export const NormalModal = (props: any) => {
  const { modalUri, stopLoading } = props;
  const [mainData, setMainData] = useState<PageDataState>();
  const [form] = Form.useForm();

  useEffect(() => {
    async function getData(uri: string) {
      const rawData = await request(uri);
      setMainData(rawData.data);
    }

    if (modalUri) {
      getData(modalUri);
    }
    stopLoading();
  }, [modalUri]);

  if (mainData && mainData.dataSource && mainData.layout) {
    const formData: any = [];

    mainData.layout.map((column: any) => {
      if (column.type === 'datetime') {
        formData[column.key] = moment(mainData.dataSource[column.key]);
      } else if (column.type === 'tag') {
        formData[column.key] = Boolean(mainData.dataSource[column.key]);
      } else {
        // type equals 'text' or others
        formData[column.key] = mainData.dataSource[column.key];
      }
      return null;
    });

    form.setFieldsValue(formData);
  }

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  return (
    <>
      <form>
        <Form
          {...layout}
          form={form}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          initialValues={{
            status: true,
          }}
        >
          {mainData &&
            mainData.layout &&
            mainData.layout.map((column: any) => {
              switch (column.type) {
                case 'datetime':
                  return (
                    <Form.Item name={column.key} label={column.title} key={column.key}>
                      <DatePicker showTime />
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
                default:
                  return (
                    <Form.Item name={column.key} label={column.title} key={column.key}>
                      <Input />
                    </Form.Item>
                  );
              }
            })}
        </Form>
      </form>
    </>
  );
};

export default NormalModal;
