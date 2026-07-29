import mongoose from "mongoose";

const { Schema, model } = mongoose;

const notificationPreferenceSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    emailAlerts: { type: Boolean, default: true },
    attendanceAlerts: { type: Boolean, default: true },
    leaveAlerts: { type: Boolean, default: true },
    systemAlerts: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const NotificationPreference = model("NotificationPreference", notificationPreferenceSchema);
