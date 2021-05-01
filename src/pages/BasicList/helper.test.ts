import { setFieldsAdaptor, submitFieldsAdaptor } from './helper';
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
  });
  test('Valid parameter should return correct object', () => {
    expect(submitFieldsAdaptor(submitFieldsAdaptorParams as any)).toEqual(
      submitFieldsAdaptorResult,
    );
  });
});
