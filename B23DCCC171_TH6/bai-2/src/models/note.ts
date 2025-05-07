import { Effect, Reducer, Subscription } from 'umi';
import { GhiChu, DuLieuFormGhiChu } from '@/types/note';
import * as dichVuGhiChu from '@/services/noteService';

export interface TrangThaiModelGhiChu {
  danhSachGhiChu: GhiChu[];
  dangTai: boolean;
  tuKhoaTimKiem: string;
  locTheoThe: string[];
  locTheoKhoangNgay: [string, string] | null;
  cheDoXem: 'luoi' | 'danhSach';
}

export interface NoteModelType {
  namespace: 'notes';
  state: TrangThaiModelGhiChu;
  effects: {
    fetchNotes: Effect;
    addNote: Effect;
    updateNote: Effect;
    deleteNote: Effect;
    togglePin: Effect;
    toggleImportant: Effect;
    setSearchTerm: Effect;
    setFilterTags: Effect;
    setFilterDateRange: Effect;
    setViewMode: Effect;
  };
  reducers: {
    saveNotes: Reducer<TrangThaiModelGhiChu>;
    setLoading: Reducer<TrangThaiModelGhiChu>;
    _setSearchTerm: Reducer<TrangThaiModelGhiChu>;
    _setFilterTags: Reducer<TrangThaiModelGhiChu>;
    _setFilterDateRange: Reducer<TrangThaiModelGhiChu>;
    _setViewMode: Reducer<TrangThaiModelGhiChu>;
  };
  subscriptions: { setup: Subscription };
}

const NoteModel: NoteModelType = {
  namespace: 'notes',

  state: {
    danhSachGhiChu: [],
    dangTai: false,
    tuKhoaTimKiem: '',
    locTheoThe: [],
    locTheoKhoangNgay: null,
    cheDoXem: 'luoi',
  },

  effects: {
    *fetchNotes(_, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      const notes = yield call(dichVuGhiChu.layTatCaGhiChu);
      yield put({ type: 'saveNotes', payload: notes });
      yield put({ type: 'setLoading', payload: false });
    },

    *addNote({ payload }: { payload: DuLieuFormGhiChu }, { call, put }) {
     
      yield put({ type: 'setLoading', payload: true });
      const duLieuGhiChuVoiMacDinh = {
        ...payload,
        the: payload.the || [],
        quanTrong: payload.quanTrong || false,
      };
      yield call(dichVuGhiChu.themGhiChuMoi, duLieuGhiChuVoiMacDinh as Omit<GhiChu, 'id' | 'ngayTao' | 'daGhim'>);
      yield put({ type: 'fetchNotes' });
      yield put({ type: 'setLoading', payload: false });
    },

    *updateNote({ payload }: { payload: GhiChu }, { call, put }) {
      
      yield put({ type: 'setLoading', payload: true });
      const ghiChuCapNhatDayDu: GhiChu = {
         ...payload,
         the: payload.the || [],
      }
      yield call(dichVuGhiChu.capNhatGhiChu, ghiChuCapNhatDayDu);
      yield put({ type: 'fetchNotes' });
      yield put({ type: 'setLoading', payload: false });
    },

    *deleteNote({ payload: id }: { payload: string }, { call, put }) {
      yield put({ type: 'setLoading', payload: true });
      yield call(dichVuGhiChu.xoaGhiChuTheoId, id);
      yield put({ type: 'fetchNotes' });
      yield put({ type: 'setLoading', payload: false });
    },

    *togglePin({ payload: id }: { payload: string }, { select, call, put }) {
      const danhSach: GhiChu[] = yield select((state: any) => state.notes.danhSachGhiChu);
      const ghiChuCanGhim = danhSach.find(note => note.id === id);
      if (ghiChuCanGhim) {
        const ghiChuCapNhat = { ...ghiChuCanGhim, daGhim: !ghiChuCanGhim.daGhim };
        yield put({ type: 'updateNote', payload: ghiChuCapNhat });
      }
    },

    *toggleImportant({ payload: id }: { payload: string }, { select, call, put }) {
      const danhSach: GhiChu[] = yield select((state: any) => state.notes.danhSachGhiChu);
      const ghiChuCanDanhDau = danhSach.find(note => note.id === id);
      if (ghiChuCanDanhDau) {
        const ghiChuCapNhat = { ...ghiChuCanDanhDau, quanTrong: !ghiChuCanDanhDau.quanTrong };
        yield put({ type: 'updateNote', payload: ghiChuCapNhat });
      }
    },

    *setSearchTerm({ payload }, { put }) {
      yield put({ type: '_setSearchTerm', payload });
    },

    *setFilterTags({ payload }, { put }) {
      yield put({ type: '_setFilterTags', payload });
    },

    *setFilterDateRange({ payload }, { put }) {
      yield put({ type: '_setFilterDateRange', payload });
    },

    *setViewMode({ payload }, { put }) {
      yield put({ type: '_setViewMode', payload });
    },
  },

  reducers: {
    saveNotes(state, { payload }) {
      return { ...state, danhSachGhiChu: payload };
    },
    setLoading(state, { payload }) {
      return { ...state, dangTai: payload };
    },
    _setSearchTerm(state, { payload }) {
      return { ...state, tuKhoaTimKiem: payload };
    },
    _setFilterTags(state, { payload }) {
      return { ...state, locTheoThe: payload };
    },
    _setFilterDateRange(state, { payload }) {
      return { ...state, locTheoKhoangNgay: payload };
    },
    _setViewMode(state, { payload }) {
      return { ...state, cheDoXem: payload };
    },
  },

  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname }) => {
        if (pathname === '/notes' || pathname === '/') {
          dispatch({ type: 'fetchNotes' });
        }
      });
    },
  },
};

export default NoteModel;