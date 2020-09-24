import React, { useEffect, useState, FC } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { useRequest, request, history } from 'umi';
import { ColumnsType } from 'antd/es/table';
import { getPageParam } from '@/utils/utils';
import moment from 'moment';
import { SearchOutlined, ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
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
} from 'antd';
import { join } from 'lodash';
import { buildColumns, buildElements, buildSearchFields } from '@/components/List';
import { ModalForm } from './ModalForm';
import { DataState, SingleColumnType } from './data';
import * as helper from './helper';
import styles from './style.less';

interface BasicListProps {}

const BasicList: FC<BasicListProps> = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState([]);
  const [searchExpand, setSearchExpand] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formInitUri, setFormInitUri] = useState('');
  const [mainData, setMainData] = useState<DataState | undefined>(undefined);
  const [paginationQuery, setPaginationQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('&sort=id&order=desc');
  const [searchQuery, setSearchQuery] = useState('');

  const [searchForm] = Form.useForm();
  const { confirm } = Modal;

  const pageParam = getPageParam();
  const initUri = `/api/${pageParam}`;

  const { data, loading, run } = useRequest(
    (requestQuery?) => {
      const queryString = requestQuery || '';
      return {
        url: `${initUri}?${queryString}`,
      };
    },
    {
      manual: true,
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
    if (id) {
      setFormInitUri(`${uri}/${id}`);
    } else {
      setFormInitUri(`${uri}`);
    }
    setModalVisible(true);
  };

  const buildBatchOverview = () => {
    const batchOverviewColumns: ColumnsType<SingleColumnType> = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: mainData?.layout.tableColumn[0].title,
        dataIndex: mainData?.layout.tableColumn[0].dataIndex,
        key: mainData?.layout.tableColumn[0].key,
      },
    ];

    return (
      <Table
        className={styles.batchOverviewTable}
        dataSource={selectedRowData}
        columns={batchOverviewColumns}
        pagination={false}
        bordered
        size="small"
      />
    );
  };

  /**
   * Action Handler
   * @param type action type: modal / delete etc...
   * @param uri handle uri
   * @param method http method of uri
   * @param record current record
   */
  const actionHandler = (type: string, uri: string, method: string, record?: any) => {
    switch (type) {
      case 'modal':
        if (record) {
          showModal(uri, record.id);
        } else {
          showModal(uri);
        }
        break;
      case 'page':
        if (record) {
          history.push(`/search-list/page?uri=${uri}/${record.id}`);
        } else {
          history.push(`/search-list/page?uri=${uri}`);
        }
        break;
      case 'reload':
        reloadHandler();
        break;
      case 'delete':
        request(`/api/${uri}/${record.id}`, {
          method,
          data: record,
        })
          .then((response) => {
            message.success(response.message);
            reloadHandler();
          })
          .catch(() => {});
        break;
      case 'batchDelete':
        confirm({
          title: `Overview of Batch ${record.text} Operation`,
          icon: <ExclamationCircleOutlined />,
          content: buildBatchOverview(),
          okText: `Sure to ${record.text} !!!`,
          okType: 'danger',
          cancelText: 'Cancel',
          onOk() {
            const processingHide = message.loading('Processing...');
            request(`/api/${uri}`, {
              method,
              data: {
                idArray: selectedRowKeys,
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
            message.warning(`${record.text} Operation Cancelled.`);
          },
        });
        break;

      default:
        break;
    }
  };

  const tableChangeHandler = (pagination: any, filters: any, sorter: any) => {
    const sortQueryString = helper.buildSorter(sorter);

    if (sortQueryString) {
      run(`${searchQuery}${sortQueryString}`);
      setSortQuery(sortQueryString);
    }
  };

  const batchToolBar = () => {
    const hasSelected = selectedRowKeys.length > 0;
    if (hasSelected) {
      return (
        <FooterToolbar
          extra={
            <>
              <Space>
                {mainData?.layout && buildElements(mainData.layout.batchToolBar, actionHandler)}
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
    return (
      <Space>
        <Button
          type={searchExpand ? 'primary' : 'dashed'}
          icon={<SearchOutlined />}
          onClick={() => {
            setSearchExpand(!searchExpand);
          }}
        />
        <Button
          type={
            window.location.pathname.split('/').pop().indexOf('trash') === -1 ? 'dashed' : 'danger'
          }
          icon={<DeleteOutlined />}
          onClick={() => {
            const currentUri = window.location.pathname.split('/');
            const uriLast = currentUri.pop();
            if (uriLast?.indexOf('trash') === -1) {
              history.push(`${window.location.pathname}/trash`);
            } else {
              history.push(currentUri.join('/'));
            }
          }}
        />
        {mainData?.layout && buildElements(mainData.layout.tableToolBar, actionHandler)}
      </Space>
    );
  };

  const onSelectChange = (rowKeys: any, selectedRows: any) => {
    setSelectedRowKeys(rowKeys);
    setSelectedRowData(selectedRows);
  };

  const tableRowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
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

  const modalCancelHandler = () => {
    setFormInitUri('');
    setModalVisible(false);
  };

  const searchLayout = () => {
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
          {mainData?.layout && buildSearchFields(mainData.layout.tableColumn)}
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

  const paginationChangeHandler = (page: number, pageSize?: number) => {
    const pageQuery = `&page=${page}&per_page=${pageSize}`;
    run(`${searchQuery}${sortQuery}${pageQuery}`);
    setPaginationQuery(pageQuery);
  };

  const paginationLayout = () => {
    return (
      <Pagination
        total={mainData?.meta.total}
        showSizeChanger
        showQuickJumper
        showTotal={(total) => `Total ${total} items`}
        onChange={paginationChangeHandler}
        onShowSizeChange={paginationChangeHandler}
        current={mainData?.meta.page}
        pageSize={mainData ? mainData.meta.per_page : 10}
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

  const columns = mainData?.layout ? buildColumns(mainData, actionHandler) : [];

  return (
    <>
      <PageContainer>
        <Space direction="vertical" style={{ width: '100%' }}>
          {searchLayout()}
          <Card>
            {beforeTableLayout()}
            <Table
              columns={columns}
              pagination={false}
              rowKey="id"
              dataSource={mainData && mainData.dataSource}
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
