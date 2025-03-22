-- Migration: 02_add_reservations
-- Version: 0.2.0
-- Description: Add reservation system to busboyPOS

-- Check if this migration has already been applied
DO $$
BEGIN
  IF NOT has_migration_been_applied('0.2.0') THEN
    -- Migration code starts here
    
    -- Create reservations table
    CREATE TABLE reservations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
      customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
      table_id UUID REFERENCES tables(id) ON DELETE SET NULL,
      reservation_date DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      party_size INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')),
      notes TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    -- Create index for restaurant_id and date for faster reservations lookup
    CREATE INDEX idx_reservations_restaurant_id ON reservations(restaurant_id);
    CREATE INDEX idx_reservations_date_time ON reservations(reservation_date, start_time);
    CREATE INDEX idx_reservations_customer ON reservations(customer_id);
    CREATE INDEX idx_reservations_status ON reservations(status);

    -- Auto-update updated_at timestamp
    CREATE TRIGGER update_reservations_updated_at 
      BEFORE UPDATE ON reservations 
      FOR EACH ROW 
      EXECUTE PROCEDURE update_updated_at_column();

    -- Add RLS policies for reservations
    ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

    -- RLS Policies for reservations
    -- Platform admins can see all reservations
    CREATE POLICY "Platform admins can see all reservations"
      ON reservations FOR SELECT
      TO authenticated
      USING (is_platform_admin());

    -- Restaurant admins can see their restaurant's reservations
    CREATE POLICY "Restaurant admins can see their reservations"
      ON reservations FOR SELECT
      TO authenticated
      USING (restaurant_id = get_user_restaurant_id() AND 
             is_restaurant_admin(restaurant_id));

    -- Kitchen staff can see reservations for their restaurant
    CREATE POLICY "Kitchen staff can see their restaurant's reservations"
      ON reservations FOR SELECT
      TO authenticated
      USING (restaurant_id = get_user_restaurant_id() AND 
             is_kitchen_staff(restaurant_id));

    -- Customers can see their own reservations
    CREATE POLICY "Customers can see their own reservations"
      ON reservations FOR SELECT
      TO authenticated
      USING (customer_id = auth.uid());

    -- Restaurant admins can create/update/delete reservations
    CREATE POLICY "Restaurant admins can insert reservations"
      ON reservations FOR INSERT
      TO authenticated
      WITH CHECK (restaurant_id = get_user_restaurant_id() AND 
                  is_restaurant_admin(restaurant_id));

    CREATE POLICY "Restaurant admins can update reservations"
      ON reservations FOR UPDATE
      TO authenticated
      USING (restaurant_id = get_user_restaurant_id() AND 
             is_restaurant_admin(restaurant_id));

    CREATE POLICY "Restaurant admins can delete reservations"
      ON reservations FOR DELETE
      TO authenticated
      USING (restaurant_id = get_user_restaurant_id() AND 
             is_restaurant_admin(restaurant_id));

    -- Customers can create and cancel their own reservations
    CREATE POLICY "Customers can create reservations"
      ON reservations FOR INSERT
      TO authenticated
      WITH CHECK (customer_id = auth.uid());

    CREATE POLICY "Customers can update or cancel their own reservations"
      ON reservations FOR UPDATE
      TO authenticated
      USING (customer_id = auth.uid())
      WITH CHECK (customer_id = auth.uid() AND 
                 status IN ('pending', 'confirmed', 'cancelled'));

    -- Create view for active reservations with table and customer details
    CREATE VIEW active_reservations AS
    SELECT 
      r.id,
      r.restaurant_id,
      r.reservation_date,
      r.start_time,
      r.end_time,
      r.party_size,
      r.status,
      r.notes,
      t.id AS table_id,
      t.table_number,
      t.capacity,
      u.id AS customer_id,
      u.full_name AS customer_name,
      u.email AS customer_email,
      u.phone AS customer_phone
    FROM reservations r
    LEFT JOIN tables t ON r.table_id = t.id
    LEFT JOIN users u ON r.customer_id = u.id
    WHERE r.status IN ('pending', 'confirmed');

    -- Add settings field for reservation settings in restaurant settings
    -- This is an idempotent operation that adds the field if it doesn't exist
    DO $$
    BEGIN
      -- Check if restaurants have reservationSettings
      IF NOT EXISTS (
        SELECT 1 FROM restaurants 
        WHERE settings ? 'reservationSettings'
        LIMIT 1
      ) THEN
        -- Update all restaurants to include reservation settings
        UPDATE restaurants
        SET settings = settings || '{
          "reservationSettings": {
            "enabled": true,
            "minimumNotice": 30,
            "maxReservationDays": 30,
            "defaultDuration": 90,
            "maxPartySize": 20,
            "timeSlots": ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00"]
          }
        }'::jsonb;
      END IF;
    END $$;

    -- Record this migration
    PERFORM record_migration('0.2.0', '02_add_reservations', 'Add reservation system to busboyPOS');
  END IF;
END $$; 