import api from "./api";

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  category: "general" | "shipping" | "payment" | "returns" | "products";
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

class FAQService {
  // دریافت سوالات متداول
  async getFAQs(category?: string, activeOnly: boolean = true): Promise<FAQ[]> {
    const params: any = {};
    if (category) params.category = category;
    if (activeOnly) params.active = true;

    const response = await api.get("/faq", { params });
    return response.data;
  }

  // دریافت یک سوال با ID
  async getFAQById(id: string): Promise<FAQ> {
    const response = await api.get(`/faq/${id}`);
    return response.data;
  }

  // اضافه کردن سوال جدید (فقط ادمین)
  async addFAQ(data: {
    question: string;
    answer: string;
    category: string;
    order?: number;
  }): Promise<FAQ> {
    const response = await api.post("/faq", data);
    return response.data;
  }

  // ویرایش سوال (فقط ادمین)
  async updateFAQ(
    id: string,
    data: Partial<{
      question: string;
      answer: string;
      category: string;
      order: number;
      isActive: boolean;
    }>,
  ): Promise<FAQ> {
    const response = await api.put(`/faq/${id}`, data);
    return response.data;
  }

  // حذف سوال (فقط ادمین)
  async deleteFAQ(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/faq/${id}`);
    return response.data;
  }

  // تغییر وضعیت فعال/غیرفعال (فقط ادمین)
  async toggleFAQStatus(
    id: string,
  ): Promise<{ message: string; isActive: boolean }> {
    const response = await api.patch(`/faq/${id}/toggle`);
    return response.data;
  }
}

export default new FAQService();
