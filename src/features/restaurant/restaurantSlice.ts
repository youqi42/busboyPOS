import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Table {
  id: string;
  restaurantId: string;
  tableNumber: string;
  qrCode: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export interface RestaurantSettings {
  currency: string;
  taxRate: number;
  defaultTipOptions: number[];
  openingHours: {
    [key: string]: { // day of week
      open: string; // HH:MM format
      close: string; // HH:MM format
      isClosed: boolean;
    };
  };
  allowReservations: boolean;
  autoAcceptOrders: boolean;
  estimatedPrepTimes: {
    [key: string]: number; // categoryId: minutes
  };
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  logoUrl?: string;
  coverImageUrl?: string;
  settings: RestaurantSettings;
  tables: Table[];
  isActive: boolean;
  subscriptionTier: 'basic' | 'premium' | 'enterprise';
  subscriptionStatus: 'active' | 'past_due' | 'cancelled';
}

interface RestaurantState {
  currentRestaurant: Restaurant | null;
  allRestaurants: Restaurant[];
  isLoading: boolean;
  error: string | null;
}

const initialState: RestaurantState = {
  currentRestaurant: null,
  allRestaurants: [],
  isLoading: false,
  error: null,
};

const restaurantSlice = createSlice({
  name: 'restaurant',
  initialState,
  reducers: {
    fetchRestaurantStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchRestaurantSuccess: (state, action: PayloadAction<Restaurant>) => {
      state.isLoading = false;
      state.currentRestaurant = action.payload;
      state.error = null;
    },
    fetchAllRestaurantsSuccess: (state, action: PayloadAction<Restaurant[]>) => {
      state.isLoading = false;
      state.allRestaurants = action.payload;
      state.error = null;
    },
    fetchRestaurantFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    updateRestaurant: (state, action: PayloadAction<Partial<Restaurant>>) => {
      if (state.currentRestaurant) {
        state.currentRestaurant = { ...state.currentRestaurant, ...action.payload };
      }
    },
    updateRestaurantSettings: (state, action: PayloadAction<Partial<RestaurantSettings>>) => {
      if (state.currentRestaurant) {
        state.currentRestaurant.settings = { 
          ...state.currentRestaurant.settings, 
          ...action.payload 
        };
      }
    },
    addTable: (state, action: PayloadAction<Table>) => {
      if (state.currentRestaurant) {
        state.currentRestaurant.tables.push(action.payload);
      }
    },
    updateTable: (state, action: PayloadAction<Table>) => {
      if (state.currentRestaurant) {
        const index = state.currentRestaurant.tables.findIndex(table => table.id === action.payload.id);
        if (index !== -1) {
          state.currentRestaurant.tables[index] = action.payload;
        }
      }
    },
    deleteTable: (state, action: PayloadAction<string>) => {
      if (state.currentRestaurant) {
        state.currentRestaurant.tables = state.currentRestaurant.tables.filter(table => table.id !== action.payload);
      }
    },
    updateTableStatus: (state, action: PayloadAction<{ id: string; status: 'available' | 'occupied' | 'reserved' | 'maintenance' }>) => {
      if (state.currentRestaurant) {
        const table = state.currentRestaurant.tables.find(table => table.id === action.payload.id);
        if (table) {
          table.status = action.payload.status;
        }
      }
    },
  },
});

export const {
  fetchRestaurantStart,
  fetchRestaurantSuccess,
  fetchAllRestaurantsSuccess,
  fetchRestaurantFailure,
  updateRestaurant,
  updateRestaurantSettings,
  addTable,
  updateTable,
  deleteTable,
  updateTableStatus,
} = restaurantSlice.actions;

export default restaurantSlice.reducer; 