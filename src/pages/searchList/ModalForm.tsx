import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Switch, Button, Space, message, Tag } from 'antd';
import moment from 'moment';
import { request } from 'umi';
import { PageDataState } from './data';
import styles from './style.less';

export const ModalForm = (props: any) => {
  const { visible, modalUri, stopLoading, cancelHandler, onFinish } = props;
  const [mainData, setMainData] = useState<PageDataState>();
  const [form] = Form.useForm();

  useEffect(() => {
    if (modalUri) {
      getData(modalUri);
    }
    stopLoading();
  }, [modalUri]);

  useEffect(() => {
    if (visible === false) {
      form.resetFields();
    }
  }, [visible]);

  async function getData(uri: string) {
    const rawData = await request(uri);
    setMainData(rawData.data);
  }

  // handle form values
  if (mainData && mainData.dataSource && mainData.layout) {
    const formData: any = [];

    mainData.layout.map((column: any) => {
      switch (column.type) {
        case 'datetime':
          formData[column.key] = moment(mainData.dataSource[column.key], moment.ISO_8601);
          break;
        case 'tag':
          formData[column.key] = Boolean(mainData.dataSource[column.key]);
          break;
        case 'action':
          break;

        default:
          // type equals 'text' or others
          formData[column.key] = mainData.dataSource[column.key];
          break;
      }

      return null;
    });

    form.setFieldsValue(formData);
  }

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const actionClickHandler = (action: string) => {
    switch (action) {
      case 'submit':
        form.submit();
        break;
      case 'cancel':
        cancelHandler();
        break;
      case 'reset':
        form.resetFields();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <form>
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            status: true,
          }}
        >
          {mainData &&
            mainData.layout &&
            mainData.layout.map((column: any) => {
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
                case 'action':
                  return (
                    <div className={styles.actionRow}>
                      <Tag className={styles.modalBottomTip}>
                        Update Time:&nbsp;
                        {form.getFieldValue('update_time').format('YYYY-MM-DD HH:mm:ss')}
                      </Tag>
                      <Form.Item name={column.key} key={column.key}>
                        <Space>
                          {column.actions.map((action: any) => {
                            if (action.component === 'button') {
                              return (
                                <Button
                                  type={action.type}
                                  key={action.action}
                                  onClick={() => {
                                    actionClickHandler(action.action);
                                  }}
                                >
                                  {action.text}
                                </Button>
                              );
                            }
                            return 1;
                          })}
                        </Space>
                      </Form.Item>
                    </div>
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

export default ModalForm;
