import api from "./api";

export interface AboutInfo {
  _id?: string;
  title: string;
  description: string;
  mission: string;
  vision: string;
  history: string;
  stats: {
    products: number;
    customers: number;
    experience: number;
    support: string;
  };
  contact: {
    phone: string[];
    email: string[];
    address: string;
    hours: string;
  };
  socialMedia: {
    instagram?: string;
    telegram?: string;
    twitter?: string;
    linkedin?: string;
    whatsapp?: string;
    youtube?: string;
    aparat?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

class AboutService {
  // دریافت اطلاعات فروشگاه (با جلوگیری از کش)
  async getAboutInfo(): Promise<AboutInfo> {
    // اضافه کردن timestamp برای جلوگیری از کش
    const response = await api.get("/about", {
      params: { _t: Date.now() }, // این خط مهمه
    });
    return response.data;
  }

  // آپدیت اطلاعات فروشگاه (فقط ادمین)
  async updateAboutInfo(data: Partial<AboutInfo>): Promise<AboutInfo> {
    const response = await api.put("/about", data);
    return response.data;
  }

  // آپلود تصویر (برای لوگو یا بنر)
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/about/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export default new AboutService();
