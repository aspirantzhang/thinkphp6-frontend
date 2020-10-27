declare namespace ListAPI {
  export interface Page {
    title: string;
    type: string;
    searchBar: boolean;
    trash: boolean;
  }

  export interface Action {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface TableColumn {
    title: string;
    dataIndex: string;
    key: string;
    type: string;
    data: any;
    hideInColumn?: boolean;
    sorter?: boolean;
    mode: string;
    actions?: Action[];
    render?: () => void;
  }

  export interface TableToolBar {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
  }

  export interface BatchToolBar {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface Layout {
    tableColumn: TableColumn[];
    tableToolBar: TableToolBar[];
    batchToolBar: BatchToolBar[];
  }

  export interface Record {
    [key: string]: any;
  }

  export interface Meta {
    total: number;
    per_page: number;
    page: number;
  }

  export interface Data {
    page: Page;
    layout: Layout;
    dataSource: Record[];
    meta: Meta;
  }

  export interface Base {
    success: boolean;
    message: string;
    data: Data;
  }

  export interface UriMatchState {
    app?: string;
    controller?: string;
    action?: string;
    [key: string]: string;
  }
}
