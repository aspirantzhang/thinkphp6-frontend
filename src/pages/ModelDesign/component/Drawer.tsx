import { useEffect } from 'react';

import { Drawer as AntdDrawer, Button, Checkbox, Space } from 'antd';
// import styles from './index.less';

// const form = createForm();

const Drawer = ({
  drawerVisible,
  hideDrawer,
}: {
  drawerVisible: boolean;
  hideDrawer: () => void;
}) => {
  const displayOptions = [
    { label: 'List Sorter', value: 'listSorter' },
    { label: 'Hide in Column', value: 'hideInColumn' },
    { label: 'Edit Disabled', value: 'editDisabled' },
  ];
  console.log('drawer display');

  return (
    <AntdDrawer
      title="Configuration"
      placement="right"
      width={500}
      closable={false}
      // onClose={onClose}
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
          <Button type="primary">Submit</Button>
        </div>
      }
    >
      <h2>Display Settings</h2>
      <Checkbox.Group options={displayOptions} /* onChange={onChange} */ />
      <Space />
      <h2 style={{ marginTop: '20px' }}>Validate Settings</h2>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </AntdDrawer>
  );
};

export default Drawer;
