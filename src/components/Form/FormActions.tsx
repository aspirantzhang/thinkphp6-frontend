import React from 'react';
import { Button } from 'antd';

export const buildActions = (column: any, loading?: boolean, actionHandler?: any) => {
  return column.actions.map((action: any) => {
    if (action.component === 'button') {
      return (
        <Button
          type={action.type}
          key={action.action}
          loading={loading}
          onClick={() => {
            actionHandler(action.action, action.uri, action.method);
          }}
        >
          {action.text}
        </Button>
      );
    }
    return null;
  });
};
