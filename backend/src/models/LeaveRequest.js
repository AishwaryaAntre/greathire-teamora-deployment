import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const LEAVE_TYPES = [
  "Sick Leave",
  "Casual Leave",
  "Earned Leave",
  "Family Emergency",
  "Work From Home",
  "Unpaid Leave",
  "Other",
];

export const LEAVE_STATUSES = ["pending", "approved", "rejected", "cancelled"];

const leaveRequestSchema = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      index: true,
    },
    leaveType: {
      type: String,
      enum: LEAVE_TYPES,
      required: [true, "Leave type is required"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    durationDays: {
      type: Number,
      required: true,
      min: 0.5,
    },
    reason: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: LEAVE_STATUSES,
      default: "pending",
      index: true,
    },
    appliedOn: {
      type: Date,
      default: Date.now,
    },
    decidedOn: {
      type: Date,
      default: null,
    },
    decidedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    decisionNote: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: true }
);

leaveRequestSchema.pre("validate", function preValidate(next) {
  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    return next(new Error("End date cannot be before start date"));
  }
  next();
});

export const LeaveRequest = model("LeaveRequest", leaveRequestSchema);
