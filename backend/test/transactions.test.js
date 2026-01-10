import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/server.js";
import { cleanupUser, hasDatabase, setupTestDB } from "./utils.js";

const TEST_USER_ID = `test-user-${Date.now()}-transactions`;

test("transactions CRUD and summary", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const createExpense = await request(app)
      .post("/api/transactions")
      .send({
        user_id: TEST_USER_ID,
        title: "Lunch",
        amount: -12.5,
        category: "Food",
      });

    assert.equal(createExpense.status, 201);
    assert.ok(createExpense.body.id);

    const createIncome = await request(app)
      .post("/api/transactions")
      .send({
        user_id: TEST_USER_ID,
        title: "Salary",
        amount: 120,
        category: "Income",
      });

    assert.equal(createIncome.status, 201);

    const list = await request(app).get(`/api/transactions/${TEST_USER_ID}`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body));
    assert.ok(list.body.length >= 2);

    const summary = await request(app).get(`/api/transactions/summary/${TEST_USER_ID}`);
    assert.equal(summary.status, 200);
    assert.equal(Number(summary.body.balance), 107.5);
    assert.equal(Number(summary.body.income), 120);
    assert.equal(Number(summary.body.expenses), -12.5);

    const deleteExpense = await request(app)
      .delete(`/api/transactions/${createExpense.body.id}`)
      .send({ user_id: TEST_USER_ID });
    assert.equal(deleteExpense.status, 200);
  } finally {
    await cleanupUser(TEST_USER_ID);
  }
});

test("transactions validation errors", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const missingFields = await request(app)
      .post("/api/transactions")
      .send({ user_id: "x", title: "Bad" });
    assert.equal(missingFields.status, 400);

    const missingUser = await request(app)
      .delete("/api/transactions/999999")
      .send({});
    assert.equal(missingUser.status, 400);

    const invalidId = await request(app)
      .delete("/api/transactions/not-a-number")
      .send({ user_id: "x" });
    assert.equal(invalidId.status, 400);
  } finally {
    await cleanupUser("x");
  }
});
