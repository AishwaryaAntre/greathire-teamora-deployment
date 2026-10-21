import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { setupTestApp, teardownTestApp, loginAs, ADMIN_EMAIL, EMPLOYEE_EMAIL } from "./helpers/setup.js";
import { SharedFileModel, MessageModel } from "../src/db/schemas.js";

let app;

before(async () => {
  app = await setupTestApp();
});

after(async () => {
  await teardownTestApp();
});

test("shared files appear in the conversation panel without creating a chat message", async () => {
  let { token, user } = await loginAs(request, app, ADMIN_EMAIL);
  let id = `test-file-${Date.now()}`;
  let beforeCount = await MessageModel.countDocuments({ conversationId: "chan_general" });

  await SharedFileModel.create({
    id,
    conversationId: "chan_general",
    key: `shared-files/chan_general/${id}`,
    name: "team-plan.pdf",
    contentType: "application/pdf",
    size: 2048,
    kind: "file",
    uploaderId: user.employeeId,
    uploaderName: user.name,
    status: "ready",
  });

  let response = await request(app)
    .get("/api/messages/conversations/chan_general")
    .set("Authorization", `Bearer ${token}`);

  assert.equal(response.status, 200);
  assert.ok(response.body.data.sharedFiles.some((file) => file.id === id && file.name === "team-plan.pdf"));
  assert.equal(await MessageModel.countDocuments({ conversationId: "chan_general" }), beforeCount);
  await SharedFileModel.deleteOne({ id });
});

test("shared file upload rejects files larger than 2 GB", async () => {
  let { token } = await loginAs(request, app, ADMIN_EMAIL);
  let response = await request(app)
    .post("/api/messages/conversations/chan_general/files/uploads")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "large.zip", contentType: "application/zip", size: 2 * 1024 * 1024 * 1024 + 1 });

  assert.equal(response.status, 400);
});

test("shared file upload rejects videos larger than 16 MB", async () => {
  let { token } = await loginAs(request, app, ADMIN_EMAIL);
  let response = await request(app)
    .post("/api/messages/conversations/chan_general/files/uploads")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "clip.mp4", contentType: "video/mp4", size: 16 * 1024 * 1024 + 1, durationSeconds: 30 });

  assert.equal(response.status, 400);
});

test("shared file upload rejects videos longer than 90 seconds", async () => {
  let { token } = await loginAs(request, app, ADMIN_EMAIL);
  let response = await request(app)
    .post("/api/messages/conversations/chan_general/files/uploads")
    .set("Authorization", `Bearer ${token}`)
    .send({ name: "clip.mp4", contentType: "video/mp4", size: 1024, durationSeconds: 91 });

  assert.equal(response.status, 400);
});

test("shared files are only accessible to conversation members", async () => {
  let { token: adminToken } = await loginAs(request, app, ADMIN_EMAIL);
  let { token: employeeToken } = await loginAs(request, app, EMPLOYEE_EMAIL);
  let channelResponse = await request(app)
    .post("/api/messages/channels")
    .set("Authorization", `Bearer ${adminToken}`)
    .send({ name: `Private ${Date.now()}`, memberIds: [] });
  let channelId = channelResponse.body.data.id;

  let response = await request(app)
    .post(`/api/messages/conversations/${channelId}/files/uploads`)
    .set("Authorization", `Bearer ${employeeToken}`)
    .send({ name: "plan.pdf", contentType: "application/pdf", size: 1024 });

  assert.equal(channelResponse.status, 201);
  assert.equal(response.status, 404);
});

test("shared file upload reports missing object storage configuration", async () => {
  let { token } = await loginAs(request, app, ADMIN_EMAIL);
  let names = ["S3_BUCKET", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"];
  let previous = Object.fromEntries(names.map((name) => [name, process.env[name]]));
  names.forEach((name) => delete process.env[name]);

  try {
    let response = await request(app)
      .post("/api/messages/conversations/chan_general/files/uploads")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "plan.pdf", contentType: "application/pdf", size: 1024 });

    assert.equal(response.status, 503);
    assert.match(response.body.error, /S3_BUCKET/);
    assert.equal(await SharedFileModel.countDocuments({ conversationId: "chan_general", status: "pending" }), 0);
  } finally {
    names.forEach((name) => {
      if (previous[name] === undefined) delete process.env[name];
      else process.env[name] = previous[name];
    });
  }
});
