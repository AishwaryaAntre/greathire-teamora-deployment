import mongoose from "mongoose";

const { Schema, model } = mongoose;

const refreshTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },
    rememberMe: {
      type: Boolean,
      default: false,
    },
    // Set for TTL-based auto-expiry at the DB level.
    expiresAt: {
      type: Date,
      required: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    // When a token is rotated, we point to its replacement.
    // If a revoked token is ever presented again, that's a reuse
    // signal and every token in the chain should be revoked.
    replacedByTokenHash: {
      type: String,
      default: null,
    },
    userAgent: { type: String, default: null },
    ip: { type: String, default: null },
  },
  { timestamps: true }
);

// MongoDB TTL index: documents are auto-removed after expiresAt.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = model("RefreshToken", refreshTokenSchema);
