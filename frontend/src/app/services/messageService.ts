import api from "./api";

export interface MessageItem {
  _id: string;
  sender: string | { _id: string; name: string; email: string; role: string; studentId?: string; department?: string; avatar?: string };
  recipient: string | { _id: string; name: string; email: string; role: string; studentId?: string; department?: string; avatar?: string };
  department: string;
  channel?: string;
  senderName: string;
  senderRole: string;
  recipientName: string;
  subject: string;
  message: string;
  clearanceRequestId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface ConversationThread {
  id: string;
  user: {
    _id?: string;
    name: string;
    email?: string;
    role: string;
    studentId?: string;
    department?: string;
    avatar?: string;
  };
  department: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  totalMessages: number;
}

export const messageService = {
  async getMyMessages(params?: { department?: string; studentId?: string }): Promise<{ success: boolean; count: number; messages: MessageItem[] }> {
    const query = new URLSearchParams();
    if (params?.department) query.append("department", params.department);
    if (params?.studentId) query.append("studentId", params.studentId);
    const queryString = query.toString() ? `?${query.toString()}` : "";
    return api.get(`/messages${queryString}`);
  },

  async getConversations(): Promise<{ success: boolean; count: number; conversations: ConversationThread[] }> {
    return api.get("/messages/conversations");
  },

  async sendMessage(data: {
    recipientId?: string;
    department?: string;
    subject?: string;
    message: string;
    clearanceRequestId?: string;
  }): Promise<{ success: boolean; message: string; data: MessageItem }> {
    return api.post("/messages", data);
  },
};
