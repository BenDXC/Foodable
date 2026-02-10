import app from './app';
import { config } from './config';
import { testConnection, initializeTables, closePool } from './config/database';
import { logInfo, logError } from './utils/logger';

/**
 * Start the server
 */
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    logInfo('Testing database connection...');
    await testConnection();

    // Initialize database tables
    logInfo('Initializing database tables...');
    await initializeTables();

    // Start Express server
    const server = app.listen(config.PORT, () => {
      logInfo(`Server started successfully`, {
        port: config.PORT,
        environment: config.NODE_ENV,
        apiVersion: config.API_VERSION,
      });
      logInfo(`API available at: http://localhost:${config.PORT}/api/${config.API_VERSION}`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logInfo(`${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logInfo('HTTP server closed');

        try {
          await closePool();
          logInfo('Database connections closed');
          process.exit(0);
        } catch (error) {
          logError('Error during graceful shutdown', error);
          process.exit(1);
        }
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logError('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    // Listen for termination signals
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logError('Failed to start server', error);
    process.exit(1);
  }
};

// Start the server
startServer();
