#!/usr/bin/env node

/**
 * Supabase Migration Runner
 * 
 * This script automates the process of running database migrations in order.
 * It uses the Supabase CLI to apply migrations to the database.
 * 
 * Usage:
 *   node migrate.js
 * 
 * Environment variables:
 *   SUPABASE_URL - The URL of your Supabase instance
 *   SUPABASE_KEY - The service role key for your Supabase instance
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { createClient } = require('@supabase/supabase-js');

// Configuration
const MIGRATIONS_DIR = path.join(__dirname, 'migrations');
const METADATA_MIGRATION = path.join(MIGRATIONS_DIR, '00_metadata.sql');
const MIGRATIONS_PREFIX = /^(\d+)_(.*)\.sql$/;

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Execute a command and return the output as a promise
 */
function execCommand(command, args) {
  return new Promise((resolve, reject) => {
    console.log(`Running: ${command} ${args.join(' ')}`);
    
    const child = spawn(command, args, { stdio: 'inherit' });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
    
    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Check if the migrations table exists
 */
async function checkMigrationTable() {
  const { data, error } = await supabase
    .from('schema_migrations')
    .select('id')
    .limit(1);
  
  if (error && error.code === '42P01') { // relation does not exist
    console.log('Migration table does not exist, setting up metadata...');
    return false;
  } else if (error) {
    throw new Error(`Error checking migration table: ${error.message}`);
  }
  
  return true;
}

/**
 * Get list of applied migrations
 */
async function getAppliedMigrations() {
  const { data, error } = await supabase
    .from('schema_migrations')
    .select('version')
    .order('id', { ascending: true });
  
  if (error) {
    throw new Error(`Error fetching applied migrations: ${error.message}`);
  }
  
  return data.map(m => m.version);
}

/**
 * Get all migration files
 */
function getAllMigrationFiles() {
  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(file => file.match(MIGRATIONS_PREFIX))
    .sort();
  
  return files.map(file => {
    const match = file.match(MIGRATIONS_PREFIX);
    return {
      file,
      number: parseInt(match[1], 10),
      name: match[2],
      path: path.join(MIGRATIONS_DIR, file)
    };
  });
}

/**
 * Apply a migration
 */
async function applyMigration(migration) {
  console.log(`Applying migration ${migration.file}...`);
  
  try {
    await execCommand('supabase', [
      'db',
      'execute',
      '--file',
      migration.path
    ]);
    console.log(`✅ Migration ${migration.file} applied successfully`);
    return true;
  } catch (err) {
    console.error(`❌ Error applying migration ${migration.file}:`, err.message);
    return false;
  }
}

/**
 * Main function to run migrations
 */
async function runMigrations() {
  console.log('Starting database migration process...');
  
  // First check if the schema_migrations table exists
  const tableExists = await checkMigrationTable();
  
  if (!tableExists) {
    // Apply the metadata migration first
    console.log('Applying metadata migration...');
    try {
      await execCommand('supabase', [
        'db',
        'execute',
        '--file',
        METADATA_MIGRATION
      ]);
      console.log('✅ Metadata migration applied successfully');
    } catch (err) {
      console.error('❌ Error applying metadata migration:', err.message);
      process.exit(1);
    }
  }
  
  // Get already applied migrations
  const appliedMigrations = await getAppliedMigrations();
  console.log('Already applied migrations:', appliedMigrations.length > 0 ? appliedMigrations : 'None');
  
  // Get all migration files
  const allMigrations = getAllMigrationFiles();
  console.log(`Found ${allMigrations.length} migration files`);
  
  // Identify migrations that need to be applied
  const migrationsToApply = [];
  
  // Extract version info from each migration file
  for (const migration of allMigrations) {
    try {
      const content = fs.readFileSync(migration.path, 'utf8');
      const versionMatch = content.match(/-- Version: ([\d\.]+)/);
      
      if (versionMatch) {
        const version = versionMatch[1];
        if (!appliedMigrations.includes(version)) {
          migrationsToApply.push({
            ...migration,
            version
          });
        }
      } else {
        console.warn(`⚠️ Warning: No version found in migration ${migration.file}`);
      }
    } catch (err) {
      console.error(`❌ Error reading migration ${migration.file}:`, err.message);
    }
  }
  
  // Apply migrations in order
  if (migrationsToApply.length === 0) {
    console.log('✅ Database is up to date! No migrations to apply.');
    return;
  }
  
  console.log(`Applying ${migrationsToApply.length} migrations...`);
  
  for (const migration of migrationsToApply) {
    const success = await applyMigration(migration);
    if (!success) {
      console.error('❌ Migration process stopped due to an error');
      process.exit(1);
    }
  }
  
  console.log('✅ All migrations applied successfully!');
}

// Run the migration process
runMigrations().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
}); 