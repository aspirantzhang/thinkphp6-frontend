import React, { FC, useEffect, useState } from 'react';
import { Form, Input, Space, message, Tag, Spin } from 'antd';
import moment from 'moment';
import { request } from 'umi';
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
  const [actionsLoading, setActionsLoading] = useState<boolean>(false);
  const [spinLoading, setSpinLoading] = useState<boolean>(true);
  const [form] = Form.useForm();

  useEffect(() => {
    let stopMark = false;

    async function fetchMainData(uri: string) {
      try {
        const rawData = await request(uri);
        setSpinLoading(false);
        if (!stopMark) setMainData(rawData.data);
      } catch (error) {
        setSpinLoading(false);
        cancelHandler();
      }
    }

    if (initUri) {
      setMainData(undefined);
      form.resetFields();
      setSpinLoading(true);
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
    setActionsLoading(true);
    const processingHide = message.loading('Processing...');
    const { submitValues, uri, method } = preFinish(values);

    request(uri as string, {
      method,
      data: submitValues,
    })
      .then((response) => {
        processingHide();
        message.success(response.message);
        cancelHandler();
        reloadHandler();
        setActionsLoading(false);
      })
      .catch(() => {
        processingHide();
        setActionsLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
  };

  if (mainData?.layout && mainData.dataSource) {
    form.setFieldsValue(preSetFields(mainData));
  }
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
        key="title"
      >
        {mainData?.page.title} {mainData?.dataSource?.id && `ID: ${mainData?.dataSource?.id}`}
      </div>
      <form style={{ display: spinLoading ? 'none' : 'block' }} key="form">
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
                <div className={styles.actionRow}>
                  {mainData.dataSource && form.getFieldValue('update_time') && (
                    <Tag className={styles.modalBottomTip} key="update_time">
                      Update Time:&nbsp;
                      {form.getFieldValue('update_time').format('YYYY-MM-DD HH:mm:ss')}
                    </Tag>
                  )}
                  <div key="actions">
                    <Space>{buildActions(column, actionsLoading, actionHandler)}</Space>
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
      </form>
    </>
  );
};

export default ModalForm;
