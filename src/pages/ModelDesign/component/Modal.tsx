import { useEffect } from 'react';
import { createForm } from '@formily/core';
import { createSchemaField } from '@formily/react';
import { Form, FormItem, Input, ArrayTable, Switch, Select, Checkbox } from '@formily/antd';
import { Modal as AntdModal } from 'antd';
import styles from '../index.less';

const form = createForm();
const SchemaField = createSchemaField({
  components: {
    Input,
    FormItem,
    ArrayTable,
    Switch,
    Select,
    Checkbox,
  },
});

const Modal = ({
  modalVisible,
  hideModal,
  modalSubmitHandler,
  modalData,
}: {
  modalVisible: boolean;
  hideModal: (reload?: boolean) => void;
  modalSubmitHandler: (values: any) => void;
  modalData: { type: string; values: Record<string, unknown> };
}) => {
  useEffect(() => {
    form.reset('*', {
      forceClear: true,
    });
    if (modalData.type === 'switch') {
      form.setFieldState('data.sortColumn', (state) => {
        state.visible = false;
      });
      form.setFieldState('data.operationColumn', (state) => {
        state.visible = false;
      });
      form.setFieldState('data.addition', (state) => {
        state.visible = false;
      });
      form.setFormState((state) => {
        state.initialValues = {
          data: [
            {
              title: 'Enabled',
              value: 1,
            },
            {
              title: 'Disabled',
              value: 0,
            },
          ],
        };
      });
    } else {
      form.setFieldState('data.sortColumn', (state) => {
        state.visible = true;
      });
      form.setFieldState('data.operationColumn', (state) => {
        state.visible = true;
      });
      form.setFieldState('data.addition', (state) => {
        state.visible = true;
      });
    }

    if (modalData.values && Object.keys(modalData.values).length > 0) {
      form.setFormState((state) => {
        state.values = {
          data: modalData.values,
        };
      });
    }
  }, [modalData]);

  return (
    <div>
      <AntdModal
        visible={modalVisible}
        onCancel={() => {
          hideModal();
        }}
        onOk={() => {
          form.submit(modalSubmitHandler);
        }}
        maskClosable={false}
        forceRender
        focusTriggerAfterClose={false}
      >
        <Form className={styles.formilyForm} form={form}>
          <SchemaField>
            <SchemaField.Array x-component="ArrayTable" name="data" x-decorator="FormItem">
              <SchemaField.Object>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Sort', width: 60, align: 'center' }}
                  name="sortColumn"
                >
                  <SchemaField.Void x-component="ArrayTable.SortHandle" x-decorator="FormItem" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Title' }}
                >
                  <SchemaField.String name="title" x-component="Input" x-decorator="FormItem" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Value' }}
                >
                  <SchemaField.String name="value" x-component="Input" x-decorator="FormItem" />
                </SchemaField.Void>
                <SchemaField.Void
                  x-component="ArrayTable.Column"
                  x-component-props={{ title: 'Operations', width: 100, align: 'center' }}
                  name="operationColumn"
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
        </Form>
      </AntdModal>
    </div>
  );
};

export default Modal;
