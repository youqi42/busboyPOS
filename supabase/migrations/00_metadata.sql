-- Create a migration metadata table to track schema versions
CREATE TABLE IF NOT EXISTS schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  description TEXT
);

-- Create a function to check if a migration has been applied
CREATE OR REPLACE FUNCTION has_migration_been_applied(migration_version VARCHAR) 
RETURNS BOOLEAN AS $$
DECLARE
  migration_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM schema_migrations
    WHERE version = migration_version
  ) INTO migration_exists;
  
  RETURN migration_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to record a migration
CREATE OR REPLACE FUNCTION record_migration(migration_version VARCHAR, migration_name VARCHAR, migration_description TEXT DEFAULT NULL) 
RETURNS VOID AS $$
BEGIN
  INSERT INTO schema_migrations (version, name, description)
  VALUES (migration_version, migration_name, migration_description);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 