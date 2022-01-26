import React from 'react';
import { Button } from 'antd';
import type { ButtonType } from 'antd/lib/button';
import { ThunderboltTwoTone } from '@ant-design/icons';

const ActionBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler: BasicListApi.ActionHandler,
  loading = false,
  record?: BasicListApi.Field,
) => {
  return (Array.isArray(actions) ? actions : []).map((action) => {
    if (action.name === 'quick_edit') {
      return (
        <Button
          key={action.name}
          type="dashed"
          icon={<ThunderboltTwoTone />}
          onClick={() => {
            actionHandler(action, record);
          }}
          loading={loading}
          className={`${action.name.replace(/[^\w\d]/g, '-')}-btn`}
        ></Button>
      );
    }

    return (
      <Button
        key={action.name}
        type={action.type as ButtonType}
        onClick={() => {
          actionHandler(action, record);
        }}
        loading={loading}
        className={`${action.name.replace(/[^\w\d]/g, '-')}-btn`}
      >
        {action.title}
      </Button>
    );
  });
};
export default ActionBuilder;
