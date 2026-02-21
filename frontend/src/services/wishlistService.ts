import api from "./api";
import { Product } from "./productService";

export interface Wishlist {
  _id: string;
  user: string;
  products: Product[];
  createdAt: string;
  updatedAt: string;
}

class WishlistService {
  // دریافت لیست علاقه‌مندی‌ها
  async getWishlist(): Promise<Wishlist> {
    const response = await api.get("/wishlist");
    return response.data;
  }

  // افزودن محصول به علاقه‌مندی‌ها
  async addToWishlist(productId: string): Promise<{ message: string; wishlist: Wishlist }> {
    const response = await api.post("/wishlist/add", { productId });
    return response.data;
  }

  // حذف محصول از علاقه‌مندی‌ها
  async removeFromWishlist(productId: string): Promise<{ message: string; wishlist: Wishlist }> {
    const response = await api.delete(`/wishlist/remove/${productId}`);
    return response.data;
  }

  // بررسی وجود محصول در علاقه‌مندی‌ها
  async checkInWishlist(productId: string): Promise<{ inWishlist: boolean }> {
    const response = await api.get(`/wishlist/check/${productId}`);
    return response.data;
  }

  // پاک کردن کل لیست علاقه‌مندی‌ها
  async clearWishlist(): Promise<{ message: string }> {
    const response = await api.delete("/wishlist/clear");
    return response.data;
  }
}

export default new WishlistService();