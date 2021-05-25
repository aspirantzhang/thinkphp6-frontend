import { useEffect } from 'react';

import { Drawer as AntdDrawer, Button, Checkbox, Space, Select, Form, Row, Col } from 'antd';
// import styles from './index.less';

// const form = createForm();

const Drawer = ({
  drawerVisible,
  hideDrawer,
}: {
  drawerVisible: boolean;
  hideDrawer: () => void;
}) => {
  const [form] = Form.useForm();

  const displayOptions = [
    { label: 'List Sorter', value: 'listSorter' },
    { label: 'Hide in Column', value: 'hideInColumn' },
    { label: 'Edit Disabled', value: 'editDisabled' },
  ];

  return (
    <AntdDrawer
      title="Field Settings"
      placement="right"
      width={500}
      maskClosable={false}
      onClose={hideDrawer}
      visible={drawerVisible}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button
            onClick={() => {
              hideDrawer();
            }}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>
        </div>
      }
    >
      <Form
        layout="vertical"
        onFinish={(values) => {
          console.log(values);
        }}
        form={form}
      >
        <h2>Display Settings</h2>
        <Form.Item name="display">
          <Checkbox.Group options={displayOptions} />
        </Form.Item>
        <h2 style={{ marginTop: '20px' }}>Validate Settings</h2>
        <Form.Item name="validate">
          <Checkbox.Group style={{ width: '100%' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Row>
                <Col md={8}>
                  <Checkbox value="require">Require</Checkbox>
                </Col>
                <Col md={16}>xxxx</Col>
              </Row>
              <Row>
                <Col md={8}>
                  <Checkbox value="length">Length</Checkbox>
                </Col>
                <Col md={16}>xxxx</Col>
              </Row>
              <Row>
                <Col md={8}>
                  <Checkbox value="number">Number</Checkbox>
                </Col>
                <Col md={16}>xxxx</Col>
              </Row>
              <Row>
                <Col md={8}>
                  <Checkbox value="numberArray">Number Array</Checkbox>
                </Col>
                <Col md={16}>xxxx</Col>
              </Row>
              <Row>
                <Col md={8}>
                  <Checkbox value="checkParentId">Parent Id</Checkbox>
                </Col>
                <Col md={16}>xxxx</Col>
              </Row>
              <Row>
                <Col md={8}>
                  <Checkbox value="numberTag">Number Tag</Checkbox>
                </Col>
                <Col md={16}>xxxx</Col>
              </Row>
              <Row>
                <Col md={8}>
                  <Checkbox value="dateTimeRange">DateTime Range</Checkbox>
                </Col>
                <Col md={16}>xxxx</Col>
              </Row>
            </Space>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </AntdDrawer>
  );
};

export default Drawer;
