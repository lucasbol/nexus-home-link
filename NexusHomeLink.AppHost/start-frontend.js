#!/usr/bin/env node

// Simple frontend startup script for Aspire
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting frontend development server...');
console.log('Frontend will be available at: http://localhost:3000');

// Change to frontend directory
process.chdir(path.join(__dirname, 'frontend'));

// Start pnpm dev with explicit port configuration
const child = spawn('pnpm', ['dev', '--port', '3000', '--host', '0.0.0.0'], {
  stdio: 'inherit',
  shell: true
});

child.on('error', (error) => {
  console.error('Failed to start frontend:', error);
  process.exit(1);
});

child.on('exit', (code) => {
  console.log(`Frontend process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down frontend...');
  child.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Shutting down frontend...');
  child.kill('SIGTERM');
});
