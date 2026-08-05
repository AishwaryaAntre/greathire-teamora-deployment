import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { setupTestApp, teardownTestApp, loginAs, ADMIN_EMAIL, EMPLOYEE_EMAIL_2 } from "./helpers/setup.js";

let app, adminAuth;

before(async () => {
  app = await setupTestApp();
  adminAuth = await loginAs(request, app, ADMIN_EMAIL);
});

after(async () => {
  await teardownTestApp();
});

function bearer(auth) {
  return `Bearer ${auth.token}`;
}

// --- Permissions ---

test("a plain employee is blocked from deleting anyone", async () => {
  let employeeAuth = await loginAs(request, app, EMPLOYEE_EMAIL_2);
  let res = await request(app)
    .delete(`/api/employees/${employeeAuth.user.employeeId}`)
    .set("Authorization", bearer(employeeAuth));
  assert.equal(res.status, 403);
});

test("an admin can't delete their own account", async () => {
  let res = await request(app)
    .delete(`/api/employees/${adminAuth.user.employeeId}`)
    .set("Authorization", bearer(adminAuth));
  assert.equal(res.status, 400);
});

test("deleting an unknown employeeId 404s", async () => {
  let res = await request(app)
    .delete("/api/employees/emp_does_not_exist")
    .set("Authorization", bearer(adminAuth));
  assert.equal(res.status, 404);
});

// --- Core delete + cascade behavior ---
//
// This exercises the actual regression this feature had to avoid: Attendance
// and Dashboard read models join attendance rows back to Employee.getById()
// without a null guard, so deleting an employee while leaving their
// attendance/leave rows behind would 500 the next time anyone loaded the
// Attendance page or admin dashboard. These tests give the victim real
// attendance + leave data first, then confirm both survive the delete.

test("admin can delete an employee, and their login/data disappear with them", async () => {
  let victimAuth = await loginAs(request, app, EMPLOYEE_EMAIL_2);
  let victimId = victimAuth.user.employeeId;

  // Give the victim real attendance + leave history before deleting them.
  let checkIn = await request(app).post("/api/attendance/check-in").set("Authorization", bearer(victimAuth));
  assert.equal(checkIn.status, 201);

  let leaveReq = await request(app)
    .post("/api/leave/requests")
    .set("Authorization", bearer(victimAuth))
    .send({ leaveType: "Casual", startDate: "2026-11-02", endDate: "2026-11-03", reason: "Trip" });
  assert.equal(leaveReq.status, 201);

  // They show up in the employee directory before deletion.
  let before = await request(app).get("/api/employees").set("Authorization", bearer(adminAuth));
  assert.ok(before.body.data.some((e) => e.id === victimId));

  // Delete them.
  let del = await request(app).delete(`/api/employees/${victimId}`).set("Authorization", bearer(adminAuth));
  assert.equal(del.status, 200);
  assert.equal(del.body.data.id, victimId);

  // Gone from the directory.
  let after = await request(app).get("/api/employees").set("Authorization", bearer(adminAuth));
  assert.ok(!after.body.data.some((e) => e.id === victimId));

  // Their login no longer works.
  let loginAttempt = await request(app)
    .post("/api/auth/login")
    .send({ email: EMPLOYEE_EMAIL_2, password: process.env.SEED_USER_PASSWORD || "password123" });
  assert.equal(loginAttempt.status, 401);

  // Attendance and leave endpoints still respond cleanly (no 500 from a
  // stale employeeId join) and no longer include the deleted employee.
  let attendanceToday = await request(app).get("/api/attendance").set("Authorization", bearer(adminAuth));
  assert.equal(attendanceToday.status, 200);
  assert.ok(!attendanceToday.body.data.some((r) => r.employeeId === victimId));

  let liveAttendance = await request(app).get("/api/attendance/live").set("Authorization", bearer(adminAuth));
  assert.equal(liveAttendance.status, 200);

  let leaveRequests = await request(app).get("/api/leave/requests").set("Authorization", bearer(adminAuth));
  assert.equal(leaveRequests.status, 200);
  assert.ok(!leaveRequests.body.data.some((r) => r.employeeId === victimId));
});

test("deleting the same employee twice 404s the second time", async () => {
  let victimAuth = await loginAs(request, app, "elonmusk@greathire.com"); // emp_003, seeded as employee
  let victimId = victimAuth.user.employeeId;

  let first = await request(app).delete(`/api/employees/${victimId}`).set("Authorization", bearer(adminAuth));
  assert.equal(first.status, 200);

  let second = await request(app).delete(`/api/employees/${victimId}`).set("Authorization", bearer(adminAuth));
  assert.equal(second.status, 404);
});
