import { join } from 'lodash';

/**
 * Build Sort Query
 * @param sorter Table Sorter
 */
export const buildSorter = (sorter: any) => {
  let sorterQuery: string = '';
  if (sorter) {
    sorterQuery = `${sorter.field ? '&sort=' + sorter.field : ''}${
      sorter.order ? (sorter.order === 'ascend' ? '&order=asc' : '&order=desc') : ''
    }`;
    // sorterQuery = `&sort=${sorter.field}&order=${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
  }
  return `${sorterQuery}`;
};

export const buildUriMatch = (match: any) => {
  const params =
    typeof match === 'object' && match !== null ? (match.params ? match.params : {}) : {};
  const fullUri = typeof params === 'object' ? join(Object.values(params), '/') : '';
  const baseUri = { app: '', controller: '', action: '' };
  return { fullUri, ...baseUri, ...params };
};
