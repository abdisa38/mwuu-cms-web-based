import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userName: { type: String, required: true },
    userRole: { type: String, required: true },
    userDepartment: { type: String, default: "" },
    action: {
      type: String,
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      default: "Clearance",
    },
    targetId: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      default: "",
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1",
    },
    status: {
      type: String,
      enum: ["Success", "Warning", "Failed"],
      default: "Success",
    },
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
