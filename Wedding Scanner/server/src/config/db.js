const { Pool } = require("pg");

let pool;

const getPool = () => {
  if (!pool) {
    throw new Error("Database pool has not been initialized. Call connectDB first.");
  }
  return pool;
};

const connectDB = async () => {
  const connectionString = process.env.POSTGRES_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("POSTGRES_URL (or DATABASE_URL) is not set in environment variables.");
  }

  pool = new Pool({ connectionString });
  await pool.query("SELECT 1");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS guests (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      qr_token UUID NOT NULL UNIQUE,
      checked_in BOOLEAN NOT NULL DEFAULT FALSE,
      category TEXT NOT NULL DEFAULT 'General',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  console.log("PostgreSQL connected");
};

module.exports = { connectDB, getPool };
