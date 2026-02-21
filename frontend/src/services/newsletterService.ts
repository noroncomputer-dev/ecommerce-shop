import api from "./api";

export interface Subscriber {
  _id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  isActive: boolean;
}

class NewsletterService {
  // عضویت در خبرنامه
  async subscribe(email: string, name?: string): Promise<{ message: string }> {
    const response = await api.post("/newsletter/subscribe", { email, name });
    return response.data;
  }

  // لغو عضویت
  async unsubscribe(email: string): Promise<{ message: string }> {
    const response = await api.post("/newsletter/unsubscribe", { email });
    return response.data;
  }

  // دریافت لیست اعضا (فقط ادمین)
  async getSubscribers(): Promise<Subscriber[]> {
    const response = await api.get("/newsletter/subscribers");
    return response.data;
  }

  // ارسال خبرنامه (فقط ادمین)
  async sendNewsletter(data: {
    subject: string;
    content: string;
    sendTo?: "all" | "active";
  }): Promise<{ message: string; sentCount: number }> {
    const response = await api.post("/newsletter/send", data);
    return response.data;
  }
}

export default new NewsletterService();
