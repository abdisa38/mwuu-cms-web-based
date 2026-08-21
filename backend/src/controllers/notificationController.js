import { Notification } from "../models/Notification.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getMyNotifications = async (req, res) => {
  try {
    const query = {
      $or: [
        { recipient: req.user._id },
        ...(req.user.department ? [{ recipientDepartment: req.user.department }] : []),
        ...(req.user.role ? [{ recipientRole: req.user.role }] : []),
      ],
    };

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
    const query = {
      $or: [
        { recipient: req.user._id },
        ...(req.user.department ? [{ recipientDepartment: req.user.department }] : []),
        ...(req.user.role ? [{ recipientRole: req.user.role }] : []),
      ],
    };
    await Notification.updateMany(query, { isRead: true });
    return res.json({ success: true, message: "All marked as read" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
