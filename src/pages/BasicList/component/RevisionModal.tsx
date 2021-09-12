import { useEffect } from 'react';
import { Modal as AntdModal, Form, Input, message, Tag, Spin, Timeline } from 'antd';
import { useRequest, useIntl, useModel } from 'umi';
import moment from 'moment';
import FormBuilder from '../builder/FormBuilder';
import ActionBuilder from '../builder/ActionBuilder';
import { setFieldsAdaptor, submitFieldsAdaptor, getDefaultValue } from '../helper';
import styles from '../index.less';

const RevisionModal = ({
  modalVisible,
  hideModal,
  modalUri,
}: {
  modalVisible: boolean;
  hideModal: (reload?: boolean) => void;
  modalUri: string;
}) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const lang = useIntl();

  const init = useRequest<{ data: BasicListApi.PageData }>(`${modalUri}`, {
    manual: true,
    onError: () => {
      hideModal();
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
      const { uri, method, ...formValues } = values;
      return {
        url: `${uri}`,
        method,
        data: {
          ...submitFieldsAdaptor(formValues),
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
        hideModal(true);
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

  // useEffect(() => {
  //   if (modalVisible) {
  //     form.resetFields();
  //     init.run();
  //   }
  // }, [modalVisible]);

  // useEffect(() => {
  //   if (init.data) {
  //     form.setFieldsValue(setFieldsAdaptor(init.data.layout.tabs, init.data.dataSource));
  //   }
  // }, [init.data]);

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

  function actionHandler(action: Partial<BasicListApi.Action>) {
    switch (action.call) {
      case 'submit':
        form.setFieldsValue({ uri: action.uri, method: action.method });
        form.submit();
        break;
      case 'cancel':
        hideModal();
        break;
      case 'reset':
        form.resetFields();
        break;
      case 'fetchMenu':
        reFetchMenu();
        break;
      default:
        break;
    }
  }

  const onFinish = (values: any) => {
    request.run(values);
  };

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  return (
    <div>
      <AntdModal
        // title={init?.data?.page?.title}
        visible={modalVisible}
        onCancel={() => {
          hideModal();
        }}
        // footer={ActionBuilder(init?.data?.layout?.actions[0]?.data, actionHandler, request.loading)}
        forceRender
        className="basic-list-modal"
      >
        <Timeline mode="left">
          <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
          <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
          <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
          <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
          <Timeline.Item label="2015-09-01">Create a services</Timeline.Item>
        </Timeline>
        {/* {init?.loading ? (
          <Spin className={styles.formSpin} tip="Loading..." />
        ) : (
          <>
            <Form
              form={form}
              {...layout}
              initialValues={init.data && getDefaultValue(init.data.layout.tabs)}
              onFinish={onFinish}
            >
              {FormBuilder(init?.data?.layout?.tabs[0]?.data)}
              <Form.Item name="uri" key="uri" hidden>
                <Input />
              </Form.Item>
              <Form.Item name="method" key="method" hidden>
                <Input />
              </Form.Item>
            </Form>
            <Tag className={styles.formUpdateTime}>
              {lang.formatMessage({
                id: `basic-list.page.updateTime`,
              })}
              : {moment(form.getFieldValue('update_time')).format('YYYY-MM-DD HH:mm:ss')}
            </Tag>
          </>
        )} */}
      </AntdModal>
    </div>
  );
};

export default RevisionModal;
