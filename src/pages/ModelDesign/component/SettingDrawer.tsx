import { useEffect, useMemo } from 'react';
import { Drawer as AntdDrawer, Button, Space, Card } from 'antd';
import { createForm, onFieldChange, isField } from '@formily/core';
import { createSchemaField } from '@formily/react';
import {
  PreviewText,
  Form,
  FormItem,
  ArrayTable,
  Switch,
  Select,
  Checkbox,
  NumberPicker,
} from '@formily/antd';
import styles from '../index.less';

const SchemaField = createSchemaField({
  components: {
    NumberPicker,
    FormItem,
    ArrayTable,
    Switch,
    Select,
    Checkbox,
    PreviewText,
    Card,
  },
});

const SettingDrawer = ({
  settingDrawerVisible,
  settingDrawerData,
  hideDrawer,
  drawerSubmitHandler,
}: {
  settingDrawerVisible: boolean;
  settingDrawerData: { type: string; values: Record<string, unknown> };
  hideDrawer: () => void;
  drawerSubmitHandler: (values: any) => void;
}) => {
  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldChange('validate', ['value'], (field) => {
            if (isField(field) && field.value) {
              form.setFieldState('options.lengthCard', (state) => {
                state.visible = Boolean(Object.values(field.value).includes('length'));
              });
            }
          });
        },
      }),
    [],
  );

  useEffect(() => {
    if (settingDrawerData.values && Object.keys(settingDrawerData.values).length > 0) {
      form.setFormState((state) => {
        state.values = settingDrawerData.values;
      });
    } else {
      form.setFormState((state) => {
        state.values = {};
      });
    }
  }, [settingDrawerData]);

  const displayOptions = [
    { label: 'List Sorter', value: 'listSorter' },
    { label: 'Hide in Column', value: 'hideInColumn' },
    { label: 'Edit Disabled', value: 'editDisabled' },
  ];

  const validateOptions = [
    { label: 'Require', value: 'require' },
    { label: 'Length', value: 'length' },
    { label: 'Number', value: 'number' },
    { label: 'Number Array', value: 'numberArray' },
    { label: 'Parent Id', value: 'parentId' },
    { label: 'Number Tag', value: 'numberTag' },
    { label: 'DateTime Range', value: 'dateTimeRange' },
  ];

  return (
    <AntdDrawer
      title="Field Settings"
      placement="right"
      width={500}
      onClose={() => {
        hideDrawer();
      }}
      visible={settingDrawerVisible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button
            onClick={() => {
              hideDrawer();
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.submit(drawerSubmitHandler);
            }}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form form={form}>
        <h2>Display Settings</h2>
        <SchemaField>
          <SchemaField.String
            name="display"
            enum={displayOptions}
            x-decorator="FormItem"
            x-component="Checkbox.Group"
          />
        </SchemaField>
        <h2 style={{ marginTop: '20px' }}>Validate Settings</h2>
        <div className={styles.validateSettings}>
          <SchemaField>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <SchemaField.String
                name="validate"
                enum={validateOptions}
                x-decorator="FormItem"
                x-component="Checkbox.Group"
              />
            </Space>
          </SchemaField>
        </div>
        <h2 style={{ marginTop: '20px' }}>Validate Options</h2>
        <SchemaField>
          <SchemaField.Object name="options">
            <SchemaField.Void
              name="lengthCard"
              x-component="Card"
              x-component-props={{
                title: 'Length',
                size: 'small',
                className: styles.settingsCard,
              }}
              x-visible={false}
            >
              <SchemaField.String
                name="length.min"
                title="Min"
                x-decorator="FormItem"
                x-component="NumberPicker"
                default={0}
                x-component-props={{
                  style: {
                    width: 50,
                  },
                }}
              />
              <SchemaField.String
                name="length.max"
                title="Max"
                x-decorator="FormItem"
                x-component="NumberPicker"
                default={32}
                x-component-props={{
                  style: {
                    width: 50,
                  },
                }}
              />
            </SchemaField.Void>
          </SchemaField.Object>
        </SchemaField>
      </Form>
    </AntdDrawer>
  );
};

export default SettingDrawer;
