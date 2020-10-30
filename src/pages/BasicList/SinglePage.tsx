import React, { FC, useEffect, useState } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { Row, Col, Card, Form, Input, Space, message, Tag, Tabs, Spin } from 'antd';
import moment from 'moment';
import { request, useRequest, history, useRouteMatch } from 'umi';
import { useBoolean } from 'ahooks';
import { FieldBuilder, ActionBuilder, FinishPrepare, FieldsPrepare } from '@/components/Form';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import * as helper from './helper';
import styles from './style.less';

interface SinglePageProps {}

const SinglePage: FC<SinglePageProps> = () => {
  const [mainData, setMainData] = useState<PageAPI.Data | undefined>(undefined);
  const [spinLoading, setSpinLoading] = useBoolean(true);
  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const match = useRouteMatch<API.UriMatchState>();

  const { fullUri } = helper.buildUriMatch(match);
  const initUri = fullUri as string;

  const { loading, run } = useRequest(
    (url: string, method: string, requestData: API.Store) => {
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
        message.success({ content: response.message, key: 'submit' });
        history.goBack();
      },
      onError: (error) => {
        message.error({ content: error.message, key: 'submit' });
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

  const actionHandler: API.ActionHandler = (actions) => {
    const { action, method, uri } = actions;
    switch (action) {
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

  const onFinish = async (values: API.Store) => {
    message.loading({ content: 'Processing...', key: 'submit' });
    const { submitValues, uri, method } = FinishPrepare(values);
    run(uri, method, submitValues);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<API.Store>) => {
    message.error({ content: errorInfo?.errorFields[0]?.errors[0], key: 'submit' });
  };

  const layout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 19 },
  };

  useEffect(() => {
    if (mainData?.layout && mainData.dataSource) {
      form.setFieldsValue(FieldsPrepare(mainData));
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
          <Row gutter={24}>
            <Col lg={16} md={24} sm={24} xs={24}>
              <Tabs
                defaultActiveKey="1"
                size="large"
                type="card"
                style={{ display: spinLoading ? 'none' : 'block' }}
              >
                {mainData?.layout?.tabs.map((value: PageAPI.Form) => {
                  return (
                    <TabPane tab={value.title} key={value.name}>
                      <Card bordered={false}>{FieldBuilder(value.data)}</Card>
                    </TabPane>
                  );
                })}
              </Tabs>
            </Col>
            <Col lg={8} md={24} sm={24} xs={24}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {mainData?.layout?.actions?.map((actions: PageAPI.Action) => {
                  return (
                    <Card className={styles.textCenter} size="small" key={actions.name}>
                      <Space>{ActionBuilder(actions, actionHandler, loading)}</Space>
                    </Card>
                  );
                })}
                {mainData?.layout?.sidebars?.map((sidebar: PageAPI.Form) => {
                  return (
                    <Card title={sidebar.title} key={sidebar.name}>
                      {FieldBuilder(sidebar.data)}
                    </Card>
                  );
                })}
              </Space>
            </Col>
          </Row>
          <Form.Item name="uri" key="uri" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="method" key="method" hidden>
            <Input />
          </Form.Item>
          <FooterToolbar
            className={styles.textAlignRight}
            extra={
              <>
                <Space>
                  {mainData?.layout.actions.map((actions: PageAPI.Action) => {
                    return ActionBuilder(actions, actionHandler, loading);
                  })}
                </Space>
                {mainData?.dataSource?.update_time && (
                  <Tag className={styles.fullPageBottomTip} key="update_time">
                    Update Time:&nbsp;
                    {moment(mainData.dataSource.update_time, moment.ISO_8601).format(
                      'YYYY-MM-DD HH:mm:ss',
                    )}
                  </Tag>
                )}
              </>
            }
          />
        </Form>
      </PageContainer>
    </>
  );
};

export default SinglePage;
