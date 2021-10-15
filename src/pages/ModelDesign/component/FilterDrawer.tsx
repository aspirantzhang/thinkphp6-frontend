import React, { useEffect, useState, useMemo } from 'react';
import { Drawer as AntdDrawer, Button, message, Alert } from 'antd';
import { useLocation, useRequest, history, useModel, useIntl } from 'umi';
import type { IFieldState } from '@formily/core';
import { createForm, onFieldChange, onFieldReact, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { PreviewText, Form, FormItem, Input, ArrayTable, Checkbox } from '@formily/antd';
import _ from 'lodash';
import FilterConfigBlock from '../design/field/FilterConfigBlock';

const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayTable,
    Checkbox,
    PreviewText,
  },
});

type FilterDrawerType = {
  allowDrawerVisible: boolean;
  allowDrawerData: {
    options: Record<string, unknown>;
    tabs: Record<string, unknown>;
    sidebars: Record<string, unknown>;
  };
  hideFilterDrawer: () => void;
  handleFieldFilter: boolean;
};

const FilterDrawer = ({
  allowDrawerVisible,
  allowDrawerData,
  hideFilterDrawer,
  handleFieldFilter,
}: FilterDrawerType) => {
  const location = useLocation();
  const lang = useIntl();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('*.*.*.allowTranslate', (field) => {
            if (isField(field)) {
              const typeValue = field.query('.type').get('value');
              const fieldName = field.query('.name').get('value');
              const typesCanBeTranslated = ['input', 'textarea', 'textEditor'].includes(typeValue);
              const fieldsCanBeTranslated = !['pathname'].includes(fieldName);
              if (typesCanBeTranslated && fieldsCanBeTranslated) {
                field.disabled = false;
                field.visible = true;
              } else {
                field.disabled = true;
                field.visible = false;
              }
            }
          });
          onFieldChange('checkAll', (field) => {
            if (isField(field) && allowDrawerVisible) {
              field.query('*.*.*.*').forEach((checkbox) => {
                if (
                  isField(checkbox) &&
                  // eslint-disable-next-line no-underscore-dangle
                  checkbox.componentType.__ANT_CHECKBOX === true &&
                  checkbox.disabled !== true &&
                  !checkbox.path.toString().endsWith('titleField')
                ) {
                  checkbox.value = field.value;
                }
              });
            }
          });
          onFieldChange('*.*.*.titleField', (field) => {
            if (isField(field)) {
              const selfPath = field.path.toString();
              field.query('*.*.*.titleField').forEach((otherCheckbox) => {
                if (isField(otherCheckbox) && otherCheckbox.path.toString() !== selfPath) {
                  if (field.value === true || field.value === 1 || field.value === '1') {
                    otherCheckbox.disabled = true;
                  } else if (field.value === false || field.value === 0 || field.value === '1') {
                    otherCheckbox.disabled = false;
                  }
                }
              });
            }
          });
        },
      }),
    [allowDrawerVisible],
  );

  useEffect(() => {
    if (allowDrawerData.tabs && Object.keys(allowDrawerData.tabs).length > 0) {
      form.setState((formState) => {
        formState.values = allowDrawerData;
        // set title field editing status
        // first step: find index of the title field from the tabs
        let titleFieldPath = '';
        Object.keys(allowDrawerData.tabs).forEach((tabName) => {
          const titleFieldIndex = _.findIndex(allowDrawerData.tabs[tabName] as any[], (obj) => {
            return obj.titleField === 1 || obj.titleField === '1';
          });
          if (titleFieldIndex !== -1) {
            titleFieldPath = `tabs.${tabName}.${titleFieldIndex}.titleField`;
          }
        });
        // second step: set editable = false except for the title field
        if (titleFieldPath) {
          form.setFieldState(`*.*.*.titleField`, (titleField: IFieldState) => {
            if (isField(titleField)) {
              if (titleField.path.toString() !== titleFieldPath) {
                titleField.editable = false;
              }
            }
          });
        }
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
        id: 'model-design.fieldFilterSettings',
      })}
      placement="bottom"
      height={600}
      closable={true}
      onClose={hideFilterDrawer}
      visible={allowDrawerVisible}
    >
      <div style={{ display: handleFieldFilter ? 'block' : 'none' }}>
        <Form form={form}>
          <SchemaField>
            <SchemaField.Boolean
              name="checkAll"
              title={lang.formatMessage({
                id: 'model-design.fieldFilter.checkAll',
              })}
              x-decorator="FormItem"
              x-component="Checkbox"
            />
          </SchemaField>
          {Object.keys(allowDrawerData?.tabs || []).map((tabName) => {
            return <FilterConfigBlock name={`tabs.${tabName}`} />;
          })}
          {Object.keys(allowDrawerData?.sidebars || []).map((sidebarName) => {
            return <FilterConfigBlock name={`sidebars.${sidebarName}`} />;
          })}
        </Form>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Alert
            message={lang.formatMessage({
              id: 'model-design.fieldFilter.translateAttention',
            })}
            type="warning"
            showIcon
            style={{ width: '650px', margin: '0 auto', marginBottom: '10px' }}
          />
          <Alert
            message={lang.formatMessage({
              id: 'model-design.fieldFilter.indexAttention',
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
            hideFilterDrawer();
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

export default React.memo(FilterDrawer);
