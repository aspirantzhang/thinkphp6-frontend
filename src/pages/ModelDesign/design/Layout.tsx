import { useState, useEffect, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { createForm, onFieldReact, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, ArrayTable, Switch, Space, Select, Checkbox } from '@formily/antd';
import { Spin, Button, Card, message } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { useRequest, useLocation, history, useIntl } from 'umi';
import styles from '../index.less';
import { initialLayout } from './initialLayout';
import * as enums from './enums';

const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayTable,
    Switch,
    Select,
    Checkbox,
    Button,
  },
});

const Field = () => {
  const [spinLoading, setSpinLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();
  const lang = useIntl();

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('*.*.uri', (field) => {
            if (isField(field)) {
              field.value = field.value?.replace(
                '{%tableName%}',
                field.query('tableName').get('value'),
              );
            }
          });
        },
      }),
    [],
  );

  const init = useRequest(
    {
      url: `${location.pathname.replace('/basic-list/api/models/layout-design', '')}`,
    },
    {
      manual: true,
      onSuccess: (res) => {
        setSpinLoading(false);
        form.setState((state) => {
          const { tableName, ...rest } = res.data.layout;
          if (Object.keys(rest).length === 0) {
            message.info(
              lang.formatMessage({
                id: 'model-design.initSampleValue',
              }),
            );
            state.initialValues = initialLayout;
          }
          state.initialValues = res.data.layout;
        });
      },
      onError: () => {
        history.goBack();
      },
      formatResult: (res: any) => {
        return res.data;
      },
      throttleInterval: 1000,
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
      return {
        url: `${location.pathname.replace('/basic-list/api/models/layout-design', '')}`,
        method: 'put',
        data: {
          type: 'layout',
          data: {
            layout: values,
          },
        },
      };
    },
    {
      manual: true,
      onSuccess: (data: BasicListApi.Root) => {
        message.success({
          content: data?.message,
          key: 'process',
          className: 'process-message',
        });
        history.goBack();
      },
      onError: () => {
        setSubmitLoading(false);
      },
      formatResult: (res: any) => {
        return res;
      },
      throttleInterval: 1000,
    },
  );

  useEffect(() => {
    if (location.pathname) {
      init.run();
    }
  }, [location.pathname]);

  const pageSubmitHandler = (values: any) => {
    setSubmitLoading(true);
    message.loading({
      content: lang.formatMessage({
        id: 'basic-list.processing',
      }),
      key: 'process',
      duration: 0,
    });
    request.run(values);
  };

  return (
    <PageContainer
      header={{
        title: init.data?.page?.title,
        breadcrumb: {},
      }}
    >
      {spinLoading ? (
        <Spin className={styles.formSpin} tip="Loading..." />
      ) : (
        <Form form={form}>
          <Card title="Basic" size="small" hidden>
            <SchemaField>
              <SchemaField.String
                name="tableName"
                title="Table Name"
                x-component="Input"
                x-decorator="FormItem"
              />
            </SchemaField>
          </Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card
              title={lang.formatMessage({
                id: 'model-design.listAction',
              })}
              size="small"
            >
              <SchemaField>
                <SchemaField.Array
                  x-component="ArrayTable"
                  name="listAction"
                  x-decorator="FormItem"
                >
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                    >
                      <SchemaField.Void
                        x-component="ArrayTable.SortHandle"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Name' }}
                    >
                      <SchemaField.String name="name" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Title' }}
                    >
                      <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Type' }}
                    >
                      <SchemaField.String
                        name="type"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.buttonType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Call', width: 200 }}
                    >
                      <SchemaField.String
                        name="call"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.callType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Uri' }}
                    >
                      <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Method' }}
                    >
                      <SchemaField.String
                        name="method"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.httpMethod}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Operations', width: 100, align: 'center' }}
                    >
                      <SchemaField.Void x-component="ArrayTable.Remove" />
                      <SchemaField.Void x-component="ArrayTable.MoveUp" />
                      <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Addition"
                    x-component-props={{ title: 'Add' }}
                  />
                </SchemaField.Array>
              </SchemaField>
            </Card>

            <Card
              title={lang.formatMessage({
                id: 'model-design.addAction',
              })}
              size="small"
            >
              <SchemaField>
                <SchemaField.Array x-component="ArrayTable" name="addAction" x-decorator="FormItem">
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                    >
                      <SchemaField.Void
                        x-component="ArrayTable.SortHandle"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Name' }}
                    >
                      <SchemaField.String name="name" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Title' }}
                    >
                      <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Type' }}
                    >
                      <SchemaField.String
                        name="type"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.buttonType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Call', width: 200 }}
                    >
                      <SchemaField.String
                        name="call"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.callType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Uri' }}
                    >
                      <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Method' }}
                    >
                      <SchemaField.String
                        name="method"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.httpMethod}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Operations', width: 100, align: 'center' }}
                    >
                      <SchemaField.Void x-component="ArrayTable.Remove" />
                      <SchemaField.Void x-component="ArrayTable.MoveUp" />
                      <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Addition"
                    x-component-props={{ title: 'Add' }}
                  />
                </SchemaField.Array>
              </SchemaField>
            </Card>

            <Card
              title={lang.formatMessage({
                id: 'model-design.editAction',
              })}
              size="small"
            >
              <SchemaField>
                <SchemaField.Array
                  x-component="ArrayTable"
                  name="editAction"
                  x-decorator="FormItem"
                >
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                    >
                      <SchemaField.Void
                        x-component="ArrayTable.SortHandle"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Name' }}
                    >
                      <SchemaField.String name="name" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Title' }}
                    >
                      <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Type' }}
                    >
                      <SchemaField.String
                        name="type"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.buttonType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Call', width: 200 }}
                    >
                      <SchemaField.String
                        name="call"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.callType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Uri' }}
                    >
                      <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Method' }}
                    >
                      <SchemaField.String
                        name="method"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.httpMethod}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Operations', width: 100, align: 'center' }}
                    >
                      <SchemaField.Void x-component="ArrayTable.Remove" />
                      <SchemaField.Void x-component="ArrayTable.MoveUp" />
                      <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Addition"
                    x-component-props={{ title: 'Add' }}
                  />
                </SchemaField.Array>
              </SchemaField>
            </Card>

            <Card
              title={lang.formatMessage({
                id: 'model-design.tableToolbar',
              })}
              size="small"
            >
              <SchemaField>
                <SchemaField.Array
                  x-component="ArrayTable"
                  name="tableToolbar"
                  x-decorator="FormItem"
                >
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                    >
                      <SchemaField.Void
                        x-component="ArrayTable.SortHandle"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Name' }}
                    >
                      <SchemaField.String name="name" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Title' }}
                    >
                      <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Type' }}
                    >
                      <SchemaField.String
                        name="type"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.buttonType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Call', width: 200 }}
                    >
                      <SchemaField.String
                        name="call"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.callType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Uri' }}
                    >
                      <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Method' }}
                    >
                      <SchemaField.String
                        name="method"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.httpMethod}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Operations', width: 100, align: 'center' }}
                    >
                      <SchemaField.Void x-component="ArrayTable.Remove" />
                      <SchemaField.Void x-component="ArrayTable.MoveUp" />
                      <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Addition"
                    x-component-props={{ title: 'Add' }}
                  />
                </SchemaField.Array>
              </SchemaField>
            </Card>

            <Card
              title={lang.formatMessage({
                id: 'model-design.batchToolbar',
              })}
              size="small"
            >
              <SchemaField>
                <SchemaField.Array
                  x-component="ArrayTable"
                  name="batchToolbar"
                  x-decorator="FormItem"
                >
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                    >
                      <SchemaField.Void
                        x-component="ArrayTable.SortHandle"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Name' }}
                    >
                      <SchemaField.String name="name" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Title' }}
                    >
                      <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Type' }}
                    >
                      <SchemaField.String
                        name="type"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.buttonType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Call', width: 200 }}
                    >
                      <SchemaField.String
                        name="call"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.callType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Uri' }}
                    >
                      <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Method' }}
                    >
                      <SchemaField.String
                        name="method"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.httpMethod}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Operations', width: 100, align: 'center' }}
                    >
                      <SchemaField.Void x-component="ArrayTable.Remove" />
                      <SchemaField.Void x-component="ArrayTable.MoveUp" />
                      <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Addition"
                    x-component-props={{ title: 'Add' }}
                  />
                </SchemaField.Array>
              </SchemaField>
            </Card>

            <Card
              title={lang.formatMessage({
                id: 'model-design.batchToolbarTrashed',
              })}
              size="small"
            >
              <SchemaField>
                <SchemaField.Array
                  x-component="ArrayTable"
                  name="batchToolbarTrashed"
                  x-decorator="FormItem"
                >
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                    >
                      <SchemaField.Void
                        x-component="ArrayTable.SortHandle"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Name' }}
                    >
                      <SchemaField.String name="name" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Title' }}
                    >
                      <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Type' }}
                    >
                      <SchemaField.String
                        name="type"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.buttonType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Call', width: 200 }}
                    >
                      <SchemaField.String
                        name="call"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.callType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Uri' }}
                    >
                      <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Method' }}
                    >
                      <SchemaField.String
                        name="method"
                        x-component="Select"
                        x-decorator="FormItem"
                        enum={enums.httpMethod}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Operations', width: 100, align: 'center' }}
                    >
                      <SchemaField.Void x-component="ArrayTable.Remove" />
                      <SchemaField.Void x-component="ArrayTable.MoveUp" />
                      <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Addition"
                    x-component-props={{ title: 'Add' }}
                  />
                </SchemaField.Array>
              </SchemaField>
            </Card>
          </Space>
        </Form>
      )}
      <FooterToolbar
        extra={
          <div style={{ textAlign: 'center' }}>
            <Space size={50}>
              <Button
                danger
                shape="round"
                onClick={() => {
                  history.goBack();
                }}
              >
                <DoubleLeftOutlined />{' '}
                {lang.formatMessage({
                  id: 'model-design.back',
                })}
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  form.submit(pageSubmitHandler);
                }}
                loading={submitLoading}
                shape="round"
              >
                {lang.formatMessage({
                  id: 'model-design.submit',
                })}
                <DoubleRightOutlined />
              </Button>
            </Space>
          </div>
        }
      />
    </PageContainer>
  );
};

export default Field;
