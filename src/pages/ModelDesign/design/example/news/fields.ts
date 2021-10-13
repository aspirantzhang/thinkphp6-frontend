export const fields = {
  options: {
    handleFieldValidation: true,
    handleFieldFilter: true,
  },
  tabs: {
    basic: [
      {
        name: 'title',
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
        name: 'pathname',
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
        name: 'content',
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
  },
  sidebars: {
    basic: [
      {
        name: 'listOrder',
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
    ],
  },
};
