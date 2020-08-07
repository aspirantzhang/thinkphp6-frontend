import React, { useEffect, useState, FC } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  DatePicker,
  Switch,
  Button,
  Space,
  message,
  Tag,
  Tabs,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import { request, history } from 'umi';
import { getPageQuery } from '@/utils/utils';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { unset } from 'lodash';
import { PageDataState, FormValues } from './data';
import styles from './style.less';

const { TabPane } = Tabs;

interface PageProps {}

const Page: FC<PageProps> = () => {
  const params = getPageQuery();
  const pageUri = params.uri as string;

  const [mainData, setMainData] = useState<PageDataState>();
  const [buttonLoading, setButtonLoading] = useState<boolean>(false);
  const [spinLoading, setSpinLoading] = useState<boolean>(true);
  const [form] = Form.useForm();

  useEffect(() => {
    if (pageUri) {
      setMainData(undefined);
      form.resetFields();
      setSpinLoading(true);
      getData(pageUri);
    }
  }, [pageUri]);

  async function getData(uri: string) {
    const rawData = await request(uri);

    setSpinLoading(false);
    setMainData(rawData.data);
  }

  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
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

  const cancelHandler = () => {
    history.goBack();
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
    setButtonLoading(true);
    const processingHide = message.loading('Processing...');
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
        processingHide();
        message.success(response.message);
        cancelHandler();
        setButtonLoading(false);
      })
      .catch(() => {
        processingHide();
        setButtonLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const actionsLayout = (column: any) => {
    return column.actions.map((action: any) => {
      if (action.component === 'button') {
        return (
          <>
            <Button
              type={action.type}
              key={action.action}
              loading={buttonLoading}
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
    });
  };

  return (
    <>
      <PageHeaderWrapper>
        {/* <Spin
          spinning={spinLoading}
          tip="Loading, please wait..."
          className={styles.modalSpin}
          key="spin"
        /> */}
        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Card Tab 1" key="1">
            <Row gutter={24}>
              <Col lg={16} md={24} sm={24} xs={24}>
                <Card className={styles.mainCard}>
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
                                  <Form.Item
                                    name={column.key}
                                    label={column.title}
                                    key={column.key}
                                  >
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
                            case 'tree':
                              return (
                                <Form.Item
                                  name={column.key}
                                  label={column.title}
                                  key={column.key}
                                  // valuePropName="checked"
                                >
                                  <TreeSelect
                                    showSearch
                                    style={{ width: '100%' }}
                                    dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                                    treeData={column.data}
                                    placeholder="Please select"
                                    multiple
                                    treeDefaultExpandAll
                                    treeCheckable
                                    showCheckedStrategy="SHOW_PARENT"
                                    allowClear
                                  />
                                </Form.Item>
                              );
                            case 'actions':
                              return (
                                <div className={styles.actionRow}>
                                  {mainData.dataSource && form.getFieldValue('update_time') && (
                                    <Tag className={styles.modalBottomTip} key="update_time">
                                      Update Time:&nbsp;
                                      {form
                                        .getFieldValue('update_time')
                                        .format('YYYY-MM-DD HH:mm:ss')}
                                    </Tag>
                                  )}
                                  <div key="actions">
                                    <Space>{actionsLayout(column)}</Space>
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
                </Card>
              </Col>
              <Col lg={8} md={24} sm={24} xs={24}>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Card>
                    <Space>
                      {mainData?.layout?.map((column: any) => {
                        if (column.type === 'actions') {
                          return actionsLayout(column);
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

export default Page;
