import { useEffect, useState } from 'react';
import { Drawer as AntdDrawer, Button, message, Alert } from 'antd';
import { useLocation, useRequest, history, useModel, useIntl } from 'umi';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  PreviewText,
  Form,
  FormItem,
  Input,
  ArrayTable,
  Switch,
  Select,
  Checkbox,
} from '@formily/antd';

const form = createForm();
const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayTable,
    Switch,
    Select,
    Checkbox,
    PreviewText,
  },
});

const AllowDrawer = ({
  allowDrawerVisible,
  hideAllowDrawer,
  drawerFieldData,
}: {
  allowDrawerVisible: boolean;
  hideAllowDrawer: () => void;
  drawerFieldData: { fields?: Record<string, unknown> };
}) => {
  const location = useLocation();
  const lang = useIntl();
  const [submitLoading, setSubmitLoading] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  useEffect(() => {
    if (drawerFieldData) {
      form.setState((state) => {
        state.values = drawerFieldData;
      });
    }
  }, [drawerFieldData]);

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
    request.run(values);
  };

  return (
    <AntdDrawer
      title="Allow Fields Settings"
      placement="bottom"
      height={600}
      closable={true}
      onClose={hideAllowDrawer}
      visible={allowDrawerVisible}
    >
      <Form layout="vertical" form={form}>
        <SchemaField>
          <SchemaField.Array x-component="ArrayTable" name="fields" x-decorator="FormItem">
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
      <div style={{ textAlign: 'center' }}>
        {/* TODO: add i18n for message */}
        <Alert
          message="Attention: When switching a field's 'Translate', the existing data in that field will be lost."
          type="warning"
          showIcon
          style={{ width: '600px', margin: '0 auto', marginBottom: '10px' }}
        />
        <Button
          onClick={() => {
            hideAllowDrawer();
          }}
          style={{ marginRight: 8 }}
          loading={submitLoading}
        >
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={() => {
            form.submit(pageSubmitHandler);
          }}
          loading={submitLoading}
        >
          Submit
        </Button>
      </div>
    </AntdDrawer>
  );
};

export default AllowDrawer;
