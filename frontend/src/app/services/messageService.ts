import api from "./api";

export interface MessageItem {
  _id: string;
  sender: string;
  recipient: string;
  senderName: string;
  senderRole: string;
  recipientName: string;
  subject: string;
  message: string;
  clearanceRequestId?: string;
  isRead: boolean;
  createdAt: string;
}

export const messageService = {
  async getMyMessages(): Promise<{ success: boolean; messages: MessageItem[] }> {
    return api.get("/messages");
  },

  async sendMessage(data: {
    recipientId?: string;
    recipientEmail?: string;
    subject?: string;
    message: string;
    clearanceRequestId?: string;
  }): Promise<{ success: boolean; message: string; data: MessageItem }> {
    return api.post("/messages", data);
  },
};
