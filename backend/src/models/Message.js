import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    department: {
      type: String,
      default: "Registrar",
      index: true,
    },
    channel: {
      type: String,
      default: "",
      index: true,
    },
    senderName: { type: String, required: true },
    senderRole: { type: String, required: true },
    recipientName: { type: String, default: "University Office" },
    subject: { type: String, default: "Clearance Inquiry" },
    message: { type: String, required: true },
    clearanceRequestId: { type: String, default: "" },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
