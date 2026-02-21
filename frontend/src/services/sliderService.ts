import api from "./api";

export interface Slider {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  link: string;
  buttonText: string;
  order: number;
  isActive: boolean;
}

class SliderService {
  // دریافت اسلایدرهای فعال
  async getActiveSliders(): Promise<Slider[]> {
    const response = await api.get("/sliders/active");

    // اصلاح آدرس تصاویر
    const sliders = response.data.map((slider: Slider) => ({
      ...slider,
      image: slider.image.startsWith("http")
        ? slider.image
        : `http://localhost:5001${slider.image}`,
    }));

    return sliders;
  }

  // دریافت همه اسلایدرها (فقط ادمین)
  async getAllSliders(): Promise<Slider[]> {
    const response = await api.get("/sliders");
    return response.data;
  }

  // آپلود تصویر اسلایدر
  async uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await api.post("/sliders/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // ایجاد اسلایدر جدید (فقط ادمین)
  async createSlider(data: Partial<Slider>): Promise<Slider> {
    const response = await api.post("/sliders", data);
    return response.data;
  }

  // ویرایش اسلایدر (فقط ادمین)
  async updateSlider(id: string, data: Partial<Slider>): Promise<Slider> {
    const response = await api.put(`/sliders/${id}`, data);
    return response.data;
  }

  // حذف اسلایدر (فقط ادمین)
  async deleteSlider(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/sliders/${id}`);
    return response.data;
  }

  // تغییر وضعیت فعال/غیرفعال (فقط ادمین)
  async toggleSliderStatus(
    id: string,
  ): Promise<{ message: string; isActive: boolean }> {
    const response = await api.patch(`/sliders/${id}/toggle`);
    return response.data;
  }
}

export default new SliderService();
