/**
 * Build Sort String
 * @param sorter Table Sorter
 */
export const sorter_build = (sorter: any) => {
  let sorterString = null;
  if (sorter.order !== undefined || sorter.order !== null) {
    sorterString = `&sort=${sorter.field}&order=${sorter.order === 'ascend' ? 'asc' : 'desc'}`;
  }

  return `${sorterString}`;
};
