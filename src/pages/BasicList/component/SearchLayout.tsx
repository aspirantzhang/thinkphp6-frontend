import { Row, Col, Card, Space, Button, Form, InputNumber } from 'antd';
import styles from '../index.less';
import { useIntl } from 'umi';
import type { FormInstance } from 'antd/lib/form/hooks/useForm';
import SearchBuilder from '../builder/SearchBuilder';

type SearchLayoutProps = {
  onFinish: (values: any) => void;
  searchForm: FormInstance;
  tableColumn: BasicListApi.Field[] | undefined;
  clearButtonCallback: () => void;
};

const SearchLayout = (props: SearchLayoutProps) => {
  const { onFinish, searchForm, tableColumn, clearButtonCallback } = props;
  const lang = useIntl();

  return (
    <div key="searchForm" className="search-layout">
      <Card className={styles['search-form']} key="searchFormCard">
        <Form onFinish={onFinish} form={searchForm}>
          <Row gutter={24}>
            <Col sm={6} key="id">
              <Form.Item label="ID" name="id" key="id">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            {SearchBuilder(tableColumn)}
          </Row>
          <Row>
            <Col sm={24} className={styles['text-align-right']}>
              <Space>
                <Button type="primary" htmlType="submit" className="submit-btn">
                  {lang.formatMessage({
                    id: 'basic-list.list.search.submitButtonText',
                  })}
                </Button>
                <Button
                  onClick={() => {
                    searchForm.resetFields();
                    clearButtonCallback();
                  }}
                  className="clear-btn"
                >
                  {lang.formatMessage({
                    id: 'basic-list.list.search.clearButtonText',
                  })}
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  );
};

export default SearchLayout;
