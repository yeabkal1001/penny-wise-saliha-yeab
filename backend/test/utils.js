import { initDB, sql } from "../src/config/db.js";

export const hasDatabase = Boolean(process.env.DATABASE_URL);

export async function setupTestDB() {
  if (!hasDatabase) return;
  await initDB();
}

export async function cleanupUser(userId) {
  if (!hasDatabase) return;
  await sql`DELETE FROM notifications WHERE user_id = ${userId}`;
  await sql`DELETE FROM transactions WHERE user_id = ${userId}`;
  await sql`DELETE FROM budgets WHERE user_id = ${userId}`;
  await sql`DELETE FROM goals WHERE user_id = ${userId}`;
  await sql`DELETE FROM categories WHERE user_id = ${userId}`;
}
