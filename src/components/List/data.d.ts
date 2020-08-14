export interface SingleColumnType {
  title: string;
  dataIndex: string;
  key: string;
  sorter?: boolean;
  fixed?: string;
  render?: () => void;
}
