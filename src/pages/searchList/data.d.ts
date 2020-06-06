export interface BasicListState {
  success: boolean;
  message: string;
  data: DataState;
}

export interface DataState {
  page: PageState;
  layout: LayoutState;
  dataSource: [];
  meta: MetaState;
}
export interface PageState {
  title: string;
  type: string;
  searchBar: boolean;
  searchExpand: boolean;
}

export interface LayoutState {
  tableColumn: [];
  tableToolBar: [];
  batchToolBar: [];
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
