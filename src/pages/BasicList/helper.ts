import { join } from 'lodash';

/**
 * Build Sort Query
 * @param sorter Table Sorter
 */
export const buildSorter = (sorter: any) => {
  let sorterQuery = null;
  if (sorter.order !== undefined || sorter.order !== null) {
    sorterQuery = `&sort=${sorter.field}&order=${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
  }

  return `${sorterQuery}`;
};

export const buildUriMatch = (match: any) => {
  const params = match.params;
  const fullUri = join(Object.values(params), '/');
  const baseUri = { app: '', controller: '', action: '' };
  return { fullUri, ...baseUri, ...params };
};
