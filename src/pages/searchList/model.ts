import { Effect, Reducer, Subscription } from 'umi';
import { queryRule } from './service';

export interface UserModelState {
  page: {
    title: string;
    type: string;
    searchBar: boolean;
    searchExpand: boolean;
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
  searchExpand?: boolean;
}

/**
 * TODO: fix namespace
 */
export interface UserModelType {
  namespace: 'users';
  state: UserModelState;
  reducers: {
    getList: Reducer;
  };
  effects: {
    getRemote: Effect;
    searchExpand: Effect;
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
      searchExpand: false,
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
    searchExpand: false,
  },
  reducers: {
    getList(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
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
    *searchExpand({ payload: { expand } }, { put }) {
      yield put({
        type: 'getList',
        payload: {
          searchExpand: expand,
        },
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
