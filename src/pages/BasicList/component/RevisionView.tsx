import { useEffect, useState } from 'react';
import { Drawer, Table, List, Popconfirm, Tooltip } from 'antd';
import { useRequest, useIntl } from 'umi';
import { useUpdateEffect } from 'ahooks';
import { InfoCircleTwoTone } from '@ant-design/icons';

type RevisionViewResponse = {
  data: { dataSource: Record<string, unknown>; meta: { total: number; page: number } };
};

const RevisionView = ({
  visible,
  onHide,
  uri,
}: {
  visible: boolean;
  onHide: (reload?: boolean) => void;
  uri: string;
}) => {
  const lang = useIntl();

  const init = useRequest<RevisionViewResponse>(`${uri}`, {
    manual: true,
    onError: () => {
      onHide();
    },
  });

  useEffect(() => {
    if (visible) {
      init.run();
    }
  }, [visible]);

  const payload = init.data?.dataSource;

  const columns = [
    {
      dataIndex: 'name',
      key: 'name',
    },
    {
      dataIndex: 'data',
      key: 'data',
    },
  ];

  const buildFieldTable = (tableData: Record<string, unknown>) => {
    const tableDataSource = Object.keys(tableData).map((fieldName) => {
      return {
        key: fieldName,
        name: fieldName,
        data: tableData[fieldName] || '',
      };
    });
    return (
      <div style={{ padding: '5px 0px' }}>
        <Table
          dataSource={tableDataSource}
          columns={columns}
          showHeader={false}
          bordered
          pagination={false}
          size="small"
        />
      </div>
    );
  };

  const buildI18nTable = (i18nData: Record<string, unknown>[]) => {
    const i18nDataSource = i18nData.map((item) => {
      return {
        key: item.lang_code,
        name: item.lang_code,
        data: buildFieldTable(item),
      };
    });
    return (
      <div style={{ padding: '5px 0px' }}>
        <Table
          dataSource={i18nDataSource}
          columns={columns}
          showHeader={false}
          pagination={false}
          size="small"
        />
      </div>
    );
  };

  const dataSource = [
    {
      key: 'original_update_time',
      name: lang.formatMessage({
        id: 'basic-list.revision.originalUpdateTime',
      }),
      data: payload?.create_time,
    },
    {
      key: 'revision_create_time',
      name: lang.formatMessage({
        id: 'basic-list.revision.revisionCreateTime',
      }),
      data: payload?.create_time,
    },
    {
      key: 'main table data',
      name: lang.formatMessage({
        id: 'basic-list.revision.mainTable',
      }),
      data: payload?.main_data && buildFieldTable(JSON.parse(payload.main_data as string)),
    },
    {
      key: 'i18n_table_data',
      name: lang.formatMessage({
        id: 'basic-list.revision.i18nTable',
      }),
      data: payload?.i18n_data && buildI18nTable(JSON.parse(payload?.i18n_data as string)),
    },
  ];

  return (
    <div>
      <Drawer
        title={`[${payload?.id}] ${payload?.title}`}
        visible={visible}
        width={800}
        onClose={() => {
          onHide();
        }}
        placement="right"
      >
        <Table
          dataSource={dataSource}
          columns={columns}
          showHeader={false}
          pagination={false}
          bordered
          loading={init.loading}
        />
        ;
      </Drawer>
    </div>
  );
};

export default RevisionView;
