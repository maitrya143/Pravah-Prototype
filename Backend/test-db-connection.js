// backend/test-db-connection.js
import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

console.log("ENV (sample):", {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD ? "SET" : "EMPTY",
  DB_NAME: process.env.DB_NAME,
});

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("DB Connected OK:", res.rows[0]);
  } catch (err) {
    console.error("DB ERROR:", err.message);
  } finally {
    await pool.end();
  }
})();
