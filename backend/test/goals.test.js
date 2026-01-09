import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/server.js";
import { cleanupUser, hasDatabase, setupTestDB } from "./utils.js";

const TEST_USER_ID = `test-user-${Date.now()}-goals`;

test("goals CRUD", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const create = await request(app)
      .post("/api/goals")
      .send({
        user_id: TEST_USER_ID,
        name: "Emergency Fund",
        target_amount: 1000,
        current_amount: 100,
      });

    assert.equal(create.status, 201);
    const goalId = create.body.id;
    assert.ok(goalId);

    const list = await request(app).get(`/api/goals/${TEST_USER_ID}`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body));

    const update = await request(app)
      .put(`/api/goals/${goalId}`)
      .send({ user_id: TEST_USER_ID, target_amount: 1500 });

    assert.equal(update.status, 200);
    assert.equal(Number(update.body.target_amount), 1500);

    const del = await request(app)
      .delete(`/api/goals/${goalId}`)
      .send({ user_id: TEST_USER_ID });
    assert.equal(del.status, 200);
  } finally {
    await cleanupUser(TEST_USER_ID);
  }
});

test("goals validation errors", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const missingFields = await request(app)
      .post("/api/goals")
      .send({ user_id: "x" });
    assert.equal(missingFields.status, 400);

    const missingUser = await request(app)
      .put("/api/goals/999999")
      .send({ target_amount: 10 });
    assert.equal(missingUser.status, 400);

    const notFound = await request(app)
      .put("/api/goals/999999")
      .send({ user_id: "x", target_amount: 10 });
    assert.equal(notFound.status, 404);
  } finally {
    await cleanupUser("x");
  }
});
