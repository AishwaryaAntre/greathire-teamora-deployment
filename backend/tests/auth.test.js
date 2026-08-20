import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { setupTestApp, teardownTestApp, loginAs, ADMIN_EMAIL, EMPLOYEE_EMAIL } from "./helpers/setup.js";
import { UsersStore } from "../src/data/usersStore.js";

let app;

before(async () => {
  app = await setupTestApp();
});

after(async () => {
  await teardownTestApp();
});

test("register creates a new employee-role account", async () => {
  let res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Test User", email: "testuser@example.com", password: "password123" });

  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.user.role, "employee");
  assert.ok(res.body.data.token, "expected an access token");
  assert.ok(res.body.data.refreshToken, "expected a refresh token");
});

test("register rejects a duplicate email", async () => {
  await request(app)
    .post("/api/auth/register")
    .send({ name: "Dup", email: "dup@example.com", password: "password123" });

  let res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Dup Again", email: "dup@example.com", password: "password123" });

  assert.equal(res.status, 409);
});

test("register rejects an invalid payload (zod validation)", async () => {
  let res = await request(app)
    .post("/api/auth/register")
    .send({ name: "", email: "not-an-email", password: "short" });

  assert.equal(res.status, 400);
});

test("login succeeds for a seeded admin and reports role: admin", async () => {
  let data = await loginAs(request, app, ADMIN_EMAIL);
  assert.equal(data.user.role, "admin");
  assert.equal(data.user.email, ADMIN_EMAIL);
});

test("login succeeds for a seeded employee and reports role: employee", async () => {
  let data = await loginAs(request, app, EMPLOYEE_EMAIL);
  assert.equal(data.user.role, "employee");
});

test("login fails with the wrong password", async () => {
  let res = await request(app).post("/api/auth/login").send({ email: ADMIN_EMAIL, password: "wrong-password" });
  assert.equal(res.status, 401);
});

test("GET /api/auth/me requires a token", async () => {
  let res = await request(app).get("/api/auth/me");
  assert.equal(res.status, 401);
});

test("GET /api/auth/me returns the authenticated user", async () => {
  let { token, user } = await loginAs(request, app, EMPLOYEE_EMAIL);
  let res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

  assert.equal(res.status, 200);
  assert.equal(res.body.data.email, user.email);
});

test("GET /api/auth/me rejects a garbage token", async () => {
  let res = await request(app).get("/api/auth/me").set("Authorization", "Bearer not-a-real-token");
  assert.equal(res.status, 401);
});

test("refresh token rotation: old refresh token can't be reused after rotating", async () => {
  let { refreshToken } = await loginAs(request, app, EMPLOYEE_EMAIL);

  let first = await request(app).post("/api/auth/refresh").send({ refreshToken });
  assert.equal(first.status, 200);
  assert.ok(first.body.data.token, "expected a new access token");
  assert.notEqual(first.body.data.refreshToken, refreshToken, "refresh token should rotate to a new value");

  // Replaying the original (now-revoked) refresh token must fail.
  let replay = await request(app).post("/api/auth/refresh").send({ refreshToken });
  assert.equal(replay.status, 401);
});

test("logout revokes the refresh token", async () => {
  let { refreshToken } = await loginAs(request, app, EMPLOYEE_EMAIL);

  let logoutRes = await request(app).post("/api/auth/logout").send({ refreshToken });
  assert.equal(logoutRes.status, 200);

  let afterLogout = await request(app).post("/api/auth/refresh").send({ refreshToken });
  assert.equal(afterLogout.status, 401);
});

test("forgot-password responds identically for a real and a fake email (no account enumeration)", async () => {
  let real = await request(app).post("/api/auth/forgot-password").send({ email: ADMIN_EMAIL });
  let fake = await request(app).post("/api/auth/forgot-password").send({ email: "nobody@nowhere.com" });

  assert.equal(real.status, 200);
  assert.equal(fake.status, 200);
  assert.equal(real.body.message, fake.body.message);
});

test("reset-password rejects a garbage/unknown token", async () => {
  let res = await request(app).post("/api/auth/reset-password").send({ token: "not-a-real-token", password: "NewPassword123" });
  assert.equal(res.status, 400);
});

test("reset-password: full flow — new password works, old password stops working, token can't be reused, works for both admin and employee", async () => {
  for (let email of [ADMIN_EMAIL, EMPLOYEE_EMAIL]) {
    let user = await UsersStore.findByEmail(email);
    let rawToken = await UsersStore.createPasswordResetToken(user.id);

    let resetRes = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: rawToken, password: "BrandNewPassword123" });
    assert.equal(resetRes.status, 200);

    // Old password must no longer work.
    let oldLogin = await request(app)
      .post("/api/auth/login")
      .send({ email, password: process.env.SEED_USER_PASSWORD || "password123" });
    assert.equal(oldLogin.status, 401);

    // New password works.
    let newLogin = await request(app).post("/api/auth/login").send({ email, password: "BrandNewPassword123" });
    assert.equal(newLogin.status, 200);

    // The same token can't be replayed.
    let replay = await request(app)
      .post("/api/auth/reset-password")
      .send({ token: rawToken, password: "AnotherPassword123" });
    assert.equal(replay.status, 400);

    // Restore the seeded password so later tests (and re-runs) aren't affected.
    let passwordHash = await (await import("../src/utils/password.js")).hashPassword(
      process.env.SEED_USER_PASSWORD || "password123"
    );
    await UsersStore.updatePassword(user.id, passwordHash);
  }
});

test("reset-password rejects an expired token", async () => {
  let user = await UsersStore.findByEmail(EMPLOYEE_EMAIL);
  let rawToken = await UsersStore.createPasswordResetToken(user.id);

  // Force the stored token into the past to simulate expiry.
  let { PasswordResetTokenModel } = await import("../src/db/schemas.js");
  let { hashToken } = await import("../src/utils/refreshToken.js");
  await PasswordResetTokenModel.updateOne(
    { tokenHash: hashToken(rawToken) },
    { $set: { expiresAt: new Date(Date.now() - 1000).toISOString() } }
  );

  let res = await request(app).post("/api/auth/reset-password").send({ token: rawToken, password: "NewPassword123" });
  assert.equal(res.status, 400);
});
