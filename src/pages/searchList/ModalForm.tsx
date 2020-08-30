import React, { FC, useEffect, useState } from 'react';
import { Form, Input, Space, message, Tag, Spin } from 'antd';
import moment from 'moment';
import { request, useRequest } from 'umi';
import { useBoolean } from 'ahooks';
import { buildFields, buildActions, preFinish, preSetFields } from '@/components/Form';
import { PageDataState, FormValues } from './data';
import styles from './style.less';

interface ModalFormProps {
  initUri: string;
  cancelHandler: () => void;
  reloadHandler: () => void;
}

export const ModalForm: FC<ModalFormProps> = (props) => {
  const { initUri, cancelHandler, reloadHandler } = props;
  const [mainData, setMainData] = useState<PageDataState | undefined>(undefined);
  const [spinLoading, setSpinLoading] = useBoolean(true);
  const [form] = Form.useForm();

  const { loading, run } = useRequest(
    (url: string, method: string, requestData: any) => ({
      url: `/api/${url}`,
      method,
      data: requestData,
    }),
    {
      manual: true,
      throttleInterval: 1000,
      onSuccess: (response) => {
        message.success({ content: response.message, key: 'msg' });
        cancelHandler();
        reloadHandler();
      },
      onError: (error) => {
        message.error({ content: error.message, key: 'msg' });
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
        const rawData = await request(`/api/${uri}`);
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

  const actionHandler = (type: string, uri: string, method: string) => {
    switch (type) {
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

  const onFinish = async (values: FormValues) => {
    message.loading({ content: 'Processing...', key: 'msg' });
    const { submitValues, uri, method } = preFinish(values);
    run(uri, method, submitValues);
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  useEffect(() => {
    if (mainData?.layout && mainData.dataSource) {
      form.setFieldsValue(preSetFields(mainData));
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
          {buildFields(mainData)}
          {mainData?.layout.map((column: any) => {
            if (column.type === 'actions') {
              return (
                <div className={styles.actionRow} key="actionRow">
                  {form.getFieldValue('update_time') && (
                    <Tag className={styles.modalBottomTip} key="update_time">
                      Update Time:&nbsp;
                      {form.getFieldValue('update_time').format('YYYY-MM-DD HH:mm:ss')}
                    </Tag>
                  )}
                  <div key={column.key}>
                    <Space>{buildActions(column, actionHandler, loading)}</Space>
                  </div>
                </div>
              );
            }
            return null;
          })}
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
