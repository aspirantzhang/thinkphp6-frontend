import React, { useEffect, useState, FC } from 'react';
import { connect, UserModelState } from 'umi';
import { ColumnsType } from 'antd/es/table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import {
  PlusOutlined,
  SearchOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Input,
  InputNumber,
  Space,
  Pagination,
  Table,
  message,
  Modal,
  DatePicker,
  Tag,
  Select,
} from 'antd';
import * as helper from './helper';
import styles from './style.less';

interface basicListProps {
  users: UserModelState;
}

const BasicList: FC<basicListProps> = ({ dispatch, users }) => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchFormInitialValues, setSearchFormInitialValues] = useState({});
  const [searchForm] = Form.useForm();
  const { confirm } = Modal;
  const { RangePicker } = DatePicker;

  interface SingleColumn {
    title: string;
    dataIndex: string;
    key: string;
    sorter?: boolean;
    fixed?: string;
    render?: () => void;
  }

  const columns: ColumnsType<SingleColumn> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      fixed: 'left',
    },
  ];
  // Build Column
  if (users.layout) {
    users.layout.tableColumn.forEach((column: any) => {
      const thisColumn = column;
      // tag
      if (thisColumn.type === 'tag') {
        thisColumn.render = (text: any) => {
          return (
            <Space>
              {thisColumn.values
                .filter((item: any, index: number) => index === text)
                .map((item: any) => {
                  return <Tag color={text === 0 ? 'red' : 'blue'}>{item}</Tag>;
                })}
            </Space>
          );
        };
      }

      // action
      if (thisColumn.type === 'action') {
        thisColumn.render = () => {
          return (
            <Space>
              {thisColumn.action.map((action: any) => {
                if (action.component === 'button') {
                  return <Button type={action.type}>{action.text}</Button>;
                }
                return null;
              })}
            </Space>
          );
        };
      }

      columns.push(thisColumn);
    });
  }

  // const columns = [
  //   {
  //     title: 'Create Time',
  //     dataIndex: 'create_time',
  //     key: 'create_time',
  //     sorter: true,
  //     render: (text: any) => {
  //       return moment(text).format('YYYY-MM-DD HH:mm:ss');
  //     },
  //   },
  //   {
  //     title: 'Action',
  //     key: 'action',
  //     render: (text: any, record: any) => {
  //       return (
  //         <Space>
  //           <Button type="dashed">Edit</Button>
  //           <Button type="dashed">Delete</Button>
  //         </Space>
  //       );
  //     },
  //   },
  // ];

  const batchDeleteHandler = () => {
    confirm({
      title: 'Delete Overview',
      icon: <ExclamationCircleOutlined />,
      content: JSON.stringify(selectedKeys),
      okText: 'Sure to Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        message.success(JSON.stringify(selectedKeys));
      },
      onCancel() {
        message.error('Operation Cancelled.');
      },
    });
  };

  const searchExpandHandler = () => {
    dispatch({
      type: 'users/searchExpand',
      payload: {
        expand: !users.searchExpand,
      },
    });
  };

  const tableChangeHandler = (pagination: any, filters: any, sorter: any) => {
    const queryString = helper.sorter_build(sorter);

    if (queryString) {
      message.success(queryString);
    }
  };

  const batchToolBar = () => {
    const hasSelected = selectedKeys.length > 0;
    return (
      <div style={{ display: hasSelected ? 'block' : 'none' }}>
        <Space>
          <Button type="dashed">Selected: {selectedKeys.length}</Button>
          <Button
            type="primary"
            shape="circle"
            icon={<DeleteOutlined />}
            onClick={batchDeleteHandler}
            danger
          />
        </Space>
      </div>
    );
  };

  const tableToolBar = () => {
    return (
      <Space>
        <Button
          type={users.searchExpand ? 'primary' : 'dashed'}
          icon={<SearchOutlined />}
          onClick={searchExpandHandler}
        />
        <Button type="primary">
          <PlusOutlined />
          Add
        </Button>
      </Space>
    );
  };

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedKeys,
    onChange: onSelectChange,
  };

  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12} className={styles.toolBarLeft}>
          {batchToolBar()}
        </Col>
        <Col xs={24} sm={12} className={styles.toolBarRight}>
          {tableToolBar()}
        </Col>
      </Row>
    );
  };

  const pageChangeHandler = (page: number, pageSize?: number) => {
    message.success(`&page=${page}&per_page=${pageSize}`);
  };

  const pageSizeHandler = (current: number, size: number) => {
    message.success(`&page=${current}&per_page=${size}`);
  };

  const paginationLayout = () => {
    return (
      <Pagination
        total={85}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        onChange={pageChangeHandler}
        onShowSizeChange={pageSizeHandler}
        current={1}
        pageSize={1}
      />
    );
  };

  const afterTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12} className={styles.toolBarLeft}>
          {batchToolBar()}
        </Col>
        <Col xs={24} sm={12} className={styles.toolBarRight}>
          {paginationLayout()}
        </Col>
      </Row>
    );
  };

  useEffect(() => {
    setSearchFormInitialValues({
      name: 'zhang',
      create_time: [moment('2020/05/11 14:22:30'), moment('2020/05/18 14:22:30')],
      projects: [2],
    });
  }, [1]);

  const searchFormReset = () => {
    setSearchFormInitialValues({});
    searchForm.resetFields();
  };

  const searchFormHandler = (values: any) => {
    message.success(JSON.stringify(values));
  };

  const searchLayout = () => {
    return (
      <Card
        bordered={false}
        className={styles.searchCard}
        title="Search"
        style={{ display: users.searchExpand ? 'block' : 'none' }}
      >
        <Form
          layout="inline"
          form={searchForm}
          initialValues={searchFormInitialValues}
          onFinish={searchFormHandler}
        >
          <Form.Item name="id" label="ID">
            <InputNumber />
          </Form.Item>
          {users.layout.tableColumn.map((column: any) => {
            switch (column.type) {
              case 'datetime':
                return (
                  <Form.Item name={column.key} label={column.title}>
                    <RangePicker
                      ranges={{
                        Today: [moment(), moment()],
                        'Last 7 Days': [moment().subtract(7, 'd'), moment()],
                        'Last 30 Days': [moment().subtract(30, 'days'), moment()],
                        'Last Month': [
                          moment().subtract(1, 'months').startOf('month'),
                          moment().subtract(1, 'months').endOf('month'),
                        ],
                      }}
                      showTime
                      format="YYYY/MM/DD HH:mm:ss"
                    />
                  </Form.Item>
                );
              case 'tag':
                return (
                  <Form.Item name={column.key} label={column.title}>
                    <Select mode="multiple" placeholder="Please select" style={{ width: '100px' }}>
                      {column.values.map((item: any, key: number) => (
                        <Select.Option value={key}>{item}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              case 'action':
                return null;
              default:
                return (
                  <Form.Item name={column.key} label={column.title}>
                    <Input />
                  </Form.Item>
                );
            }
          })}

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
          <Form.Item>
            <Button htmlType="button" onClick={searchFormReset}>
              Clear Search
            </Button>
          </Form.Item>
        </Form>
      </Card>
    );
  };

  return (
    <>
      <PageHeaderWrapper>
        <Space direction="vertical" style={{ width: '100%' }}>
          {searchLayout()}
          <Card>
            {beforeTableLayout()}
            <Table
              columns={columns}
              pagination={false}
              rowKey="id"
              dataSource={users.data.dataSource}
              rowSelection={rowSelection}
              onChange={tableChangeHandler}
            />
            {afterTableLayout()}
          </Card>
        </Space>
      </PageHeaderWrapper>
    </>
  );
};

const mapStateToProps = ({ users }: { users: UserModelState }) => {
  return {
    users,
  };
};

export default connect(mapStateToProps)(BasicList);
