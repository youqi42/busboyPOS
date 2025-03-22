export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          role: 'customer' | 'kitchen_staff' | 'restaurant_admin' | 'platform_admin'
          tenant_id: string | null
          created_at: string
          updated_at: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
        }
        Insert: {
          id?: string
          email: string
          role: 'customer' | 'kitchen_staff' | 'restaurant_admin' | 'platform_admin'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: 'customer' | 'kitchen_staff' | 'restaurant_admin' | 'platform_admin'
          tenant_id?: string | null
          created_at?: string
          updated_at?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
        }
      }
      restaurants: {
        Row: {
          id: string
          name: string
          description: string | null
          address: string | null
          phone: string | null
          email: string | null
          logo_url: string | null
          cover_image_url: string | null
          settings: Json
          is_active: boolean
          subscription_tier: 'basic' | 'premium' | 'enterprise'
          subscription_status: 'active' | 'past_due' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          settings?: Json
          is_active?: boolean
          subscription_tier?: 'basic' | 'premium' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          address?: string | null
          phone?: string | null
          email?: string | null
          logo_url?: string | null
          cover_image_url?: string | null
          settings?: Json
          is_active?: boolean
          subscription_tier?: 'basic' | 'premium' | 'enterprise'
          subscription_status?: 'active' | 'past_due' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      menu_categories: {
        Row: {
          id: string
          restaurant_id: string
          name: string
          description: string | null
          order: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          name: string
          description?: string | null
          order?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          name?: string
          description?: string | null
          order?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: string
          category_id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          category_id: string
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modifiers: {
        Row: {
          id: string
          menu_item_id: string
          name: string
          required: boolean
          multi_select: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          menu_item_id: string
          name: string
          required?: boolean
          multi_select?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          menu_item_id?: string
          name?: string
          required?: boolean
          multi_select?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      modifier_options: {
        Row: {
          id: string
          modifier_id: string
          name: string
          price: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          modifier_id: string
          name: string
          price: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          modifier_id?: string
          name?: string
          price?: number
          created_at?: string
          updated_at?: string
        }
      }
      tables: {
        Row: {
          id: string
          restaurant_id: string
          table_number: string
          qr_code: string
          capacity: number
          status: 'available' | 'occupied' | 'reserved' | 'maintenance'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_number: string
          qr_code: string
          capacity: number
          status?: 'available' | 'occupied' | 'reserved' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_number?: string
          qr_code?: string
          capacity?: number
          status?: 'available' | 'occupied' | 'reserved' | 'maintenance'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          restaurant_id: string
          table_id: string
          customer_id: string | null
          status: 'pending' | 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          tax: number
          tip: number | null
          payment_status: 'pending' | 'processing' | 'completed' | 'failed'
          payment_intent: string | null
          created_at: string
          updated_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          restaurant_id: string
          table_id: string
          customer_id?: string | null
          status?: 'pending' | 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount: number
          tax: number
          tip?: number | null
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed'
          payment_intent?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          restaurant_id?: string
          table_id?: string
          customer_id?: string | null
          status?: 'pending' | 'received' | 'preparing' | 'ready' | 'completed' | 'cancelled'
          total_amount?: number
          tax?: number
          tip?: number | null
          payment_status?: 'pending' | 'processing' | 'completed' | 'failed'
          payment_intent?: string | null
          created_at?: string
          updated_at?: string
          completed_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          menu_item_id: string
          quantity: number
          subtotal: number
          special_instructions: string | null
          modifiers: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          menu_item_id: string
          quantity: number
          subtotal: number
          special_instructions?: string | null
          modifiers?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          menu_item_id?: string
          quantity?: number
          subtotal?: number
          special_instructions?: string | null
          modifiers?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          restaurant_id: string
          customer_id: string | null
          table_id: string | null
          reservation_date: string
          start_time: string
          end_time: string
          party_size: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          customer_id?: string | null
          table_id?: string | null
          reservation_date: string
          start_time: string
          end_time: string
          party_size: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          customer_id?: string | null
          table_id?: string | null
          reservation_date?: string
          start_time?: string
          end_time?: string
          party_size?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no_show'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      menu_items_with_categories: {
        Row: {
          id: string
          item_name: string
          item_description: string | null
          price: number
          item_image: string | null
          available: boolean
          category_id: string
          category_name: string
          restaurant_id: string
        }
      }
      orders_with_items: {
        Row: {
          order_id: string
          restaurant_id: string
          table_id: string
          status: string
          total_amount: number
          created_at: string
          table_number: string
          order_item_id: string
          menu_item_id: string
          item_name: string
          quantity: number
          subtotal: number
          special_instructions: string | null
        }
      }
      active_reservations: {
        Row: {
          id: string
          restaurant_id: string
          reservation_date: string
          start_time: string
          end_time: string
          party_size: number
          status: 'pending' | 'confirmed'
          notes: string | null
          table_id: string | null
          table_number: string | null
          capacity: number | null
          customer_id: string | null
          customer_name: string | null
          customer_email: string | null
          customer_phone: string | null
        }
      }
    }
    Functions: {
      is_platform_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
      is_restaurant_admin: {
        Args: { restaurant_id: string }
        Returns: boolean
      }
      is_kitchen_staff: {
        Args: { restaurant_id: string }
        Returns: boolean
      }
      get_user_restaurant_id: {
        Args: Record<string, never>
        Returns: string
      }
      has_migration_been_applied: {
        Args: { migration_version: string }
        Returns: boolean
      }
      record_migration: {
        Args: { 
          migration_version: string 
          migration_name: string
          migration_description?: string
        }
        Returns: undefined
      }
    }
    Enums: {
      // Add any enums here if needed
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 