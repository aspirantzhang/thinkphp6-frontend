import { useState, useEffect, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { createForm, onFieldChange, onFieldReact, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, ArrayTable, Switch, Select, Checkbox } from '@formily/antd';
import { Spin, Button, Card, Space, message } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { useRequest, useLocation, history } from 'umi';
import Modal from '../component/Modal';
import SettingDrawer from '../component/SettingDrawer';
import AllowDrawer from '../component/AllowDrawer';
import styles from '../index.less';
import { initialFields } from './initialFields';
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
  const [currentFieldPath, setCurrentFieldPath] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalState, setModalState] = useSetState({
    type: '',
    values: {},
  });
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerState, setDrawerState] = useSetState({
    type: '',
    values: {},
  });
  const [allowDrawerVisible, setAllowDrawerVisible] = useState(false);
  const [drawerFieldData, setDrawerFieldData] = useSetState<{ fields?: Record<string, unknown> }>();
  const [spinLoading, setSpinLoading] = useState(true);
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
          onFieldChange('fields.*.settings', ['active'], (field) => {
            if (isField(field) && field.active === true) {
              setCurrentFieldPath(field.path.toString());
              setDrawerState({
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
    if (drawerState.type) {
      setDrawerVisible(true);
    }
  }, [drawerState.type]);

  useEffect(() => {
    if (drawerFieldData.fields && Object.keys(drawerFieldData.fields).length > 0) {
      setAllowDrawerVisible(true);
    }
  }, [drawerFieldData]);

  const init = useRequest(
    {
      url: `${location.pathname.replace('/basic-list/api/models/field-design', '')}`,
    },
    {
      manual: true,
      onSuccess: (res) => {
        setSpinLoading(false);
        form.setState((state) => {
          if (
            res.data.data?.fields === undefined ||
            Object.keys(res.data.data.fields).length === 0
          ) {
            message.info('Initialized with sample values.');
            state.initialValues = initialFields;
          }
          state.initialValues = res.data.data;
        });
      },
      onError: () => {
        history.goBack();
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

  const modalSubmitHandler = (values: any) => {
    setModalVisible(false);
    form.setFieldState(currentFieldPath, (state) => {
      state.value = values.data;
    });
    setModalState({ type: '', values: {} });
  };

  const drawerSubmitHandler = (values: any) => {
    setDrawerVisible(false);
    form.setFieldState(currentFieldPath, (state) => {
      state.value = values;
    });
    setDrawerState({ type: '', values: {} });
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
          <Card title="Fields" size="small">
            <SchemaField>
              <SchemaField.Array x-component="ArrayTable" name="fields" x-decorator="FormItem">
                <SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Column"
                    x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                  >
                    <SchemaField.Void x-component="ArrayTable.SortHandle" x-decorator="FormItem" />
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
                    x-component-props={{ title: 'Settings', width: 60, align: 'center' }}
                  >
                    <SchemaField.String
                      name="settings"
                      x-component="Button"
                      x-decorator="FormItem"
                      x-content="Settings"
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
                <DoubleLeftOutlined /> Back to List
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  form.submit(setDrawerFieldData);
                }}
                shape="round"
              >
                Next Step <DoubleRightOutlined />
              </Button>
            </Space>
          </div>
        }
      />
      <Modal
        modalVisible={modalVisible}
        hideModal={() => {
          setModalVisible(false);
          setModalState({ type: '', values: {} });
        }}
        modalState={modalState}
        modalSubmitHandler={modalSubmitHandler}
      />
      <SettingDrawer
        hideDrawer={() => {
          setDrawerVisible(false);
          setDrawerState({ type: '', values: {} });
        }}
        drawerVisible={drawerVisible}
        drawerState={drawerState}
        drawerSubmitHandler={drawerSubmitHandler}
      />
      <AllowDrawer
        hideAllowDrawer={() => {
          setAllowDrawerVisible(false);
          setDrawerFieldData({ fields: {} });
        }}
        allowDrawerVisible={allowDrawerVisible}
        drawerFieldData={drawerFieldData}
      />
    </PageContainer>
  );
};

export default Field;
