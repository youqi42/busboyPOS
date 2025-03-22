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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 