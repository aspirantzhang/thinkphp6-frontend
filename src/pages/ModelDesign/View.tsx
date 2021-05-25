import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, ArrayTable, Switch, Space, Select, Checkbox } from '@formily/antd';
import { Card, Spin, Button, message } from 'antd';
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

const View = () => {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Card title="Basic" size="small">
        <SchemaField>
          <SchemaField.String
            name="modelName"
            title="Route Name"
            x-component="Input"
            x-decorator="FormItem"
          />
        </SchemaField>
      </Card>
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

      <Card title="List Action" size="small">
        <SchemaField>
          <SchemaField.Array x-component="ArrayTable" name="listAction" x-decorator="FormItem">
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
                  enum={enums.buttonType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Call', width: 200 }}
              >
                <SchemaField.String
                  name="call"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.callType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Uri' }}
              >
                <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Method' }}
              >
                <SchemaField.String
                  name="method"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.httpMethod}
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

      <Card title="Add Action" size="small">
        <SchemaField>
          <SchemaField.Array x-component="ArrayTable" name="addAction" x-decorator="FormItem">
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
                  enum={enums.buttonType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Call', width: 200 }}
              >
                <SchemaField.String
                  name="call"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.callType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Uri' }}
              >
                <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Method' }}
              >
                <SchemaField.String
                  name="method"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.httpMethod}
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

      <Card title="Edit Action" size="small">
        <SchemaField>
          <SchemaField.Array x-component="ArrayTable" name="editAction" x-decorator="FormItem">
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
                  enum={enums.buttonType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Call', width: 200 }}
              >
                <SchemaField.String
                  name="call"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.callType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Uri' }}
              >
                <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Method' }}
              >
                <SchemaField.String
                  name="method"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.httpMethod}
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

      <Card title="Table Toolbar" size="small">
        <SchemaField>
          <SchemaField.Array x-component="ArrayTable" name="tableToolbar" x-decorator="FormItem">
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
                  enum={enums.buttonType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Call', width: 200 }}
              >
                <SchemaField.String
                  name="call"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.callType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Uri' }}
              >
                <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Method' }}
              >
                <SchemaField.String
                  name="method"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.httpMethod}
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

      <Card title="Batch Toolbar" size="small">
        <SchemaField>
          <SchemaField.Array x-component="ArrayTable" name="batchToolbar" x-decorator="FormItem">
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
                  enum={enums.buttonType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Call', width: 200 }}
              >
                <SchemaField.String
                  name="call"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.callType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Uri' }}
              >
                <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Method' }}
              >
                <SchemaField.String
                  name="method"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.httpMethod}
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

      <Card title="Batch Toolbar - Trashed" size="small">
        <SchemaField>
          <SchemaField.Array
            x-component="ArrayTable"
            name="batchToolbarTrashed"
            x-decorator="FormItem"
          >
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
                  enum={enums.buttonType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Call', width: 200 }}
              >
                <SchemaField.String
                  name="call"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.callType}
                />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Uri' }}
              >
                <SchemaField.String name="uri" x-component="Input" x-decorator="FormItem" />
              </SchemaField.Void>

              <SchemaField.Void
                x-component="ArrayTable.Column"
                x-component-props={{ title: 'Method' }}
              >
                <SchemaField.String
                  name="method"
                  x-component="Select"
                  x-decorator="FormItem"
                  enum={enums.httpMethod}
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
    </Space>
  );
};

export default View;
