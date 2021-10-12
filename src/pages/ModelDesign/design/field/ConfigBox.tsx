import React from 'react';
import { createSchemaField } from '@formily/react';
import { FormItem, Switch, FormGrid } from '@formily/antd';
import { Card } from 'antd';
import { useIntl } from 'umi';

const SchemaField = createSchemaField({
  components: {
    FormItem,
    Switch,
  },
});

const ConfigBox = () => {
  const lang = useIntl();

  return (
    <>
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
    </>
  );
};

export default ConfigBox;
