import React, { FC, useEffect, useState } from 'react';
import { Row, Col, Card, Form, Input, Space, message, Tag, Tabs, Spin } from 'antd';
import moment from 'moment';
import { request, history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { buildFields, buildActions, preFinish, preSetFields } from '@/components/Form';
import { getPageQuery } from '@/utils/utils';
import { PageDataState, FormValues } from './data';
import styles from './style.less';

interface SinglePageProps {}

const SinglePage: FC<SinglePageProps> = () => {
  const params = getPageQuery();
  const initUri = params.uri as string;

  const [mainData, setMainData] = useState<PageDataState | undefined>(undefined);
  const [actionsLoading, setActionsLoading] = useState<boolean>(false);
  const [spinLoading, setSpinLoading] = useState<boolean>(true);
  const { TabPane } = Tabs;
  const [form] = Form.useForm();

  useEffect(() => {
    let stopMark = false;

    async function fetchMainData(uri: string) {
      try {
        const rawData = await request(uri);
        setSpinLoading(false);
        if (!stopMark) setMainData(rawData.data);
      } catch (error) {
        setSpinLoading(false);
        history.goBack();
      }
    }

    if (initUri) {
      setMainData(undefined);
      form.resetFields();
      setSpinLoading(true);
      fetchMainData(initUri);
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
    setActionsLoading(true);
    const processingHide = message.loading('Processing...');
    const { submitValues, uri, method } = preFinish(values);

    request(uri, {
      method,
      data: submitValues,
    })
      .then((response) => {
        processingHide();
        message.success(response.message);
        setActionsLoading(false);
        history.goBack();
      })
      .catch(() => {
        processingHide();
        setActionsLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  if (mainData?.layout && mainData.dataSource) {
    form.setFieldsValue(preSetFields(mainData));
  }

  return (
    <>
      <PageHeaderWrapper>
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
                  <form key="form">
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
                            <div className={styles.actionRow}>
                              {mainData.dataSource && form.getFieldValue('update_time') && (
                                <Tag className={styles.modalBottomTip} key="update_time">
                                  Update Time:&nbsp;
                                  {form.getFieldValue('update_time').format('YYYY-MM-DD HH:mm:ss')}
                                </Tag>
                              )}
                              <div key="actions">
                                <Space>{buildActions(column, actionsLoading, actionHandler)}</Space>
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
                  </form>
                </Card>
              </Col>
              <Col lg={8} md={24} sm={24} xs={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card>
                    <Space>
                      {mainData?.layout.map((column: any) => {
                        if (column.type === 'actions') {
                          return buildActions(column, actionsLoading, actionHandler);
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
      </PageHeaderWrapper>
    </>
  );
};

export default SinglePage;
