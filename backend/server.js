import "dotenv/config";
import { createApp } from "./src/app.js";

const PORT = process.env.PORT || 5000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`GreatHire Teamora API listening on http://localhost:${PORT}`);
});
