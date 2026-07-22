import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const ATTENDANCE_STATUSES = ["present", "late", "absent", "on_leave", "weekend", "holiday"];
export const LIVE_STATUSES = ["working", "on_break"];

const attendanceSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    // Calendar day this record belongs to, normalized to 00:00:00 UTC,
    // so there's exactly one attendance record per employee per day.
    date: {
      type: Date,
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ATTENDANCE_STATUSES,
      default: "present",
    },
    liveStatus: {
      type: String,
      enum: [...LIVE_STATUSES, null],
      default: null,
    },
    checkInAt: {
      type: Date,
      default: null,
    },
    checkOutAt: {
      type: Date,
      default: null,
    },
    late: {
      type: Boolean,
      default: false,
    },
    hoursWorked: {
      type: Number,
      default: 0,
      min: 0,
    },
    breaks: [
      {
        startedAt: { type: Date, required: true },
        endedAt: { type: Date, default: null },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

attendanceSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    employee: this.employee,
    date: this.date,
    status: this.status,
    liveStatus: this.liveStatus,
    checkInAt: this.checkInAt,
    checkOutAt: this.checkOutAt,
    late: this.late,
    hoursWorked: this.hoursWorked,
  };
};

export const Attendance = model("Attendance", attendanceSchema);
