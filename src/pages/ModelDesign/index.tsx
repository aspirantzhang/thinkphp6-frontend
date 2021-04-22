import { useState, useEffect, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { createForm, onFieldChange, onFieldReact, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, ArrayTable, Switch, Space, Select, Checkbox } from '@formily/antd';
import { Card, Spin, Button, message } from 'antd';
import * as enums from './enums';
import { useSetState } from 'ahooks';
import { request, useLocation, history, useModel } from 'umi';
import Modal from './Modal';
import styles from './index.less';
import { schemaExample } from './initialValues';

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

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentFieldPath, setCurrentFieldPath] = useState('');
  const [modalState, setModalState] = useSetState({
    type: '',
    values: {},
  });
  const [spinLoading, setSpinLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();
  const { initialState, setInitialState, refresh } = useModel('@@initialState');

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('*.*.uri', (field) => {
            if (isField(field)) {
              field.value = field.value?.replace('admins', field.query('routeName').get('value'));
            }
          });
          onFieldReact('fields.*.data', (field) => {
            if (isField(field)) {
              const typeValue = field.query('.type').get('value');
              field.editable = typeValue === 'switch' || typeValue === 'radio';
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
            `${location.pathname.replace('/basic-list/api/models/model-design', '')}`,
          );
          if (stopMark !== true) {
            setSpinLoading(false);
            form.setState((state) => {
              const { routeName, ...rest } = res.data.data;
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

  const reFetchMenu = async () => {
    setInitialState({
      ...initialState,
      settings: {
        menu: {
          loading: true,
        },
      },
    });

    refresh();

    // const userMenu = await initialState?.fetchMenu?.();
    // if (userMenu) {
    //   setInitialState({
    //     ...initialState,
    //     currentMenu: userMenu,
    //   });
    // }
  };

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
          `${location.pathname.replace('/basic-list/api/models/model-design', '')}`,
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
          reFetchMenu();
        }
      } catch (error) {
        setSubmitLoading(false);
      }
    };

    updateData();
  };

  return (
    <PageContainer>
      {spinLoading ? (
        <Spin className={styles.formSpin} tip="Loading..." />
      ) : (
        <Form form={form}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card title="Basic" size="small">
              <SchemaField>
                <SchemaField.String
                  name="routeName"
                  title="Route Name"
                  x-component="Input"
                  x-decorator="FormItem"
                />
              </SchemaField>
            </Card>
            <Card title="Fields" size="small">
              <SchemaField>
                <SchemaField.Array x-component="ArrayTable" name="fields" x-decorator="FormItem">
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
                        enum={enums.fieldType}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{ title: 'Data', width: 60, align: 'center' }}
                    >
                      <SchemaField.String
                        name="data"
                        x-component="Button"
                        x-decorator="FormItem"
                        x-content="Data"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: 'List Sorter',
                        width: 90,
                        align: 'center',
                      }}
                    >
                      <SchemaField.Boolean
                        name="listSorter"
                        x-component="Checkbox"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: 'Hide in Column',
                        dataIndex: 'hideInColumn',
                        width: 90,
                        align: 'center',
                      }}
                    >
                      <SchemaField.Boolean
                        name="hideInColumn"
                        x-component="Checkbox"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: 'Edit Disabled',
                        dataIndex: 'editDisabled',
                        width: 90,
                        align: 'center',
                      }}
                    >
                      <SchemaField.Boolean
                        name="editDisabled"
                        x-component="Checkbox"
                        x-decorator="FormItem"
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

export default Index;
