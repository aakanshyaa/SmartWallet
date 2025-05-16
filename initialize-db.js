/**
 * Database Initialization Script
 * 
 * This script ensures that all required tables are created in the database
 * and adds necessary columns if they're missing.
 */

const { db, initializeDatabase } = require('./src/models/db');

console.log('Starting database initialization...');

// Run the database initialization function
initializeDatabase();

// Give some time for async operations to complete
setTimeout(() => {
  console.log('Database initialization completed. You can now start the application.');
  process.exit(0);
}, 3000); 