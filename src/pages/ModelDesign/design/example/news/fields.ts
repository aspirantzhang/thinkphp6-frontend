export const fields = {
  options: {
    handleFieldValidation: true,
    handleFieldFilter: true,
  },
  data: [
    {
      name: 'news_title',
      title: 'Title',
      type: 'input',
      settings: {
        validate: ['require', 'length'],
        options: {
          length: { min: '0', max: '255' },
        },
      },
      titleField: 1,
      allowHome: 1,
      allowRead: 1,
      allowSave: 1,
      allowUpdate: 1,
      allowTranslate: 1,
    },
    {
      name: '_path',
      title: 'Path',
      type: 'input',
      settings: {
        validate: ['require', 'length'],
        options: {
          length: { min: '0', max: '255' },
        },
        display: ['hideInColumn'],
      },
      allowHome: 1,
      allowRead: 1,
      allowSave: 1,
      allowUpdate: 1,
    },
    {
      name: '_order',
      title: 'Order',
      type: 'number',
      settings: {
        display: ['listSorter'],
        validate: ['number'],
      },
      allowHome: 1,
      allowRead: 1,
      allowSave: 1,
      allowUpdate: 1,
    },
    {
      name: 'news_content',
      title: 'Content',
      type: 'textEditor',
      settings: {
        display: ['hideInColumn'],
      },
      ignoreFilter: 1,
      allowHome: 1,
      allowRead: 1,
      allowSave: 1,
      allowUpdate: 1,
      allowTranslate: 1,
    },
  ],
};
