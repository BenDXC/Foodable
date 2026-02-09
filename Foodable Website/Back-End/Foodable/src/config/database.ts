import mysql from 'mysql2/promise';
import { config } from './index';
import { logInfo, logError } from '../utils/logger';

// Create connection pool
export const pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: config.DB_CONNECTION_LIMIT,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    logInfo('Database connection established successfully');
    connection.release();
  } catch (error) {
    logError('Failed to connect to database', error);
    throw error;
  }
};

// Execute query with error handling
export const query = async <T = any>(
  sql: string,
  params?: any[]
): Promise<T> => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T;
  } catch (error: any) {
    logError(`Database query failed: ${sql}`, error);
    throw error;
  }
};

// Helper function to check if table exists
export const tableExists = async (tableName: string): Promise<boolean> => {
  try {
    const result = await query<any[]>(
      `SELECT COUNT(*) as count FROM information_schema.tables 
       WHERE table_schema = ? AND table_name = ?`,
      [config.DB_NAME, tableName]
    );
    return result[0].count > 0;
  } catch (error) {
    logError(`Error checking table existence: ${tableName}`, error);
    return false;
  }
};

// Initialize database tables if they don't exist
export const initializeTables = async (): Promise<void> => {
  try {
    // Create users/donator table
    const createDonatorTable = `
      CREATE TABLE IF NOT EXISTS donator (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // Create donations table
    const createDonationsTable = `
      CREATE TABLE IF NOT EXISTS donations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        item_name VARCHAR(255) NOT NULL,
        item_quantity INT NOT NULL,
        dietary_preference ENUM('halal', 'non-halal', 'vegan', 'vegetarian') NOT NULL,
        expiry_date DATE NOT NULL,
        image_url VARCHAR(500),
        status ENUM('pending', 'approved', 'claimed', 'expired') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES donator(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // Create food packages table
    const createPackagesTable = `
      CREATE TABLE IF NOT EXISTS food_packages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        donator_id INT NOT NULL,
        receiver_id INT,
        status ENUM('available', 'reserved', 'claimed', 'cancelled') DEFAULT 'available',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (donator_id) REFERENCES donator(id) ON DELETE CASCADE,
        FOREIGN KEY (receiver_id) REFERENCES donator(id) ON DELETE SET NULL,
        INDEX idx_donator (donator_id),
        INDEX idx_receiver (receiver_id),
        INDEX idx_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    // Create refresh tokens table for JWT
    const createRefreshTokensTable = `
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        token VARCHAR(500) NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES donator(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_token (token(255))
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    await query(createDonatorTable);
    await query(createDonationsTable);
    await query(createPackagesTable);
    await query(createRefreshTokensTable);

    logInfo('Database tables initialized successfully');
  } catch (error) {
    logError('Failed to initialize database tables', error);
    throw error;
  }
};

// Graceful shutdown
export const closePool = async (): Promise<void> => {
  try {
    await pool.end();
    logInfo('Database connection pool closed');
  } catch (error) {
    logError('Error closing database connection pool', error);
    throw error;
  }
};

export default pool;
