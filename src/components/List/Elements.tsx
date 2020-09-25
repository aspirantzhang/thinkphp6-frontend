import React from 'react';
import { Button } from 'antd';

export const buildElements = (data: any, actionHandler: any, isTrash: boolean) => {
  return data.map((element: any) => {
    if (element.component === 'button') {
      let elementTitle = element.text;
      let elementAction = element.action;
      if (isTrash && element.action === 'batchDelete') {
        elementTitle = 'Delete Permanently';
        elementAction = 'deletePermanently';
      }

      return (
        <Button
          type={element.type}
          onClick={() => {
            actionHandler(elementAction, element.uri, element.method, element);
          }}
          key={element.action}
        >
          {elementTitle}
        </Button>
      );
    }
    return null;
  });
};
