import React from 'react';
import { createSchemaField } from '@formily/react';
import { FormItem, Input, ArrayTable, Select, Checkbox } from '@formily/antd';
import { Button, Card } from 'antd';
import { useIntl, getLocale } from 'umi';
import FlagIcon from '../../../BasicList/builder/FlagIcon';
import * as enums from '.././enums';

const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayTable,
    Select,
    Checkbox,
    Button,
  },
});

const MainTab = () => {
  const lang = useIntl();
  const currentLang = getLocale().toLowerCase();

  return (
    <>
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
                <SchemaField.Void x-component="ArrayTable.SortHandle" x-decorator="FormItem" />
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
    </>
  );
};

export default MainTab;
