import { neon } from "@neondatabase/serverless";

import "dotenv/config";

// Creates a SQL connection using our DB URL
export const sql = neon(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await sql`CREATE TABLE IF NOT EXISTS transactions(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      title  VARCHAR(255) NOT NULL,
      amount  DECIMAL(10,2) NOT NULL,
      category VARCHAR(255) NOT NULL,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    await sql`CREATE TABLE IF NOT EXISTS budgets(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      category VARCHAR(255) NOT NULL,
      amount DECIMAL(10,2) NOT NULL,
      period VARCHAR(50) NOT NULL DEFAULT 'monthly',
      alert_threshold DECIMAL(5,2) NOT NULL DEFAULT 0,
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    await sql`CREATE TABLE IF NOT EXISTS goals(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      target_amount DECIMAL(10,2) NOT NULL,
      current_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      icon VARCHAR(100) NOT NULL DEFAULT 'trophy',
      created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`;

    await sql`CREATE TABLE IF NOT EXISTS categories(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      icon VARCHAR(100) NOT NULL DEFAULT 'pricetag',
      color VARCHAR(20) NOT NULL DEFAULT '#00D09C',
      created_at DATE NOT NULL DEFAULT CURRENT_DATE,
      UNIQUE (user_id, name)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS notifications(
      id SERIAL PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      is_read BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )`;

    console.log("Database initialized successfully");
  } catch (error) {
    console.log("Error initializing DB", error);
    process.exit(1); // status code 1 means failure, 0 success
  }
}
