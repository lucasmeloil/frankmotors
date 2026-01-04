import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'frank_motors',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'strong_password_here',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000, // Aumentado para lidar com conexões lentas
});

export default pool;
