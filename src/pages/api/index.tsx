import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { BasicLayout } from '@ant-design/pro-layout';

const Index = () => {
  return (
    <BasicLayout
      pageTitleRender={() => {
        return 'Public API v2';
      }}
      pure={true}
    >
      <SwaggerUI url="http://www.test.com/index/api" />
    </BasicLayout>
  );
};
export default Index;
