/**
 * @jest-environment jsdom
 */
import './antd-test-setup';
import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import { Form } from 'antd';
import SearchBuilder from '../../builder/SearchBuilder';

const validSearch = [
  {
    name: 'single_line_text',
    title: 'Single Line Text',
    type: 'input',
    disabled: true,
  },
  {
    name: 'password',
    title: 'Password',
    type: 'password',
    disabled: true,
  },
  {
    name: 'textarea',
    title: 'Textarea',
    type: 'textarea',
    disabled: true,
  },
  {
    name: 'tree',
    title: 'Tree',
    type: 'tree',
    data: [],
    disabled: true,
  },
  {
    name: 'datetime',
    title: 'Datetime',
    type: 'datetime',
    disabled: true,
  },
  {
    name: 'select',
    title: 'Select',
    type: 'select',
    data: [],
    disabled: true,
  },
  {
    name: 'switch',
    title: 'Switch',
    type: 'switch',
    data: [{ title: 'foo', value: 'bar' }],
    disabled: true,
  },
  {
    name: 'invalid',
    title: 'Invalid',
    type: 'invalid',
  },
];

describe('SearchBuilder', () => {
  test('snapshot test', () => {
    const { container } = render(<Form>{SearchBuilder(validSearch as any)}</Form>);
    expect(container).toMatchSnapshot();
  });

  test('valid params', () => {
    render(<Form>{SearchBuilder(validSearch as any)}</Form>);
    expect(screen.getByLabelText('Single Line Text')).toBeInTheDocument();
    expect(screen.getByLabelText('Textarea')).toBeInTheDocument();
    expect(screen.getByLabelText('Tree')).toBeInTheDocument();
    expect(screen.getByLabelText('Datetime')).toBeInTheDocument();
    expect(screen.getByLabelText('Select')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch')).toBeInTheDocument();
    expect(screen.queryByLabelText('Invalid')).not.toBeInTheDocument();
  });

  test('invalid params', () => {
    expect(SearchBuilder(null as any)).toEqual([]);
    expect(SearchBuilder([] as any)).toEqual([]);
    expect(SearchBuilder({} as any)).toEqual([]);
    expect(SearchBuilder(undefined as any)).toEqual([]);
    expect(SearchBuilder(NaN as any)).toEqual([]);
    expect(SearchBuilder(true as any)).toEqual([]);
    expect(SearchBuilder(false as any)).toEqual([]);
    expect(SearchBuilder('' as any)).toEqual([]);
  });
});
