import "dotenv/config";
import { createApp } from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { seedDatabaseIfEmpty } from "./src/db/seed.js";
import { loadAllData } from "./src/db/loadAll.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB();
    await seedDatabaseIfEmpty();
    await loadAllData();

    let app = createApp();
    app.listen(PORT, () => {
      console.log(`GreatHire Teamora API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[boot] failed to start server:", err.message);
    process.exit(1);
  }
}

start();
