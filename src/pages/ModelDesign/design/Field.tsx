import { useState, useEffect, useMemo, useCallback } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { createForm, onFieldChange, onFieldReact, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  Form,
  FormItem,
  Input,
  ArrayTable,
  Switch,
  Select,
  Checkbox,
  FormGrid,
} from '@formily/antd';
import { Spin, Button, Card, Space, Dropdown, Menu, message } from 'antd';
import { DoubleRightOutlined, DoubleLeftOutlined, DownOutlined } from '@ant-design/icons';
import { useSetState } from 'ahooks';
import { useRequest, useLocation, history, useIntl, getLocale } from 'umi';
import Modal from '../component/Modal';
import SettingDrawer from '../component/SettingDrawer';
import FilterDrawer from '../component/FilterDrawer';
import FlagIcon from '../../BasicList/builder/FlagIcon';
import styles from '../index.less';
import { fields as news } from './example/news/fields';
import { fields as user } from './example/user/fields';
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
  const [handleFieldValidation, setHandleFieldValidation] = useState(true);
  const [handleFieldFilter, setHandleFilter] = useState(true);
  const [modalFieldPath, setModalFieldPath] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useSetState({
    type: '',
    values: {},
  });
  const [settingDrawerFieldPath, setSettingDrawerFieldPath] = useState('');
  const [settingDrawerVisible, setSettingDrawerVisible] = useState(false);
  const [settingDrawerData, setSettingDrawerData] = useSetState({
    type: '',
    values: {},
  });
  const [allowDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [allowDrawerData, setFilterDrawerData] =
    useSetState<{ options?: Record<string, unknown>; data?: Record<string, unknown>[] }>();
  const [spinLoading, setSpinLoading] = useState(true);
  const location = useLocation();
  const lang = useIntl();
  const currentLang = getLocale().toLowerCase();

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('options.handleFieldValidation', (field) => {
            if (isField(field)) {
              setHandleFieldValidation(field.value ?? true);
            }
          });
          onFieldReact('options.handleFieldFilter', (field) => {
            if (isField(field)) {
              setHandleFilter(field.value ?? true);
            }
          });
          onFieldReact('*.*.uri', (field) => {
            if (isField(field)) {
              field.value = field.value?.replace('admins', field.query('tableName').get('value'));
            }
          });
          onFieldReact('data.*.data', (field) => {
            if (isField(field)) {
              const typeValue = field.query('.type').get('value');
              const attrValue = typeValue === 'switch' || typeValue === 'radio';
              field.editable = attrValue;
              field.required = attrValue;
            }
          });
          onFieldChange('data.*.data', ['active'], (field) => {
            if (isField(field) && field.active === true) {
              setModalFieldPath(field.path.toString());
              setModalData({
                values: field.value,
                type: field.query('.type').get('value'),
              });
              setModalVisible(true);
              field.active = false;
            }
          });
          onFieldChange('data.*.settings', ['active'], (field) => {
            if (isField(field) && field.active === true) {
              setSettingDrawerFieldPath(field.path.toString());
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
    if (allowDrawerData.data && Object.keys(allowDrawerData.data).length > 0) {
      setFilterDrawerVisible(true);
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
          if (res.data?.fields !== undefined && Object.keys(res.data.fields).length !== 0) {
            state.values = res.data.fields;
          }
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

  const modalSubmitHandler = useCallback(
    (values: any) => {
      setModalVisible(false);
      setModalData({ type: '', values: {} });
      form.setFieldState(modalFieldPath, (state) => {
        state.value = values.data;
      });
    },
    [modalFieldPath],
  );

  const drawerSubmitHandler = useCallback(
    (values: any) => {
      setSettingDrawerVisible(false);
      setSettingDrawerData({ type: '', values: {} });
      form.setFieldState(settingDrawerFieldPath, (state) => {
        state.value = values;
      });
    },
    [settingDrawerFieldPath],
  );

  const handleMenuClick = (e: any) => {
    switch (e.key as string) {
      case 'news':
        form.reset('*', {
          forceClear: true,
        });
        form.setState((state) => {
          state.initialValues = news;
        });
        message.info(
          lang.formatMessage({
            id: 'model-design.initSampleValue',
          }),
        );
        break;
      case 'user':
        form.reset('*', {
          forceClear: true,
        });
        form.setState((state) => {
          state.initialValues = user;
        });
        message.info(
          lang.formatMessage({
            id: 'model-design.initSampleValue',
          }),
        );
        break;
      default:
        break;
    }
  };

  return (
    <PageContainer
      header={{
        title: init.data?.page?.title,
        breadcrumb: {},
        extra: [
          <Dropdown
            overlay={
              <Menu onClick={handleMenuClick}>
                <Menu.Item key="news">News</Menu.Item>
                <Menu.Item key="user">User</Menu.Item>
              </Menu>
            }
          >
            <Button>
              {lang.formatMessage({
                id: 'model-design.example',
              })}{' '}
              <DownOutlined />
            </Button>
          </Dropdown>,
        ],
      }}
    >
      {spinLoading ? (
        <Spin className={styles.formSpin} tip="Loading..." />
      ) : (
        <Form form={form} className={styles.formilyForm}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Card
              title={lang.formatMessage({
                id: 'model-design.options',
              })}
              size="small"
            >
              <FormGrid maxColumns={4}>
                <SchemaField name="options">
                  <SchemaField.Boolean
                    name="handleFieldValidation"
                    title={lang.formatMessage({
                      id: 'model-design.handleFieldValidation',
                    })}
                    x-decorator="FormItem"
                    x-component="Switch"
                  />
                  <SchemaField.Boolean
                    name="handleFieldFilter"
                    title={lang.formatMessage({
                      id: 'model-design.handleFieldFilter',
                    })}
                    x-decorator="FormItem"
                    x-component="Switch"
                  />
                </SchemaField>
              </FormGrid>
            </Card>
            <Card
              title={lang.formatMessage({
                id: 'model-design.fields',
              })}
              size="small"
            >
              <SchemaField>
                <SchemaField.Array x-component="ArrayTable" name="data" x-decorator="FormItem">
                  <SchemaField.Object>
                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: lang.formatMessage({
                          id: 'model-design.sort',
                        }),
                        width: 60,
                        align: 'center',
                      }}
                    >
                      <SchemaField.Void
                        x-component="ArrayTable.SortHandle"
                        x-decorator="FormItem"
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: lang.formatMessage({
                          id: 'model-design.name',
                        }),
                      }}
                    >
                      <SchemaField.String name="name" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: (
                          <>
                            {lang.formatMessage({
                              id: 'model-design.title',
                            })}{' '}
                            <FlagIcon code={currentLang.substr(currentLang.indexOf('-') + 1)} />
                          </>
                        ),
                      }}
                    >
                      <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: lang.formatMessage({
                          id: 'model-design.type',
                        }),
                      }}
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
                      x-component-props={{
                        title: lang.formatMessage({
                          id: 'model-design.data',
                        }),
                        width: 60,
                        align: 'center',
                      }}
                    >
                      <SchemaField.String
                        name="data"
                        x-component="Button"
                        x-decorator="FormItem"
                        x-content={lang.formatMessage({
                          id: 'model-design.data',
                        })}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: lang.formatMessage({
                          id: 'model-design.settings',
                        }),
                        width: 60,
                        align: 'center',
                      }}
                    >
                      <SchemaField.String
                        name="settings"
                        x-component="Button"
                        x-decorator="FormItem"
                        x-content={lang.formatMessage({
                          id: 'model-design.settings',
                        })}
                      />
                    </SchemaField.Void>

                    <SchemaField.Void
                      x-component="ArrayTable.Column"
                      x-component-props={{
                        title: lang.formatMessage({
                          id: 'model-design.operations',
                        }),
                        width: 100,
                        align: 'center',
                      }}
                    >
                      <SchemaField.Void x-component="ArrayTable.Remove" />
                      <SchemaField.Void x-component="ArrayTable.MoveUp" />
                      <SchemaField.Void x-component="ArrayTable.MoveDown" />
                    </SchemaField.Void>
                  </SchemaField.Object>
                  <SchemaField.Void
                    x-component="ArrayTable.Addition"
                    x-component-props={{
                      title: lang.formatMessage({
                        id: 'model-design.add',
                      }),
                    }}
                  />
                </SchemaField.Array>
              </SchemaField>
            </Card>
          </Space>
        </Form>
      )}
      <FooterToolbar
        extra={
          <Space>
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
          </Space>
        }
      >
        <Button
          type="primary"
          onClick={() => {
            form.submit(setFilterDrawerData);
          }}
          shape="round"
        >
          {lang.formatMessage({
            id: 'model-design.next',
          })}
          <DoubleRightOutlined />
        </Button>
      </FooterToolbar>
      <Modal
        modalVisible={modalVisible}
        hideModal={useCallback(() => {
          setModalVisible(false);
          setModalData({ type: '', values: {} });
        }, [])}
        modalData={modalData}
        modalSubmitHandler={modalSubmitHandler}
      />
      <SettingDrawer
        hideDrawer={useCallback(() => {
          setSettingDrawerVisible(false);
          setSettingDrawerData({ type: '', values: {} });
        }, [])}
        settingDrawerVisible={settingDrawerVisible}
        settingDrawerData={settingDrawerData}
        drawerSubmitHandler={drawerSubmitHandler}
        handleFieldValidation={handleFieldValidation}
      />
      <FilterDrawer
        hideFilterDrawer={useCallback(() => {
          setFilterDrawerData({ data: [] });
          setFilterDrawerVisible(false);
        }, [])}
        allowDrawerVisible={allowDrawerVisible}
        allowDrawerData={allowDrawerData}
        handleFieldFilter={handleFieldFilter}
      />
    </PageContainer>
  );
};

export default Field;
