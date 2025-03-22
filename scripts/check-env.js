#!/usr/bin/env node

/**
 * Migration Environment Check
 * 
 * This script verifies that the environment is properly configured for
 * running database migrations and backups.
 * 
 * Usage:
 *   node scripts/check-env.js
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// Required environment variables
const REQUIRED_ENV_VARS = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
  'REACT_APP_SUPABASE_SERVICE_ROLE_KEY'
];

// Required directories
const REQUIRED_DIRS = [
  path.join(__dirname, '..', 'supabase', 'migrations'),
  path.join(__dirname, '..', 'supabase', 'backups')
];

/**
 * Execute a command and return the output as a promise
 */
function execCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'pipe' });
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        resolve(stdout.trim());
      } else {
        reject(new Error(`Command failed with exit code ${code}: ${stderr}`));
      }
    });
    
    child.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Check if a directory exists and create it if it doesn't
 */
function checkDirectory(dir) {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ Created directory: ${dir}`);
    } else {
      console.log(`✅ Directory exists: ${dir}`);
    }
    return true;
  } catch (err) {
    console.error(`❌ Error with directory ${dir}:`, err.message);
    return false;
  }
}

/**
 * Check if Supabase CLI is installed
 */
async function checkSupabaseCli() {
  try {
    const version = await execCommand('supabase', ['--version']);
    console.log(`✅ Supabase CLI is installed (${version})`);
    return true;
  } catch (err) {
    console.error('❌ Supabase CLI is not installed');
    console.log('   To install Supabase CLI, run: npm run db:setup-cli');
    return false;
  }
}

/**
 * Check for required environment variables
 */
function checkEnvironmentVariables() {
  // Load environment from .env file if it exists
  const envPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  }
  
  let allPresent = true;
  
  REQUIRED_ENV_VARS.forEach(envVar => {
    if (!process.env[envVar]) {
      console.error(`❌ Missing environment variable: ${envVar}`);
      allPresent = false;
    } else {
      console.log(`✅ Environment variable found: ${envVar}`);
    }
  });
  
  if (!allPresent) {
    console.log('\nMake sure you have a .env file in the project root with these variables.');
    console.log('You can copy .env.example to .env and fill in the values.');
  }
  
  return allPresent;
}

/**
 * Check if migration files exist
 */
function checkMigrationFiles() {
  const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
  
  if (!fs.existsSync(migrationsDir)) {
    console.error(`❌ Migrations directory not found: ${migrationsDir}`);
    return false;
  }
  
  const metadataFile = path.join(migrationsDir, '00_metadata.sql');
  if (!fs.existsSync(metadataFile)) {
    console.error(`❌ Migration metadata file not found: ${metadataFile}`);
    return false;
  }
  
  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter(file => file.match(/^\d+_.*\.sql$/));
  
  if (migrationFiles.length === 0) {
    console.error('❌ No migration files found');
    return false;
  }
  
  console.log(`✅ Found ${migrationFiles.length} migration files`);
  return true;
}

/**
 * Verify environment and setup
 */
async function verifyEnvironment() {
  console.log('=== busboyPOS Migration Environment Check ===\n');
  
  let allChecksPass = true;
  
  // Check directories
  console.log('Checking required directories...');
  REQUIRED_DIRS.forEach(dir => {
    const dirStatus = checkDirectory(dir);
    allChecksPass = allChecksPass && dirStatus;
  });
  console.log('');
  
  // Check environment variables
  console.log('Checking environment variables...');
  const envStatus = checkEnvironmentVariables();
  allChecksPass = allChecksPass && envStatus;
  console.log('');
  
  // Check Supabase CLI
  console.log('Checking Supabase CLI...');
  const cliStatus = await checkSupabaseCli();
  allChecksPass = allChecksPass && cliStatus;
  console.log('');
  
  // Check migration files
  console.log('Checking migration files...');
  const migrationsStatus = checkMigrationFiles();
  allChecksPass = allChecksPass && migrationsStatus;
  console.log('');
  
  // Summary
  console.log('=== Environment Check Summary ===');
  if (allChecksPass) {
    console.log('✅ All checks passed! Your environment is ready for database migrations.');
  } else {
    console.log('❌ Some checks failed. Please fix the issues before running migrations.');
  }
  
  return allChecksPass;
}

// Run the verification
verifyEnvironment()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('Error during environment check:', err);
    process.exit(1);
  }); 