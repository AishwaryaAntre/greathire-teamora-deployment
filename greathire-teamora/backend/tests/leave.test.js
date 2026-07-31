import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { setupTestApp, teardownTestApp, loginAs, ADMIN_EMAIL, EMPLOYEE_EMAIL } from "./helpers/setup.js";

let app, adminAuth, employeeAuth;

before(async () => {
  app = await setupTestApp();
  adminAuth = await loginAs(request, app, ADMIN_EMAIL);
  employeeAuth = await loginAs(request, app, EMPLOYEE_EMAIL);
});

after(async () => {
  await teardownTestApp();
});

test("employee can submit a leave request for themself", async () => {
  let res = await request(app)
    .post("/api/leave/requests")
    .set("Authorization", `Bearer ${employeeAuth.token}`)
    .send({ leaveType: "Sick Leave", startDate: "2026-10-10", endDate: "2026-10-11", reason: "Flu" });

  assert.equal(res.status, 201);
  assert.equal(res.body.data.employeeId, employeeAuth.user.employeeId);
  assert.equal(res.body.data.status, "Pending");
});

test("leave request rejects an end date before the start date", async () => {
  let res = await request(app)
    .post("/api/leave/requests")
    .set("Authorization", `Bearer ${employeeAuth.token}`)
    .send({ leaveType: "Casual", startDate: "2026-10-10", endDate: "2026-10-05" });

  assert.equal(res.status, 400);
});

test("leave request rejects an unknown leave type", async () => {
  let res = await request(app)
    .post("/api/leave/requests")
    .set("Authorization", `Bearer ${employeeAuth.token}`)
    .send({ leaveType: "Sabbatical", startDate: "2026-10-10", endDate: "2026-10-11" });

  assert.equal(res.status, 400);
});

test("full approval flow: employee submits, admin approves, status updates", async () => {
  let create = await request(app)
    .post("/api/leave/requests")
    .set("Authorization", `Bearer ${employeeAuth.token}`)
    .send({ leaveType: "Annual", startDate: "2026-11-01", endDate: "2026-11-03", reason: "Trip" });
  assert.equal(create.status, 201);
  let requestId = create.body.data.id;

  let approve = await request(app)
    .patch(`/api/leave/requests/${requestId}/approve`)
    .set("Authorization", `Bearer ${adminAuth.token}`);
  assert.equal(approve.status, 200);
  assert.equal(approve.body.data.status, "Approved");

  let fetched = await request(app)
    .get(`/api/leave/requests/${requestId}`)
    .set("Authorization", `Bearer ${adminAuth.token}`);
  assert.equal(fetched.body.data.status, "Approved");
});

test("rejection flow updates status to Rejected", async () => {
  let create = await request(app)
    .post("/api/leave/requests")
    .set("Authorization", `Bearer ${employeeAuth.token}`)
    .send({ leaveType: "Unpaid", startDate: "2026-12-01", endDate: "2026-12-01" });
  let requestId = create.body.data.id;

  let reject = await request(app)
    .patch(`/api/leave/requests/${requestId}/reject`)
    .set("Authorization", `Bearer ${adminAuth.token}`);
  assert.equal(reject.status, 200);
  assert.equal(reject.body.data.status, "Rejected");
});

test("approving a nonexistent request returns 404, not a silent success", async () => {
  let res = await request(app)
    .patch("/api/leave/requests/does-not-exist/approve")
    .set("Authorization", `Bearer ${adminAuth.token}`);
  assert.equal(res.status, 404);
});
