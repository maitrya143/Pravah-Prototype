import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create migrations table if it doesn't exist
async function createMigrationsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      run_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(query);
}

// Get list of already run migrations
async function getRunMigrations() {
  const result = await pool.query('SELECT name FROM migrations ORDER BY run_at');
  return result.rows.map(row => row.name);
}

// Run a single migration file
async function runMigration(fileName) {
  const migrationPath = path.join(__dirname, '../../database/migrations', fileName);
  const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
  
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(migrationSQL);
    await client.query('INSERT INTO migrations (name) VALUES ($1)', [fileName]);
    await client.query('COMMIT');
    console.log(`✅ Migration ${fileName} completed`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(`❌ Migration ${fileName} failed:`, error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Run all pending migrations
export async function runMigrations() {
  try {
    await createMigrationsTable();
    const runMigrations = await getRunMigrations();
    
    const migrationsDir = path.join(__dirname, '../../database/migrations');
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();
    
    const pendingMigrations = files.filter(file => !runMigrations.includes(file));
    
    if (pendingMigrations.length === 0) {
      console.log('✅ No pending migrations');
      return;
    }
    
    console.log(`Running ${pendingMigrations.length} migration(s)...`);
    for (const file of pendingMigrations) {
      await runMigration(file);
    }
    
    console.log('✅ All migrations completed');
  } catch (error) {
    console.error('❌ Migration process failed:', error);
    process.exit(1);
  }
}

