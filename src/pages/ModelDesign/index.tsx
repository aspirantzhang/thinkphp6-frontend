import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button } from 'antd';
import {
  createFormActions,
  SchemaForm,
  SchemaMarkupField as Field,
  FormButtonGroup,
  Submit,
  Reset,
  FormEffectHooks,
  FormPath,
  createEffectHook,
  IFormEffect,
  IFormState,
} from '@formily/antd';

import {
  Input,
  ArrayTable,
  Select,
  Checkbox,
  FormCard,
  FormMegaLayout,
} from '@formily/antd-components';
import 'antd/dist/antd.css';

const { onFieldValueChange$ } = FormEffectHooks;
const setSampleValues$ = createEffectHook('setSampleValues');
const actions = createFormActions();

const ModelDesign = () => {
  const [tableToolbarVisible, setTableToolbarVisible] = useState(false);
  const [batchToolbarVisible, setBatchToolbarVisible] = useState(false);

  const submitHandler = (values) => {
    console.log(values);
  };

  const actionFields = () => {
    return (
      <Field type="object">
        <Field name="name" x-component="Input" title="Name*" />
        <Field
          name="type"
          x-component="Select"
          title="Type*"
          default="primary"
          enum={[
            { label: 'Primary', value: 'primary' },
            { label: 'Default', value: 'default' },
            { label: 'Dashed', value: 'dashed' },
          ]}
        />
        <Field
          name="action"
          x-component="Select"
          title="Action*"
          default="modal"
          enum={[
            { label: 'Modal', value: 'modal' },
            { label: 'Page', value: 'page' },
            { label: 'Delete', value: 'delete' },
            { label: 'Reset', value: 'reset' },
            { label: 'Submit', value: 'submit' },
            { label: 'Cancel', value: 'cancel' },
            { label: 'Reload', value: 'reload' },
            { label: 'Batch Delete', value: 'batchDelete' },
          ]}
        />
        <Field name="uri" x-component="input" title="Uri" />
        <Field
          name="method"
          x-component="Select"
          title="Method*"
          default="get"
          enum={[
            { label: 'Get', value: 'get' },
            { label: 'Post', value: 'post' },
            { label: 'Put', value: 'put' },
            { label: 'Delete', value: 'delete' },
          ]}
        />
      </Field>
    );
  };

  const formEffects: IFormEffect = ({ setFieldValue, setFormState }) => {
    onFieldValueChange$('fields.*.listData').subscribe(({ name, value }) => {
      if (value) {
        setFieldValue(
          FormPath.transform(name, /\d/, ($1) => {
            return `fields.${$1}.addData`;
          }),
          true,
        );
      }
    });
    onFieldValueChange$('haveTableToolbar').subscribe(({ value }) => {
      setTableToolbarVisible(value);
    });
    onFieldValueChange$('haveBatchToolbar').subscribe(({ value }) => {
      setBatchToolbarVisible(value);
    });
    setSampleValues$().subscribe(() => {
      setFormState((state: IFormState) => {
        const sampleValues = {
          pageName: 'Group',
          haveBatchToolbar: true,
          haveTableToolbar: true,
          fields: [
            {
              name: 'name',
              title: 'Group Name',
              type: 'text',
            },
            {
              name: 'parent_id',
              title: 'Parent',
              type: 'text',
              listData: true,
              addData: true,
            },
            {
              name: 'rules',
              title: 'Rules',
              type: 'text',
            },
            {
              name: 'create_time',
              title: 'Create Time',
              type: 'datetime',
              listSorter: true,
            },
            {
              name: 'update_time',
              title: 'Update Time',
              type: 'datetime',
            },
            {
              name: 'status',
              title: 'Status',
              type: 'tag',
              listData: true,
              addData: true,
            },
          ],
          listAction: [
            {
              name: 'Edit',
              type: 'default',
              action: 'modal',
              uri: '/backend/groups',
              method: 'get',
            },
            {
              name: 'Full page edit',
              type: 'default',
              action: 'page',
              uri: '/backend/groups',
              method: 'get',
            },
            {
              name: 'Delete',
              type: 'default',
              action: 'delete',
              uri: '/backend/groups',
              method: 'delete',
            },
          ],
          addAction: [
            {
              name: 'Reset',
              type: 'dashed',
              action: 'reset',
            },
            {
              name: 'Cancel',
              type: 'dashed',
              action: 'cancel',
            },
            {
              name: 'Submit',
              type: 'primary',
              action: 'submit',
              uri: '/backend/groups',
              method: 'post',
            },
          ],
          editAction: [
            {
              name: 'Reset',
              type: 'dashed',
              action: 'reset',
            },
            {
              name: 'Cancel',
              type: 'dashed',
              action: 'cancel',
            },
            {
              name: 'Submit',
              type: 'primary',
              action: 'submit',
              uri: '/backend/groups/:id',
              method: 'put',
            },
          ],
          tableToolbar: [
            {
              name: 'Add',
              type: 'primary',
              action: 'modal',
              uri: '/backend/groups/add',
            },
            {
              name: 'Full page add',
              type: 'primary',
              action: 'page',
              uri: '/backend/groups/add',
            },
            {
              name: 'Reload',
              type: 'default',
              action: 'reload',
            },
          ],
          batchToolbar: [
            {
              name: 'Delete',
              type: 'dashed',
              action: 'batchDelete',
              uri: '/backend/groups/batch-delete',
              method: 'delete',
            },
          ],
        };
        // eslint-disable-next-line no-param-reassign
        state.values = sampleValues;
      });
    });
  };

  return (
    <>
      <PageContainer>
        <Card>
          <Button
            onClick={() => {
              if (actions.dispatch) {
                actions.dispatch('setSampleValues', null);
              }
            }}
            type="primary"
            style={{ marginBottom: '10px' }}
          >
            Sample
          </Button>
          <SchemaForm
            actions={actions}
            components={{ ArrayTable, Input, Select, Checkbox }}
            onSubmit={submitHandler}
            effects={formEffects}
          >
            <FormCard title="Basic">
              <FormMegaLayout grid columns={7}>
                <Field
                  name="pageName"
                  type="string"
                  x-component="Input"
                  title="Page Name*"
                  x-mega-props={{ span: 5 }}
                />
                <Field name="haveTableToolbar" x-component="Checkbox" title="Table Toolbar?" />
                <Field name="haveBatchToolbar" x-component="Checkbox" title="Batch Toolbar?" />
              </FormMegaLayout>
            </FormCard>
            <FormCard title="Fields">
              <Field
                name="fields"
                type="array"
                default={[]}
                x-component="ArrayTable"
                x-component-props={{
                  operationsWidth: 150,
                  operations: {
                    title: '',
                  },
                  draggable: true,
                }}
              >
                <Field type="object">
                  <Field name="name" x-component="Input" title="Name*" />
                  <Field name="title" x-component="Input" title="Title*" />
                  <Field
                    name="type"
                    x-component="Select"
                    title="Type*"
                    default="text"
                    enum={[
                      { label: 'Text', value: 'text' },
                      { label: 'Tree', value: 'tree' },
                      { label: 'Tag', value: 'tag' },
                      { label: 'Datetime', value: 'datetime' },
                    ]}
                  />
                  <Field name="listData" x-component="Checkbox" title="List: Data" />
                  <Field
                    name="listHideInColumn"
                    x-component="Checkbox"
                    title="List: HideInColumn"
                  />
                  <Field name="listSorter" x-component="Checkbox" title="List: Sorter" />
                  <Field name="addData" x-component="Checkbox" title="Add: Data" />
                  <Field name="editDisabled" x-component="Checkbox" title="Edit: Disabled" />
                </Field>
              </Field>
            </FormCard>
            <FormCard title="List Action">
              <Field
                name="listAction"
                type="array"
                default={[]}
                x-component="ArrayTable"
                x-component-props={{
                  operationsWidth: 150,
                  operations: {
                    title: 'Action',
                  },
                  draggable: true,
                }}
              >
                {actionFields()}
              </Field>
            </FormCard>
            <FormCard title="Add Action">
              <Field
                name="addAction"
                type="array"
                default={[]}
                x-component="ArrayTable"
                x-component-props={{
                  operationsWidth: 150,
                  operations: {
                    title: '',
                  },
                  draggable: true,
                }}
              >
                {actionFields()}
              </Field>
            </FormCard>
            <FormCard title="Edit Action">
              <Field
                name="editAction"
                type="array"
                default={[]}
                x-component="ArrayTable"
                x-component-props={{
                  operationsWidth: 150,
                  operations: {
                    title: '',
                  },
                  draggable: true,
                }}
              >
                {actionFields()}
              </Field>
            </FormCard>
            <FormCard
              title="Table Toolbar"
              style={{ display: tableToolbarVisible ? 'block' : 'none' }}
            >
              <Field
                name="tableToolbar"
                type="array"
                default={[]}
                x-component="ArrayTable"
                x-component-props={{
                  operationsWidth: 150,
                  operations: {
                    title: '',
                  },
                  draggable: true,
                }}
              >
                {actionFields()}
              </Field>
            </FormCard>
            <FormCard
              title="Batch Toolbar"
              style={{ display: batchToolbarVisible ? 'block' : 'none' }}
            >
              <Field
                name="batchToolbar"
                type="array"
                default={[]}
                x-component="ArrayTable"
                x-component-props={{
                  operationsWidth: 150,
                  operations: {
                    title: '',
                  },
                  draggable: true,
                }}
              >
                {actionFields()}
              </Field>
            </FormCard>
            <FormButtonGroup offset={5}>
              <Submit>Submit</Submit>
              <Reset>reset</Reset>
            </FormButtonGroup>
          </SchemaForm>
        </Card>
      </PageContainer>
    </>
  );
};

export default ModelDesign;
