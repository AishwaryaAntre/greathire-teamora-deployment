import express from "express";
import { getGridFSBucket } from "../services/objectStorage.js";
import { ApiError } from "../middleware/errorHandler.js";

const router = express.Router();

/**
 * PUT /api/messages/storage/upload?key=<storageKey>
 * Streams raw binary file directly into MongoDB GridFS bucket.
 */
router.put("/upload", async (req, res, next) => {
  try {
    const key = req.query.key;
    if (!key) throw new ApiError(400, "Missing file key parameter");

    const contentType = req.headers["content-type"] || "application/octet-stream";
    const bucket = getGridFSBucket();

    // Remove any previous file with this key if re-uploading
    const existing = await bucket.find({ filename: key }).next();
    if (existing) {
      await bucket.delete(existing._id);
    }

    const uploadStream = bucket.openUploadStream(key, {
      metadata: { contentType },
    });

    uploadStream.on("error", (err) => {
      next(err);
    });

    uploadStream.on("finish", () => {
      res.status(200).json({ success: true, message: "File stored successfully" });
    });

    req.pipe(uploadStream);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/messages/storage/download?key=<storageKey>&name=<fileName>
 * Streams file from MongoDB GridFS back to the client.
 */
router.get("/download", async (req, res, next) => {
  try {
    const key = req.query.key;
    const fileName = req.query.name || "download";
    if (!key) throw new ApiError(400, "Missing file key parameter");

    const bucket = getGridFSBucket();
    const file = await bucket.find({ filename: key }).next();
    if (!file) throw new ApiError(404, "File not found");

    const encodedName = encodeURIComponent(fileName).replace(/[!'()*]/g, (c) =>
      `%${c.charCodeAt(0).toString(16).toUpperCase()}`
    );

    res.setHeader("Content-Type", file.metadata?.contentType || "application/octet-stream");
    res.setHeader("Content-Length", file.length);
    res.setHeader("Content-Disposition", `attachment; filename*=UTF-8''${encodedName}`);

    bucket.openDownloadStreamByName(key).pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;
