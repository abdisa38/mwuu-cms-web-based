import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  publicId: { type: String, default: "" },
  fileSize: { type: String, default: "1.0 MB" },
  fileType: { type: String, default: "image/jpeg" },
  status: { type: String, default: "Uploaded" },
  uploadedAt: { type: Date, default: Date.now },
});

const departmentApprovalSchema = new mongoose.Schema({
  departmentName: { type: String, required: true },
  departmentCode: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "hold", "not_started"],
    default: "pending",
  },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedByName: { type: String, default: "" },
  reviewedAt: { type: Date },
  remarks: { type: String, default: "" },
  rejectionReason: { type: String, default: "" },
  itemsChecked: [
    {
      name: { type: String, required: true },
      status: { type: String, default: "cleared" },
      remarks: { type: String, default: "" },
    },
  ],
});

const auditTrailSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  role: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  details: { type: String, default: "" },
});

const clearanceSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    studentName: { type: String, required: true },
    studentId: { type: String, required: true, index: true },
    department: { type: String, required: true },
    college: { type: String, default: "College of Computing" },
    program: { type: String, default: "Undergraduate Regular" },
    clearanceType: {
      type: String,
      required: true,
      enum: ["graduation", "withdrawal", "transfer", "dismissal", "staff"],
    },
    reason: { type: String, default: "" },
    contactDetails: {
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
      emergencyContactName: { type: String, default: "" },
      emergencyPhone: { type: String, default: "" },
      currentAddress: { type: String, default: "" },
    },
    academicDetails: {
      admissionYear: { type: String, default: "2013" },
      expectedGraduation: { type: String, default: "2017" },
      currentSemester: { type: String, default: "Semester II" },
      cgpa: { type: Number, default: 3.5 },
      advisorName: { type: String, default: "" },
    },
    documents: [documentSchema],
    departmentApprovals: [departmentApprovalSchema],
    status: {
      type: String,
      enum: ["pending", "in_progress", "approved", "rejected", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    finalApproval: {
      approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      approvedByName: { type: String, default: "" },
      approvedAt: { type: Date },
      remarks: { type: String, default: "" },
    },
    certificate: {
      certNumber: { type: String, sparse: true, index: true },
      qrCode: { type: String, default: "" },
      issuedAt: { type: Date },
      blockchainHash: { type: String, default: "" },
      isValid: { type: Boolean, default: true },
    },
    auditTrail: [auditTrailSchema],
  },
  { timestamps: true }
);

export const Clearance = mongoose.model("Clearance", clearanceSchema);
