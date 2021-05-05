/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';
import ColumnBuilder from '../../builder/ColumnBuilder';

const validColumns = [
  {
    name: 'single_line_text',
    dataIndex: 'single_line_text',
    key: 'single_line_text',
    title: 'Single-line Text',
    type: 'input',
  },
  {
    name: 'password',
    dataIndex: 'password',
    key: 'password',
    title: 'Password',
    type: 'password',
  },
  {
    name: 'multi_line_text',
    dataIndex: 'multi_line_text',
    key: 'multi_line_text',
    title: 'Multi-line Text',
    type: 'textarea',
  },
  {
    name: 'datetime',
    dataIndex: 'datetime',
    key: 'datetime',
    title: 'Datetime',
    type: 'datetime',
  },
  {
    name: 'switch',
    dataIndex: 'switch',
    key: 'switch',
    title: 'Switch',
    type: 'switch',
  },
  {
    name: 'actions',
    dataIndex: 'actions',
    key: 'actions',
    title: 'Actions',
    type: 'actions',
  },
];
const validResults = [
  {
    name: 'id',
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    sorter: true,
  },
  {
    name: 'single_line_text',
    dataIndex: 'single_line_text',
    key: 'single_line_text',
    title: 'Single-line Text',
    type: 'input',
  },
  {
    name: 'password',
    dataIndex: 'password',
    key: 'password',
    title: 'Password',
    type: 'password',
  },
  {
    name: 'multi_line_text',
    dataIndex: 'multi_line_text',
    key: 'multi_line_text',
    title: 'Multi-line Text',
    type: 'textarea',
  },
  {
    name: 'datetime',
    dataIndex: 'datetime',
    key: 'datetime',
    title: 'Datetime',
    type: 'datetime',
    render: expect.any(Function),
  },
  {
    name: 'switch',
    dataIndex: 'switch',
    key: 'switch',
    title: 'Switch',
    type: 'switch',
    render: expect.any(Function),
  },
  {
    name: 'actions',
    dataIndex: 'actions',
    key: 'actions',
    title: 'Actions',
    type: 'actions',
    render: expect.any(Function),
  },
];
const onlyIdResults = [
  {
    name: 'id',
    dataIndex: 'id',
    key: 'id',
    title: 'ID',
    sorter: true,
  },
];

describe('ColumnBuilder', () => {
  test('valid params', () => {
    expect(ColumnBuilder(validColumns as any, () => {})).toEqual(validResults);
  });

  test('invalid params', () => {
    expect(ColumnBuilder(null as any, () => {})).toEqual(onlyIdResults);
    expect(ColumnBuilder([] as any, () => {})).toEqual(onlyIdResults);
    expect(ColumnBuilder({} as any, () => {})).toEqual(onlyIdResults);
    expect(ColumnBuilder(undefined as any, () => {})).toEqual(onlyIdResults);
    expect(ColumnBuilder(NaN as any, () => {})).toEqual(onlyIdResults);
    expect(ColumnBuilder(true as any, () => {})).toEqual(onlyIdResults);
    expect(ColumnBuilder(false as any, () => {})).toEqual(onlyIdResults);
    expect(ColumnBuilder('' as any, () => {})).toEqual(onlyIdResults);
  });
});
