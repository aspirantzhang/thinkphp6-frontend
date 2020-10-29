import React, { useEffect, useState, FC } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { useRequest, request, history, useRouteMatch } from 'umi';
import { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import { Store } from 'rc-field-form/lib/interface';
import moment from 'moment';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  InputNumber,
  Space,
  Pagination,
  Table,
  message,
  Modal,
  Alert,
} from 'antd';
import { join } from 'lodash';
import { ColumnBuilder, buildElements, SearchBuilder } from '@/components/List';
import { ModalForm } from './ModalForm';
import * as helper from './helper';
import styles from './style.less';

interface BasicListProps {}

const BasicList: FC<BasicListProps> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedRowData, setSelectedRowData] = useState<ListAPI.Record[]>([]);
  const [searchExpand, setSearchExpand] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formInitUri, setFormInitUri] = useState('');
  const [mainData, setMainData] = useState<ListAPI.Data | undefined>(undefined);
  const [paginationQuery, setPaginationQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('&sort=id&order=desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchForm] = Form.useForm();
  const { confirm } = Modal;
  const match = useRouteMatch<API.UriMatchState>();

  const { fullUri } = helper.buildUriMatch(match);
  const initUri = fullUri as string;

  const { data, loading, run } = useRequest(
    (requestQuery?) => ({
      url: `/api/${initUri}?${requestQuery || ''}`,
    }),
    {
      manual: true,
      throttleInterval: 1000,
    },
  );

  useEffect(() => {
    run();
  }, [initUri]);

  useEffect(() => {
    setMainData(data);
  }, [data]);

  const reloadHandler = () => {
    run(`${searchQuery}${sortQuery}${paginationQuery}`);
  };

  const showModal = (uri: string, id?: number) => {
    setFormInitUri(`${uri}${id ? '/' + id : ''}`);
    setModalVisible(true);
  };

  const buildBatchOverview = (dataSource: ListAPI.Record[], action: string) => {
    const batchOverviewColumns: ColumnsType<ListAPI.Record> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
    ];

    if (mainData?.layout?.tableColumn[0]) {
      batchOverviewColumns.push({
        title: mainData.layout.tableColumn[0].title || '',
        dataIndex: mainData.layout.tableColumn[0].dataIndex || undefined,
        key: mainData.layout.tableColumn[0].key || undefined,
      });
    }

    return (
      <>
        {(action === 'delete' || action === 'deletePermanently') && (
          <Alert
            message="The operation will delete all child records when a parent record is deleted."
            type="warning"
            showIcon
          />
        )}

        <Table
          className={styles.batchOverviewTable}
          dataSource={dataSource}
          columns={batchOverviewColumns}
          pagination={false}
          bordered
          rowKey="id"
          size="small"
        />
      </>
    );
  };

  const actionHandler: API.ActionHandler = (actions, record?) => {
    const { action, method, uri } = actions;
    switch (action) {
      case 'modal':
        if (record) {
          showModal(uri, record.id);
        } else {
          showModal(uri);
        }
        break;
      case 'page':
        history.push(`/basic-list${uri}${record?.id ? '/' + record.id : ''}`);
        break;
      case 'modelDesign':
        if (record) {
          history.push(`/basic-list${uri}/${record.id}`);
        }
        break;
      case 'reload':
        reloadHandler();
        break;
      case 'delete':
      case 'deletePermanently':
      case 'restore':
        confirm({
          title: `Overview of ${actions.text} Operation`,
          icon: <ExclamationCircleOutlined />,
          content: buildBatchOverview(record?.id ? [record] : selectedRowData, action),
          okText: `Sure to ${actions.text} !!!`,
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            const processingHide = message.loading('Processing...');
            request(`/api/${uri}`, {
              method,
              data: {
                ids: record?.id ? [record.id] : selectedRowKeys,
                type: action,
              },
            })
              .then((response) => {
                message.success(response.message);
                reloadHandler();
                processingHide();
                setSelectedRowData([]);
                setSelectedRowKeys([]);
              })
              .catch(() => {
                processingHide();
              });
          },
          onCancel() {
            message.warning(`${actions.text} Operation Cancelled.`);
          },
        });
        break;

      default:
        break;
    }
  };

  const tableChangeHandler = (_: any, __: any, sorter: any) => {
    const sortQueryString = helper.buildSorter(sorter);
    if (sortQueryString) {
      run(`${searchQuery}${sortQueryString}`);
      setSortQuery(sortQueryString);
    }
  };

  const batchToolBar = () => {
    if (selectedRowKeys.length > 0) {
      return (
        <FooterToolbar
          extra={
            <>
              <Space>
                {mainData?.layout?.batchToolBar &&
                  buildElements(mainData.layout.batchToolBar, actionHandler)}
                &nbsp;&nbsp;&nbsp;
              </Space>
              Selected&nbsp;<a style={{ fontWeight: 700 }}>{selectedRowKeys.length}</a> Items
            </>
          }
        />
      );
    }
    return null;
  };

  const tableToolBar = () => {
    if (mainData?.layout?.tableToolBar) {
      return (
        <Space>
          <Button
            type={searchExpand ? 'primary' : 'dashed'}
            icon={<SearchOutlined />}
            onClick={() => {
              setSearchExpand(!searchExpand);
            }}
            id="searchExpandButton"
          />
          {buildElements(mainData.layout.tableToolBar, actionHandler)}
        </Space>
      );
    }
    return null;
  };

  const onSelectChange = (rowKeys: React.Key[], selectedRows: ListAPI.Record[]) => {
    setSelectedRowKeys(rowKeys);
    setSelectedRowData(selectedRows);
  };

  const tableRowSelection: TableRowSelection<ListAPI.Record> = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const searchFormClear = () => {
    searchForm.resetFields();
    searchForm.submit();
  };

  const searchFormHandler = (values: Store) => {
    let searchQueryString = '';

    Object.keys(values).forEach((key) => {
      const searchItem = values[key];

      if (searchItem) {
        // object(array) or string
        if (typeof searchItem === 'object') {
          const multiValueArray: string[] = [];
          Object.keys(searchItem).forEach((searchItemKey) => {
            if (moment.isMoment(searchItem[searchItemKey])) {
              multiValueArray.push(searchItem[searchItemKey].utc().format());
            } else {
              multiValueArray.push(searchItem[searchItemKey]);
            }
          });

          searchQueryString = `${searchQueryString}&${key}=${encodeURIComponent(
            join(multiValueArray, ','),
          )}`;
        } else {
          searchQueryString = `${searchQueryString}&${key}=${encodeURIComponent(searchItem)}`;
        }
      }
    });
    run(`${searchQueryString}${sortQuery}`);
    setSearchQuery(searchQueryString);
    setSelectedRowData([]);
    setSelectedRowKeys([]);
  };

  const modalCancelHandler = () => {
    setFormInitUri('');
    setModalVisible(false);
  };

  const searchLayout = () => {
    if (mainData?.layout?.tableColumn) {
      return (
        <Card
          bordered={false}
          className={styles.searchCard}
          title={false}
          style={{ display: searchExpand ? 'block' : 'none' }}
        >
          <Form layout="inline" form={searchForm} onFinish={searchFormHandler}>
            <Form.Item name="id" label="ID">
              <InputNumber />
            </Form.Item>
            {SearchBuilder(mainData.layout.tableColumn)}
            <Form.Item>
              <Button type="primary" htmlType="submit" id="searchSubmit">
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
    }
    return null;
  };

  const paginationChangeHandler = (page: number, pageSize?: number) => {
    const pageQuery = `&page=${page}&per_page=${pageSize}`;
    run(`${searchQuery}${sortQuery}${pageQuery}`);
    setPaginationQuery(pageQuery);
  };

  const paginationLayout = () => {
    return (
      <Pagination
        total={mainData?.meta?.total || 0}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        onChange={paginationChangeHandler}
        onShowSizeChange={paginationChangeHandler}
        current={mainData?.meta?.page || 1}
        pageSize={mainData?.meta?.per_page || 10}
      />
    );
  };

  const beforeTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12} className={styles.toolBarLeft}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.toolBarRight}>
          {tableToolBar()}
        </Col>
      </Row>
    );
  };

  const afterTableLayout = () => {
    return (
      <Row>
        <Col xs={24} sm={12} className={styles.toolBarLeft}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.toolBarRight}>
          {paginationLayout()}
        </Col>
      </Row>
    );
  };

  const columns = mainData?.layout?.tableColumn
    ? ColumnBuilder(mainData?.layout?.tableColumn, actionHandler)
    : [];

  return (
    <>
      <PageContainer>
        <Space direction="vertical" style={{ width: '100%' }}>
          {searchLayout()}
          <Card>
            {beforeTableLayout()}
            <Table<ListAPI.Record>
              columns={columns as ColumnsType<ListAPI.Record>}
              pagination={false}
              rowKey="id"
              dataSource={mainData?.dataSource}
              rowSelection={tableRowSelection}
              onChange={tableChangeHandler}
              loading={loading}
            />
            {afterTableLayout()}
          </Card>
        </Space>
        {batchToolBar()}
        <Modal
          visible={modalVisible}
          onCancel={modalCancelHandler}
          footer={null}
          maskClosable={false}
          title={false}
        >
          <ModalForm
            initUri={formInitUri}
            cancelHandler={modalCancelHandler}
            reloadHandler={reloadHandler}
          />
        </Modal>
      </PageContainer>
    </>
  );
};

export default BasicList;
