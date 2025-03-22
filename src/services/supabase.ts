import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

// Initialize Supabase client
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || '';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase URL or anonymous key. Please check your environment variables.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Authentication services
export const authService = {
  // Sign up a new user
  signUp: async (email: string, password: string, role: string, metadata?: { [key: string]: any }) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { role, ...metadata }
      }
    });
  },

  // Sign in a user
  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password
    });
  },

  // Sign out
  signOut: async () => {
    return await supabase.auth.signOut();
  },

  // Get the current user
  getCurrentUser: async () => {
    return await supabase.auth.getUser();
  },

  // Get the current session
  getSession: async () => {
    return await supabase.auth.getSession();
  },

  // Reset password
  resetPassword: async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
  },

  // Update user
  updateUser: async (attributes: { email?: string; password?: string; data?: { [key: string]: any } }) => {
    return await supabase.auth.updateUser(attributes);
  }
};

// Restaurant services
export const restaurantService = {
  // Create a new restaurant
  createRestaurant: async (restaurantData: any) => {
    return await supabase
      .from('restaurants')
      .insert(restaurantData)
      .select();
  },

  // Get a restaurant by ID
  getRestaurant: async (id: string) => {
    return await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Update a restaurant
  updateRestaurant: async (id: string, restaurantData: any) => {
    return await supabase
      .from('restaurants')
      .update(restaurantData)
      .eq('id', id);
  },

  // Delete a restaurant
  deleteRestaurant: async (id: string) => {
    return await supabase
      .from('restaurants')
      .delete()
      .eq('id', id);
  },

  // Get all restaurants (for platform admins)
  getAllRestaurants: async () => {
    return await supabase
      .from('restaurants')
      .select('*');
  }
};

// Menu services
export const menuService = {
  // Create a new menu category
  createCategory: async (categoryData: any) => {
    return await supabase
      .from('menu_categories')
      .insert(categoryData)
      .select();
  },

  // Get all categories for a restaurant
  getCategories: async (restaurantId: string) => {
    return await supabase
      .from('menu_categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('order');
  },

  // Update a category
  updateCategory: async (id: string, categoryData: any) => {
    return await supabase
      .from('menu_categories')
      .update(categoryData)
      .eq('id', id);
  },

  // Delete a category
  deleteCategory: async (id: string) => {
    return await supabase
      .from('menu_categories')
      .delete()
      .eq('id', id);
  },

  // Create a new menu item
  createMenuItem: async (menuItemData: any) => {
    return await supabase
      .from('menu_items')
      .insert(menuItemData)
      .select();
  },

  // Get all menu items for a category
  getMenuItems: async (categoryId: string) => {
    return await supabase
      .from('menu_items')
      .select('*, modifiers(*)')
      .eq('category_id', categoryId);
  },

  // Get all menu items for a restaurant
  getAllMenuItems: async (restaurantId: string) => {
    return await supabase
      .from('menu_items')
      .select('*, menu_categories!inner(*)')
      .eq('menu_categories.restaurant_id', restaurantId);
  },

  // Update a menu item
  updateMenuItem: async (id: string, menuItemData: any) => {
    return await supabase
      .from('menu_items')
      .update(menuItemData)
      .eq('id', id);
  },

  // Delete a menu item
  deleteMenuItem: async (id: string) => {
    return await supabase
      .from('menu_items')
      .delete()
      .eq('id', id);
  },

  // Toggle menu item availability
  toggleItemAvailability: async (id: string, available: boolean) => {
    return await supabase
      .from('menu_items')
      .update({ available })
      .eq('id', id);
  }
};

// Order services
export const orderService = {
  // Create a new order
  createOrder: async (orderData: any) => {
    return await supabase
      .from('orders')
      .insert(orderData)
      .select();
  },

  // Get an order by ID
  getOrder: async (id: string) => {
    return await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', id)
      .single();
  },

  // Get orders for a restaurant
  getRestaurantOrders: async (restaurantId: string) => {
    return await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });
  },

  // Get active orders for a restaurant
  getActiveOrders: async (restaurantId: string) => {
    return await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('restaurant_id', restaurantId)
      .not('status', 'eq', 'completed')
      .not('status', 'eq', 'cancelled')
      .order('created_at');
  },

  // Update order status
  updateOrderStatus: async (id: string, status: string) => {
    return await supabase
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
  },

  // Update payment status
  updatePaymentStatus: async (id: string, paymentStatus: string, paymentIntent?: string) => {
    return await supabase
      .from('orders')
      .update({ 
        payment_status: paymentStatus, 
        payment_intent: paymentIntent,
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);
  },

  // Subscribe to order changes
  subscribeToOrders: (restaurantId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('orders-channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        },
        callback
      )
      .subscribe();
  }
};

// Table services
export const tableService = {
  // Create a new table
  createTable: async (tableData: any) => {
    return await supabase
      .from('tables')
      .insert(tableData)
      .select();
  },

  // Get all tables for a restaurant
  getTables: async (restaurantId: string) => {
    return await supabase
      .from('tables')
      .select('*')
      .eq('restaurant_id', restaurantId);
  },

  // Update a table
  updateTable: async (id: string, tableData: any) => {
    return await supabase
      .from('tables')
      .update(tableData)
      .eq('id', id);
  },

  // Delete a table
  deleteTable: async (id: string) => {
    return await supabase
      .from('tables')
      .delete()
      .eq('id', id);
  },

  // Update table status
  updateTableStatus: async (id: string, status: string) => {
    return await supabase
      .from('tables')
      .update({ status })
      .eq('id', id);
  },

  // Get table by QR code
  getTableByQRCode: async (qrCode: string) => {
    return await supabase
      .from('tables')
      .select('*, restaurants(*)')
      .eq('qr_code', qrCode)
      .single();
  }
};

// User management services
export const userService = {
  // Create a staff user
  createStaffUser: async (userData: any) => {
    return await supabase
      .from('users')
      .insert(userData)
      .select();
  },

  // Get all staff for a restaurant
  getStaffUsers: async (restaurantId: string) => {
    return await supabase
      .from('users')
      .select('*')
      .eq('tenant_id', restaurantId)
      .in('role', ['kitchen_staff', 'restaurant_admin']);
  },

  // Update a user
  updateUser: async (id: string, userData: any) => {
    return await supabase
      .from('users')
      .update(userData)
      .eq('id', id);
  },

  // Delete a user
  deleteUser: async (id: string) => {
    return await supabase
      .from('users')
      .delete()
      .eq('id', id);
  }
}; 