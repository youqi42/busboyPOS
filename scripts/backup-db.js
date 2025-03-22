#!/usr/bin/env node

/**
 * Database Backup Script
 * 
 * This script creates a backup of the current Supabase database schema and data.
 * It requires the Supabase CLI to be installed.
 * 
 * Usage:
 *   node scripts/backup-db.js
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Backup configuration
const BACKUP_DIR = path.join(__dirname, '..', 'supabase', 'backups');
const DATE_FORMAT = new Date().toISOString().replace(/[:.]/g, '-').split('T');
const BACKUP_NAME = `backup_${DATE_FORMAT[0]}_${DATE_FORMAT[1].slice(0, -1)}`;

// Ensure the backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

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
 * Create a backup of the database schema and data
 */
async function createBackup() {
  console.log('Creating database backup...');
  
  const schemaOutput = path.join(BACKUP_DIR, `${BACKUP_NAME}_schema.sql`);
  const dataOutput = path.join(BACKUP_DIR, `${BACKUP_NAME}_data.sql`);
  
  try {
    // Export database schema
    await execCommand('supabase', [
      'db',
      'dump',
      '--db-url',
      process.env.REACT_APP_SUPABASE_DB_URL || 'postgresql://postgres:postgres@localhost:54322/postgres',
      '--schema-only',
      '-f',
      schemaOutput
    ]);
    console.log('✅ Schema backup completed');
    
    // Export database data
    await execCommand('supabase', [
      'db',
      'dump',
      '--db-url',
      process.env.REACT_APP_SUPABASE_DB_URL || 'postgresql://postgres:postgres@localhost:54322/postgres',
      '--data-only',
      '-f',
      dataOutput
    ]);
    console.log('✅ Data backup completed');
    
    console.log(`\nBackup created successfully:`);
    console.log(`- Schema: ${schemaOutput}`);
    console.log(`- Data: ${dataOutput}`);
    
    // Also create a combined backup
    console.log('\nCreating combined backup...');
    
    const combinedOutput = path.join(BACKUP_DIR, `${BACKUP_NAME}_full.sql`);
    const schemaContent = fs.readFileSync(schemaOutput, 'utf8');
    const dataContent = fs.readFileSync(dataOutput, 'utf8');
    
    fs.writeFileSync(combinedOutput, `-- SCHEMA\n${schemaContent}\n\n-- DATA\n${dataContent}`);
    
    console.log(`✅ Combined backup created: ${combinedOutput}`);
    console.log(`\nBackup process completed successfully!`);
  } catch (err) {
    console.error('❌ Error creating backup:', err.message);
    process.exit(1);
  }
}

// Run the backup process
createBackup(); 