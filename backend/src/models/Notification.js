import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const NOTIFICATION_TYPES = ["attendance", "leave", "system"];
export const NOTIFICATION_PRIORITIES = ["low", "normal", "medium", "high"];

const notificationSchema = new Schema(
  {
    // Null recipient = broadcast notification, visible to admins/managers.
    recipient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    relatedEmployee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    type: {
      type: String,
      enum: NOTIFICATION_TYPES,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 200,
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      maxlength: 1000,
    },
    priority: {
      type: String,
      enum: NOTIFICATION_PRIORITIES,
      default: "normal",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ createdAt: -1 });

export const Notification = model("Notification", notificationSchema);
