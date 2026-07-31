import mongoose from "mongoose";
import { logger } from "./logger.js";

mongoose.set("strictQuery", true);

let isConnected = false;

/**
 * Connects to MongoDB using MONGODB_URI from the environment.
 * Call once at boot, before the server starts accepting requests.
 */
export async function connectDB() {
  if (isConnected) return mongoose.connection;

  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env and set MONGODB_URI (local Mongo or a MongoDB Atlas connection string)."
    );
  }

  mongoose.connection.on("connected", () => {
    logger.info({ db: mongoose.connection.name }, "[mongo] connected");
  });
  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "[mongo] connection error");
  });
  mongoose.connection.on("disconnected", () => {
    logger.warn("[mongo] disconnected");
  });

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  isConnected = true;
  return mongoose.connection;
}

export async function disconnectDB() {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
}

export default mongoose;
