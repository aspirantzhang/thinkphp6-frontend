import React, { FC, useEffect, useState } from 'react';
import { Form, Input, Space, message, Tag, Spin } from 'antd';
import moment from 'moment';
import { request, useRequest } from 'umi';
import { useBoolean } from 'ahooks';
import { FieldBuilder, ActionBuilder, FinishPrepare, FieldPrepare } from '@/components/Form';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { getApiBase } from '@/utils/utils';
import styles from './style.less';

interface ModalFormProps {
  initUri: string;
  cancelHandler: () => void;
  reloadHandler: () => void;
}

export const ModalForm: FC<ModalFormProps> = (props) => {
  const { initUri, cancelHandler, reloadHandler } = props;
  const [mainData, setMainData] = useState<PageAPI.Data | undefined>(undefined);
  const [spinLoading, setSpinLoading] = useBoolean(true);
  const [form] = Form.useForm();

  const { loading, run } = useRequest(
    (url: string, method: string, requestData: API.Store) => ({
      url: getApiBase() + `/${url}`,
      method,
      data: requestData,
    }),
    {
      manual: true,
      throttleInterval: 1000,
      onSuccess: (response: PageAPI.Base) => {
        message.success({ content: response.message, key: 'submit' });
        cancelHandler();
        reloadHandler();
      },
      onError: (error: Error) => {
        message.destroy('submit');
        // message.error({ content: error.message, key: 'submit' });
      },
      formatResult: (response) => {
        return response;
      },
    },
  );

  useEffect(() => {
    let stopMark = false;

    async function fetchMainData(uri: string) {
      try {
        const rawData = await request(getApiBase() + `/${uri}`);
        setSpinLoading.setFalse();
        if (!stopMark) setMainData(rawData.data);
      } catch (error) {
        setSpinLoading.setFalse();
        cancelHandler();
      }
    }

    if (initUri) {
      setMainData(undefined);
      form.resetFields();
      setSpinLoading.setTrue();
      fetchMainData(initUri);
    }
    return () => {
      stopMark = true;
    };
  }, [initUri]);

  const actionHandler: API.ActionHandler = (actions) => {
    const { action, method, uri } = actions;
    switch (action) {
      case 'submit':
        form.setFieldsValue({ uri, method });
        form.submit();
        break;
      case 'cancel':
        cancelHandler();
        break;
      case 'reset':
        form.resetFields();
        break;
      default:
        break;
    }
  };

  const onFinish = async (values: API.Store) => {
    message.loading({ content: 'Processing...', key: 'submit' });
    const { submitValues, uri, method } = FinishPrepare(values);
    run(uri, method, submitValues);
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<API.Store>) => {
    message.error({ content: errorInfo?.errorFields[0]?.errors[0], key: 'submit' });
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  useEffect(() => {
    if (mainData?.layout && mainData.dataSource) {
      form.setFieldsValue(FieldPrepare(mainData));
    }
  }, [mainData]);

  return (
    <>
      <Spin
        spinning={spinLoading}
        tip="Loading, please wait..."
        className={styles.modalSpin}
        key="spin"
      />
      <div
        className={styles.titleRow}
        style={{ display: spinLoading ? 'none' : 'block' }}
        key="titleRow"
      >
        {mainData?.page.title} {mainData?.dataSource?.id && `ID: ${mainData?.dataSource?.id}`}
      </div>
      <div style={{ display: spinLoading ? 'none' : 'block' }} key="form">
        <Form
          {...layout}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            status: true,
            create_time: moment(),
          }}
        >
          {mainData?.layout?.tabs && FieldBuilder(mainData.layout.tabs[0].data)}

          <div className={styles.actionRow} key="actionRow">
            {mainData?.dataSource?.update_time && (
              <Tag className={styles.modalBottomTip} key="update_time">
                Update Time:&nbsp;
                {moment(mainData.dataSource.update_time, moment.ISO_8601).format(
                  'YYYY-MM-DD HH:mm:ss',
                )}
              </Tag>
            )}
            <Space>
              {mainData?.layout?.actions &&
                ActionBuilder(mainData.layout.actions[0].data, actionHandler, loading)}
            </Space>
          </div>

          <Form.Item name="uri" key="uri" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="method" key="method" hidden>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default ModalForm;
