/**
 * @jest-environment jsdom
 */
import './antd-test-setup';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import FormBuilder from '../../builder/FormBuilder';

const validFormData = [
  {
    name: 'single_line_text',
    key: 'single_line_text',
    title: 'Single-line Text',
    type: 'input',
    disabled: true,
  },
  {
    name: 'password',
    key: 'password',
    title: 'Password',
    type: 'password',
    disabled: true,
  },
  {
    name: 'multi_line_text',
    key: 'multi_line_text',
    title: 'Multi-line Text',
    type: 'textarea',
    disabled: true,
  },
  {
    name: 'number',
    key: 'number',
    title: 'Number',
    type: 'number',
    disabled: true,
  },
  {
    name: 'datetime',
    key: 'datetime',
    title: 'Datetime',
    type: 'datetime',
    disabled: true,
  },
  {
    name: 'switch',
    key: 'switch',
    title: 'Switch',
    type: 'switch',
    data: [{ title: 'foo', value: 'bar' }],
    disabled: true,
  },
  {
    name: 'tree',
    key: 'tree',
    title: 'Tree',
    type: 'tree',
    data: [],
    disabled: true,
  },
  {
    name: 'update_time',
    key: 'update_time',
    title: 'Update Time',
    type: 'datetime',
    disabled: true,
  },
  {
    name: 'radio',
    key: 'radio',
    title: 'Radio',
    type: 'radio',
    data: [{ title: 'foo', value: 'bar' }],
    disabled: true,
  },
  {
    name: 'parent',
    key: 'parent',
    title: 'Parent',
    type: 'parent',
    data: [
      { id: 1, parent_id: 0, value: 'foo1', title: 'Bar1' },
      { id: 2, parent_id: 1, value: 'foo2', title: 'Bar2' },
    ],
    disabled: true,
  },
  {
    name: 'invalid',
    key: 'invalid',
    title: 'Invalid',
    type: 'invalid',
  },
];

describe('FormBuilder', () => {
  test('snapshot test', () => {
    const { container } = render(<Form>{FormBuilder(validFormData as any)}</Form>);
    expect(container).toMatchSnapshot();
  });

  test('valid params', () => {
    render(<Form>{FormBuilder(validFormData as any)}</Form>);
    expect(screen.getByLabelText('Single-line Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Multi-line Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Number')).toBeInTheDocument();
    expect(screen.getByLabelText('Datetime')).toBeInTheDocument();
    expect(screen.getByLabelText('Tree')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch')).toBeInTheDocument();
    expect(screen.getByTitle('Radio')).toBeInTheDocument();
    expect(screen.getByLabelText('Parent')).toBeInTheDocument();
    expect(screen.queryByLabelText('Invalid')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Update Time')).not.toBeInTheDocument();
  });

  test('invalid params', () => {
    expect(FormBuilder(null as any)).toEqual([]);
    expect(FormBuilder([] as any)).toEqual([]);
    expect(FormBuilder({} as any)).toEqual([]);
    expect(FormBuilder(undefined as any)).toEqual([]);
    expect(FormBuilder(NaN as any)).toEqual([]);
    expect(FormBuilder(true as any)).toEqual([]);
    expect(FormBuilder(false as any)).toEqual([]);
    expect(FormBuilder('' as any)).toEqual([]);
  });
});
