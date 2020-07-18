import React, { useEffect, useState, FC } from 'react';
import { useRequest, request } from 'umi';
import { ColumnsType } from 'antd/es/table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { SearchOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
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
  Popconfirm,
} from 'antd';
import { join } from 'lodash';
import { ModalForm } from './ModalForm';
import { DataState, SingleColumnType } from './data.d';
import * as helper from './helper';
import styles from './style.less';

interface basicListProps {}

const BasicList: FC<basicListProps> = () => {
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchExpand, setSearchExpand] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formUri, setFormUri] = useState<string>();
  const [formUriMethod, setFormUriMethod] = useState<string>();
  const [listData, setListData] = useState<DataState>();
  const [paginationQuery, setPaginationQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('&sort=id&order=desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchForm] = Form.useForm();
  const { confirm } = Modal;
  const { RangePicker } = DatePicker;

  const { data, loading, run } = useRequest((requestQuery) => {
    const queryString = requestQuery || '';
    return {
      url: `http://www.test.com/backend/admins?${queryString}`,
    };
  });

  useEffect(() => {
    setListData(data);
  }, [data]);

  const reloadHandler = () => {
    run(`${searchQuery}${sortQuery}${paginationQuery}`);
  };

  const showModal = (uri: string, method: string, id?: number) => {
    // console.log(`${uri}/${id}`);
    setFormUriMethod(method);
    if (id) {
      setFormUri(`${uri}/${id}`);
    } else {
      setFormUri(`${uri}`);
    }

    setModalVisible(true);
  };

  /**
   *
   * @param type action type: modal / delete etc...
   * @param uri handle uri
   * @param method http method of uri
   * @param record current record
   */
  const actionHandler = (type: string, uri: string, method: string, record?: any) => {
    switch (type) {
      case 'modal':
        if (record) {
          showModal(uri, method, record.id);
        } else {
          showModal(uri, method);
        }
        break;
      case 'reload':
        reloadHandler();
        break;
      case 'delete':
        request(`${uri}/${record.id}`, {
          method,
          data: record,
        })
          .then((response) => {
            message.success(response.message);
            reloadHandler();
          })
          .catch(() => {});
        break;

      default:
        break;
    }
  };

  const columns: ColumnsType<SingleColumnType> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
      fixed: 'left',
    },
  ];
  // Build Column
  if (listData?.layout) {
    listData.layout.tableColumn.forEach((column: any) => {
      const thisColumn = column;
      // tag
      if (thisColumn.type === 'tag') {
        thisColumn.render = (text: any) => {
          return (
            <Space>
              {thisColumn.values
                .filter((item: any, index: number) => index === text)
                .map((item: any) => {
                  return (
                    <Tag color={text === 0 ? 'red' : 'blue'} key={text}>
                      {item}
                    </Tag>
                  );
                })}
            </Space>
          );
        };
      }

      if (thisColumn.type === 'datetime') {
        thisColumn.render = (text: any) => {
          return moment(text).format('YYYY-MM-DD HH:mm:ss');
        };
      }

      // action
      if (thisColumn.type === 'actions') {
        thisColumn.render = (text: any, record: any) => {
          return (
            <Space>
              {thisColumn.actions.map((action: any) => {
                if (action.component === 'button') {
                  // Popconfirm
                  if (action.action === 'delete') {
                    return (
                      <Popconfirm
                        title={`${record[Object.keys(record)[1]]} - (ID:${record.id})`}
                        onConfirm={() => {
                          actionHandler(action.action, action.uri, action.method, record);
                        }}
                        okText="Delete"
                        okType="danger"
                        key={action.action}
                      >
                        <Button type={action.type}>{action.text}</Button>
                      </Popconfirm>
                    );
                  }

                  return (
                    <Button
                      type={action.type}
                      onClick={() => {
                        actionHandler(action.action, action.uri, action.method, record);
                      }}
                      key={action.action}
                    >
                      {action.text}
                    </Button>
                  );
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

  const tableChangeHandler = (pagination: any, filters: any, sorter: any) => {
    const sortQueryString = helper.sorter_build(sorter);

    if (sortQueryString) {
      run(`${searchQuery}${sortQueryString}`);
      setSortQuery(sortQueryString);
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
          type={searchExpand ? 'primary' : 'dashed'}
          icon={<SearchOutlined />}
          onClick={() => {
            setSearchExpand(!searchExpand);
          }}
        />
        {listData?.layout.tableToolBar.map((element: any) => {
          if (element.component === 'button') {
            return (
              <Button
                type={element.type}
                onClick={() => {
                  actionHandler(element.action, element.uri, element.method);
                }}
                key={element.action}
              >
                {element.text}
              </Button>
            );
          }
          return null;
        })}
        {/* <Button type="primary">
          <PlusOutlined />
          Add
        </Button> */}
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

  const paginationChangeHandler = (page: number, pageSize?: number) => {
    const pageQuery = `&page=${page}&per_page=${pageSize}`;
    run(`${searchQuery}${sortQuery}${pageQuery}`);
    setPaginationQuery(pageQuery);
  };

  const paginationLayout = () => {
    return (
      <Pagination
        total={listData?.meta.total}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        onChange={paginationChangeHandler}
        onShowSizeChange={paginationChangeHandler}
        current={listData?.meta.page}
        pageSize={listData ? listData.meta.per_page : 10}
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

  const searchFormClear = () => {
    searchForm.resetFields();
    searchForm.submit();
  };

  const searchFormHandler = async (values: any) => {
    let searchQueryString = '';

    Object.keys(values).forEach((key) => {
      const thisValue = values[key];
      const multiValueArray: string[] = [];
      if (thisValue) {
        if (typeof thisValue === 'object') {
          Object.keys(thisValue).forEach((innerKey) => {
            if (moment.isMoment(thisValue[innerKey])) {
              multiValueArray.push(thisValue[innerKey].utc().format());
            } else {
              multiValueArray.push(thisValue[innerKey]);
            }
          });

          searchQueryString = `${searchQueryString}&${key}=${encodeURIComponent(
            join(multiValueArray, ','),
          )}`;
        } else {
          searchQueryString = `${searchQueryString}&${key}=${encodeURIComponent(thisValue)}`;
        }
      }
    });
    run(`${searchQueryString}${sortQuery}`);
    setSearchQuery(searchQueryString);
  };

  const resetFormValues = () => {};

  const modalCancelHandler = () => {
    setFormUri('');
    resetFormValues();
    setModalVisible(false);
  };

  const preFinishHandler = (uri: string, method: string) => {
    setFormUri(uri);
    setFormUriMethod(method);
  };

  const searchLayout = () => {
    return (
      <Card
        bordered={false}
        className={styles.searchCard}
        title={false}
        style={{ display: searchExpand ? 'block' : 'none' }}
      >
        <Form
          layout="inline"
          form={searchForm}
          // initialValues={searchFormInitialValues}
          onFinish={searchFormHandler}
        >
          <Form.Item name="id" label="ID">
            <InputNumber />
          </Form.Item>
          {listData?.layout.tableColumn.map((column: any) => {
            switch (column.type) {
              case 'datetime':
                return (
                  <Form.Item name={column.key} label={column.title} key={column.key}>
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
                      format="YYYY-MM-DD HH:mm:ss"
                    />
                  </Form.Item>
                );
              case 'tag':
                return (
                  <Form.Item name={column.key} label={column.title} key={column.key}>
                    <Select mode="multiple" placeholder="Please select" style={{ width: '100px' }}>
                      {column.values.map((item: any, key: number) => (
                        <Select.Option value={key} key={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                );
              case 'actions':
                return null;
              default:
                return (
                  <Form.Item name={column.key} label={column.title} key={column.key}>
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
            <Button htmlType="button" onClick={searchFormClear}>
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
              dataSource={listData && listData.dataSource}
              rowSelection={rowSelection}
              onChange={tableChangeHandler}
              loading={loading}
            />
            {afterTableLayout()}
          </Card>
        </Space>
        <Modal
          visible={modalVisible}
          onCancel={modalCancelHandler}
          footer={null}
          maskClosable={false}
          title={false}
        >
          <ModalForm
            formUri={formUri}
            formUriMethod={formUriMethod}
            cancelHandler={modalCancelHandler}
            preFinish={preFinishHandler}
            reloadHandler={reloadHandler}
          />
        </Modal>
      </PageHeaderWrapper>
    </>
  );
};

export default BasicList;
