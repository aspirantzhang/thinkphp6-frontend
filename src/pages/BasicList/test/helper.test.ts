import { setFieldsAdaptor, submitFieldsAdaptor, searchTree, searchTreeRecursion } from '../helper';
import moment from 'moment';

const setFieldsAdaptorParams = {
  layout: {
    tabs: [
      {
        name: 'basic',
        title: 'Basic',
        data: [
          {
            dataIndex: 'string',
            name: 'string',
            type: 'text',
          },
          {
            dataIndex: 'momentTime',
            name: 'momentTime',
            type: 'datetime',
          },
          {
            title: 'objectTextarea',
            name: 'objectTextarea',
            type: 'textarea',
          },
          {
            title: 'stringTextarea',
            name: 'stringTextarea',
            type: 'textarea',
          },
        ],
      },
    ],
  },
  dataSource: {
    string: 'unitTest',
    notExistField: 1,
    momentTime: '2020-10-22T15:38:51+08:00',
    objectTextarea: {
      routeName: 'users',
      number: 100,
    },
    stringTextarea: 'stringTextarea',
  },
};

const setFieldsAdaptorResult = {
  string: 'unitTest',
  momentTime: moment('2020-10-22T15:38:51+08:00'),
  objectTextarea: JSON.stringify({
    routeName: 'users',
    number: 100,
  }),
  stringTextarea: 'stringTextarea',
};

describe('setFieldsAdaptor', () => {
  test('Invalid parameter should return empty object', () => {
    expect(setFieldsAdaptor(null as any)).toEqual({});
    expect(setFieldsAdaptor([] as any)).toEqual({});
    expect(setFieldsAdaptor({} as any)).toEqual({});
    expect(setFieldsAdaptor(undefined as any)).toEqual({});
    expect(setFieldsAdaptor(NaN as any)).toEqual({});
    expect(setFieldsAdaptor(true as any)).toEqual({});
    expect(setFieldsAdaptor(false as any)).toEqual({});
    expect(setFieldsAdaptor('' as any)).toEqual({});
  });
  test('Valid parameter should return correct object', () => {
    expect(setFieldsAdaptor(setFieldsAdaptorParams as any)).toEqual(setFieldsAdaptorResult);
  });
});

const submitFieldsAdaptorParams = {
  string: 'unitTest',
  number: 1,
  array: [53],
  stringTime: '2021-04-29T17:34:15+08:00',
  momentTime: moment('2021-05-01T20:19:57+08:00'),
  innerTime: [moment('2021-05-01T20:19:57+08:00'), moment('2021-05-02T20:19:57+08:00')],
};

const submitFieldsAdaptorResult = {
  string: 'unitTest',
  number: 1,
  array: [53],
  stringTime: '2021-04-29T17:34:15+08:00',
  momentTime: moment('2021-05-01T20:19:57+08:00').format(),
  innerTime: [
    moment('2021-05-01T20:19:57+08:00').format(),
    moment('2021-05-02T20:19:57+08:00').format(),
  ],
};

describe('submitFieldsAdaptor', () => {
  test('Invalid parameter should return empty object', () => {
    expect(submitFieldsAdaptor(null as any)).toEqual({});
    expect(submitFieldsAdaptor([] as any)).toEqual({});
    expect(submitFieldsAdaptor({} as any)).toEqual({});
    expect(submitFieldsAdaptor(undefined as any)).toEqual({});
    expect(submitFieldsAdaptor(NaN as any)).toEqual({});
    expect(submitFieldsAdaptor(true as any)).toEqual({});
    expect(submitFieldsAdaptor(false as any)).toEqual({});
    expect(submitFieldsAdaptor('' as any)).toEqual({});
  });
  test('Valid parameter should return correct object', () => {
    expect(submitFieldsAdaptor(submitFieldsAdaptorParams as any)).toEqual(
      submitFieldsAdaptorResult,
    );
  });
});

const validTree = [
  {
    id: 1,
    parent_id: 0,
    title: 'Level 1',
    value: 1,
    children: [
      {
        id: 3,
        parent_id: 1,
        title: 'Level 1-1',
        value: 3,
        children: [
          {
            id: 5,
            parent_id: 3,
            title: 'Level 1-1-1',
            value: 5,
          },
          {
            id: 6,
            parent_id: 3,
            title: 'Level 1-1-2',
            value: 6,
          },
        ],
      },
      {
        id: 4,
        parent_id: 1,
        title: 'Level 1-2',
        value: 4,
      },
    ],
  },
  {
    id: 2,
    parent_id: 0,
    title: 'Level 2',
    value: 2,
    children: [
      {
        id: 7,
        parent_id: 2,
        title: 'Level 2-1',
        value: 7,
        children: [
          {
            id: 8,
            parent_id: 7,
            title: 'Level 2-1-1',
            value: 8,
          },
        ],
      },
    ],
  },
  {
    id: 9,
    parent_id: 0,
    title: 'Level 3',
    value: 9,
  },
];

describe('searchTree', () => {
  test('Invalid parameter should return null', () => {
    expect(searchTree(null as any, 'foo', 'bar')).toEqual(null);
    expect(searchTree([] as any, 'foo', 'bar')).toEqual(null);
    expect(searchTree({} as any, 'foo', 'bar')).toEqual(null);
    expect(searchTree(undefined as any, 'foo', 'bar')).toEqual(null);
    expect(searchTree(NaN as any, 'foo', 'bar')).toEqual(null);
    expect(searchTree(true as any, 'foo', 'bar')).toEqual(null);
    expect(searchTree(false as any, 'foo', 'bar')).toEqual(null);
    expect(searchTree('' as any, 'foo', 'bar')).toEqual(null);
  });
  test('Valid parameter should return correct object', () => {
    // level 3
    expect(searchTree(validTree, 5, 'value')).toEqual({
      id: 5,
      parent_id: 3,
      title: 'Level 1-1-1',
      value: 5,
    });
    expect(searchTree(validTree, 7, 'parent_id')).toEqual({
      id: 8,
      parent_id: 7,
      title: 'Level 2-1-1',
      value: 8,
    });
    // level 2
    expect(searchTree(validTree, 'Level 1-2', 'title')).toEqual({
      id: 4,
      parent_id: 1,
      title: 'Level 1-2',
      value: 4,
    });
    // level 1
    expect(searchTree(validTree, 9, 'id')).toEqual({
      id: 9,
      parent_id: 0,
      title: 'Level 3',
      value: 9,
    });
    // with children
    expect(searchTree(validTree, 3, 'id', true)).toEqual({
      id: 3,
      parent_id: 1,
      title: 'Level 1-1',
      value: 3,
      children: [
        {
          id: 5,
          parent_id: 3,
          title: 'Level 1-1-1',
          value: 5,
        },
        {
          id: 6,
          parent_id: 3,
          title: 'Level 1-1-2',
          value: 6,
        },
      ],
    });
  });
});
