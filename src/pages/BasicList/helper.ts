import moment from 'moment';

export const setFieldsAdaptor = (data: BasicListApi.PageData) => {
  if (data?.layout?.tabs && data.dataSource) {
    const result = {};
    data.layout.tabs.forEach((tab) => {
      tab.data.forEach((field) => {
        switch (field.type) {
          case 'datetime':
            result[field.name] = moment(data.dataSource[field.name]);
            break;
          case 'textarea':
            if (
              typeof data.dataSource[field.name] === 'object' &&
              data.dataSource[field.name] !== null
            ) {
              result[field.name] = JSON.stringify(data.dataSource[field.name]);
            } else {
              result[field.name] = data.dataSource[field.name];
            }
            break;

          default:
            result[field.name] = data.dataSource[field.name];
            break;
        }
      });
    });
    return result;
  }
  return {};
};

export const submitFieldsAdaptor = (formValues: any) => {
  if (typeof formValues === 'object' && formValues !== null && Object.keys(formValues).length) {
    const result = formValues;
    Object.keys(formValues).forEach((key) => {
      if (moment.isMoment(formValues[key])) {
        result[key] = moment(formValues[key]).format();
      }
      if (Array.isArray(formValues[key])) {
        result[key] = formValues[key].map((innerValue: any) => {
          if (moment.isMoment(innerValue)) {
            return moment(innerValue).format();
          }
          return innerValue;
        });
      }
    });
    return result;
  }
  return {};
};
