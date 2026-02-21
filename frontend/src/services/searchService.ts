import api from "./api";

export interface SearchResult {
  products: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images: string[];
    category: { name: string };
  }[];
  categories: {
    _id: string;
    name: string;
    slug: string;
  }[];
  total: number;
}

class SearchService {
  // جستجوی پیشرفته
  async search(
    query: string,
    filters?: {
      category?: string;
      minPrice?: number;
      maxPrice?: number;
      inStock?: boolean;
    },
  ): Promise<SearchResult> {
    const params: any = { q: query, ...filters };
    const response = await api.get("/search", { params });
    return response.data;
  }

  // پیشنهادات جستجو (autocomplete)
  async getSuggestions(query: string): Promise<string[]> {
    const response = await api.get("/search/suggestions", {
      params: { q: query },
    });
    return response.data;
  }

  // جستجوی سریع برای هدر
  async quickSearch(query: string): Promise<{
    products: {
      _id: string;
      name: string;
      slug: string;
      price: number;
      image?: string;
    }[];
  }> {
    const response = await api.get("/search/quick", { params: { q: query } });
    return response.data;
  }
}

export default new SearchService();
