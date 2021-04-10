import { Button } from 'antd';
import type { ButtonType } from 'antd/lib/button';

const ActionBuilder = (
  actions: BasicListApi.Action[] | undefined,
  actionHandler: BasicListApi.ActionHandler,
  loading = false,
  record: Record<string, unknown> = {},
) => {
  return (actions || []).map((action) => {
    if (action.component === 'button') {
      return (
        <Button
          key={action.name}
          type={action.type as ButtonType}
          onClick={() => {
            actionHandler(action, record);
          }}
          loading={loading}
          className={`btn-${action.name}`}
        >
          {action.title}
        </Button>
      );
    }
    return null;
  });
};
export default ActionBuilder;
