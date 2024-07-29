import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:password123@localhost:5432/postgres",
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
});

export default pool;
