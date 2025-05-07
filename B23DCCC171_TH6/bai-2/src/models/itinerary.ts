// src/models/itinerary.ts
import { Reducer } from 'redux';
// import { Effect } from 'dva'; // Add effects later if saving/loading needed
import { ItineraryItem, Destination } from '@/types';
import { nanoid } from 'nanoid';

export interface ItineraryModelState {
  items: ItineraryItem[];
  // Add other relevant state: total budget, total days etc.
}

export interface ItineraryModelType {
  namespace: 'itinerary';
  state: ItineraryModelState;
  // effects: {}; // Add later if needed
  reducers: {
    add: Reducer<ItineraryModelState>;
    remove: Reducer<ItineraryModelState>;
    update: Reducer<ItineraryModelState>;
    reorder: Reducer<ItineraryModelState>; // Simple reorder logic
  };
}

const ItineraryModel: ItineraryModelType = {
  namespace: 'itinerary',

  state: {
    items: [], // Example: { day: 1, destinationId: 'xyz', notes: 'Visit market' }
  },

  // effects: { /* Add effects for saving/loading itinerary later */ },

  reducers: {
    add(state, { payload }) {
      // Payload should include { day: number, destination: Destination }
      const newItem: ItineraryItem = {
        day: payload.day,
        destinationId: payload.destination.id,
        // Add a unique internal id if needed for easier manipulation
        // internalId: nanoid()
      };
      // Add simple validation if needed (e.g., prevent adding same dest twice on same day)
      const newItems = [...state.items, newItem];
      // Sort by day and maybe insertion order within day
      newItems.sort((a, b) => a.day - b.day);
      return { ...state, items: newItems };
    },
    remove(state, { payload }) {
      // Payload should uniquely identify the item to remove, e.g., { day: number, destinationId: string }
      // If using internal IDs, payload could be just { internalId: string }
      const items = state.items.filter(
        item => !(item.day === payload.day && item.destinationId === payload.destinationId)
        // Or filter by internalId if you added one
      );
      return { ...state, items };
    },
     update(state, { payload }) {
        // Payload: { day, destinationId, values: { notes: 'new note' } }
         const items = state.items.map(item => {
             if (item.day === payload.day && item.destinationId === payload.destinationId) {
                 return { ...item, ...payload.values };
             }
             return item;
         });
         return { ...state, items };
     },
    reorder(state, { payload }) {
      // Payload could be { oldIndex: number, newIndex: number } or more complex logic
      // This is a simplified example assuming a flat list reorder
      const { oldIndex, newIndex } = payload;
      const items = Array.from(state.items);
      const [removed] = items.splice(oldIndex, 1);
      items.splice(newIndex, 0, removed);
       // Re-sort by day if necessary after manual reorder if day changes
       items.sort((a, b) => a.day - b.day);
      return { ...state, items };
    },
  },
};

export default ItineraryModel;