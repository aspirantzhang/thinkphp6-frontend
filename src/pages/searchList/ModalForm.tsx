import React, { useEffect, useState } from 'react';
import { Form, Input, DatePicker, Switch, Button, Space, message, Tag, Spin } from 'antd';
import moment from 'moment';
import { request } from 'umi';
import { unset } from 'lodash';
import { PageDataState, FormValues } from './data';
import styles from './style.less';

export const ModalForm = (props: any) => {
  const { formUri, cancelHandler, reloadHandler } = props;
  const [mainData, setMainData] = useState<PageDataState>();
  const [spinLoading, setSpinLoading] = useState<boolean>(true);
  const [form] = Form.useForm();

  // setSpinLoading(true);

  useEffect(() => {
    if (formUri) {
      setMainData(undefined);
      form.resetFields();
      setSpinLoading(true);
      getData(formUri);
    }
  }, [formUri]);

  async function getData(uri: string) {
    const rawData = await request(uri);

    setSpinLoading(false);
    setMainData(rawData.data);
  }

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

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

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const actionHandler = (type: string, uri: string, method: string) => {
    switch (type) {
      case 'submit':
        form.setFieldsValue({ uri, method });
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

  const onFinish = async (values: FormValues) => {
    const submitValues = {};
    let uri = '';
    let method = '';

    Object.keys(values).forEach((key) => {
      submitValues[key] = values[key];
      if (moment.isMoment(values[key])) {
        submitValues[key] = values[key].format();
      }
      if (key === 'uri') {
        uri = values[key];
        unset(submitValues, key);
      }
      if (key === 'method') {
        method = values[key];
        unset(submitValues, key);
      }
    });

    request(uri, {
      method,
      data: submitValues,
    })
      .then((response) => {
        message.success(response.message);
        cancelHandler();
        reloadHandler();
      })
      .catch(() => {});

    // console.log(result);
  };

  return (
    <>
      <Spin
        spinning={spinLoading}
        tip="Loading, please wait..."
        className={styles.modalSpin}
        key="spin"
      />
      <div
        className={styles.titleRow}
        style={{ display: spinLoading ? 'none' : 'block' }}
        key="title"
      >
        {mainData && mainData.page.title}{' '}
        {mainData &&
          mainData.dataSource &&
          mainData.dataSource.id &&
          `ID: ${mainData.dataSource.id}`}
      </div>
      <form style={{ display: spinLoading ? 'none' : 'block' }} key="form">
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
                case 'actions':
                  return (
                    <div className={styles.actionRow}>
                      {mainData.dataSource && form.getFieldValue('update_time') && (
                        <Tag className={styles.modalBottomTip} key="update_time">
                          Update Time:&nbsp;
                          {form.getFieldValue('update_time').format('YYYY-MM-DD HH:mm:ss')}
                        </Tag>
                      )}
                      <div key="actions">
                        <Space>
                          {column.actions.map((action: any) => {
                            if (action.component === 'button') {
                              return (
                                <>
                                  <Button
                                    type={action.type}
                                    key={action.action}
                                    onClick={() => {
                                      actionHandler(action.action, action.uri, action.method);
                                    }}
                                  >
                                    {action.text}
                                  </Button>
                                </>
                              );
                            }
                            return null;
                          })}
                        </Space>
                      </div>
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
          <Form.Item name="uri" key="uri" hidden style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item name="method" key="method" hidden style={{ display: 'none' }}>
            <Input />
          </Form.Item>
        </Form>
      </form>
    </>
  );
};

export default ModalForm;
