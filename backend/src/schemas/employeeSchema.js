import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const documentSubSchema = new Schema(
  {
    name: String,
    note: String,
    type: String,
  },
  { _id: false }
);

const employeeSchema = new Schema(
  {
    // Keep the existing human-readable ids ("emp_001") as the primary key so
    // every other in-memory module (Attendance, LeaveRequest, etc.) that
    // references employeeId keeps working unchanged.
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    role: String,
    department: { type: String, index: true },
    initials: String,
    joiningDate: String,
    avatar: { type: String, default: null },
    employeeCode: String,
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: String,
    performanceScore: Number,
    taskLoadPercent: Number,
    leaveAllocation: {
      casual: Number,
      paid: Number,
      sick: Number,
    },
    documents: [documentSubSchema],
  },
  { timestamps: true }
);

export const EmployeeModel = models.Employee || model("Employee", employeeSchema);
