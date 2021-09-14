import { useEffect, useState } from 'react';
import { Modal as AntdModal, Form, Input, message, Tag, Spin, Button, List } from 'antd';
import { useRequest, useIntl, useModel } from 'umi';
import { useUpdateEffect, useThrottleFn } from 'ahooks';
import { StarTwoTone } from '@ant-design/icons';
import moment from 'moment';
import FormBuilder from '../builder/FormBuilder';
import ActionBuilder from '../builder/ActionBuilder';
import { setFieldsAdaptor, submitFieldsAdaptor, getDefaultValue } from '../helper';
import styles from '../index.less';

type RevisionResponse = {
  data: { dataSource: RevisionRecord[]; meta: { total: number; page: number } };
};
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
  const [pageQuery, setPageQuery] = useState('&page=1');
  const [form] = Form.useForm();
  const lang = useIntl();

  const init = useRequest<RevisionResponse>(`${uri}?${pageQuery}`, {
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

  useUpdateEffect(() => {
    init.run();
  }, [pageQuery]);

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
        afterClose={() => {
          setPageQuery('&page=1');
        }}
      >
        <List
          className="demo-loadmore-list"
          loading={init.loading}
          itemLayout="horizontal"
          pagination={{
            onChange: (page) => {
              setPageQuery(`&page=${page}`);
            },
            pageSize: 5,
            total: init.data?.meta.total || 0,
            current: init.data?.meta.page || 1,
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
