import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  host: !connectionString ? (process.env.POSTGRES_HOST || 'localhost') : undefined,
  port: !connectionString ? parseInt(process.env.POSTGRES_PORT || '5432') : undefined,
  database: !connectionString ? (process.env.POSTGRES_DB || 'frank_motors') : undefined,
  user: !connectionString ? (process.env.POSTGRES_USER || 'admin') : undefined,
  password: !connectionString ? (process.env.POSTGRES_PASSWORD || 'strong_password_here') : undefined,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : (connectionString ? { rejectUnauthorized: false } : false),
});

export default pool;
