import moment from 'moment';

export const FieldPrepare = (mainData: PageAPI.Data) => {
  // combine fields from tabs and sidebars
  let allFields: PageAPI.FormData[] = [];
  mainData?.layout?.tabs?.forEach((tab: PageAPI.Form) => {
    allFields = allFields.concat(tab.data);
  });
  mainData?.layout?.sidebars?.forEach((sidebar: PageAPI.Form) => {
    allFields = allFields.concat(sidebar.data);
  });

  const formData: API.Store = [];

  allFields.forEach((field: PageAPI.FormData) => {
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
        // Object to string
        if (field.type === 'textarea' && typeof mainData.dataSource[field.key] === 'object') {
          formData[field.key] = JSON.stringify(mainData.dataSource[field.key]);
        }
        break;
    }
  });

  return formData;
};
