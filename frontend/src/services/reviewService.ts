import api from "./api";

export interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  product: string;
  rating: number;
  title?: string;
  comment: string;
  pros?: string[];
  cons?: string[];
  images?: string[];
  likes: number;
  isVerifiedPurchase: boolean;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  updatedAt: string;
}

class ReviewService {
  // دریافت نظرات یک محصول
  async getProductReviews(
    productId: string,
    params?: {
      page?: number;
      limit?: number;
      rating?: number;
      sort?: "newest" | "helpful" | "highest" | "lowest";
    },
  ): Promise<{
    reviews: Review[];
    pagination: { page: number; limit: number; total: number; pages: number };
    averageRating: number;
    totalReviews: number;
  }> {
    const response = await api.get(`/reviews/product/${productId}`, { params });
    return response.data;
  }

  // افزودن نظر جدید
  async addReview(data: {
    productId: string;
    rating: number;
    title?: string;
    comment: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
  }): Promise<Review> {
    const response = await api.post("/reviews", data);
    return response.data;
  }

  // ویرایش نظر
  async updateReview(
    reviewId: string,
    data: Partial<{
      rating: number;
      title: string;
      comment: string;
      pros: string[];
      cons: string[];
      images: string[];
    }>,
  ): Promise<Review> {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  }

  // حذف نظر
  async deleteReview(reviewId: string): Promise<{ message: string }> {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }

  // لایک کردن نظر
  async likeReview(reviewId: string): Promise<{ likes: number }> {
    const response = await api.post(`/reviews/${reviewId}/like`);
    return response.data;
  }

  // گزارش نظر نامناسب
  async reportReview(
    reviewId: string,
    reason: string,
  ): Promise<{ message: string }> {
    const response = await api.post(`/reviews/${reviewId}/report`, { reason });
    return response.data;
  }

  // دریافت نظرات کاربر جاری
  async getMyReviews(): Promise<Review[]> {
    const response = await api.get("/reviews/my-reviews");
    return response.data;
  }
}

export default new ReviewService();
