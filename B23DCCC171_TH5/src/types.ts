// src/types.ts (Create this file if it doesn't exist)
export interface Destination {
    id: string;
    name: string;
    location: string;
    type: 'beach' | 'mountain' | 'city';
    imageUrl: string;
    rating: number;
    priceRange: number; // e.g., 1 (cheap) to 5 (expensive)
    description?: string;
  }
  
  export interface ItineraryItem {
    day: number;
    destinationId: string;
    notes?: string;
    // Add estimated cost, travel time later
  }
  
  export interface BudgetCategory {
    id: string;
    name: 'accommodation' | 'food' | 'transport' | 'activities' | 'other';
    allocated: number;
    spent: number;
  }
  
  export interface AppFilters {
      type?: string[];
      priceRange?: [number, number];
      minRating?: number;
      sortBy?: 'rating_desc' | 'price_asc' | 'price_desc';
  }