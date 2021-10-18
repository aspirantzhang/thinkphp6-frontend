import { useEffect, useState, useCallback } from 'react';
import {
  Form,
  Input,
  message,
  Tag,
  Spin,
  Row,
  Col,
  Tabs,
  Card,
  Space,
  Tooltip,
  Button,
} from 'antd';
import { useRequest, useLocation, history, useIntl, getLocale } from 'umi';
import { ClockCircleTwoTone } from '@ant-design/icons';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import moment from 'moment';
import _ from 'lodash';
import FormBuilder from '../builder/FormBuilder';
import ActionBuilder from '../builder/ActionBuilder';
import RevisionModal from './RevisionModal';
import FlagIcon from '../builder/FlagIcon';
import { setFieldsAdaptor, submitFieldsAdaptor, getDefaultValue } from '../helper';
import styles from '../index.less';

const Page = () => {
  const [form] = Form.useForm();
  const { TabPane } = Tabs;
  const location = useLocation();
  const lang = useIntl();
  const [revisionVisible, setRevisionVisible] = useState(false);
  const currentLang = getLocale().toLowerCase();

  const init = useRequest<{ data: BasicListApi.PageData }>(
    `${location.pathname.replace('/basic-list', '')}`,
    {
      onError: () => {
        history.goBack();
      },
    },
  );
  const request = useRequest(
    (values: any) => {
      message.loading({
        content: lang.formatMessage({
          id: 'basic-list.processing',
        }),
        key: 'process',
        duration: 0,
        className: 'process-message',
      });
      const { uri, method, ...formValues } = values;
      return {
        url: `${uri}`,
        method,
        data: {
          ...submitFieldsAdaptor(formValues),
        },
      };
    },
    {
      manual: true,
      onSuccess: (res: BasicListApi.Root) => {
        message.success({
          content: res?.message,
          key: 'process',
          className: 'process-message',
        });
        history.goBack();
        if (res.call && res.call.length > 0) {
          res.call.forEach((callName) => {
            actionHandler({ call: callName });
          });
        }
      },
      formatResult: (res: any) => {
        return res;
      },
      throttleInterval: 1000,
    },
  );

  useEffect(() => {
    if (init.data) {
      form.setFieldsValue(
        setFieldsAdaptor(
          [...(init.data.layout.tabs || []), ...(init.data.layout.sidebars || [])],
          init.data.dataSource,
        ),
      );
    }
  }, [init.data]);

  function actionHandler(action: Partial<BasicListApi.Action>) {
    switch (action.call) {
      case 'submit':
        form.setFieldsValue({ uri: action.uri, method: action.method });
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
  }

  const onFinish = (values: any) => {
    request.run(values);
  };

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };

  const onModelHide = useCallback((reload) => {
    setRevisionVisible(false);
    if (reload) {
      history.goBack();
    }
  }, []);

  const titleField = _.find(init?.data?.layout?.tabs[0]?.data, ['titleField', true]);
  const havePathField = _.findIndex(init?.data?.layout?.tabs[0]?.data, ['name', 'pathname']) !== -1;

  return (
    <PageContainer
      header={{
        title: (
          <>
            <FlagIcon code={currentLang.substr(currentLang.indexOf('-') + 1)} />{' '}
            {init?.data?.page?.title}
          </>
        ),
        breadcrumb: {},
      }}
    >
      {init?.loading ? (
        <Spin className={styles.formSpin} tip="Loading..." />
      ) : (
        <Form
          form={form}
          {...layout}
          initialValues={
            init.data &&
            getDefaultValue([
              ...(init.data.layout.tabs || []),
              ...(init.data.layout.sidebars || []),
            ])
          }
          onFinish={onFinish}
        >
          <Row gutter={24}>
            <Col sm={18}>
              {titleField && (
                <Form.Item noStyle name={titleField.name} key={titleField.title}>
                  <Input size="large" style={{ fontSize: '20px' }} />
                </Form.Item>
              )}
              {havePathField && (
                <Form.Item label="URL Path" labelCol={{ span: 2 }}>
                  <Row>
                    <Col span={16}>
                      <Form.Item name="pathname" noStyle>
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Button>Edit</Button>
                    </Col>
                  </Row>
                </Form.Item>
              )}
              <Tabs type="card" className={styles.pageTabs}>
                {(init?.data?.layout?.tabs || []).map((tab) => {
                  return (
                    <TabPane tab={tab.title} key={tab.title}>
                      <Card>{FormBuilder(tab.data, '', titleField && [titleField.name])}</Card>
                    </TabPane>
                  );
                })}
              </Tabs>
            </Col>
            <Col sm={6}>
              {(init?.data?.layout?.actions || []).map((action) => {
                return (
                  <Card className={styles.textAlignCenter}>
                    <Space>{ActionBuilder(action.data, actionHandler)}</Space>
                  </Card>
                );
              })}
              {(init?.data?.layout?.sidebars || []).map((sidebar) => {
                return <Card>{FormBuilder(sidebar.data, '')}</Card>;
              })}
            </Col>
          </Row>
          <FooterToolbar
            extra={
              !(init.data?.page?.options?.revision === false) && (
                <Space>
                  <Tooltip
                    title={lang.formatMessage({
                      id: 'basic-list.revision',
                    })}
                  >
                    <ClockCircleTwoTone
                      onClick={() => {
                        setRevisionVisible(true);
                      }}
                    />
                  </Tooltip>
                  <Tag>
                    {lang.formatMessage({
                      id: `basic-list.page.updateTime`,
                    })}
                    :{moment(init.data?.dataSource?.update_time).format('YYYY-MM-DD HH:mm:ss')}
                  </Tag>
                </Space>
              )
            }
          >
            {ActionBuilder(init?.data?.layout?.actions[0].data, actionHandler)}
          </FooterToolbar>
          <Form.Item name="uri" key="uri" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="method" key="method" hidden>
            <Input />
          </Form.Item>
          <RevisionModal
            visible={revisionVisible}
            onHide={onModelHide}
            uri={`${location.pathname.replace('/basic-list', '')}/revisions`}
          />
        </Form>
      )}
    </PageContainer>
  );
};

export default Page;
