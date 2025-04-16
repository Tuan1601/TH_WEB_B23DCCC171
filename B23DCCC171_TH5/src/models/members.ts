import { Effect, Reducer } from 'umi';
import { message } from 'antd';
import { queryMembers, updateMemberGroup, Application } from '@/services/application';  

 
export type Member = Application;

export interface MembersModelState {
  list: Member[];
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  loading: boolean;
  filterParams: Record<string, any>;
}

export interface MembersModelType {
  namespace: 'members';
  state: MembersModelState;
  effects: {
    fetch: Effect;
    updateGroup: Effect;
  };
  reducers: {
    save: Reducer<MembersModelState>;
    changeLoading: Reducer<MembersModelState>;
    setFilterParams: Reducer<MembersModelState>;
  };
}

const MembersModel: MembersModelType = {
  namespace: 'members',

  state: {
    list: [],
    pagination: { current: 1, pageSize: 10, total: 0 },
    loading: false,
    filterParams: {},
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({ type: 'changeLoading', payload: true });
      const currentFilterParams = yield select((state: any) => state.members.filterParams);
      const params = { ...currentFilterParams, ...payload };
      const response = yield call(queryMembers, params);
      yield put({ type: 'changeLoading', payload: false });
      if (response && response.success) {
        yield put({
          type: 'save',
          payload: {
            list: response.data,
            pagination: {
              current: params.current || 1,
              pageSize: params.pageSize || 10,
              total: response.total,
            },
          },
        });
         yield put({ type: 'setFilterParams', payload: params });
      } else {
          message.error('Failed to fetch members.');
      }
    },
    *updateGroup({ payload }, { call, put, select }) {
        const { id, group } = payload;
        yield put({ type: 'changeLoading', payload: true });
         
        const response = yield call(updateMemberGroup, id, group, 'Admin');
        yield put({ type: 'changeLoading', payload: false });

        if (response && response.success) {
            message.success('Member group updated successfully!');
            
            const currentPagination = yield select((state: any) => state.members.pagination);
            const currentFilterParams = yield select((state: any) => state.members.filterParams);
            yield put({ type: 'fetch', payload: { ...currentFilterParams, current: currentPagination.current, pageSize: currentPagination.pageSize } });
        } else {
            message.error('Failed to update member group.');
        }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    changeLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
     setFilterParams(state, { payload }) {
       return { ...state, filterParams: { ...state?.filterParams, ...payload } };
    },
  },
};

export default MembersModel;