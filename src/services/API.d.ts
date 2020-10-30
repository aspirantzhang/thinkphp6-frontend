declare namespace API {
  export interface CurrentUser {
    avatar?: string;
    name?: string;
    title?: string;
    group?: string;
    signature?: string;
    tags?: {
      key: string;
      label: string;
    }[];
    userid?: string;
    access?: 'user' | 'guest' | 'admin';
    unreadCount?: number;
  }

  export interface LoginStateType {
    success?: boolean;
    type?: string;
  }

  export interface NoticeIconData {
    id: string;
    key: string;
    avatar: string;
    title: string;
    datetime: string;
    type: string;
    read?: boolean;
    description: string;
    clickClose?: boolean;
    extra: any;
    status: string;
  }

  export type ActionHandler = (actions: ListAPI.Action, record?: ListAPI.Record) => void;

  export interface UriMatchState {
    app?: string;
    controller?: string;
    action?: string;
    [key: string]: string;
  }

  export interface Store {
    [key: string]: any;
  }

  export type StoreValue = string | number;
}
