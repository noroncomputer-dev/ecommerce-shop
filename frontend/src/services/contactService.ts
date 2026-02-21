import api from "./api";

export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status?: "pending" | "read" | "replied";
  reply?: string;
  repliedAt?: string;
  createdAt?: string;
}

class ContactService {
  // =============== مسیرهای عمومی ===============

  // ارسال پیام جدید
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

  // =============== مسیرهای محافظت شده (فقط ادمین) ===============

  // دریافت همه پیام‌ها
  async getMessages(status?: string): Promise<ContactMessage[]> {
    const params = status ? { status } : {};
    const response = await api.get("/messages", { params }); // تغییر مسیر
    return response.data;
  }

  // دریافت یک پیام با ID
  async getMessageById(id: string): Promise<ContactMessage> {
    const response = await api.get(`/messages/${id}`); // تغییر مسیر
    return response.data;
  }

  // تغییر وضعیت پیام
  async updateMessageStatus(
    id: string,
    status: "pending" | "read" | "replied",
  ): Promise<{ message: string; status: string }> {
    const response = await api.patch(`/messages/${id}/status`, { status }); // تغییر مسیر
    return response.data;
  }

  // حذف پیام
  async deleteMessage(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/messages/${id}`); // تغییر مسیر
    return response.data;
  }
}

export default new ContactService();
