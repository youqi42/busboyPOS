import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  available: boolean;
  modifiers?: Modifier[];
}

export interface Modifier {
  id: string;
  name: string;
  options: ModifierOption[];
  required: boolean;
  multiSelect: boolean;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  imageUrl?: string;
}

interface MenuState {
  categories: MenuCategory[];
  items: MenuItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: MenuState = {
  categories: [],
  items: [],
  isLoading: false,
  error: null,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    fetchMenuStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMenuSuccess: (state, action: PayloadAction<{ categories: MenuCategory[]; items: MenuItem[] }>) => {
      state.isLoading = false;
      state.categories = action.payload.categories;
      state.items = action.payload.items;
      state.error = null;
    },
    fetchMenuFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addCategory: (state, action: PayloadAction<MenuCategory>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<MenuCategory>) => {
      const index = state.categories.findIndex(category => category.id === action.payload.id);
      if (index !== -1) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(category => category.id !== action.payload);
    },
    addMenuItem: (state, action: PayloadAction<MenuItem>) => {
      state.items.push(action.payload);
    },
    updateMenuItem: (state, action: PayloadAction<MenuItem>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteMenuItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleItemAvailability: (state, action: PayloadAction<{ id: string; available: boolean }>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index].available = action.payload.available;
      }
    },
  },
});

export const {
  fetchMenuStart,
  fetchMenuSuccess,
  fetchMenuFailure,
  addCategory,
  updateCategory,
  deleteCategory,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleItemAvailability,
} = menuSlice.actions;

export default menuSlice.reducer; 