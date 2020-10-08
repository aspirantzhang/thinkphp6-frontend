export interface BasicListState {
  success: boolean;
  message: string;
  data: DataState;
}

export interface DataState {
  page: PageState;
  layout: LayoutState;
  dataSource: Array;
  meta: MetaState;
}
export interface PageDataState {
  page: PageState;
  layout: {
    tabs: Array;
    sidebars: Array;
    actions: Array;
  };
  dataSource: Array;
  meta: MetaState;
}
export interface PageState {
  title: string;
  type: string;
  searchBar: boolean;
  trash: boolean;
}

export interface LayoutState {
  tableColumn: Array;
  tableToolBar: Array;
  batchToolBar: Array;
}

export interface MetaState {
  total: number;
  per_page: number;
  page: number;
}

export interface SingleColumnType {
  title: string;
  dataIndex: string;
  key: string;
  sorter?: boolean;
  fixed?: string;
  render?: () => void;
}

export interface FormValues {
  [name: string]: any;
}
