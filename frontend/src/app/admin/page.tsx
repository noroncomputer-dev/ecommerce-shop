"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Package,
  FolderTree,
  Users,
  ShoppingCart,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft,
  DollarSign,
  AlertCircle,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    users: 0,
    orders: 0,
    revenue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const getHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const loadStats = async () => {
    try {
      const [productsRes, categoriesRes, usersRes, ordersRes] =
        await Promise.all([
          fetch(`${API}/products`, { headers: getHeaders() }),
          fetch(`${API}/categories`, { headers: getHeaders() }),
          fetch(`${API}/users`, { headers: getHeaders() }),
          fetch(`${API}/orders/all`, { headers: getHeaders() }),
        ]);

      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      const usersData = await usersRes.json();
      const ordersData = await ordersRes.json();

      const orders = Array.isArray(ordersData) ? ordersData : [];
      const products = Array.isArray(productsData.products)
        ? productsData.products
        : [];
      const categories = Array.isArray(categoriesData) ? categoriesData : [];
      const users = Array.isArray(usersData) ? usersData : [];

      setStats({
        products: products.length,
        categories: categories.length,
        users: users.length,
        orders: orders.length,
        revenue: orders
          .filter((o: any) => o.paymentStatus === "paid")
          .reduce((sum: number, o: any) => sum + o.totalAmount, 0),
        pendingOrders: orders.filter((o: any) => o.status === "pending").length,
        deliveredOrders: orders.filter((o: any) => o.status === "delivered")
          .length,
        cancelledOrders: orders.filter((o: any) => o.status === "cancelled")
          .length,
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending: { 
      label: "در انتظار", 
      color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800" 
    },
    processing: { 
      label: "در پردازش", 
      color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800" 
    },
    shipped: { 
      label: "ارسال شده", 
      color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800" 
    },
    delivered: { 
      label: "تحویل شده", 
      color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800" 
    },
    cancelled: { 
      label: "لغو شده", 
      color: "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800" 
    },
    refunded: { 
      label: "برگشت پول", 
      color: "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700" 
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Header with greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            خوش آمدید، ادمین
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            آخرین آمار و اطلاعات فروشگاه خود را مشاهده کنید
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-blue-50 dark:bg-blue-950/30 px-4 py-2 rounded-xl">
            <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              {new Date().toLocaleDateString('fa-IR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Main Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Link href="/admin/products" className="group">
          <Card className="hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تعداد محصولات
              </CardTitle>
              <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg group-hover:scale-110 transition-transform">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {stats.products.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                محصول فعال در فروشگاه
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/categories" className="group">
          <Card className="hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تعداد دسته‌بندی
              </CardTitle>
              <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg group-hover:scale-110 transition-transform">
                <FolderTree className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {stats.categories.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                دسته‌بندی فعال
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users" className="group">
          <Card className="hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                تعداد کاربران
              </CardTitle>
              <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded-lg group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {stats.users.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                کاربر ثبت‌نام شده
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders" className="group">
          <Card className="hover:shadow-lg dark:hover:shadow-gray-800 transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">
                کل سفارشات
              </CardTitle>
              <div className="p-2 bg-orange-50 dark:bg-orange-950/30 rounded-lg group-hover:scale-110 transition-transform">
                <ShoppingCart className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                {stats.orders.toLocaleString()}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                سفارش ثبت شده
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Order Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="p-3 bg-emerald-200 dark:bg-emerald-800 rounded-xl">
              <DollarSign className="h-6 w-6 text-emerald-700 dark:text-emerald-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                درآمد کل
              </p>
              <p className="text-lg md:text-xl font-bold text-emerald-700 dark:text-emerald-300 truncate">
                {stats.revenue.toLocaleString()} تومان
              </p>
              <p className="text-xs text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                از {stats.deliveredOrders} سفارش موفق
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="p-3 bg-amber-200 dark:bg-amber-800 rounded-xl">
              <Clock className="h-6 w-6 text-amber-700 dark:text-amber-300" />
            </div>
            <div>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-1">
                در انتظار
              </p>
              <p className="text-lg md:text-xl font-bold text-amber-700 dark:text-amber-300">
                {stats.pendingOrders}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="p-3 bg-green-200 dark:bg-green-800 rounded-xl">
              <CheckCircle className="h-6 w-6 text-green-700 dark:text-green-300" />
            </div>
            <div>
              <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">
                تحویل شده
              </p>
              <p className="text-lg md:text-xl font-bold text-green-700 dark:text-green-300">
                {stats.deliveredOrders}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20 border-red-200 dark:border-red-800">
          <CardContent className="p-4 md:p-6 flex items-center gap-4">
            <div className="p-3 bg-red-200 dark:bg-red-800 rounded-xl">
              <XCircle className="h-6 w-6 text-red-700 dark:text-red-300" />
            </div>
            <div>
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">
                لغو شده
              </p>
              <p className="text-lg md:text-xl font-bold text-red-700 dark:text-red-300">
                {stats.cancelledOrders}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      {recentOrders.length > 0 && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg text-gray-900 dark:text-white">
                آخرین سفارشات
              </CardTitle>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                آخرین ۵ سفارش ثبت شده در سیستم
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors group"
            >
              مشاهده همه سفارشات
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            </Link>
          </CardHeader>
          <CardContent>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">شماره سفارش</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">مشتری</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">مبلغ</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">وضعیت</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">تاریخ</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">عملیات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {recentOrders.map((order) => {
                    const sc = statusLabel[order.status] || statusLabel.pending;
                    return (
                      <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                          {order.shippingAddress?.fullName || "—"}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {order.totalAmount?.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">تومان</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block text-xs px-3 py-1.5 rounded-full font-medium ${sc.color}`}>
                            {sc.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/admin/orders/${order._id}`}
                            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium"
                          >
                            مشاهده
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
              {recentOrders.map((order) => {
                const sc = statusLabel[order.status] || statusLabel.pending;
                return (
                  <Link
                    key={order._id}
                    href={`/admin/orders/${order._id}`}
                    className="block bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                        #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${sc.color}`}>
                        {sc.label}
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">مشتری:</span>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {order.shippingAddress?.fullName || "—"}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">مبلغ:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          {order.totalAmount?.toLocaleString()} تومان
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">تاریخ:</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 flex justify-end">
                      <span className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-1">
                        مشاهده جزئیات
                        <ArrowLeft className="h-3 w-3" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {recentOrders.length === 0 && !loading && (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <AlertCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                هیچ سفارشی یافت نشد
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                هنوز هیچ سفارشی در سیستم ثبت نشده است. با اولین سفارش، آمار در این بخش نمایش داده می‌شود.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}