#!/usr/bin/env node

/**
 * Create Migration Script
 * 
 * This script helps create a new migration file with proper versioning.
 * 
 * Usage:
 *   node scripts/create-migration.js [migration_name]
 * 
 * Example:
 *   node scripts/create-migration.js add_loyalty_points
 *   
 * This will create a new migration file like:
 *   supabase/migrations/03_add_loyalty_points.sql
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const MIGRATIONS_DIR = path.join(__dirname, '..', 'supabase', 'migrations');
const MIGRATION_TEMPLATE = `-- Migration: {{name}}
-- Version: {{version}}
-- Description: {{description}}

-- Check if this migration has already been applied
DO $$
BEGIN
  IF NOT has_migration_been_applied('{{version}}') THEN
    -- Migration code starts here
    
    -- Put your SQL statements here
    
    -- Record this migration
    PERFORM record_migration('{{version}}', '{{name}}', '{{description}}');
  END IF;
END $$;
`;

// Ensure the migrations directory exists
if (!fs.existsSync(MIGRATIONS_DIR)) {
  fs.mkdirSync(MIGRATIONS_DIR, { recursive: true });
}

// Get the current migrations
const migrations = fs.readdirSync(MIGRATIONS_DIR)
  .filter(file => file.match(/^\d+_.*\.sql$/))
  .sort();

// Determine the next migration number
let nextNumber = 1;
if (migrations.length > 0) {
  const lastMigration = migrations[migrations.length - 1];
  const match = lastMigration.match(/^(\d+)_/);
  if (match) {
    nextNumber = parseInt(match[1], 10) + 1;
  }
}

// Format the migration number with leading zeros
const paddedNumber = nextNumber.toString().padStart(2, '0');

// Get the migration name from command line arguments
let migrationName = process.argv[2];

// Create readline interface for user input if needed
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function promptUser() {
  // If no name was provided, ask for one
  if (!migrationName) {
    migrationName = await new Promise(resolve => {
      rl.question('Enter migration name (e.g. add_users_table): ', answer => {
        resolve(answer.trim().toLowerCase().replace(/\s+/g, '_'));
      });
    });
    
    if (!migrationName) {
      console.error('Error: Migration name is required');
      rl.close();
      process.exit(1);
    }
  }
  
  // Ask for a description
  const description = await new Promise(resolve => {
    rl.question('Enter migration description: ', answer => {
      resolve(answer.trim());
    });
  });
  
  // Determine the version (semver format)
  let version;
  
  // Check if the 00_metadata.sql file exists to determine the current version
  const metadataPath = path.join(MIGRATIONS_DIR, '00_metadata.sql');
  if (fs.existsSync(metadataPath)) {
    const matches = [];
    const migrationFiles = fs.readdirSync(MIGRATIONS_DIR).filter(f => f !== '00_metadata.sql');
    
    for (const file of migrationFiles) {
      const content = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
      const versionMatch = content.match(/-- Version: ([\d\.]+)/);
      if (versionMatch) {
        matches.push(versionMatch[1]);
      }
    }
    
    if (matches.length > 0) {
      // Sort versions and get the latest
      const versions = matches.sort((a, b) => {
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aVal = i < aParts.length ? aParts[i] : 0;
          const bVal = i < bParts.length ? bParts[i] : 0;
          
          if (aVal !== bVal) {
            return aVal - bVal;
          }
        }
        
        return 0;
      });
      
      const latestVersion = versions[versions.length - 1];
      const parts = latestVersion.split('.').map(Number);
      parts[parts.length - 1]++;
      version = parts.join('.');
    }
  }
  
  // If no version was determined, use 0.1.0
  if (!version) {
    version = '0.1.0';
  }
  
  // Create the filename
  const filename = `${paddedNumber}_${migrationName}.sql`;
  const filepath = path.join(MIGRATIONS_DIR, filename);
  
  // Check if the file already exists
  if (fs.existsSync(filepath)) {
    console.error(`Error: Migration file ${filename} already exists`);
    rl.close();
    process.exit(1);
  }
  
  // Create the migration file
  const content = MIGRATION_TEMPLATE
    .replace(/{{name}}/g, migrationName)
    .replace(/{{version}}/g, version)
    .replace(/{{description}}/g, description || `Migration for ${migrationName}`);
  
  fs.writeFileSync(filepath, content);
  
  console.log(`✅ Created migration file: ${filepath}`);
  console.log(`   Version: ${version}`);
  
  rl.close();
}

promptUser(); 