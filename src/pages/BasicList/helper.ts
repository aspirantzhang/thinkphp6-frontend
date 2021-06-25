import moment from 'moment';

export const setFieldsAdaptor = (
  tabs: BasicListApi.Tabs[],
  dataSource: BasicListApi.DataSource,
  nested = false,
) => {
  if (Array.isArray(tabs) && dataSource) {
    const result = {};
    tabs.forEach((tab) => {
      if (nested) {
        result[tab.name!] = {};
      }

      tab.data.forEach((field) => {
        let sourceValue = null;
        if (nested) {
          sourceValue = dataSource[tab.name!] ? dataSource[tab.name!][field.name] : null;
        } else {
          sourceValue = dataSource[field.name];
        }
        let fieldValue = null;

        switch (field.type) {
          case 'datetime':
            fieldValue = moment(sourceValue);
            break;
          case 'textarea':
            if (typeof sourceValue === 'object' && sourceValue !== null) {
              fieldValue = JSON.stringify(sourceValue);
            } else {
              fieldValue = sourceValue;
            }
            break;

          default:
            fieldValue = sourceValue;
            break;
        }
        if (nested) {
          result[tab.name!][field.name] = fieldValue;
        } else {
          result[field.name] = fieldValue;
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
