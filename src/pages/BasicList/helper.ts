import moment from 'moment';

export const setFieldsAdaptor = (
  tabs: BasicListApi.Tabs[],
  dataSource: BasicListApi.DataSource,
) => {
  if (Array.isArray(tabs) && dataSource) {
    const result = {};
    tabs.forEach((tab) => {
      tab.data.forEach((field) => {
        switch (field.type) {
          case 'datetime':
            result[field.name] = moment(dataSource[field.name]);
            break;
          case 'textarea':
            if (typeof dataSource[field.name] === 'object' && dataSource[field.name] !== null) {
              result[field.name] = JSON.stringify(dataSource[field.name]);
            } else {
              result[field.name] = dataSource[field.name];
            }
            break;

          default:
            result[field.name] = dataSource[field.name];
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

export function searchTree(
  tree: Record<string, any>[],
  value: unknown,
  key = 'value',
  withChildren = false,
) {
  let result = null;
  if (!Array.isArray(tree)) return result;

  for (let index = 0; index < tree.length; index += 1) {
    const stack = [tree[index]];
    while (stack.length) {
      const node = stack.shift()!;
      if (node[key] === value) {
        result = node;
        break;
      }
      if (node.children) {
        stack.push(...node.children);
      }
    }
    if (result) break;
  }
  if (withChildren !== true) {
    delete result?.children;
  }

  return result;
}
