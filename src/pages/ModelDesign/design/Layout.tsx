import { useState, useEffect, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { createForm, onFieldChange, onFieldReact, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, ArrayTable, Switch, Space, Select, Checkbox } from '@formily/antd';
import { Spin, Button, Card, message } from 'antd';
import { useSetState } from 'ahooks';
import { request, useLocation, history } from 'umi';
import Modal from '../component/Modal';
import styles from '../index.less';
import { schemaExample } from './initialValues';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFieldPath, setCurrentFieldPath] = useState('');
  const [modalState, setModalState] = useSetState({
    type: '',
    values: {},
  });
  const [spinLoading, setSpinLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('*.*.uri', (field) => {
            if (isField(field)) {
              field.value = field.value?.replace('admins', field.query('modelName').get('value'));
            }
          });
          onFieldReact('fields.*.data', (field) => {
            if (isField(field)) {
              const typeValue = field.query('.type').get('value');
              const attrValue = typeValue === 'switch' || typeValue === 'radio';
              field.editable = attrValue;
              field.required = attrValue;
            }
          });
          onFieldChange('fields.*.data', ['active'], (field) => {
            if (isField(field) && field.active === true) {
              setCurrentFieldPath(field.path.toString());
              setModalState({
                values: field.value,
                type: field.query('.type').get('value'),
              });
              field.active = false;
            }
          });
        },
      }),
    [],
  );

  useEffect(() => {
    if (modalState.type) {
      setModalVisible(true);
    }
  }, [modalState.type]);

  useEffect(() => {
    let stopMark = false;
    if (location.pathname) {
      const getData = async () => {
        try {
          const res = await request(
            `${location.pathname.replace('/basic-list/api/models/layout-design', '')}`,
          );
          if (stopMark !== true) {
            setSpinLoading(false);
            form.setState((state) => {
              const { modelName, ...rest } = res.data.data;
              if (Object.keys(rest).length === 0) {
                state.initialValues = schemaExample;
              }
              state.initialValues = res.data.data;
            });
          }
        } catch (error) {
          history.goBack();
        }
      };
      getData();
    }
    return () => {
      stopMark = true;
    };
  }, [location.pathname]);

  const modalSubmitHandler = (values: any) => {
    setModalVisible(false);
    form.setFieldState(currentFieldPath, (state) => {
      state.value = values.data;
    });
    setModalState({ type: '', values: {} });
  };

  const pageSubmitHandler = (values: any) => {
    setSubmitLoading(true);
    message.loading({ content: 'Processing...', key: 'process', duration: 0 });
    const updateData = async () => {
      try {
        const res = await request(
          `${location.pathname.replace('/basic-list/api/models/layout-design', '')}`,
          {
            method: 'put',
            data: {
              data: values,
            },
          },
        );
        if (res.success === true) {
          message.success({ content: res.message, key: 'process' });
          history.goBack();
        }
      } catch (error) {
        setSubmitLoading(false);
      }
    };

    updateData();
  };

  return (
    <PageContainer
      header={{
        breadcrumb: {},
      }}
    >
      {spinLoading ? (
        <Spin className={styles.formSpin} tip="Loading..." />
      ) : (
        <Form form={form}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="Basic" size="small">
              <SchemaField>
                <SchemaField.String
                  name="modelName"
                  title="Route Name"
                  x-component="Input"
                  x-decorator="FormItem"
                />
              </SchemaField>
            </Card>
            <Card title="List Action" size="small">
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

            <Card title="Add Action" size="small">
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

            <Card title="Edit Action" size="small">
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

            <Card title="Table Toolbar" size="small">
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

            <Card title="Batch Toolbar" size="small">
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

            <Card title="Batch Toolbar - Trashed" size="small">
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
          <Button
            type="primary"
            onClick={() => {
              form.submit(pageSubmitHandler);
            }}
            loading={submitLoading}
          >
            Submit
          </Button>
        }
      />
      <Modal
        modalVisible={modalVisible}
        hideModal={() => {
          setModalVisible(false);
          setModalState({ type: '', values: {} });
        }}
        modalSubmitHandler={modalSubmitHandler}
        modalState={modalState}
      />
    </PageContainer>
  );
};

export default Field;
