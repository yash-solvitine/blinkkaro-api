import app from './app';
import { config } from './config/config';
import { log } from './utils/logger';
import initializeDatabase from './db/init';

async function startServer() {
  try {
    // Initialize database
    await initializeDatabase();
    log.info('Database initialized successfully');

    // Start server
    const server = app.listen(config.server.port, () => {
      log.info(`Server is running on port ${config.server.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      log.info('Shutting down server...');
      
      server.close(() => {
        log.info('Server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);

  } catch (error) {
    log.error('Failed to start server', { error });
    process.exit(1);
  }
}

startServer();