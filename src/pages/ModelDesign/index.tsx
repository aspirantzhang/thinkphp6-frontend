import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, message } from 'antd';
import { useRequest } from 'umi';
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

  const { run, loading } = useRequest(
    (data?) => {
      return {
        url: `/api/backend/models`,
        method: 'post',
        body: JSON.stringify({
          data,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      };
    },
    {
      manual: true,
      onSuccess: (response) => {
        message.success({ content: response.message, key: 'msg' });
      },
      onError: (error) => {
        message.error({ content: error.message, key: 'msg' });
      },
      formatResult: (response) => {
        return response;
      },
    },
  );

  const submitHandler = (values) => {
    run(values);
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
            { label: 'Danger', value: 'danger' },
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
            { label: 'Restore', value: 'restore' },
            { label: 'Reset', value: 'reset' },
            { label: 'Submit', value: 'submit' },
            { label: 'Cancel', value: 'cancel' },
            { label: 'Reload', value: 'reload' },
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
          title: 'Group',
          name: 'group',
          icon: 'table',
          path: '/search-list/backend/groups',
          component: './BasicList',
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
              type: 'danger',
              action: 'delete',
              uri: '/backend/groups',
              method: 'delete',
            },
          ],
          batchToolbarTrashed: [
            {
              name: 'Delete Permanently',
              type: 'danger',
              action: 'deletePermanently',
              uri: '/backend/groups',
              method: 'delete',
            },
            {
              name: 'Restore',
              type: 'default',
              action: 'restore',
              uri: '/backend/groups/restore',
              method: 'post',
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
              <FormMegaLayout grid columns={4}>
                <Field
                  name="title"
                  type="string"
                  x-component="Input"
                  title="Page Title*"
                  x-mega-props={{ span: 2 }}
                />
                <Field name="haveTableToolbar" x-component="Checkbox" title="Table Toolbar?" />
                <Field name="haveBatchToolbar" x-component="Checkbox" title="Batch Toolbar?" />
              </FormMegaLayout>
              <FormMegaLayout grid columns={8}>
                <Field
                  name="name"
                  type="string"
                  x-component="Input"
                  title="Name String*"
                  x-mega-props={{ span: 2 }}
                />
                <Field
                  name="icon"
                  type="string"
                  x-component="Input"
                  title="Icon*"
                  x-mega-props={{ span: 2 }}
                />
                <Field
                  name="path"
                  type="string"
                  x-component="Input"
                  title="Path*"
                  x-mega-props={{ span: 2 }}
                />
                <Field
                  name="component"
                  type="string"
                  x-component="Input"
                  title="Component*"
                  x-mega-props={{ span: 2 }}
                />
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
            <FormCard
              title="Batch Toolbar - Trashed"
              style={{ display: batchToolbarVisible ? 'block' : 'none' }}
            >
              <Field
                name="batchToolbarTrashed"
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
              <Submit loading={loading}>Submit</Submit>
              <Reset loading={loading}>reset</Reset>
            </FormButtonGroup>
          </SchemaForm>
        </Card>
      </PageContainer>
    </>
  );
};

export default ModelDesign;
