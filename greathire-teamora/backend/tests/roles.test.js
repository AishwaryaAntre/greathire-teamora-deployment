import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { setupTestApp, teardownTestApp, loginAs, ADMIN_EMAIL, EMPLOYEE_EMAIL, EMPLOYEE_EMAIL_2 } from "./helpers/setup.js";

let app, adminAuth, employeeAuth;

before(async () => {
  app = await setupTestApp();
  adminAuth = await loginAs(request, app, ADMIN_EMAIL);
  employeeAuth = await loginAs(request, app, EMPLOYEE_EMAIL);
});

after(async () => {
  await teardownTestApp();
});

function bearer(auth) {
  return `Bearer ${auth.token}`;
}

// --- Admin-only routes actually get blocked for a plain employee ---

test("employee is blocked from the admin dashboard", async () => {
  let res = await request(app).get("/api/dashboard/overview").set("Authorization", bearer(employeeAuth));
  assert.equal(res.status, 403);
});

test("admin can access the admin dashboard", async () => {
  let res = await request(app).get("/api/dashboard/overview").set("Authorization", bearer(adminAuth));
  assert.equal(res.status, 200);
});

test("employee is blocked from Reports", async () => {
  let res = await request(app).get("/api/reports/stats").set("Authorization", bearer(employeeAuth));
  assert.equal(res.status, 403);
});

test("employee is blocked from creating a new employee account", async () => {
  let res = await request(app)
    .post("/api/employees")
    .set("Authorization", bearer(employeeAuth))
    .send({ name: "Sneaky Hire", email: "sneaky@example.com", password: "password123", role: "employee" });
  assert.equal(res.status, 403);
});

test("admin can create a new employee account", async () => {
  let res = await request(app)
    .post("/api/employees")
    .set("Authorization", bearer(adminAuth))
    .send({ name: "Legit Hire", email: "legit@example.com", password: "password123", role: "employee" });
  assert.equal(res.status, 201);
  assert.equal(res.body.data.employee.name, "Legit Hire");
});

test("employee is blocked from the attendance CSV export", async () => {
  let res = await request(app).get("/api/attendance/export").set("Authorization", bearer(employeeAuth));
  assert.equal(res.status, 403);
});

test("employee is blocked from approving leave requests", async () => {
  let res = await request(app).post("/api/leave/requests/approve-all").set("Authorization", bearer(employeeAuth));
  assert.equal(res.status, 403);
});

test("unauthenticated request to any protected route is rejected, not silently allowed", async () => {
  let res = await request(app).get("/api/dashboard/overview");
  assert.equal(res.status, 401);
});

// --- Non-admin users can't edit someone else's profile ---

test("employee is blocked from editing another employee's profile", async () => {
  let res = await request(app)
    .put("/api/employees/emp_002/profile/personal-info")
    .set("Authorization", bearer(employeeAuth))
    .send({ name: "Hijacked Name" });
  assert.equal(res.status, 403);
});

test("employee CAN edit their own profile", async () => {
  let res = await request(app)
    .put("/api/employees/profile/personal-info")
    .set("Authorization", bearer(employeeAuth))
    .send({ phone: "+1-555-0100" });
  assert.equal(res.status, 200);
});

test("admin CAN edit another employee's profile", async () => {
  let res = await request(app)
    .put("/api/employees/emp_002/profile/personal-info")
    .set("Authorization", bearer(adminAuth))
    .send({ department: "Operations" });
  assert.equal(res.status, 200);
});

// --- Data scoping: list endpoints actually filter to "my own records" for non-admins ---

test("employee's attendance list only contains their own records, even if they existed for others", async () => {
  await request(app).post("/api/attendance/check-in").set("Authorization", bearer(employeeAuth));

  let res = await request(app).get("/api/attendance").set("Authorization", bearer(employeeAuth));
  assert.equal(res.status, 200);
  assert.ok(res.body.data.length > 0, "expected at least the just-created check-in");
  for (let record of res.body.data) {
    assert.equal(record.employeeId, employeeAuth.user.employeeId);
  }
});

test("admin's attendance list is NOT limited to their own records", async () => {
  let res = await request(app).get("/api/attendance").set("Authorization", bearer(adminAuth));
  assert.equal(res.status, 200);
  let distinctEmployeeIds = new Set(res.body.data.map((r) => r.employeeId));
  assert.ok(distinctEmployeeIds.size > 1, "admin should see records from more than one employee");
});

test("employee's leave request list only contains their own requests", async () => {
  let secondEmployeeAuth = await loginAs(request, app, EMPLOYEE_EMAIL_2);

  await request(app)
    .post("/api/leave/requests")
    .set("Authorization", bearer(secondEmployeeAuth))
    .send({ leaveType: "Casual", startDate: "2026-09-01", endDate: "2026-09-01", reason: "Personal" });

  let ownList = await request(app).get("/api/leave/requests").set("Authorization", bearer(secondEmployeeAuth));
  assert.equal(ownList.status, 200);
  for (let req_ of ownList.body.data) {
    assert.equal(req_.employeeId, secondEmployeeAuth.user.employeeId);
  }

  // The first employee's list must not include the second employee's request.
  let otherList = await request(app).get("/api/leave/requests").set("Authorization", bearer(employeeAuth));
  let leaked = otherList.body.data.some((r) => r.employeeId === secondEmployeeAuth.user.employeeId);
  assert.equal(leaked, false, "an employee's leave requests must not be visible to a different employee");
});

test("an employee can't view another employee's personal dashboard data by id", async () => {
  let res = await request(app).get("/api/employee/emp_002/dashboard").set("Authorization", bearer(employeeAuth));
  assert.equal(res.status, 403);
});

test("an admin CAN view another employee's personal dashboard data by id", async () => {
  let res = await request(app).get("/api/employee/emp_002/dashboard").set("Authorization", bearer(adminAuth));
  assert.equal(res.status, 200);
});
