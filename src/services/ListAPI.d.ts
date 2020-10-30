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
    [keyName: string]: any;
  }

  export interface TableColumn {
    title: string;
    dataIndex: string;
    key: string;
    type?: string;
    data?: any;
    hideInColumn?: boolean;
    sorter?: boolean;
    mode?: any;
    actions?: Action[];
    fixed?: string;
    render?: (...key: any) => void;
    // [key: string]: any;
  }

  export interface Layout {
    tableColumn: TableColumn[];
    tableToolBar: Action[];
    batchToolBar: Action[];
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
}
