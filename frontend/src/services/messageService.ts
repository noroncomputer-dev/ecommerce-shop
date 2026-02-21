import api from "./api";

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  userId?: string;
  subject: string;
  message: string;
  status?: "pending" | "read" | "replied";
  reply?: string;
  repliedAt?: string;
  readByUser?: boolean;
  createdAt?: string;
}

class MessageService {
  // =============== مسیرهای عمومی ===============
  async sendMessage(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Promise<{ message: string; id: string }> {
    const response = await api.post("/messages", data);
    return response.data;
  }

  // =============== مسیرهای کاربر ===============

  // همه پیام‌های کاربر (برای پروفایل)
  async getUserMessages(): Promise<ContactMessage[]> {
    try {
      const response = await api.get("/messages/user/all");
      return response.data;
    } catch (error) {
      console.error("🔴 Error in getUserMessages:", error);
      return [];
    }
  }

  // فقط پیام‌های خوانده نشده (برای Navbar bell)
  async getUnreadUserMessages(): Promise<ContactMessage[]> {
    try {
      const response = await api.get("/messages/user/unread");
      return response.data;
    } catch (error) {
      console.error("Error in getUnreadUserMessages:", error);
      return [];
    }
  }

  // علامت زدن پیام به عنوان خوانده شده
  async markMessageAsRead(messageId: string): Promise<{ message: string }> {
    const response = await api.patch(`/messages/user/${messageId}/read`);
    return response.data;
  }

  // =============== مسیرهای ادمین ===============

  // دریافت همه پیام‌ها با امکان فیلتر
  async getAllMessages(
    status?: string,
    search?: string,
  ): Promise<ContactMessage[]> {
    const params: any = {};
    if (status) params.status = status;
    if (search) params.search = search;

    const response = await api.get("/messages", { params });
    return response.data;
  }

  // دریافت یک پیام با ID
  async getMessageById(id: string): Promise<ContactMessage> {
    const response = await api.get(`/messages/${id}`);
    return response.data;
  }

  // تغییر وضعیت پیام
  async updateMessageStatus(
    id: string,
    status: "pending" | "read" | "replied",
    reply?: string,
  ): Promise<{ message: string; data: ContactMessage }> {
    const response = await api.patch(`/messages/${id}/status`, {
      status,
      reply,
    });
    return response.data;
  }

  // پاسخ به پیام
  async replyToMessage(
    id: string,
    reply: string,
  ): Promise<{ message: string; data: ContactMessage }> {
    const response = await api.post(`/messages/${id}/reply`, { reply });
    return response.data;
  }

  // حذف پیام
  async deleteMessage(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/messages/${id}`);
    return response.data;
  }
}

export default new MessageService();
