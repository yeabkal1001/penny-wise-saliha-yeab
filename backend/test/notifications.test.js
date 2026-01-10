import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/server.js";
import { cleanupUser, hasDatabase, setupTestDB } from "./utils.js";

const TEST_USER_ID = `test-user-${Date.now()}-notifications`;

test("notifications create/list/mark read/mark all", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const first = await request(app)
      .post("/api/notifications")
      .send({
        user_id: TEST_USER_ID,
        type: "budget",
        title: "Budget alert",
        message: "You exceeded your budget",
      });

    assert.equal(first.status, 201);
    const firstId = first.body.id;

    const second = await request(app)
      .post("/api/notifications")
      .send({
        user_id: TEST_USER_ID,
        type: "goal",
        title: "Goal progress",
        message: "You reached 50%",
      });

    assert.equal(second.status, 201);

    const list = await request(app).get(`/api/notifications/${TEST_USER_ID}`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body));
    assert.ok(list.body.length >= 2);

    const markRead = await request(app)
      .put(`/api/notifications/${firstId}/read`)
      .send({ user_id: TEST_USER_ID });
    assert.equal(markRead.status, 200);
    assert.equal(markRead.body.is_read, true);

    const markAll = await request(app)
      .put("/api/notifications/read-all")
      .send({ user_id: TEST_USER_ID });
    assert.equal(markAll.status, 200);
    assert.ok(typeof markAll.body.updated === "number");
  } finally {
    await cleanupUser(TEST_USER_ID);
  }
});

test("notifications validation errors", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const missingFields = await request(app)
      .post("/api/notifications")
      .send({ user_id: "x" });
    assert.equal(missingFields.status, 400);

    const missingUser = await request(app)
      .put("/api/notifications/999999/read")
      .send({});
    assert.equal(missingUser.status, 400);

    const notFound = await request(app)
      .put("/api/notifications/999999/read")
      .send({ user_id: "x" });
    assert.equal(notFound.status, 404);
  } finally {
    await cleanupUser("x");
  }
});
