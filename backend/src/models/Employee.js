import mongoose from "mongoose";

const { Schema, model } = mongoose;

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Human Resources",
  "Marketing",
  "Finance",
  "Sales",
  "Operations",
  "Other",
];

// Live, real-time presence status shown on the Employee Directory table.
export const EMPLOYEE_STATUSES = ["working", "on_break", "on_leave", "offline"];

const employeeSchema = new Schema(
  {
    // Optional link to a login-capable User account (an employee may exist
    // in the directory before they've ever logged in).
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    empCode: {
      type: String,
      required: [true, "Employee code is required"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email address"],
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 120,
    },
    department: {
      type: String,
      enum: DEPARTMENTS,
      required: [true, "Department is required"],
      index: true,
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    status: {
      type: String,
      enum: EMPLOYEE_STATUSES,
      default: "offline",
      index: true,
    },
    lastActivityAt: {
      type: Date,
      default: null,
    },
    lastActivityLabel: {
      type: String,
      default: null, // e.g. "Checked in", "Paused", "Last active yesterday"
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    joinedOn: {
      type: Date,
      default: Date.now,
    },
    phone: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

employeeSchema.index({ name: "text", email: "text", jobTitle: "text" });

employeeSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this._id.toString(),
    empCode: this.empCode,
    name: this.name,
    email: this.email,
    avatarUrl: this.avatarUrl,
    jobTitle: this.jobTitle,
    department: this.department,
    status: this.status,
    lastActivityAt: this.lastActivityAt,
    lastActivityLabel: this.lastActivityLabel,
    isActive: this.isActive,
    joinedOn: this.joinedOn,
  };
};

export const Employee = model("Employee", employeeSchema);
