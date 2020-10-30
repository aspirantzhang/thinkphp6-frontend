import React from 'react';
import { Button } from 'antd';
import { ButtonType } from 'antd/lib/button';

export const buildElements = (data: ListAPI.Action[], actionHandler: API.ActionHandler) => {
  return data.map((element: ListAPI.Action) => {
    if (element.component === 'button') {
      return (
        <Button
          type={element.type as ButtonType}
          onClick={() => {
            actionHandler(element, element);
          }}
          id={element.id || ''}
          key={element.action}
        >
          {element.text}
        </Button>
      );
    }
    return null;
  });
};
