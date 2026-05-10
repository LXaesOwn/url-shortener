import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


console.log('DB Config:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  hasPassword: !!process.env.DB_PASSWORD
});

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'postgres',
  password: String(process.env.DB_PASSWORD || 'postgres'), 
  database: process.env.DB_NAME || 'url_shortener',
});


pool.connect((err, client, release) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

export const query = (text: string, params?: any[]) => pool.query(text, params);
export default pool;