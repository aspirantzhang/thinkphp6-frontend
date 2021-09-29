export const initialFields = {
  options: {
    handleFieldValidation: true,
    handleFieldFilter: true,
  },
  data: [
    {
      name: 'nickname',
      title: 'Nick Name',
      type: 'input',
      settings: {
        validate: ['require', 'length'],
      },
      allowHome: 1,
      allowRead: 1,
      allowSave: 1,
      allowUpdate: 1,
      allowTranslate: 1,
    },
    {
      name: 'gender',
      title: 'Gender',
      type: 'radio',
      data: [
        {
          title: 'Mx',
          value: 'mx',
        },
        {
          title: 'Mr',
          value: 'mr',
        },
        {
          title: 'Ms',
          value: 'ms',
        },
      ],
      settings: { validate: ['require'] },
      allowHome: 1,
      allowRead: 1,
      allowSave: 1,
      allowUpdate: 1,
    },
    {
      name: 'married',
      title: 'Married',
      type: 'switch',
      hideInColumn: true,
      data: [
        { title: 'Yes', value: 1 },
        { title: 'No', value: 0 },
      ],
      settings: { display: ['listSorter'], validate: ['require'] },
      allowHome: 1,
      allowRead: 1,
      allowSave: 1,
      allowUpdate: 1,
    },
  ],
};
