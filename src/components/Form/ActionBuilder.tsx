import React from 'react';
import { Button } from 'antd';
import { ButtonType } from 'antd/lib/button';

export const ActionBuilder = (
  actions: PageAPI.ActionData[],
  actionHandler: API.ActionHandler,
  loading: boolean = false,
) => {
  return actions.map((action: PageAPI.ActionData) => {
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
            id={action.id || ''}
          >
            {action.text}
          </Button>
        );

      default:
        return null;
    }
  });
};
