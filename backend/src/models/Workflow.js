import mongoose from "mongoose";

const workflowStepSchema = new mongoose.Schema({
  stepNumber: { type: Number, required: true },
  departmentName: { type: String, required: true },
  departmentCode: { type: String, required: true },
  isRequired: { type: Boolean, default: true },
  instructions: { type: String, default: "" },
  requiredChecklist: [
    {
      item: { type: String, required: true },
      isMandatory: { type: Boolean, default: true },
    },
  ],
});

const workflowSchema = new mongoose.Schema(
  {
    clearanceType: {
      type: String,
      required: true,
      unique: true,
      enum: ["graduation", "withdrawal", "transfer", "dismissal", "staff"],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    targetAudience: {
      type: String,
      default: "All Students",
    },
    steps: [workflowStepSchema],
    requiredDocuments: [
      {
        name: { type: String, required: true },
        description: { type: String, default: "" },
        isRequired: { type: Boolean, default: true },
      },
    ],
  },
  { timestamps: true }
);

export const Workflow = mongoose.model("Workflow", workflowSchema);
