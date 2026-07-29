import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const userSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    employeeId: { type: String, default: null, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["employee", "manager", "admin"], default: "employee" },
  },
  { timestamps: true }
);

export const UserModel = models.User || model("User", userSchema);
