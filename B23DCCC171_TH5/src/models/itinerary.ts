import { Reducer } from 'redux';
import { ItineraryItem, Destination } from '@/types';
import { nanoid } from 'nanoid';

export interface ItineraryModelState {
  items: ItineraryItem[];
}

export interface ItineraryModelType {
  namespace: 'itinerary';
  state: ItineraryModelState;
  reducers: {
    add: Reducer<ItineraryModelState>;
    remove: Reducer<ItineraryModelState>;
    update: Reducer<ItineraryModelState>;
    reorder: Reducer<ItineraryModelState>; 
  };
}

const ItineraryModel: ItineraryModelType = {
  namespace: 'itinerary',

  state: {
    items: [], 
  },


  reducers: {
    add(state, { payload }) {
      const newItem: ItineraryItem = {
        day: payload.day,
        destinationId: payload.destination.id,
      };
      const newItems = [...state.items, newItem];
      newItems.sort((a, b) => a.day - b.day);
      return { ...state, items: newItems };
    },
    remove(state, { payload }) {
      const items = state.items.filter(
        item => !(item.day === payload.day && item.destinationId === payload.destinationId)
      );
      return { ...state, items };
    },
     update(state, { payload }) {
         const items = state.items.map(item => {
             if (item.day === payload.day && item.destinationId === payload.destinationId) {
                 return { ...item, ...payload.values };
             }
             return item;
         });
         return { ...state, items };
     },
    reorder(state, { payload }) {
      const { oldIndex, newIndex } = payload;
      const items = Array.from(state.items);
      const [removed] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, removed);
       items.sort((a, b) => a.day - b.day);
      return { ...state, items };
    },
  },
};

export default ItineraryModel;