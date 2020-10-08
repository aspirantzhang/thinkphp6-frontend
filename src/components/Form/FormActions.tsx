import React from 'react';
import { Button } from 'antd';

export const ActionBuilder = (actions: any, actionHandler: any, loading: boolean) => {
  console.log(actions);
  return actions.data.map((action: any) => {
    switch (action.component) {
      case 'button':
        return (
          <Button
            type={action.type}
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
