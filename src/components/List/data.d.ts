export interface SingleColumnType {
  title: string;
  dataIndex: string;
  key: string;
  type?: string;
  hideInColumn?: boolean;
  sorter?: boolean;
  fixed?: string;
  data?: string;
  actions?: any[];
  render?: (text: string, record: any, index: number) => void;
}
