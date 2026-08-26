require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'password',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: process.env.POSTGRES_PORT || 5432,
  database: process.env.POSTGRES_DB || 'campusqueue'
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    console.log('Running setup.sql...');
    const setupSql = fs.readFileSync(path.join(__dirname, 'migrations', 'setup.sql'), 'utf-8');
    await client.query(setupSql);
    console.log('Setup complete.');

    console.log('Running seed.sql...');
    const seedSql = fs.readFileSync(path.join(__dirname, 'migrations', 'seed.sql'), 'utf-8');
    await client.query(seedSql);
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    client.release();
    pool.end();
  }
}

runMigrations();
