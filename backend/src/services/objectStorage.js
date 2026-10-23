import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import mongoose from "mongoose";
import { ApiError } from "../middleware/errorHandler.js";

let s3Client;
let gridFSBucket;

export function isS3Configured() {
  let required = ["S3_BUCKET", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"];
  return required.every((name) => Boolean(process.env[name]?.trim()));
}

function getStorageConfig() {
  return {
    bucket: process.env.S3_BUCKET?.trim(),
    region: process.env.S3_REGION?.trim(),
    endpoint: process.env.S3_ENDPOINT?.trim() || undefined,
  };
}

function getS3Client(config) {
  if (!s3Client) {
    s3Client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: Boolean(config.endpoint),
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY.trim(),
      },
    });
  }
  return s3Client;
}

export function getGridFSBucket() {
  if (!gridFSBucket) {
    if (!mongoose.connection.db) {
      throw new ApiError(503, "Database connection not ready for file storage.");
    }
    gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "shared_files",
    });
  }
  return gridFSBucket;
}

export function getBackendBaseUrl(req) {
  if (process.env.BACKEND_URL) {
    return process.env.BACKEND_URL.replace(/\/+$/, "");
  }
  if (!req) return "http://localhost:5000";
  const proto = req.headers["x-forwarded-proto"] || req.protocol || "http";
  const host = req.headers["x-forwarded-host"] || req.get("host") || "localhost:5000";
  return `${proto}://${host}`;
}

export async function createUploadUrl({ key, contentType, size, req }) {
  if (isS3Configured()) {
    let config = getStorageConfig();
    let url = await getSignedUrl(
      getS3Client(config),
      new PutObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ContentType: contentType,
        ContentLength: size,
      }),
      {
        expiresIn: 600,
        signableHeaders: new Set(["content-type", "content-length"]),
      }
    );
    return { url, headers: { "Content-Type": contentType } };
  }

  // Fallback to internal storage via MongoDB GridFS
  const baseUrl = getBackendBaseUrl(req);
  const url = `${baseUrl}/api/messages/storage/upload?key=${encodeURIComponent(key)}`;
  return { url, headers: { "Content-Type": contentType } };
}

export async function getStoredObjectMetadata(key) {
  if (isS3Configured()) {
    let config = getStorageConfig();
    return getS3Client(config).send(
      new HeadObjectCommand({ Bucket: config.bucket, Key: key })
    );
  }

  const bucket = getGridFSBucket();
  const file = await bucket.find({ filename: key }).next();
  if (!file) {
    const error = new Error("The file has not finished uploading to storage.");
    error.name = "NotFound";
    error.$metadata = { httpStatusCode: 404 };
    throw error;
  }
  return {
    ContentLength: file.length,
    ContentType: file.metadata?.contentType || "application/octet-stream",
  };
}

export async function createDownloadUrl(key, fileName, req) {
  if (isS3Configured()) {
    let config = getStorageConfig();
    let encodedName = encodeURIComponent(fileName).replace(/[!'()*]/g, (character) =>
      `%${character.charCodeAt(0).toString(16).toUpperCase()}`
    );
    return getSignedUrl(
      getS3Client(config),
      new GetObjectCommand({
        Bucket: config.bucket,
        Key: key,
        ResponseContentDisposition: `attachment; filename*=UTF-8''${encodedName}`,
      }),
      { expiresIn: 900 }
    );
  }

  const baseUrl = getBackendBaseUrl(req);
  return `${baseUrl}/api/messages/storage/download?key=${encodeURIComponent(key)}&name=${encodeURIComponent(fileName)}`;
}

export async function deleteStoredObject(key) {
  if (isS3Configured()) {
    let config = getStorageConfig();
    await getS3Client(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
    return;
  }

  const bucket = getGridFSBucket();
  const file = await bucket.find({ filename: key }).next();
  if (file) {
    await bucket.delete(file._id);
  }
}
