declare module PageAPI {
  export interface Page {
    title: string;
    type: string;
  }

  export interface FormData {
    title: string;
    dataIndex: string;
    key: string;
    type: string;
    disabled: boolean;
    data: any[];
    mode: string;
  }

  export interface Form {
    name: string;
    title: string;
    data: FormData[];
  }

  export interface ActionData {
    component: string;
    text: string;
    type: string;
    action: string;
    uri: string;
    method: string;
  }

  export interface Action {
    name: string;
    title: string;
    data: ActionData[];
  }

  export interface Layout {
    tabs: Form[];
    sidebars?: Form[];
    actions: Action[];
  }

  export interface Record {
    [key: string]: any;
  }

  export interface Data {
    page: Page;
    layout: Layout;
    dataSource: Record;
  }

  export interface Base {
    success: boolean;
    message: string;
    data: Data;
  }
}
