import {
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { ApiError } from "../middleware/errorHandler.js";

let client;

function getStorageConfig() {
  let required = ["S3_BUCKET", "S3_REGION", "S3_ACCESS_KEY_ID", "S3_SECRET_ACCESS_KEY"];
  let missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length) {
    throw new ApiError(
      503,
      `File sharing storage is not configured. Set: ${missing.join(", ")}.`
    );
  }

  return {
    bucket: process.env.S3_BUCKET.trim(),
    region: process.env.S3_REGION.trim(),
    endpoint: process.env.S3_ENDPOINT?.trim() || undefined,
  };
}

function getClient(config) {
  if (!client) {
    client = new S3Client({
      region: config.region,
      endpoint: config.endpoint,
      forcePathStyle: Boolean(config.endpoint),
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID.trim(),
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY.trim(),
      },
    });
  }
  return client;
}

export async function createUploadUrl({ key, contentType, size }) {
  let config = getStorageConfig();
  let url = await getSignedUrl(
    getClient(config),
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

export async function getStoredObjectMetadata(key) {
  let config = getStorageConfig();
  return getClient(config).send(
    new HeadObjectCommand({ Bucket: config.bucket, Key: key })
  );
}

export async function createDownloadUrl(key, fileName) {
  let config = getStorageConfig();
  let encodedName = encodeURIComponent(fileName).replace(/[!'()*]/g, (character) =>
    `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  );
  return getSignedUrl(
    getClient(config),
    new GetObjectCommand({
      Bucket: config.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename*=UTF-8''${encodedName}`,
    }),
    { expiresIn: 900 }
  );
}

export async function deleteStoredObject(key) {
  let config = getStorageConfig();
  await getClient(config).send(new DeleteObjectCommand({ Bucket: config.bucket, Key: key }));
}
