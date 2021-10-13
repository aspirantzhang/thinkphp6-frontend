import React from 'react';
import { createSchemaField } from '@formily/react';
import { FormItem, Input, ArrayTable, Select, Checkbox, PreviewText } from '@formily/antd';
import { Button } from 'antd';

const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayTable,
    Select,
    Checkbox,
    Button,
    PreviewText,
  },
});

type FilterConfigBlockType = {
  name: string;
};

const FilterConfigBlock = ({ name }: FilterConfigBlockType) => {
  return (
    <>
      <SchemaField>
        <SchemaField.Array x-component="ArrayTable" name={name} x-decorator="FormItem">
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
              x-component-props={{ title: 'Title Field', align: 'center' }}
            >
              <SchemaField.String name="titleField" x-component="Checkbox" x-decorator="FormItem" />
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{ title: 'Unique Value', align: 'center' }}
            >
              <SchemaField.String
                name="uniqueValue"
                x-component="Checkbox"
                x-decorator="FormItem"
              />
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{ title: 'Ignore Filter', align: 'center' }}
            >
              <SchemaField.String
                name="ignoreFilter"
                x-component="Checkbox"
                x-decorator="FormItem"
              />
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{ title: 'Home', align: 'center' }}
            >
              <SchemaField.String name="allowHome" x-component="Checkbox" x-decorator="FormItem" />
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{ title: 'Read', align: 'center' }}
            >
              <SchemaField.String name="allowRead" x-component="Checkbox" x-decorator="FormItem" />
            </SchemaField.Void>
            <SchemaField.Void
              x-component="ArrayTable.Column"
              x-component-props={{ title: 'Save', align: 'center' }}
            >
              <SchemaField.String name="allowSave" x-component="Checkbox" x-decorator="FormItem" />
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
    </>
  );
};

export default FilterConfigBlock;
