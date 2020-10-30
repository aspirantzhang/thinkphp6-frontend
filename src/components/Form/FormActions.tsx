import React from 'react';
import { Button } from 'antd';
import { ButtonType } from 'antd/lib/button';

export const ActionBuilder = (
  actions: PageAPI.Action,
  actionHandler: API.ActionHandler,
  loading: boolean,
) => {
  return actions.data.map((action: PageAPI.ActionData) => {
    switch (action.component) {
      case 'button':
        return (
          <Button
            type={action.type as ButtonType}
            key={action.action}
            loading={loading}
            onClick={() => {
              actionHandler(action);
            }}
          >
            {action.text}
          </Button>
        );

      default:
        return null;
    }
  });
};
