import { Message } from "../models/Message.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";

// @desc    Get user messages (channel / department separated)
// @route   GET /api/messages
// @access  Private
export const getMyMessages = async (req, res) => {
  try {
    const { department, studentId } = req.query;
    let query = {};

    if (req.user.role === "student") {
      query = {
        $or: [{ sender: req.user._id }, { recipient: req.user._id }],
      };
      if (department && department !== "all") {
        query.department = department;
      }
    } else if (req.user.role === "officer") {
      const officerDept = req.user.department || "General";
      query = {
        $or: [
          { department: officerDept },
          { recipient: req.user._id },
          { sender: req.user._id },
        ],
      };
      if (studentId) {
        query.$and = [
          { $or: [{ sender: studentId }, { recipient: studentId }] }
        ];
      }
    } else {
      // Registrar / Admin
      query = {
        $or: [
          { department: "Registrar" },
          { recipient: req.user._id },
          { sender: req.user._id },
        ],
      };
      if (department && department !== "all") {
        query.department = department;
      }
    }

    const messages = await Message.find(query)
      .sort({ createdAt: 1 })
      .limit(100);

    return res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get conversation threads for officers & registrars
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    let query = {};
    if (req.user.role === "officer") {
      const dept = req.user.department || "Library";
      query = {
        $or: [{ department: dept }, { recipient: req.user._id }, { sender: req.user._id }],
      };
    } else if (req.user.role === "student") {
      query = {
        $or: [{ sender: req.user._id }, { recipient: req.user._id }],
      };
    } else {
      query = {};
    }

    const allMessages = await Message.find(query)
      .sort({ createdAt: -1 })
      .populate("sender", "name email role studentId department avatar")
      .populate("recipient", "name email role studentId department avatar");

    // Group into threads by other party / student
    const conversationMap = new Map();

    for (const msg of allMessages) {
      const isSender = String(msg.sender?._id || msg.sender) === String(req.user._id);
      const otherUser = isSender ? msg.recipient : msg.sender;
      const otherKey = otherUser?._id ? String(otherUser._id) : msg.department || "General";

      if (!conversationMap.has(otherKey)) {
        conversationMap.set(otherKey, {
          id: otherKey,
          user: otherUser || {
            name: msg.recipientName || msg.senderName,
            role: isSender ? "officer" : "student",
            department: msg.department,
          },
          department: msg.department,
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          unreadCount: (!isSender && !msg.isRead) ? 1 : 0,
          totalMessages: 1,
        });
      } else {
        const existing = conversationMap.get(otherKey);
        existing.totalMessages += 1;
        if (!isSender && !msg.isRead) {
          existing.unreadCount += 1;
        }
      }
    }

    const conversations = Array.from(conversationMap.values());
    return res.json({ success: true, count: conversations.length, conversations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
export const sendMessage = async (req, res) => {
  try {
    const { recipientId, department, subject, message, clearanceRequestId } = req.body;
    let recipient;
    const targetDept = department || "Registrar";

    if (recipientId) {
      recipient = await User.findById(recipientId);
    } else {
      // Find officer for this department or registrar
      recipient = await User.findOne({
        role: targetDept.toLowerCase().includes("reg") ? "registrar" : "officer",
        ...(targetDept.toLowerCase().includes("reg") ? {} : { department: targetDept }),
      });
    }

    const recipientName = recipient
      ? recipient.name
      : `${targetDept} Desk`;

    const newMessage = await Message.create({
      sender: req.user._id,
      recipient: recipient ? recipient._id : null,
      department: targetDept,
      senderName: req.user.name,
      senderRole: req.user.role,
      recipientName,
      subject: subject || `${targetDept} Clearance Inquiry`,
      message: message.trim(),
      clearanceRequestId: clearanceRequestId || "",
      isRead: false,
    });

    // Create Notification for the receiver / department
    await Notification.create({
      recipient: recipient ? recipient._id : null,
      recipientDepartment: targetDept,
      recipientRole: req.user.role === "student" ? "officer" : "student",
      title: `New Message from ${req.user.name}`,
      message: `${req.user.name} (${req.user.role}): "${message.substring(0, 80)}..."`,
      type: "message",
      link: req.user.role === "student" ? "/officer/messages" : "/student/messages",
    });

    return res.status(201).json({ success: true, message: "Message sent", data: newMessage });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
