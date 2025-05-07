// src/models/destination.ts
import { Reducer } from 'redux';
import { Effect } from 'dva'; // Adjust import based on your Umi/DVA version if needed
import { queryDestinations, addDestination, updateDestination, deleteDestination } from '@/services/destination';
import { Destination, AppFilters } from '@/types';

export interface DestinationModelState {
  list: Destination[];
  total: number;
  loading: boolean;
  filters: AppFilters;
  adminLoading: boolean; // Loading state for admin actions
}

export interface DestinationModelType {
  namespace: 'destination';
  state: DestinationModelState;
  effects: {
    fetch: Effect;
    applyFilters: Effect;
    add: Effect;
    update: Effect;
    remove: Effect;
  };
  reducers: {
    save: Reducer<DestinationModelState>;
    setLoading: Reducer<DestinationModelState>;
    setFilters: Reducer<DestinationModelState>;
    setAdminLoading: Reducer<DestinationModelState>;
  };
}

const DestinationModel: DestinationModelType = {
  namespace: 'destination',

  state: {
    list: [],
    total: 0,
    loading: false,
    filters: {}, // Initial empty filters
    adminLoading: false,
  },

  effects: {
    *fetch({ payload }, { call, put, select }) {
      yield put({ type: 'setLoading', payload: true });
      const currentFilters = yield select((state: any) => state.destination.filters);
      const response = yield call(queryDestinations, { ...currentFilters, ...payload }); // Merge existing and new filters/pagination
      yield put({
        type: 'save',
        payload: { list: response.data, total: response.total },
      });
      yield put({ type: 'setLoading', payload: false });
    },
    *applyFilters({ payload }, { put }) {
      yield put({ type: 'setFilters', payload });
      yield put({ type: 'fetch' }); // Refetch data with new filters
    },
    // --- Admin Effects ---
    *add({ payload }, { call, put }) {
        yield put({ type: 'setAdminLoading', payload: true });
        try {
            yield call(addDestination, payload.values);
            yield put({ type: 'fetch' }); // Refresh list after adding
            if (payload.onSuccess) payload.onSuccess();
        } catch (e) {
             console.error("Failed to add destination:", e);
             if (payload.onError) payload.onError(e);
        }
        yield put({ type: 'setAdminLoading', payload: false });
    },
    *update({ payload }, { call, put }) {
        yield put({ type: 'setAdminLoading', payload: true });
         try {
            yield call(updateDestination, payload.id, payload.values);
            yield put({ type: 'fetch' }); // Refresh list after update
            if (payload.onSuccess) payload.onSuccess();
        } catch (e) {
             console.error("Failed to update destination:", e);
              if (payload.onError) payload.onError(e);
        }
        yield put({ type: 'setAdminLoading', payload: false });
    },
     *remove({ payload }, { call, put }) {
        yield put({ type: 'setAdminLoading', payload: true });
         try {
            yield call(deleteDestination, payload.id);
            yield put({ type: 'fetch' }); // Refresh list after delete
             if (payload.onSuccess) payload.onSuccess();
        } catch (e) {
             console.error("Failed to delete destination:", e);
              if (payload.onError) payload.onError(e);
        }
        yield put({ type: 'setAdminLoading', payload: false });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
    setLoading(state, { payload }) {
      return { ...state, loading: payload };
    },
     setAdminLoading(state, { payload }) {
      return { ...state, adminLoading: payload };
    },
    setFilters(state, { payload }) {
        return { ...state, filters: payload };
    }
  },
};

export default DestinationModel;