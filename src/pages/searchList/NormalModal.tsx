import React, { useEffect } from 'react';
import { useRequest } from 'umi';
import { Modal } from 'antd';

export const NormalModal = (props: any) => {
  const { modalVisible, modalClose, modalID } = props;

  const { data } = useRequest('modalUri');

  useEffect(() => {
    // setListData(data);
  }, [data]);

  return (
    <div>
      <Modal visible={modalVisible} onCancel={modalClose} forceRender>
        {modalID}
      </Modal>
    </div>
  );
};

export default NormalModal;
