import { useState, useEffect } from 'react';
import {
  Table,
  Row,
  Col,
  Card,
  Pagination,
  Space,
  Modal as AntdModal,
  message,
  Tooltip,
  Button,
  Form,
  InputNumber,
} from 'antd';
import { useRequest, useIntl, history, useLocation, useModel } from 'umi';
import { useToggle, useUpdateEffect, useThrottleFn } from 'ahooks';
import { stringify } from 'query-string';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import QueueAnim from 'rc-queue-anim';
import { ExclamationCircleOutlined, SearchOutlined, SyncOutlined } from '@ant-design/icons';
import ColumnBuilder from './builder/ColumnBuilder';
import ActionBuilder from './builder/ActionBuilder';
import SearchBuilder from './builder/SearchBuilder';
import Modal from './component/Modal';
import { submitFieldsAdaptor } from './helper';
import styles from './index.less';

const Index = () => {
  const [pageQuery, setPageQuery] = useState('');
  const [sortQuery, setSortQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState<string | true>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalUri, setModalUri] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchVisible, searchAction] = useToggle(false);
  const { confirm } = AntdModal;
  const lang = useIntl();
  const [searchForm] = Form.useForm();
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');

  const init = useRequest<{ data: BasicListApi.ListData }>(
    (option: any) => {
      const url = `${location.pathname.replace('/basic-list', '')}`;
      if (option === true) {
        return {
          url,
        };
      }
      return {
        url: `${url}?${searchQuery}${pageQuery}${sortQuery}`,
      };
    },
    {
      onSuccess: () => {
        setSelectedRowKeys([]);
        setSelectedRows([]);
      },
    },
  );
  const throttleReload = useThrottleFn(init.run, { wait: 1000 });
  const request = useRequest(
    (values: any) => {
      message.loading({
        content: lang.formatMessage({
          id: 'basic-list.processing',
        }),
        key: 'process',
        duration: 0,
        className: 'process-message',
      });
      const { uri, method, ...formValues } = values;
      return {
        url: `${uri}`,
        method,
        data: {
          ...formValues,
        },
      };
    },
    {
      manual: true,
      onSuccess: (res: BasicListApi.Root) => {
        message.success({
          content: res?.message,
          key: 'process',
          className: 'process-message',
        });
        init.run();
        if (res.call && res.call.length > 0) {
          res.call.forEach((callName) => {
            actionHandler({ call: callName });
          });
        }
      },
      formatResult: (res: any) => {
        return res;
      },
      throttleInterval: 1000,
    },
  );

  useUpdateEffect(() => {
    init.run();
  }, [pageQuery, sortQuery, searchQuery]);

  useUpdateEffect(() => {
    init.run(true);
  }, [location.pathname]);

  useEffect(() => {
    if (modalUri) {
      setModalVisible(true);
    }
  }, [modalUri]);

  const reFetchMenu = async () => {
    setInitialState({
      ...initialState,
      settings: {
        menu: {
          loading: true,
        },
      },
    });

    const userMenu = await initialState?.fetchMenu?.();
    if (userMenu) {
      setInitialState({
        ...initialState,
        currentMenu: userMenu,
      });
    }
  };

  function actionHandler(action: Partial<BasicListApi.Action>, record?: BasicListApi.Field) {
    switch (action.call) {
      case 'modal':
        setModalUri(
          (action.uri || '').replace(/:\w+/g, (field) => {
            return record![field.replace(':', '')];
          }),
        );
        break;
      case 'page': {
        const uri = (action.uri || '').replace(/:\w+/g, (field) => {
          return record![field.replace(':', '')];
        });
        history.push(`/basic-list${uri}`);
        break;
      }
      case 'i18n': {
        history.push(
          `${location.pathname.replace('/basic-list', '/basic-list/translate')}/${record!.id}`,
        );
        break;
      }
      case 'reload':
        init.run();
        break;
      case 'delete':
      case 'deletePermanently':
      case 'restore': {
        const operationName = lang.formatMessage({
          id: `basic-list.list.actionHandler.operation.${action.call}`,
        });
        confirm({
          title: lang.formatMessage(
            {
              id: 'basic-list.list.actionHandler.confirmTitle',
            },
            {
              operationName,
            },
          ),
          icon: <ExclamationCircleOutlined />,
          content: batchOverview(Object.keys(record!).length ? [record!] : selectedRows),
          okText: lang.formatMessage(
            {
              id: 'basic-list.list.actionHandler.okButtonText',
            },
            {
              operationName,
            },
          ),
          okType: 'danger',
          cancelText: lang.formatMessage({
            id: 'basic-list.list.actionHandler.cancelButtonText',
          }),
          onOk() {
            return request.run({
              uri: action.uri,
              method: action.method,
              type: action.call,
              ids: Object.keys(record!).length ? [record!.id] : selectedRowKeys,
            });
          },
          onCancel() {},
          className: 'batch-confirm-modal',
        });
        break;
      }
      case 'fetchMenu':
        reFetchMenu();
        break;
      default:
        break;
    }
  }

  function batchOverview(dataSource: BasicListApi.Field[]) {
    const tableColumns = ColumnBuilder(init?.data?.layout?.tableColumn, actionHandler);
    return (
      <Table
        size="small"
        rowKey="id"
        columns={[tableColumns[0] || {}, tableColumns[1] || {}]}
        dataSource={dataSource}
        pagination={false}
        className="batch-overview-table"
      />
    );
  }
  const paginationChangeHandler = (page: any, per_page: any) => {
    setPageQuery(`&page=${page}&per_page=${per_page}`);
  };
  const tableChangeHandler = (_: any, __: any, sorter: any) => {
    if (sorter.order === undefined) {
      setSortQuery('');
    } else {
      const orderBy = sorter.order === 'ascend' ? 'asc' : 'desc';
      setSortQuery(`&sort=${sorter.field}&order=${orderBy}`);
    }
  };
  const hideModal = (reload = false) => {
    setModalVisible(false);
    setModalUri('');
    if (reload) {
      init.run();
    }
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (_selectedRowKeys: any, _selectedRows: any) => {
      setSelectedRowKeys(_selectedRowKeys);
      setSelectedRows(_selectedRows);
    },
  };

  const onFinish = (value: any) => {
    const searchString = stringify(submitFieldsAdaptor(value), {
      arrayFormat: 'comma',
      skipEmptyString: true,
      skipNull: true,
    });
    setSearchQuery(searchString && `&${searchString}`);
  };

  const searchLayout = () => {
    return (
      <QueueAnim type="top">
        {searchVisible && (
          <div key="searchForm" className="search-layout">
            <Card className={styles.searchForm} key="searchForm">
              <Form onFinish={onFinish} form={searchForm}>
                <Row gutter={24}>
                  <Col sm={6}>
                    <Form.Item label="ID" name="id" key="id">
                      <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  {SearchBuilder(init.data?.layout.tableColumn)}
                </Row>
                <Row>
                  <Col sm={24} className={styles.textAlignRight}>
                    <Space>
                      <Button type="primary" htmlType="submit" className="submit-btn">
                        {lang.formatMessage({
                          id: 'basic-list.list.search.submitButtonText',
                        })}
                      </Button>
                      <Button
                        onClick={() => {
                          setSearchQuery('');
                          searchForm.resetFields();
                          setSelectedRowKeys([]);
                          setSelectedRows([]);
                        }}
                        className="clear-btn"
                      >
                        {lang.formatMessage({
                          id: 'basic-list.list.search.clearButtonText',
                        })}
                      </Button>
                    </Space>
                  </Col>
                </Row>
              </Form>
            </Card>
          </div>
        )}
      </QueueAnim>
    );
  };
  const beforeTableLayout = () => {
    return (
      <Row className="before-table-layout">
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          <Space>
            {ActionBuilder(init?.data?.layout?.tableToolBar, actionHandler)}
            <Tooltip
              title={lang.formatMessage({
                id: `basic-list.list.search.toggleSearch`,
              })}
            >
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                onClick={() => {
                  searchAction.toggle();
                }}
                type={searchVisible ? 'primary' : 'default'}
                className="search-btn"
              />
            </Tooltip>
            <Tooltip title={lang.formatMessage({ id: 'basic-list.reload' })}>
              <Button
                shape="circle"
                icon={<SyncOutlined />}
                onClick={() => {
                  throttleReload.run();
                }}
                loading={init.loading}
              />
            </Tooltip>
          </Space>
        </Col>
      </Row>
    );
  };
  const afterTableLayout = () => {
    return (
      <Row className="after-table-layout">
        <Col xs={24} sm={12}>
          ...
        </Col>
        <Col xs={24} sm={12} className={styles.tableToolbar}>
          {!!init?.data?.meta?.total && (
            <Pagination
              total={init?.data?.meta?.total || 0}
              current={init?.data?.meta?.page || 1}
              pageSize={init?.data?.meta?.per_page || 10}
              showSizeChanger
              showQuickJumper
              showTotal={(total) =>
                `${lang.formatMessage({
                  id: `basic-list.list.pagination.total`,
                })}: ${total}`
              }
              onChange={paginationChangeHandler}
              onShowSizeChange={paginationChangeHandler}
            />
          )}
        </Col>
      </Row>
    );
  };
  const batchToolbar = () => {
    return (
      selectedRowKeys.length > 0 && (
        <Space>{ActionBuilder(init?.data?.layout?.batchToolBar, actionHandler)}</Space>
      )
    );
  };

  return (
    <PageContainer
      header={{
        title: init.data?.page?.title,
      }}
      className="basic-list"
    >
      {searchLayout()}
      <Card>
        {beforeTableLayout()}
        <Table
          rowKey="id"
          dataSource={init?.data?.dataSource}
          columns={ColumnBuilder(init?.data?.layout?.tableColumn, actionHandler)}
          pagination={false}
          loading={init?.loading}
          onChange={tableChangeHandler}
          rowSelection={rowSelection}
          className="basic-list-table"
        />
        {afterTableLayout()}
      </Card>
      <Modal modalVisible={modalVisible} hideModal={hideModal} modalUri={modalUri} />
      <FooterToolbar extra={batchToolbar()} className="batch-toolbar" />
    </PageContainer>
  );
};

export default Index;
