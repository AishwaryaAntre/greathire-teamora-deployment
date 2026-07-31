import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { setupTestApp, teardownTestApp, loginAs, EMPLOYEE_EMAIL } from "./helpers/setup.js";

let app, auth;

before(async () => {
  app = await setupTestApp();
  auth = await loginAs(request, app, EMPLOYEE_EMAIL);
});

after(async () => {
  await teardownTestApp();
});

function bearer() {
  return `Bearer ${auth.token}`;
}

test("check-in requires authentication", async () => {
  let res = await request(app).post("/api/attendance/check-in");
  assert.equal(res.status, 401);
});

test("check-in creates today's attendance record for the caller", async () => {
  let res = await request(app).post("/api/attendance/check-in").set("Authorization", bearer());
  assert.equal(res.status, 201);
  assert.equal(res.body.data.employeeId, auth.user.employeeId);
  assert.ok(res.body.data.checkIn, "expected a check-in time to be recorded");
});

test("check-out records a check-out time for the same record", async () => {
  let res = await request(app).post("/api/attendance/check-out").set("Authorization", bearer());
  assert.equal(res.status, 200);
  assert.equal(res.body.data.employeeId, auth.user.employeeId);
  assert.ok(res.body.data.checkOut, "expected a check-out time to be recorded");
});

test("check-out with no prior check-in for the day fails cleanly", async () => {
  // A fresh employee (emp_003) with no attendance record yet today.
  let fresh = await loginAs(request, app, "elonmusk@greathire.com");
  let res = await request(app).post("/api/attendance/check-out").set("Authorization", `Bearer ${fresh.token}`);
  assert.equal(res.status, 404);
});

test("attendance stats endpoint responds for an authenticated user", async () => {
  let res = await request(app).get("/api/attendance/stats").set("Authorization", bearer());
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
});

test("attendance list query validation rejects a malformed date", async () => {
  let res = await request(app).get("/api/attendance?date=not-a-date").set("Authorization", bearer());
  assert.equal(res.status, 400);
});
