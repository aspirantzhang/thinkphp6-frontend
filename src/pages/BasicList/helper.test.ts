import { buildSorter, buildUriMatch } from './helper';

describe('buildSorter', (): void => {
  it('Invalid parameters should return empty string', (): void => {
    expect(buildSorter([] as any)).toBe('');
    expect(buildSorter(null as any)).toBe('');
    expect(buildSorter(undefined as any)).toBe('');
    expect(buildSorter({ test: 'ok' } as any)).toBe('');
    expect(buildSorter([1, 2, 3] as any)).toBe('');
  });
  it('Valid parameters should return correct string', (): void => {
    expect(buildSorter({ field: 'id', order: 'ascend' } as any)).toBe('&sort=id&order=asc');
    expect(buildSorter({ field: 'create_time', order: 'descend' } as any)).toBe(
      '&sort=create_time&order=desc',
    );
    expect(buildSorter({ field: 'id' } as any)).toBe('&sort=id');
    expect(buildSorter({ order: 'ascend' } as any)).toBe('&order=asc');
    expect(buildSorter({ order: 'descend' } as any)).toBe('&order=desc');
  });
});
describe('buildUriMatch', (): void => {
  it('Invalid parameters should return default object', (): void => {
    const defaultObj = {
      fullUri: '',
      app: '',
      controller: '',
      action: '',
    };
    expect(buildUriMatch([] as any)).toEqual(defaultObj);
    expect(buildUriMatch(undefined as any)).toEqual(defaultObj);
    expect(buildUriMatch({} as any)).toEqual(defaultObj);
    expect(buildUriMatch('' as any)).toEqual(defaultObj);
    expect(buildUriMatch(null as any)).toEqual(defaultObj);
    expect(buildUriMatch({ params: '' } as any)).toEqual(defaultObj);
  });
  //   it('Valid parameters should return correct string', (): void => {
  //     expect(buildSorter({ field: 'id', order: 'ascend' } as any)).toBe('&sort=id&order=asc');
  //   });
});
