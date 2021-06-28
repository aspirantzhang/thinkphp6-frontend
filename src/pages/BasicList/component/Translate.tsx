import { useEffect, useState } from 'react';
import { Form, message, Row, Col, Card, Space, Button, Checkbox, Spin } from 'antd';
import { useRequest, useLocation, history, useIntl } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { DoubleLeftOutlined } from '@ant-design/icons';
import moment from 'moment';
import FormBuilder from '../builder/FormBuilder';
import FlagIcon from '../builder/FlagIcon';
import { setFieldsAdaptor } from '../helper';
import styles from '../index.less';

const Translate = () => {
  const [form] = Form.useForm();
  const lang = useIntl();
  const location = useLocation();
  const [submitLoading, setSubmitLoading] = useState(false);

  const init = useRequest(`${location.pathname.replace('/basic-list/translate', '')}/i18n`, {
    onError: () => {
      history.goBack();
    },
  });
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
        url: `${location.pathname.replace('/basic-list/translate', '')}/i18n`,
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
      onError: () => {
        setSubmitLoading(false);
      },
      formatResult: (res: any) => {
        return res;
      },
      throttleInterval: 1000,
    },
  );

  useEffect(() => {
    if (init.data) {
      form.setFieldsValue(setFieldsAdaptor(init.data.layout, init.data.dataSource, true));
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
      header={{
        title: init.data?.page?.title,
        breadcrumb: {},
      }}
    >
      {init?.loading ? (
        <Spin className={styles.formSpin} tip="Loading..." />
      ) : (
        <Form {...layoutAttr[init.data?.layout.length - 2]} form={form} onFinish={onFinish}>
          <Row gutter={16}>
            {(init.data?.layout || []).map((langForm: any) => {
              return (
                <Col {...colAttr[init.data.layout.length - 2]}>
                  <Card
                    type="inner"
                    title={
                      <FlagIcon
                        code={langForm.name.substr(langForm.name.indexOf('-') + 1)}
                        size="2x"
                      />
                    }
                    extra={
                      init.data.dataSource[langForm.name]?.translate_time
                        ? moment(init.data.dataSource[langForm.name].translate_time).format(
                            'YYYY-MM-DD HH:mm:ss',
                          )
                        : 'Not Exist'
                    }
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
      )}

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
                loading={submitLoading}
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
