import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Department name is required"],
      unique: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["academic", "administrative", "service", "facility"],
      default: "service",
    },
    description: {
      type: String,
      default: "",
    },
    headOfficer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    contactEmail: {
      type: String,
      default: "",
    },
    officeLocation: {
      type: String,
      default: "Main Campus, Building A",
    },
    phone: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    averageProcessingHours: {
      type: Number,
      default: 24,
    },
  },
  { timestamps: true }
);

export const Department = mongoose.model("Department", departmentSchema);
