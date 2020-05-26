import { Effect, Reducer, Subscription } from 'umi';
import { queryRule } from './service';

export interface UserModelState {
  page: {
    title: string;
    type: string;
    searchBar: boolean;
  };
  layout: {
    tableColumn: [];
    tableToolBar: [];
    batchToolBar: [];
  };
  success: boolean;
  message: string;
  data: {
    dataSource: [];
    meta: {
      total: number;
      per_page: number;
      page: number;
    };
  };
}

export interface UserModelType {
  namespace: 'users';
  state: UserModelState;
  reducers: {
    getList: Reducer;
  };
  effects: {
    getRemote: Effect;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: {
    page: {
      title: '',
      type: '',
      searchBar: false,
    },
    layout: {
      tableColumn: [],
      tableToolBar: [],
      batchToolBar: [],
    },
    success: false,
    message: '',
    data: {
      dataSource: [],
      meta: {
        total: 0,
        per_page: 10,
        page: 1,
      },
    },
  },
  reducers: {
    getList(state, { payload }) {
      return payload;
    },
  },
  effects: {
    *getRemote(action, { call, put }) {
      const result = yield call(queryRule);

      yield put({
        type: 'getList',
        payload: result,
      });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/search-list') {
          dispatch({
            type: 'getRemote',
          });
        }
      });
    },
  },
};

export default UserModel;
