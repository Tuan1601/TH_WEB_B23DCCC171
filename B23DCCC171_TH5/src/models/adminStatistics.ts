import { Reducer } from 'redux';
import { Effect } from 'dva';
import { queryStatistics } from '@/services/destination'; 

export interface AdminStatisticsModelState {
  stats: any; 
  loading: boolean;
}

export interface AdminStatisticsModelType {
  namespace: 'adminStatistics';
  state: AdminStatisticsModelState;
  effects: {
    fetchStats: Effect;
  };
  reducers: {
    saveStats: Reducer<AdminStatisticsModelState>;
    setLoading: Reducer<AdminStatisticsModelState>;
  };
}

const AdminStatisticsModel: AdminStatisticsModelType = {
    namespace: 'adminStatistics',
    state: {
        stats: {
            itinerariesByMonth: {},
            popularDestinations: [],
        },
        loading: false,
    },
    effects: {
        *fetchStats(_, { call, put }) {
            yield put({ type: 'setLoading', payload: true });
             try {
                const response = yield call(queryStatistics);
                yield put({ type: 'saveStats', payload: response });
            } catch(e) {
                console.error("Failed to fetch statistics:", e);
            }
            yield put({ type: 'setLoading', payload: false });
        },
    },
    reducers: {
        saveStats(state, { payload }) {
            return { ...state, stats: payload };
        },
         setLoading(state, { payload }) {
            return { ...state, loading: payload };
        },
    },
};

export default AdminStatisticsModel;