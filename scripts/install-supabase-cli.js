#!/usr/bin/env node

/**
 * Supabase CLI Installation Helper
 * 
 * This script provides instructions and tries to install the Supabase CLI
 * which is required for database migrations and backups.
 * 
 * Usage:
 *   node scripts/install-supabase-cli.js
 */

const { spawn } = require('child_process');
const os = require('os');

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
 * Display installation instructions based on OS
 */
function getInstallationInstructions() {
  const platform = os.platform();
  
  console.log('\nSupabase CLI Installation Instructions:');
  console.log('=====================================\n');
  
  switch (platform) {
    case 'darwin': // macOS
      console.log('macOS (using Homebrew):');
      console.log('  brew install supabase/tap/supabase\n');
      console.log('Alternative (using NPM):');
      console.log('  npm install -g supabase\n');
      break;
    case 'win32': // Windows
      console.log('Windows (using NPM):');
      console.log('  npm install -g supabase\n');
      console.log('Alternative (using Windows Package Manager):');
      console.log('  winget install Supabase.CLI\n');
      break;
    case 'linux': // Linux
      console.log('Linux:');
      console.log('  npm install -g supabase\n');
      console.log('Alternative (using Homebrew on Linux):');
      console.log('  brew install supabase/tap/supabase\n');
      break;
    default:
      console.log('For your platform, try:');
      console.log('  npm install -g supabase\n');
  }
  
  console.log('For more information, visit:');
  console.log('  https://supabase.com/docs/guides/cli\n');
}

/**
 * Check if Supabase CLI is already installed
 */
async function isSupabaseCliInstalled() {
  try {
    // Try to run supabase --version
    await execCommand('supabase', ['--version']);
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Try to install Supabase CLI
 */
async function tryInstallSupabaseCli() {
  const platform = os.platform();
  
  console.log('\nAttempting to install Supabase CLI...');
  
  try {
    if (platform === 'darwin') {
      // Try to install using Homebrew on macOS
      try {
        await execCommand('brew', ['install', 'supabase/tap/supabase']);
        return true;
      } catch (err) {
        // If Homebrew fails, try NPM
        console.log('Homebrew installation failed, trying NPM...');
        await execCommand('npm', ['install', '-g', 'supabase']);
        return true;
      }
    } else {
      // For other platforms, use NPM
      await execCommand('npm', ['install', '-g', 'supabase']);
      return true;
    }
  } catch (err) {
    console.error('Failed to install Supabase CLI automatically:', err.message);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('Checking for Supabase CLI installation...');
  
  const isInstalled = await isSupabaseCliInstalled();
  
  if (isInstalled) {
    console.log('\n✅ Supabase CLI is already installed!');
    console.log('You can now run database migrations and backups.');
    return;
  }
  
  console.log('\n❌ Supabase CLI not found.');
  
  // Ask if we should try to install it
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('\nWould you like to try to install it automatically? (y/n): ', async (answer) => {
    if (answer.toLowerCase() === 'y') {
      const installSuccess = await tryInstallSupabaseCli();
      
      if (installSuccess) {
        console.log('\n✅ Supabase CLI installed successfully!');
        console.log('You can now run database migrations and backups.');
      } else {
        console.log('\n❌ Automatic installation failed.');
        getInstallationInstructions();
      }
    } else {
      getInstallationInstructions();
    }
    
    readline.close();
  });
}

// Run the main function
main(); 