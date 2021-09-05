import React, { useEffect, useState, useMemo } from 'react';
import { Drawer as AntdDrawer, Button, message, Alert } from 'antd';
import { useLocation, useRequest, history, useModel, useIntl } from 'umi';
import { createForm, onFieldChange, onFieldReact, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { PreviewText, Form, FormItem, Input, ArrayTable, Checkbox } from '@formily/antd';

const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayTable,
    Checkbox,
    PreviewText,
  },
});

const AllowDrawer = ({
  allowDrawerVisible,
  allowDrawerData,
  hideAllowDrawer,
  handleAllowField,
}: {
  allowDrawerVisible: boolean;
  allowDrawerData: { options?: Record<string, unknown>; data?: Record<string, unknown>[] };
  hideAllowDrawer: () => void;
  handleAllowField: boolean;
}) => {
  const location = useLocation();
  const lang = useIntl();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('*.*.allowTranslate', (field) => {
            if (isField(field)) {
              const typeValue = field.query('.type').get('value');
              if (typeValue) {
                const isText = typeValue === 'input' || typeValue === 'textarea';
                if (isText) {
                  field.disabled = false;
                  field.visible = true;
                } else {
                  field.disabled = true;
                  field.visible = false;
                }
              }
            }
          });
          onFieldChange('checkAll', (field) => {
            if (isField(field) && allowDrawerVisible) {
              field.query('data.*.*').forEach((checkbox) => {
                if (
                  isField(checkbox) &&
                  // eslint-disable-next-line no-underscore-dangle
                  checkbox.componentType.__ANT_CHECKBOX === true &&
                  checkbox.disabled !== true
                ) {
                  checkbox.value = field.value;
                }
              });
            }
          });
        },
      }),
    [allowDrawerVisible],
  );

  useEffect(() => {
    if (allowDrawerData.data && Object.keys(allowDrawerData.data).length > 0) {
      form.setState((state) => {
        state.values = allowDrawerData;
      });
    }
  }, [allowDrawerData, form]);

  const reFetchMenu = async () => {
    setInitialState({
      ...initialState,
      settings: {
        menu: {
          loading: true,
        },
      },
    });

    const userMenu = await initialState?.fetchMenu?.();
    if (userMenu) {
      setInitialState({
        ...initialState,
        currentMenu: userMenu,
      });
    }
  };

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
        url: `${location.pathname.replace('/basic-list/api/models/field-design', '')}`,
        method: 'put',
        data: {
          type: 'field',
          data: values,
        },
      };
    },
    {
      manual: true,
      onSuccess: (res: BasicListApi.Root) => {
        message.success({ content: res.message, key: 'process' });
        history.goBack();
        reFetchMenu();
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

  const pageSubmitHandler = (values: any) => {
    setSubmitLoading(true);
    message.loading({
      content: lang.formatMessage({
        id: 'basic-list.processing',
      }),
      key: 'process',
      duration: 0,
    });
    delete values.checkAll;
    request.run(values);
  };

  return (
    <AntdDrawer
      title={lang.formatMessage({
        id: 'model-design.allowFieldSettings',
      })}
      placement="bottom"
      height={600}
      closable={true}
      onClose={hideAllowDrawer}
      visible={allowDrawerVisible}
    >
      <div style={{ display: handleAllowField ? 'block' : 'none' }}>
        <Form form={form}>
          <SchemaField>
            <SchemaField.Boolean
              name="checkAll"
              title={lang.formatMessage({
                id: 'model-design.allowField.checkAll',
              })}
              x-decorator="FormItem"
              x-component="Checkbox"
            />
            <SchemaField.Array x-component="ArrayTable" name="data" x-decorator="FormItem">
              <SchemaField.Object>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Field Name', align: 'center' }}
                >
                  <SchemaField.String
                    name="name"
                    x-component="PreviewText.Input"
                    x-decorator="FormItem"
                  />
                  <SchemaField.String
                    name="type"
                    x-component="Input"
                    x-decorator="FormItem"
                    x-display="hidden"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Home', align: 'center' }}
                >
                  <SchemaField.String
                    name="allowHome"
                    x-component="Checkbox"
                    x-decorator="FormItem"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Read', align: 'center' }}
                >
                  <SchemaField.String
                    name="allowRead"
                    x-component="Checkbox"
                    x-decorator="FormItem"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Save', align: 'center' }}
                >
                  <SchemaField.String
                    name="allowSave"
                    x-component="Checkbox"
                    x-decorator="FormItem"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Update', align: 'center' }}
                >
                  <SchemaField.String
                    name="allowUpdate"
                    x-component="Checkbox"
                    x-decorator="FormItem"
                  />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Translate', align: 'center' }}
                >
                  <SchemaField.String
                    name="allowTranslate"
                    x-component="Checkbox"
                    x-decorator="FormItem"
                  />
                </SchemaField.Void>
              </SchemaField.Object>
            </SchemaField.Array>
          </SchemaField>
        </Form>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Alert
            message={lang.formatMessage({
              id: 'model-design.allowField.translateAttention',
            })}
            type="warning"
            showIcon
            style={{ width: '650px', margin: '0 auto', marginBottom: '10px' }}
          />
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button
          onClick={() => {
            hideAllowDrawer();
          }}
          style={{ marginRight: 8 }}
          loading={submitLoading}
        >
          {lang.formatMessage({
            id: 'model-design.cancel',
          })}
        </Button>
        <Button
          type="primary"
          onClick={() => {
            form.submit(pageSubmitHandler);
          }}
          loading={submitLoading}
        >
          {lang.formatMessage({
            id: 'model-design.submit',
          })}
        </Button>
      </div>
    </AntdDrawer>
  );
};

export default React.memo(AllowDrawer);
