import api from "./api";

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  images: string[];
  stock: number;
  attributes: Record<string, any>;
  createdAt: string;
}

export interface ProductResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: Category | null;
  image?: string;
  createdAt: string;
}

class ProductService {
  // دریافت لیست محصولات با فیلتر
  async getProducts(params?: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    order?: "asc" | "desc";
    page?: number;
    limit?: number;
  }): Promise<ProductResponse> {
    const response = await api.get("/products", { params });
    return response.data;
  }

  // دریافت محصول با slug — تغییر نکرده
  async getProductBySlug(slug: string): Promise<Product> {
    const response = await api.get(`/products/${slug}`);
    return response.data;
  }

  // ✅ دریافت محصول با آیدی
  async getProductById(id: string): Promise<Product> {
    const response = await api.get(`/products/id/${id}`);
    return response.data;
  }

  // دریافت محصولات بر اساس دسته‌بندی
  async getProductsByCategory(categorySlug: string): Promise<{
    category: Category;
    products: Product[];
  }> {
    const response = await api.get(`/products/category/${categorySlug}`);
    return response.data;
  }

  // ایجاد محصول جدید
  async createProduct(data: FormData): Promise<Product> {
    const response = await api.post("/products", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  // ✅ ویرایش محصول — حالا FormData هم قبول میکنه
  async updateProduct(id: string, data: FormData | any): Promise<Product> {
    const isFormData = data instanceof FormData;
    const response = await api.put(`/products/id/${id}`, data, {
      headers: isFormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" },
    });
    return response.data;
  }

  // حذف محصول
  async deleteProduct(id: string): Promise<Product> {
    const response = await api.delete(`/products/id/${id}`);
    return response.data;
  }
}

export default new ProductService();
