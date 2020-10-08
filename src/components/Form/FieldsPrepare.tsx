import moment from 'moment';
import { PageDataState } from '@/pages/BasicList/data';

export const FieldsPrepare = (mainData: PageDataState) => {
  // combine fields from tabs and sidebars
  let allFields: any[] = [];
  mainData?.layout?.tabs?.forEach((tab: any) => {
    allFields = allFields.concat(tab.data);
  });
  mainData?.layout?.sidebars?.forEach((sidebar: any) => {
    allFields = allFields.concat(sidebar.data);
  });

  const formData: any = [];

  allFields.map((field: any) => {
    switch (field.type) {
      case 'datetime':
        formData[field.key] = moment(mainData.dataSource[field.key], moment.ISO_8601);
        break;
      case 'tag':
        formData[field.key] = Boolean(mainData.dataSource[field.key]);
        break;
      case 'action':
        break;
      default:
        // type equals 'text' or other
        formData[field.key] = mainData.dataSource[field.key];
        break;
    }
    return null;
  });

  return formData;
};
