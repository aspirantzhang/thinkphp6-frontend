export const initialFields = {
  fields: [
    {
      name: 'nickname',
      title: 'Nick Name',
      type: 'input',
      settings: {
        validate: ['require', 'length'],
      },
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
    },
  ],
};
