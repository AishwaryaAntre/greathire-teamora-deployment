import { createApp } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { env } from "./src/config/env.js";

async function start() {
  await connectDB();
  const app = createApp();

  app.listen(env.port, () => {
    console.log(`GreatHire WorkTrack API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error("[server] Failed to start:", err);
  process.exit(1);
});
