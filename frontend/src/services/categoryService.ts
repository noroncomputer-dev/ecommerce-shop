import api from "./api";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  createdAt: string;
  updatedAt?: string;
  __v?: number;
}

class CategoryService {
  // دریافت همه دسته‌بندی‌ها
  async getCategories(): Promise<Category[]> {
    const response = await api.get("/categories");
    return response.data;
  }

  // ✅ دریافت یک دسته‌بندی با ID — /api/categories بود، اشتباه بود
  async getCategoryById(id: string): Promise<Category> {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  }

  // دریافت یک دسته‌بندی با slug — تغییر نکرده
  async getCategoryBySlug(slug: string): Promise<Category> {
    const response = await api.get(`/categories/slug/${slug}`);
    return response.data;
  }

  // ایجاد دسته‌بندی جدید — تغییر نکرده
  async createCategory(data: {
    name: string;
    image?: string;
  }): Promise<Category> {
    const response = await api.post("/categories", data);
    return response.data;
  }

  // ویرایش دسته‌بندی — تغییر نکرده
  async updateCategory(
    id: string,
    data: { name?: string; image?: string },
  ): Promise<Category> {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  }

  // حذف دسته‌بندی — تغییر نکرده
  async deleteCategory(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  }
}

export default new CategoryService();
