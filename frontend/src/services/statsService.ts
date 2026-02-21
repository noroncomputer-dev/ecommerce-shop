import api from "./api";

export interface Stats {
  products: number;
  users: number;
  orders: number;
  sales: number;
  todayOrders?: number;
  pendingOrders?: number;
  monthlySales?: {
    month: string;
    amount: number;
  }[];
  topProducts?: {
    _id: string;
    name: string;
    soldCount: number;
  }[];
}

class StatsService {
  // دریافت آمار کلی
  async getStats(): Promise<Stats> {
    const response = await api.get("/stats");
    return response.data;
  }

  // دریافت آمار فروش ماهانه
  async getMonthlySales(
    year?: number,
  ): Promise<{ month: string; amount: number }[]> {
    const params = year ? { year } : {};
    const response = await api.get("/stats/monthly-sales", { params });
    return response.data;
  }

  // دریافت محصولات پرفروش
  async getTopProducts(
    limit: number = 5,
  ): Promise<{ _id: string; name: string; soldCount: number }[]> {
    const response = await api.get(`/stats/top-products?limit=${limit}`);
    return response.data;
  }

  // دریافت آمار سفارشات امروز
  async getTodayStats(): Promise<{ orders: number; amount: number }> {
    const response = await api.get("/stats/today");
    return response.data;
  }
}

export default new StatsService();
