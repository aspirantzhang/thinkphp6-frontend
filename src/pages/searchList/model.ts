import { Effect, Reducer } from 'umi';
import { queryRule } from './service';

export interface UserModelState {
  success: boolean;
  message: string;
  data: {
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
    dataSource: [];
    meta: {
      total: number;
      per_page: number;
      page: number;
    };
  };
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
}

const UserModel: UserModelType = {
  namespace: 'users',
  state: {
    success: false,
    message: '',
    data: {
      dataSource: [],
      meta: {
        total: 0,
        per_page: 10,
        page: 1,
      },
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
    },
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
};

export default UserModel;
