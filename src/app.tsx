import React from 'react';
import { BasicLayoutProps, Settings as LayoutSettings } from '@ant-design/pro-layout';

import { Modal, message } from 'antd';
import { history, RequestConfig } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { ResponseError } from 'umi-request';
import { queryCurrent } from './services/user';
import defaultSettings from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: LayoutSettings;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    try {
      const currentUser = await queryCurrent();
      return {
        currentUser,
        settings: defaultSettings,
      };
    } catch (error) {
      history.push('/user/login');
    }
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = ({
  initialState,
}: {
  initialState: { settings?: LayoutSettings; currentUser?: API.CurrentUser };
}): BasicLayoutProps => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser?.userid && history.location.pathname !== '/user/login') {
        history.push('/user/login');
      }
    },
    menuHeaderRender: undefined,
    ...initialState?.settings,
  };
};

/**
 * 异常处理程序
 */
const errorHandler = (error: ResponseError) => {
  // console.log(response);

  // if (response && response.status) {
  // }

  // if (response && response.status) {
  //   const errorText = codeMessage[response.status] || response.statusText;
  //   const { status, url } = response;

  //   Modal.error({
  //     title: 'This is an error message',
  //     content: 'some messages...some messages...',
  //   });
  // }
  if (error.name === 'BizError') {
    message.error(error.message, 6);
  } else if (!error.response) {
    Modal.error({
      title: 'Network Error',
      content: 'Cannot access the network, please try again.',
    });
  } else if (error.response.status < 500) {
    Modal.error({
      title: 'Program Error',
      content: 'Sorry, An error has occurred, Please try again later.',
    });
  } else {
    Modal.error({
      title: 'Server Error',
      content: 'Sorry, An error has occurred, Please try again later.',
    });
  }
  throw error;
};

export const request: RequestConfig = {
  errorHandler,
  errorConfig: {
    adaptor: (resData) => {
      // console.log(resData);
      return {
        ...resData,
        success: resData.success,
        errorMessage: resData.message,
      };
    },
  },
};
