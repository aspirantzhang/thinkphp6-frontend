import React from 'react';
import { Button } from 'antd';

export const buildElements = (data: any, actionHandler: any) => {
  return data.map((element: any) => {
    if (element.component === 'button') {
      return (
        <Button
          type={element.type}
          onClick={() => {
            actionHandler(element.action, element.uri, element.method, element);
          }}
          key={element.action}
        >
          {element.text}
        </Button>
      );
    }
    return null;
  });
};
