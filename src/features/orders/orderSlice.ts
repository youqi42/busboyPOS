import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MenuItem, ModifierOption } from '../menu/menuSlice';

export type OrderStatus = 'pending' | 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: {
    modifierId: string;
    options: ModifierOption[];
  }[];
  specialInstructions?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  tax: number;
  tip?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  customerId?: string;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  paymentIntent?: string;
}

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  cartItems: OrderItem[];
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  currentOrder: null,
  orderHistory: [],
  cartItems: [],
  isLoading: false,
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<OrderItem>) => {
      const existingIndex = state.cartItems.findIndex(item => 
        item.menuItem.id === action.payload.menuItem.id &&
        JSON.stringify(item.selectedModifiers) === JSON.stringify(action.payload.selectedModifiers)
      );

      if (existingIndex !== -1) {
        state.cartItems[existingIndex].quantity += action.payload.quantity;
        state.cartItems[existingIndex].subtotal += action.payload.subtotal;
      } else {
        state.cartItems.push(action.payload);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(item => item.id !== action.payload);
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const item = state.cartItems.find(item => item.id === action.payload.id);
      if (item) {
        const unitPrice = item.subtotal / item.quantity;
        item.quantity = action.payload.quantity;
        item.subtotal = unitPrice * action.payload.quantity;
      }
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    placeOrderStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    placeOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.isLoading = false;
      state.currentOrder = action.payload;
      state.cartItems = [];
      state.error = null;
    },
    placeOrderFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    fetchOrderStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.isLoading = false;
      state.currentOrder = action.payload;
      state.error = null;
    },
    fetchOrderHistorySuccess: (state, action: PayloadAction<Order[]>) => {
      state.isLoading = false;
      state.orderHistory = action.payload;
      state.error = null;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: OrderStatus }>) => {
      if (state.currentOrder && state.currentOrder.id === action.payload.id) {
        state.currentOrder.status = action.payload.status;
      }
      
      const orderIndex = state.orderHistory.findIndex(order => order.id === action.payload.id);
      if (orderIndex !== -1) {
        state.orderHistory[orderIndex].status = action.payload.status;
      }
    },
    updatePaymentStatus: (state, action: PayloadAction<{ id: string; status: 'pending' | 'processing' | 'completed' | 'failed' }>) => {
      if (state.currentOrder && state.currentOrder.id === action.payload.id) {
        state.currentOrder.paymentStatus = action.payload.status;
      }
      
      const orderIndex = state.orderHistory.findIndex(order => order.id === action.payload.id);
      if (orderIndex !== -1) {
        state.orderHistory[orderIndex].paymentStatus = action.payload.status;
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  placeOrderStart,
  placeOrderSuccess,
  placeOrderFailure,
  fetchOrderStart,
  fetchOrderSuccess,
  fetchOrderHistorySuccess,
  updateOrderStatus,
  updatePaymentStatus,
} = orderSlice.actions;

export default orderSlice.reducer; 