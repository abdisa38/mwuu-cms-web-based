import { Message } from "../models/Message.js";
import { User } from "../models/User.js";

// @desc    Get user messages (conversations)
// @route   GET /api/messages
// @access  Private
export const getMyMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ success: true, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, recipientEmail, subject, message, clearanceRequestId } = req.body;
    let recipient;

    if (recipientId) {
      recipient = await User.findById(recipientId);
    } else if (recipientEmail) {
      recipient = await User.findOne({ email: recipientEmail.toLowerCase() });
    } else {
      // Default to registrar
      recipient = await User.findOne({ role: "registrar" });
    }

    if (!recipient) {
      return res.status(404).json({ success: false, message: "Recipient user not found" });
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      recipient: recipient._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      recipientName: recipient.name,
      subject: subject || "Clearance Inquiry",
      message,
      clearanceRequestId: clearanceRequestId || "",
    });

    return res.status(201).json({ success: true, message: "Message sent", data: newMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
