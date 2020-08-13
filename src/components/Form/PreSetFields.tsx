import moment from 'moment';

export const preSetFields = (mainData: any) => {
  const formData: any = [];

  mainData?.layout.map((column: any) => {
    switch (column.type) {
      case 'datetime':
        formData[column.key] = moment(mainData.dataSource[column.key], moment.ISO_8601);
        break;
      case 'tag':
        formData[column.key] = Boolean(mainData.dataSource[column.key]);
        break;
      case 'action':
        break;
      default:
        // type equals 'text' or others
        formData[column.key] = mainData.dataSource[column.key];
        break;
    }
    return null;
  });

  return formData;
};
