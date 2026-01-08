import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app } from "../src/server.js";
import { cleanupUser, hasDatabase, setupTestDB } from "./utils.js";

const TEST_USER_ID = `test-user-${Date.now()}-categories`;

test("categories create/list/duplicate/delete", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const create = await request(app)
      .post("/api/categories")
      .send({
        user_id: TEST_USER_ID,
        name: "Groceries",
        icon: "basket",
        color: "#2ECC71",
      });

    assert.equal(create.status, 201);
    const categoryId = create.body.id;
    assert.ok(categoryId);

    const duplicate = await request(app)
      .post("/api/categories")
      .send({
        user_id: TEST_USER_ID,
        name: "Groceries",
        icon: "basket",
        color: "#2ECC71",
      });
    assert.equal(duplicate.status, 409);

    const list = await request(app).get(`/api/categories/${TEST_USER_ID}`);
    assert.equal(list.status, 200);
    assert.ok(Array.isArray(list.body));

    const del = await request(app)
      .delete(`/api/categories/${categoryId}`)
      .send({ user_id: TEST_USER_ID });
    assert.equal(del.status, 200);
  } finally {
    await cleanupUser(TEST_USER_ID);
  }
});

test("categories validation errors", { skip: !hasDatabase }, async () => {
  await setupTestDB();
  try {
    const missingFields = await request(app)
      .post("/api/categories")
      .send({ user_id: "x" });
    assert.equal(missingFields.status, 400);

    const missingUser = await request(app)
      .delete("/api/categories/999999")
      .send({});
    assert.equal(missingUser.status, 400);

    const notFound = await request(app)
      .delete("/api/categories/999999")
      .send({ user_id: "x" });
    assert.equal(notFound.status, 404);
  } finally {
    await cleanupUser("x");
  }
});
