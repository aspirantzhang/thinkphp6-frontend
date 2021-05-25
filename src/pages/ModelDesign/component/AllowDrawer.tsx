import { useEffect, useState } from 'react';
import { Drawer as AntdDrawer, Button, message } from 'antd';
import { useLocation, request, history } from 'umi';
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
  const [submitLoading, setSubmitLoading] = useState(false);
  useEffect(() => {
    if (drawerFieldData.fields && Object.keys(drawerFieldData.fields).length > 0) {
      form.setState((state) => {
        state.values = { fields: drawerFieldData.fields };
      });
    }
  }, [drawerFieldData]);

  const pageSubmitHandler = (values: any) => {
    setSubmitLoading(true);
    message.loading({ content: 'Processing...', key: 'process', duration: 0 });
    const updateData = async () => {
      try {
        const res = await request(
          `${location.pathname.replace('/basic-list/api/models/field-design', '')}`,
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
          // reFetchMenu();
        }
      } catch (error) {
        setSubmitLoading(false);
      }
    };
    updateData();
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
                x-component-props={{ title: 'List', align: 'center' }}
              >
                <SchemaField.String
                  name="allowList"
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
                x-component-props={{ title: 'Search', align: 'center' }}
              >
                <SchemaField.String
                  name="allowSearch"
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
