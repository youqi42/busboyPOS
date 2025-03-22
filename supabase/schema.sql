-- Supabase RLS schema for busboyPOS

-- Enable PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set up storage for profile images and menu item images
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('restaurant_images', 'restaurant_images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('menu_images', 'menu_images', true);

-- Create tables

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('customer', 'kitchen_staff', 'restaurant_admin', 'platform_admin')),
  tenant_id UUID,  -- restaurant_id for staff and admins
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT
);

-- Restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT,
  phone TEXT,
  email TEXT,
  logo_url TEXT,
  cover_image_url TEXT,
  settings JSONB NOT NULL DEFAULT '{
    "currency": "USD",
    "taxRate": 0.0,
    "defaultTipOptions": [15, 18, 20],
    "openingHours": {
      "monday": {"open": "09:00", "close": "22:00", "isClosed": false},
      "tuesday": {"open": "09:00", "close": "22:00", "isClosed": false},
      "wednesday": {"open": "09:00", "close": "22:00", "isClosed": false},
      "thursday": {"open": "09:00", "close": "22:00", "isClosed": false},
      "friday": {"open": "09:00", "close": "23:00", "isClosed": false},
      "saturday": {"open": "09:00", "close": "23:00", "isClosed": false},
      "sunday": {"open": "09:00", "close": "22:00", "isClosed": false}
    },
    "allowReservations": true,
    "autoAcceptOrders": true,
    "estimatedPrepTimes": {}
  }',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  subscription_tier TEXT NOT NULL DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'premium', 'enterprise')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'past_due', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu Categories table
CREATE TABLE menu_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  "order" INT NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu Items table
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT,
  available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Modifiers table (for add-ons, customizations)
CREATE TABLE modifiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  multi_select BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Modifier Options table
CREATE TABLE modifier_options (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  modifier_id UUID NOT NULL REFERENCES modifiers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tables table
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  table_number TEXT NOT NULL,
  qr_code TEXT NOT NULL UNIQUE,
  capacity INT NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (restaurant_id, table_number)
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE RESTRICT,
  table_id UUID NOT NULL REFERENCES tables(id) ON DELETE RESTRICT,
  customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'received', 'preparing', 'ready', 'completed', 'cancelled')),
  total_amount DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL,
  tip DECIMAL(10, 2),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'processing', 'completed', 'failed')),
  payment_intent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Order Items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE RESTRICT,
  quantity INT NOT NULL DEFAULT 1,
  subtotal DECIMAL(10, 2) NOT NULL,
  special_instructions TEXT,
  modifiers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create views to join related tables for easier querying

-- View for menu items with their categories
CREATE VIEW menu_items_with_categories AS
SELECT 
  mi.id,
  mi.name AS item_name,
  mi.description AS item_description,
  mi.price,
  mi.image_url AS item_image,
  mi.available,
  mc.id AS category_id,
  mc.name AS category_name,
  mc.restaurant_id
FROM menu_items mi
JOIN menu_categories mc ON mi.category_id = mc.id;

-- View for orders with their items
CREATE VIEW orders_with_items AS
SELECT 
  o.id AS order_id,
  o.restaurant_id,
  o.table_id,
  o.status,
  o.total_amount,
  o.created_at,
  t.table_number,
  oi.id AS order_item_id,
  oi.menu_item_id,
  mi.name AS item_name,
  oi.quantity,
  oi.subtotal,
  oi.special_instructions
FROM orders o
JOIN tables t ON o.table_id = t.id
JOIN order_items oi ON o.id = oi.order_id
JOIN menu_items mi ON oi.menu_item_id = mi.id;

-- Create indexes for performance

CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_menu_categories_restaurant_id ON menu_categories(restaurant_id);
CREATE INDEX idx_menu_items_category_id ON menu_items(category_id);
CREATE INDEX idx_modifiers_menu_item_id ON modifiers(menu_item_id);
CREATE INDEX idx_modifier_options_modifier_id ON modifier_options(modifier_id);
CREATE INDEX idx_tables_restaurant_id ON tables(restaurant_id);
CREATE INDEX idx_orders_restaurant_id ON orders(restaurant_id);
CREATE INDEX idx_orders_table_id ON orders(table_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

-- Functions for managing timestamps

-- Auto-update updated_at timestamp 
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_restaurants_updated_at BEFORE UPDATE ON restaurants FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_menu_categories_updated_at BEFORE UPDATE ON menu_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_modifiers_updated_at BEFORE UPDATE ON modifiers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_modifier_options_updated_at BEFORE UPDATE ON modifier_options FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_tables_updated_at BEFORE UPDATE ON tables FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_order_items_updated_at BEFORE UPDATE ON order_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update order status
CREATE OR REPLACE FUNCTION set_order_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_order_completed_at_trigger BEFORE UPDATE ON orders FOR EACH ROW EXECUTE PROCEDURE set_order_completed_at();

-- Setup Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifier_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create helper functions for RLS

-- Check if the user is a platform admin
CREATE OR REPLACE FUNCTION is_platform_admin()
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() 
    AND role = 'platform_admin'
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the user is a restaurant admin
CREATE OR REPLACE FUNCTION is_restaurant_admin(restaurant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() 
    AND role = 'restaurant_admin'
    AND tenant_id = restaurant_id
  ) INTO is_admin;
  
  RETURN is_admin;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if the user is kitchen staff for the restaurant
CREATE OR REPLACE FUNCTION is_kitchen_staff(restaurant_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  is_staff BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() 
    AND role = 'kitchen_staff'
    AND tenant_id = restaurant_id
  ) INTO is_staff;
  
  RETURN is_staff;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get the user's restaurant id (tenant_id)
CREATE OR REPLACE FUNCTION get_user_restaurant_id()
RETURNS UUID AS $$
DECLARE
  restaurant_id UUID;
BEGIN
  SELECT tenant_id INTO restaurant_id
  FROM users
  WHERE id = auth.uid();
  
  RETURN restaurant_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies

-- Users table policies
CREATE POLICY "Platform admins can see all users"
  ON users FOR SELECT
  TO authenticated
  USING (is_platform_admin());

CREATE POLICY "Restaurant admins can see users in their restaurant"
  ON users FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_restaurant_id() AND 
         is_restaurant_admin(get_user_restaurant_id()));

CREATE POLICY "Users can see their own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Platform admins can insert users"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (is_platform_admin());

CREATE POLICY "Restaurant admins can insert staff users for their restaurant"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (is_restaurant_admin(tenant_id) AND role IN ('kitchen_staff', 'restaurant_admin'));

CREATE POLICY "Platform admins can update users"
  ON users FOR UPDATE
  TO authenticated
  USING (is_platform_admin());

CREATE POLICY "Restaurant admins can update users in their restaurant"
  ON users FOR UPDATE
  TO authenticated
  USING (tenant_id = get_user_restaurant_id() AND 
         is_restaurant_admin(get_user_restaurant_id()))
  WITH CHECK (tenant_id = get_user_restaurant_id());

CREATE POLICY "Users can update their own data"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = OLD.role);

CREATE POLICY "Platform admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING (is_platform_admin());

CREATE POLICY "Restaurant admins can delete users in their restaurant"
  ON users FOR DELETE
  TO authenticated
  USING (tenant_id = get_user_restaurant_id() AND 
         is_restaurant_admin(get_user_restaurant_id()) AND
         role IN ('kitchen_staff'));

-- Restaurants table policies
CREATE POLICY "Restaurants are viewable by authenticated users"
  ON restaurants FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Platform admins can insert restaurants"
  ON restaurants FOR INSERT
  TO authenticated
  WITH CHECK (is_platform_admin());

CREATE POLICY "Platform admins can update restaurants"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (is_platform_admin());

CREATE POLICY "Restaurant admins can update their restaurant"
  ON restaurants FOR UPDATE
  TO authenticated
  USING (id = get_user_restaurant_id() AND 
         is_restaurant_admin(get_user_restaurant_id()))
  WITH CHECK (id = get_user_restaurant_id());

CREATE POLICY "Platform admins can delete restaurants"
  ON restaurants FOR DELETE
  TO authenticated
  USING (is_platform_admin());

-- Menu Categories policies
CREATE POLICY "Menu categories are viewable by anyone"
  ON menu_categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant admins can insert their menu categories"
  ON menu_categories FOR INSERT
  TO authenticated
  WITH CHECK (restaurant_id = get_user_restaurant_id() AND 
              is_restaurant_admin(restaurant_id));

CREATE POLICY "Platform admins can insert any menu categories"
  ON menu_categories FOR INSERT
  TO authenticated
  WITH CHECK (is_platform_admin());

CREATE POLICY "Restaurant admins can update their menu categories"
  ON menu_categories FOR UPDATE
  TO authenticated
  USING (restaurant_id = get_user_restaurant_id() AND 
         is_restaurant_admin(restaurant_id));

CREATE POLICY "Platform admins can update any menu categories"
  ON menu_categories FOR UPDATE
  TO authenticated
  USING (is_platform_admin());

CREATE POLICY "Restaurant admins can delete their menu categories"
  ON menu_categories FOR DELETE
  TO authenticated
  USING (restaurant_id = get_user_restaurant_id() AND 
         is_restaurant_admin(restaurant_id));

CREATE POLICY "Platform admins can delete any menu categories"
  ON menu_categories FOR DELETE
  TO authenticated
  USING (is_platform_admin());

-- Menu Items policies
CREATE POLICY "Menu items are viewable by anyone"
  ON menu_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Restaurant admins can insert their menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM menu_categories mc
    WHERE mc.id = category_id
    AND mc.restaurant_id = get_user_restaurant_id()
    AND is_restaurant_admin(mc.restaurant_id)
  ));

CREATE POLICY "Platform admins can insert any menu items"
  ON menu_items FOR INSERT
  TO authenticated
  WITH CHECK (is_platform_admin());

CREATE POLICY "Restaurant admins can update their menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM menu_categories mc
    WHERE mc.id = category_id
    AND mc.restaurant_id = get_user_restaurant_id()
    AND is_restaurant_admin(mc.restaurant_id)
  ));

CREATE POLICY "Platform admins can update any menu items"
  ON menu_items FOR UPDATE
  TO authenticated
  USING (is_platform_admin());

CREATE POLICY "Restaurant admins can delete their menu items"
  ON menu_items FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM menu_categories mc
    WHERE mc.id = category_id
    AND mc.restaurant_id = get_user_restaurant_id()
    AND is_restaurant_admin(mc.restaurant_id)
  ));

CREATE POLICY "Platform admins can delete any menu items"
  ON menu_items FOR DELETE
  TO authenticated
  USING (is_platform_admin());

-- Apply similar policies to modifiers, modifier_options, tables, orders, and order_items tables
-- Omitted for brevity but would follow the same pattern as above

-- Set up Auth Hooks for creating user profiles when auth users are created
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 
         COALESCE((NEW.raw_user_meta_data->>'role')::text, 'customer')::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user(); 