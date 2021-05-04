/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom/extend-expect';
import ColumnBuilder from '../../builder/ColumnBuilder';

const validColumns = [
  {
    name: 'string',
    dataIndex: 'string',
    key: 'string',
    type: 'string',
    title: 'String',
  },
  {
    name: 'datetime',
    dataIndex: 'datetime',
    key: 'datetime',
    type: 'datetime',
    title: 'Datetime',
  },
  {
    name: 'switch',
    dataIndex: 'switch',
    key: 'switch',
    type: 'switch',
    title: 'Switch',
  },
  {
    name: 'actions',
    dataIndex: 'actions',
    key: 'actions',
    type: 'actions',
    title: 'Actions',
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
    name: 'string',
    dataIndex: 'string',
    key: 'string',
    type: 'string',
    title: 'String',
  },
  {
    name: 'datetime',
    dataIndex: 'datetime',
    key: 'datetime',
    type: 'datetime',
    title: 'Datetime',
    render: expect.any(Function),
  },
  {
    name: 'switch',
    dataIndex: 'switch',
    key: 'switch',
    type: 'switch',
    title: 'Switch',
    render: expect.any(Function),
  },
  {
    name: 'actions',
    dataIndex: 'actions',
    key: 'actions',
    type: 'actions',
    title: 'Actions',
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
