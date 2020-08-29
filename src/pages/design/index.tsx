import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
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
const pageNameEvent$ = createEffectHook('pageNameEvent');
const actions = createFormActions();

const Index = () => {
  const [tableToolbarVisible, setTableToolbarVisible] = useState(false);

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
            { label: 'Delete', value: 'delete' },
          ]}
        />
      </Field>
    );
  };

  const formEffects: IFormEffect = ({ setFieldValue }) => {
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
    pageNameEvent$().subscribe(() => {
      setFieldValue('pageName', 'Group');
    });
  };

  return (
    <>
      <PageHeaderWrapper>
        <Card>
          <Button
            onClick={() => {
              if (actions.dispatch) {
                actions.dispatch('pageNameEvent', null);
              }
            }}
          >
            set initial values
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
            <FormCard
              title="Table Toolbar"
              style={{ display: tableToolbarVisible ? 'block' : 'none' }}
            >
              <Field
                name="tableToolBar"
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
            <FormCard title="Batch Toolbar">
              <Field
                name="batchToolBar"
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
              <Submit>查询</Submit>
              <Reset>重置</Reset>
            </FormButtonGroup>
          </SchemaForm>
        </Card>
      </PageHeaderWrapper>
    </>
  );
};

export default Index;
