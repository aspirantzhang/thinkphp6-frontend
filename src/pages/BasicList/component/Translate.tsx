import { useEffect } from 'react';
import {
  Form,
  Input,
  message,
  Tag,
  Spin,
  Row,
  Col,
  Tabs,
  Card,
  Space,
  Button,
  Checkbox,
} from 'antd';
import { useRequest, useLocation, history, useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { DoubleLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import FormBuilder from '../builder/FormBuilder';
import FlagIcon from '../builder/FlagIcon';
import ActionBuilder from '../builder/ActionBuilder';
import { setFieldsAdaptor, submitFieldsAdaptor } from '../helper';
import styles from '../index.less';

const Translate = () => {
  const [form] = Form.useForm();
  const lang = useIntl();
  const location = useLocation();
  // const { TabPane } = Tabs;

  // const location = useLocation();
  // const lang = useIntl();

  // const init = useRequest<{ data: BasicListApi.PageData }>(
  //   `${location.pathname.replace('/basic-list', '')}`,
  //   {
  //     onError: () => {
  //       history.goBack();
  //     },
  //   },
  // );
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
      return {
        url: `${location.pathname.replace('/basic-list/translate', '')}`,
        method: 'patch',
        data: values,
      };
    },
    {
      manual: true,
      onSuccess: (data) => {
        message.success({
          content: data.message,
          key: 'process',
          className: 'process-message',
        });
        history.goBack();
      },
      formatResult: (res: any) => {
        return res;
      },
      throttleInterval: 1000,
    },
  );

  const init = {
    data: {
      fields: [
        {
          name: 'zh-cn',
          translate_time: '2021-06-18T19:08:32+08:00',
          data: [
            {
              name: 'admin_name',
              title: '管理员用户名',
              type: 'input',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: true,
              mode: null,
            },
            {
              name: 'display_name',
              title: '显示名称',
              type: 'input',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
          ],
        },
        {
          name: 'en-us',
          translate_time: '2021-06-18T19:08:32+08:00',
          data: [
            {
              name: 'admin_name',
              title: 'Admin Name',
              type: 'input',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: true,
              mode: null,
            },
            {
              name: 'display_name',
              title: 'Display Name',
              type: 'input',
              data: [],
              hideInColumn: null,
              sorter: null,
              editDisabled: null,
              mode: null,
            },
          ],
        },
      ],
      dataSource: {
        'zh-cn': {
          admin_name: '张',
          display_name: '张',
        },
        'en-us': {
          admin_name: 'zhang',
          display_name: 'Zhang',
        },
      },
    },
  };

  init.data.fields[2] = {
    name: 'de-de',
    translate_time: '2021-06-19T19:08:32+08:00',
    data: [
      {
        name: 'admin_name',
        title: 'Admin Name',
        type: 'input',
        data: [],
        hideInColumn: null,
        sorter: null,
        editDisabled: true,
        mode: null,
      },
      {
        name: 'display_name',
        title: 'Display Name',
        type: 'input',
        data: [],
        hideInColumn: null,
        sorter: null,
        editDisabled: null,
        mode: null,
      },
    ],
  };

  useEffect(() => {
    if (init.data) {
      form.setFieldsValue(setFieldsAdaptor(init.data.fields, init.data.dataSource, true));
    }
  }, [init.data]);

  const layoutAttr = [
    {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 },
    },
    {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
  ];

  const colAttr = [
    { lg: 12, md: 24 },
    { lg: 8, md: 24 },
  ];

  const onFinish = (values: any) => {
    request.run(values);
  };

  return (
    <PageContainer
    // header={{
    //   title: init.data?.page?.title,
    //   breadcrumb: {},
    // }}
    >
      <Form {...layoutAttr[init.data.fields.length - 2]} form={form} onFinish={onFinish}>
        <Row gutter={16}>
          {(init.data.fields || []).map((langForm) => {
            return (
              <Col {...colAttr[init.data.fields.length - 2]}>
                <Card
                  type="inner"
                  title={
                    <FlagIcon
                      code={langForm.name.substr(langForm.name.indexOf('-') + 1)}
                      size="2x"
                    />
                  }
                  extra={moment(langForm.translate_time).format('YYYY-MM-DD HH:mm:ss')}
                  hoverable
                >
                  {FormBuilder(langForm.data, langForm.name)}
                  <Row>
                    <Col md={24} style={{ textAlign: 'center' }}>
                      <Form.Item
                        name={[langForm.name, 'complete']}
                        wrapperCol={{ span: 24 }}
                        valuePropName="checked"
                      >
                        <Checkbox>Mark as completed</Checkbox>
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Form>
      <FooterToolbar
        extra={
          <div style={{ textAlign: 'center' }}>
            <Space size={50}>
              <Button
                danger
                shape="round"
                onClick={() => {
                  history.goBack();
                }}
              >
                <DoubleLeftOutlined /> Back to List
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  form.submit();
                }}
                // loading={submitLoading}
              >
                Submit
              </Button>
            </Space>
          </div>
        }
      />
    </PageContainer>
  );
};

export default Translate;
