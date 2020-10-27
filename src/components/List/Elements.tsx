import React from 'react';
import { Button } from 'antd';

export const buildElements = (data: ListAPI.Action[], actionHandler: API.ActionHandler) => {
  return data.map((element: any) => {
    if (element.component === 'button') {
      return (
        <Button
          type={element.type}
          onClick={() => {
            actionHandler(element, element);
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
