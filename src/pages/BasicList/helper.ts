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
