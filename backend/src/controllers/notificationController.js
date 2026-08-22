import { Notification } from "../models/Notification.js";

// Helper to construct exact role/department query
const getNotificationQuery = (user) => {
  if (user.role === "officer") {
    const dept = user.department || "Library";
    return {
      $or: [
        { recipient: user._id },
        { recipientDepartment: { $regex: new RegExp(`^${dept}$`, "i") } },
        ...(dept.toLowerCase().includes("head") || dept.toLowerCase().includes("dept")
          ? [{ recipientDepartment: "Department Head" }, { recipientDepartment: "DEPT" }]
          : []),
      ],
    };
  } else if (user.role === "registrar" || user.role === "admin") {
    return {
      $or: [
        { recipient: user._id },
        { recipientDepartment: "Registrar" },
        { recipientRole: "registrar" },
      ],
    };
  } else {
    // Student
    return {
      $or: [
        { recipient: user._id },
        { recipientRole: "student", recipientDepartment: { $exists: false } },
      ],
    };
  }
};

// @desc    Get user notifications (strictly department filtered)
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const query = getNotificationQuery(req.user);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      ...query,
      isRead: false,
    });

    return res.json({ success: true, unreadCount, notifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    return res.json({ success: true, message: "Marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res) => {
  try {
    const query = getNotificationQuery(req.user);
    await Notification.updateMany(query, { isRead: true });
    return res.json({ success: true, message: "All marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
