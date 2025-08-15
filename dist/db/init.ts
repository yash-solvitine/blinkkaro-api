import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { config } from '../config/config';
import { log } from '../utils/logger';

async function initializeDatabase() {
  // Create a pool for the default postgres database
  const defaultPool = new Pool({
    connectionString: config.db.url.replace('/blinkkaro', '/postgres'),
  });

  try {
    // Try to create the database if it doesn't exist
    try {
      const result = await defaultPool.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        ['blinkkaro']
      );

      if (result.rowCount === 0) {
        log.info('Creating database...');
        await defaultPool.query('CREATE DATABASE blinkkaro');
        log.info('Database created successfully');
      }
    } catch (error) {
      log.error('Error checking/creating database', { error });
      throw error;
    } finally {
      await defaultPool.end();
    }

    // Connect to the blinkkaro database
    const pool = new Pool({
      connectionString: config.db.url,
    });

    try {
      // Read the schema file
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');

      // Execute the schema
      await pool.query(schema);
      log.info('Database schema initialized successfully');
    } finally {
      await pool.end();
    }
  } catch (error) {
    log.error('Error initializing database schema', { error });
    throw error;
  }
}

// Execute if run directly
if (require.main === module) {
  initializeDatabase()
    .then(() => {
      log.info('Database initialization completed');
      process.exit(0);
    })
    .catch((error) => {
      log.error('Database initialization failed', { error });
      process.exit(1);
    });
}

export default initializeDatabase;