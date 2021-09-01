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
  const [modalData, setModalData] = useSetState({
    type: '',
    values: {},
  });
  const [settingDrawerVisible, setSettingDrawerVisible] = useState(false);
  const [settingDrawerData, setSettingDrawerData] = useSetState({
    type: '',
    values: {},
  });
  const [allowDrawerVisible, setAllowDrawerVisible] = useState(false);
  const [allowDrawerData, setAllowDrawerData] = useSetState<{ fields?: Record<string, unknown> }>();
  const [spinLoading, setSpinLoading] = useState(true);
  const location = useLocation();

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('*.*.uri', (field) => {
            if (isField(field)) {
              field.value = field.value?.replace('admins', field.query('tableName').get('value'));
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
              setModalData({
                values: field.value,
                type: field.query('.type').get('value'),
              });
              setModalVisible(true);
              field.active = false;
            }
          });
          onFieldChange('fields.*.settings', ['active'], (field) => {
            if (isField(field) && field.active === true) {
              setCurrentFieldPath(field.path.toString());
              setSettingDrawerData({
                values: field.value,
                type: field.query('.type').get('value'),
              });
              setSettingDrawerVisible(true);
              field.active = false;
            }
          });
        },
      }),
    [],
  );

  useEffect(() => {
    if (allowDrawerData.fields && Object.keys(allowDrawerData.fields).length > 0) {
      setAllowDrawerVisible(true);
    }
  }, [allowDrawerData]);

  const init = useRequest(
    {
      url: `${location.pathname.replace('/basic-list/api/models/field-design', '')}`,
    },
    {
      manual: true,
      onSuccess: (res) => {
        setSpinLoading(false);
        form.setState((state) => {
          if (res.data?.fields === undefined || Object.keys(res.data.fields).length === 0) {
            message.info('Initialized with sample values.');
            state.initialValues = initialFields;
          }
          state.initialValues = res.data;
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

  useEffect(() => {
    if (location.pathname) {
      init.run();
    }
  }, [location.pathname]);

  const modalSubmitHandler = (values: any) => {
    setModalVisible(false);
    setModalData({ type: '', values: {} });
    form.setFieldState(currentFieldPath, (state) => {
      state.value = values.data;
    });
  };

  const drawerSubmitHandler = (values: any) => {
    setSettingDrawerVisible(false);
    setSettingDrawerData({ type: '', values: {} });
    form.setFieldState(currentFieldPath, (state) => {
      state.value = values;
    });
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
                  form.submit(setAllowDrawerData);
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
          setModalData({ type: '', values: {} });
        }}
        modalData={modalData}
        modalSubmitHandler={modalSubmitHandler}
      />
      <SettingDrawer
        hideDrawer={() => {
          setSettingDrawerVisible(false);
          setSettingDrawerData({ type: '', values: {} });
        }}
        settingDrawerVisible={settingDrawerVisible}
        settingDrawerData={settingDrawerData}
        drawerSubmitHandler={drawerSubmitHandler}
      />
      <AllowDrawer
        hideAllowDrawer={() => {
          setAllowDrawerData({ fields: {} });
          setAllowDrawerVisible(false);
        }}
        allowDrawerVisible={allowDrawerVisible}
        allowDrawerData={allowDrawerData}
      />
    </PageContainer>
  );
};

export default Field;
