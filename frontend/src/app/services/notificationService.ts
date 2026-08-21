import api from "./api";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "clearance_update" | "message";
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationService = {
  async getMyNotifications(): Promise<{
    success: boolean;
    unreadCount: number;
    notifications: NotificationItem[];
  }> {
    return api.get("/notifications");
  },

  async markAsRead(id: string): Promise<{ success: boolean }> {
    return api.put(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<{ success: boolean }> {
    return api.put("/notifications/read-all");
  },
};
