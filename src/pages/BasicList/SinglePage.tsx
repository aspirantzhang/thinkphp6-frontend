import React, { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Row, Col, Card, Form, Input, Space, message, Tag, Tabs, Spin } from 'antd';
import moment from 'moment';
import { request, useRequest, history } from 'umi';
import { useBoolean } from 'ahooks';
import { buildFields, buildActions, preFinish, preSetFields } from '@/components/Form';
import { getPageQuery } from '@/utils/utils';
import { PageDataState, FormValues } from './data';
import styles from './style.less';

interface SinglePageProps {}

const SinglePage: FC<SinglePageProps> = () => {
  const [mainData, setMainData] = useState<PageDataState | undefined>(undefined);
  const [spinLoading, setSpinLoading] = useBoolean(true);
  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const initUri = getPageQuery().uri;

  const { loading, run } = useRequest(
    (url: string, method: string, requestData: any) => {
      return {
        url: `/api/${url}`,
        method,
        data: requestData,
      };
    },
    {
      manual: true,
      throttleInterval: 1000,
      onSuccess: (response) => {
        message.success({ content: response.message, key: 'msg' });
        history.goBack();
      },
      onError: (error) => {
        message.error({ content: error.message, key: 'msg' });
      },
      formatResult: (response) => {
        return response;
      },
    },
  );

  useEffect(() => {
    let stopMark = false;

    async function fetchMainData(uri: string) {
      try {
        const rawData = await request(`/api/${uri}`);
        setSpinLoading.setFalse();
        if (!stopMark) setMainData(rawData.data);
      } catch (error) {
        setSpinLoading.setFalse();
        history.goBack();
      }
    }

    if (initUri) {
      setMainData(undefined);
      form.resetFields();
      setSpinLoading.setTrue();
      fetchMainData(initUri as string);
    }
    return () => {
      stopMark = true;
    };
  }, [initUri]);

  const actionHandler = (type: string, uri: string, method: string) => {
    switch (type) {
      case 'submit':
        form.setFieldsValue({ uri, method });
        form.submit();
        break;
      case 'cancel':
        history.goBack();
        break;
      case 'reset':
        form.resetFields();
        break;
      default:
        break;
    }
  };

  const onFinish = async (values: FormValues) => {
    message.loading({ content: 'Processing...', key: 'msg' });
    const { submitValues, uri, method } = preFinish(values);
    run(uri, method, submitValues);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  useEffect(() => {
    if (mainData?.layout && mainData.dataSource) {
      form.setFieldsValue(preSetFields(mainData));
    }
  }, [mainData]);

  return (
    <>
      <PageContainer>
        <Spin
          spinning={spinLoading}
          tip="Loading, please wait..."
          className={styles.modalSpin}
          key="spin"
        />
        <Tabs defaultActiveKey="1" type="card" style={{ display: spinLoading ? 'none' : 'block' }}>
          <TabPane tab="Card Tab 1" key="1">
            <Row gutter={24}>
              <Col lg={16} md={24} sm={24} xs={24}>
                <Card className={styles.mainCard}>
                  <div key="form">
                    <Form
                      {...layout}
                      form={form}
                      onFinish={onFinish}
                      onFinishFailed={onFinishFailed}
                      initialValues={{
                        status: true,
                        create_time: moment(),
                      }}
                    >
                      {buildFields(mainData)}
                      {mainData?.layout.map((column: any) => {
                        if (column.type === 'actions') {
                          return (
                            <div className={styles.actionRow} key="actionRow">
                              {mainData?.dataSource?.update_time && (
                                <Tag className={styles.modalBottomTip} key="update_time">
                                  Update Time:&nbsp;
                                  {moment(mainData.dataSource.update_time, moment.ISO_8601).format(
                                    'YYYY-MM-DD HH:mm:ss',
                                  )}
                                </Tag>
                              )}
                              <div key={column.key}>
                                <Space>{buildActions(column, actionHandler, loading)}</Space>
                              </div>
                            </div>
                          );
                        }
                        return null;
                      })}
                      <Form.Item name="uri" key="uri" hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item name="method" key="method" hidden>
                        <Input />
                      </Form.Item>
                    </Form>
                  </div>
                </Card>
              </Col>
              <Col lg={8} md={24} sm={24} xs={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card>
                    <Space>
                      {mainData?.layout.map((column: any) => {
                        if (column.type === 'actions') {
                          return buildActions(column, actionHandler, loading);
                        }
                        return null;
                      })}
                    </Space>
                  </Card>
                  <Card title="Sidebar 2">sidebar2</Card>
                </Space>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="Card Tab 2" key="2">
            Content of card tab 2
          </TabPane>
          <TabPane tab="Card Tab 3" key="3">
            Content of card tab 3
          </TabPane>
        </Tabs>
      </PageContainer>
    </>
  );
};

export default SinglePage;
