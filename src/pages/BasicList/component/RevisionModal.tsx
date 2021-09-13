import { useEffect } from 'react';
import { Modal as AntdModal, Form, Input, message, Tag, Spin, Button, List } from 'antd';
import { useRequest, useIntl, useModel } from 'umi';
import { StarTwoTone } from '@ant-design/icons';
import moment from 'moment';
import FormBuilder from '../builder/FormBuilder';
import ActionBuilder from '../builder/ActionBuilder';
import { setFieldsAdaptor, submitFieldsAdaptor, getDefaultValue } from '../helper';
import styles from '../index.less';

type RevisionRecord = {
  id: number;
  title: string;
  create_time: string;
};
const RevisionModal = ({
  visible,
  onHide,
  uri,
}: {
  visible: boolean;
  onHide: (reload?: boolean) => void;
  uri: string;
}) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const [form] = Form.useForm();
  const lang = useIntl();

  const init = useRequest<{ data: { dataSource: RevisionRecord[] } }>(`${uri}`, {
    manual: true,
    onError: () => {
      onHide();
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
        onHide(true);
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

  useEffect(() => {
    if (visible) {
      form.resetFields();
      init.run();
    }
  }, [visible]);

  // useEffect(() => {
  //   if (init.data) {
  //     form.setFieldsValue(setFieldsAdaptor(init.data.layout.tabs, init.data.dataSource));
  //   }
  // }, [init.data]);

  function actionHandler(action: Partial<BasicListApi.Action>) {
    switch (action.call) {
      case 'submit':
        form.setFieldsValue({ uri: action.uri, method: action.method });
        form.submit();
        break;
      case 'cancel':
        onHide();
        break;
      case 'reset':
        form.resetFields();
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
        title="Revision"
        visible={visible}
        onCancel={() => {
          onHide();
        }}
        forceRender
        className="basic-list-modal"
      >
        <List
          className="demo-loadmore-list"
          loading={init.loading}
          itemLayout="horizontal"
          pagination={{
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 5,
            total: 50,
          }}
          dataSource={init.data?.dataSource || []}
          renderItem={(item) => (
            <List.Item
              actions={[
                <a key="restore">Restore</a>,
                <a key="view">View</a>,
                <a key="compare">Compare</a>,
              ]}
            >
              <List.Item.Meta
                avatar={<StarTwoTone />}
                title={item.title}
                description={item.create_time}
              />
            </List.Item>
          )}
        />
      </AntdModal>
    </div>
  );
};

export default RevisionModal;
