declare module BasicListApi {
  type ActionHandler = (action: Partial<BasicListApi.Action>, record?: BasicListApi.Field) => void;

  type Page = {
    title: string;
    type: string;
    trash?: boolean;
    options?: Record<string, any>;
  };

  type Action = {
    component: string;
    name: string;
    title: string;
    type: string;
    call: string;
    uri?: string;
    method?: string;
  };

  type Field = {
    name: string;
    title: string;
    [key: string]: any;
  };

  type DataSource = Record<string, any>;

  type Meta = {
    total: number;
    per_page: number;
    page: number;
  };

  type FieldsBlock = {
    name?: string;
    title?: string;
    data: Field[];
  };

  type Actions = {
    name: string;
    title: string;
    data: Action[];
  };

  type ListLayout = {
    tableColumn: Field[];
    tableToolBar: Action[];
    batchToolBar: Action[];
  };

  type PageLayout = {
    tabs: FieldsBlock[];
    sidebars: FieldsBlock[];
    actions: Actions[];
  };

  type ListData = {
    page: Page;
    layout: ListLayout;
    dataSource: DataSource[];
    meta: Meta;
  };

  type PageData = {
    page: Page;
    layout: PageLayout;
    dataSource: DataSource;
  };

  type Root = {
    success: boolean;
    message: string;
    data: PageData | ListData;
    call?: string[];
  };
}
