import { useState, useEffect, useMemo } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import { createForm, onFieldChange, onFieldReact, isField } from '@formily/core';
import { Form } from '@formily/antd';
import { Spin, Button, message } from 'antd';
import { useSetState } from 'ahooks';
import { request, useLocation, history, useModel } from 'umi';
import View from './View';
import Modal from './Modal';
import Drawer from './Drawer';
import styles from './index.less';
import { schemaExample } from './initialValues';

const Index = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [currentFieldPath, setCurrentFieldPath] = useState('');
  const [modalState, setModalState] = useSetState({
    type: '',
    values: {},
  });
  const [drawerState, setDrawerState] = useSetState({
    type: '',
    values: {},
  });
  const [spinLoading, setSpinLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const location = useLocation();
  const { initialState, setInitialState } = useModel('@@initialState');

  const form = useMemo(
    () =>
      createForm({
        effects: () => {
          onFieldReact('*.*.uri', (field) => {
            if (isField(field)) {
              field.value = field.value?.replace('admins', field.query('modelName').get('value'));
            }
          });
          onFieldReact('fields.*.data', (field) => {
            if (isField(field)) {
              const typeValue = field.query('.type').get('value');
              const attrValue = typeValue === 'switch' || typeValue === 'radio';
              field.editable = attrValue;
              field.required = attrValue;
            }
          });
          onFieldChange('fields.*.data', ['active'], (field) => {
            if (isField(field) && field.active === true) {
              setCurrentFieldPath(field.path.toString());
              setModalState({
                values: field.value,
                type: field.query('.type').get('value'),
              });
              field.active = false;
            }
          });
          onFieldChange('fields.*.settings', ['active'], (field) => {
            if (isField(field) && field.active === true) {
              console.log('click');
              // setCurrentFieldPath(field.path.toString());
              setDrawerState({
                values: field.value,
                type: field.query('.type').get('value'),
              });
              field.active = false;
            }
          });
        },
      }),
    [],
  );

  useEffect(() => {
    if (modalState.type) {
      setModalVisible(true);
    }
  }, [modalState.type]);

  useEffect(() => {
    if (drawerState.type) {
      setDrawerVisible(true);
    }
  }, [drawerState.type]);

  useEffect(() => {
    let stopMark = false;
    if (location.pathname) {
      const getData = async () => {
        try {
          const res = await request(
            `${location.pathname.replace('/basic-list/api/models/model-design', '')}`,
          );
          if (stopMark !== true) {
            setSpinLoading(false);
            form.setState((state) => {
              const { modelName, ...rest } = res.data.data;
              if (Object.keys(rest).length === 0) {
                state.initialValues = schemaExample;
              }
              state.initialValues = res.data.data;
            });
          }
        } catch (error) {
          history.goBack();
        }
      };
      getData();
    }
    return () => {
      stopMark = true;
    };
  }, [location.pathname]);

  const reFetchMenu = async () => {
    setInitialState({
      ...initialState,
      settings: {
        menu: {
          loading: true,
        },
      },
    });

    const userMenu = await initialState?.fetchMenu?.();
    if (userMenu) {
      setInitialState({
        ...initialState,
        currentMenu: userMenu,
      });
    }
  };

  const modalSubmitHandler = (values: any) => {
    setModalVisible(false);
    form.setFieldState(currentFieldPath, (state) => {
      state.value = values.data;
    });
    setModalState({ type: '', values: {} });
  };

  const pageSubmitHandler = (values: any) => {
    setSubmitLoading(true);
    message.loading({ content: 'Processing...', key: 'process', duration: 0 });
    const updateData = async () => {
      try {
        const res = await request(
          `${location.pathname.replace('/basic-list/api/models/model-design', '')}`,
          {
            method: 'put',
            data: {
              data: values,
            },
          },
        );
        if (res.success === true) {
          message.success({ content: res.message, key: 'process' });
          history.goBack();
          reFetchMenu();
        }
      } catch (error) {
        setSubmitLoading(false);
      }
    };

    updateData();
  };

  return (
    <PageContainer>
      {spinLoading ? (
        <Spin className={styles.formSpin} tip="Loading..." />
      ) : (
        <Form form={form}>
          <View />
        </Form>
      )}
      <FooterToolbar
        extra={
          <Button
            type="primary"
            onClick={() => {
              form.submit(pageSubmitHandler);
            }}
            loading={submitLoading}
          >
            Submit
          </Button>
        }
      />
      <Modal
        modalVisible={modalVisible}
        hideModal={() => {
          setModalVisible(false);
          setModalState({ type: '', values: {} });
        }}
        modalSubmitHandler={modalSubmitHandler}
        modalState={modalState}
      />
      <Drawer
        hideDrawer={() => {
          setDrawerVisible(false);
          setDrawerState({ type: '', values: {} });
        }}
        drawerVisible={drawerVisible}
      />
    </PageContainer>
  );
};

export default Index;
