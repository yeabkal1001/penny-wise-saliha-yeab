import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/server.js";
import { cleanupUser, hasDatabase, setupTestDB } from "./utils.js";

const TEST_USER_ID = `test-user-${Date.now()}-budgets`;

test("budgets CRUD", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const create = await request(app)
      .post("/api/budgets")
      .send({
        user_id: TEST_USER_ID,
        category: "Food",
        amount: 200,
        period: "monthly",
      });

    assert.equal(create.status, 201);
    const budgetId = create.body.id;
    assert.ok(budgetId);

    const list = await request(app).get(`/api/budgets/${TEST_USER_ID}`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body));

    const update = await request(app)
      .put(`/api/budgets/${budgetId}`)
      .send({ user_id: TEST_USER_ID, amount: 300 });

    assert.equal(update.status, 200);
    assert.equal(Number(update.body.amount), 300);

    const del = await request(app)
      .delete(`/api/budgets/${budgetId}`)
      .send({ user_id: TEST_USER_ID });
    assert.equal(del.status, 200);
  } finally {
    await cleanupUser(TEST_USER_ID);
  }
});

test("budgets validation errors", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const missingFields = await request(app)
      .post("/api/budgets")
      .send({ user_id: "x" });
    assert.equal(missingFields.status, 400);

    const missingUser = await request(app)
      .put("/api/budgets/999999")
      .send({ amount: 50 });
    assert.equal(missingUser.status, 400);

    const notFound = await request(app)
      .put("/api/budgets/999999")
      .send({ user_id: "x", amount: 50 });
    assert.equal(notFound.status, 404);
  } finally {
    await cleanupUser("x");
  }
});
