import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { BasicLayout } from '@ant-design/pro-layout';
import { getApiBase } from '@/utils/utils';

const Index = () => {
  return (
    <BasicLayout
      pageTitleRender={() => {
        return 'Public API v2';
      }}
      pure={true}
    >
      <SwaggerUI url={getApiBase() + '/index/api'} />
    </BasicLayout>
  );
};
export default Index;
