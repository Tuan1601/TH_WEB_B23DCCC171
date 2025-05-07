import { Effect, Reducer } from 'umi';
import { message, Modal } from 'antd';
import { queryApplications, addApplication, updateApplicationStatus, Application } from '@/services/application';  
export interface ApplicationsModelState {
  list: Application[];
  pagination: {
    current?: number;
    pageSize?: number;
    total?: number;
  };
  loading: boolean;
  filterParams: Record<string, any>;  
}

export interface ApplicationsModelType {
  namespace: 'applications';
  state: ApplicationsModelState;
  effects: {
    fetch: Effect;
    add: Effect;
    updateStatus: Effect;
  };
  reducers: {
    save: Reducer<ApplicationsModelState>;
    changeLoading: Reducer<ApplicationsModelState>;
    setFilterParams: Reducer<ApplicationsModelState>;
  };
}

const ApplicationsModel: ApplicationsModelType = {
  namespace: 'applications',

  state: {
    list: [],
    pagination: { current: 1, pageSize: 10, total: 0 },
    loading: false,
    filterParams: {},
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({ type: 'changeLoading', payload: true });
      const currentFilterParams = yield select((state: any) => state.applications.filterParams);
      const params = { ...currentFilterParams, ...payload };
      const response = yield call(queryApplications, params);
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
          message.error('Failed to fetch applications.');
      }
    },
    *add({ payload }, { call, put }) {
       yield put({ type: 'changeLoading', payload: true });
       const response = yield call(addApplication, payload);
       yield put({ type: 'changeLoading', payload: false });
       if (response && response.success) {
           message.success('Application submitted successfully!');
       
           return true;  
       } else {
           message.error('Failed to submit application.');
           return false;  
       }
    },
    *updateStatus({ payload }, { call, put, select }) {
       const { id, status, notes } = payload;
       
       yield put({ type: 'changeLoading', payload: true });
   
       const response = yield call(updateApplicationStatus, id, status, notes, 'Admin');
       yield put({ type: 'changeLoading', payload: false });

       if (response && response.success) {
           message.success(`Application ${status} successfully!`);
           
           const currentPagination = yield select((state: any) => state.applications.pagination);
           const currentFilterParams = yield select((state: any) => state.applications.filterParams);
           yield put({ type: 'fetch', payload: { ...currentFilterParams, current: currentPagination.current, pageSize: currentPagination.pageSize } });
       } else {
           message.error(`Failed to ${status} application.`);
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
       
      const { current, pageSize, ...restFilters } = payload;
       return { ...state, filterParams: { ...state?.filterParams, ...payload } };
    },
  },
};

export default ApplicationsModel;