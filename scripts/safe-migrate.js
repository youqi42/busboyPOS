#!/usr/bin/env node

/**
 * Safe Migration Script
 * 
 * This script performs a database backup before running migrations,
 * ensuring that there's always a rollback path available.
 * 
 * Usage:
 *   node scripts/safe-migrate.js
 */

const { spawn } = require('child_process');
const path = require('path');

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
 * Perform a safe migration with backup
 */
async function safeMigrate() {
  try {
    console.log('Starting safe migration process...');
    
    // Step 0: Check environment
    console.log('Step 0: Checking environment...');
    await execCommand('node', [
      path.join(__dirname, 'check-env.js')
    ]);
    
    // Step 1: Create backup
    console.log('\nStep 1: Creating database backup...');
    await execCommand('node', [
      path.join(__dirname, 'backup-db.js')
    ]);
    
    // Step 2: Apply migrations
    console.log('\nStep 2: Applying migrations...');
    await execCommand('node', [
      path.join(__dirname, '..', 'supabase', 'migrate.js')
    ]);
    
    console.log('\n✅ Safe migration completed successfully!');
  } catch (err) {
    console.error('\n❌ Error during safe migration:', err.message);
    console.error('Migration process stopped. Please check the error and try again.');
    process.exit(1);
  }
}

// Run the safe migration process
safeMigrate(); 