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
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api"; // ✅

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

      // ۵ سفارش آخر
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statusLabel: Record<string, { label: string; color: string }> = {
    pending: { label: "در انتظار", color: "text-amber-600 bg-amber-50" },
    processing: { label: "در پردازش", color: "text-purple-600 bg-purple-50" },
    shipped: { label: "ارسال شده", color: "text-blue-600 bg-blue-50" },
    delivered: { label: "تحویل شده", color: "text-green-600 bg-green-50" },
    cancelled: { label: "لغو شده", color: "text-red-600 bg-red-50" },
    refunded: { label: "برگشت پول", color: "text-gray-600 bg-gray-50" },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">داشبورد مدیریت</h1>

      {/* آمار اصلی */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Link href="/admin/products">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                تعداد محصولات
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.products}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/categories">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                تعداد دسته‌بندی
              </CardTitle>
              <FolderTree className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.categories}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                تعداد کاربران
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.users}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                کل سفارشات
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* آمار سفارشات */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-emerald-50 border-emerald-100">
          <CardContent className="p-4 flex items-center gap-4">
            <TrendingUp className="h-8 w-8 text-emerald-600" />
            <div>
              <p className="text-xs text-emerald-600 font-medium">درآمد کل</p>
              <p className="text-xl font-bold text-emerald-700">
                {stats.revenue.toLocaleString()} ت
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-100">
          <CardContent className="p-4 flex items-center gap-4">
            <Clock className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-xs text-amber-600 font-medium">در انتظار</p>
              <p className="text-xl font-bold text-amber-700">
                {stats.pendingOrders}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-100">
          <CardContent className="p-4 flex items-center gap-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-xs text-green-600 font-medium">تحویل شده</p>
              <p className="text-xl font-bold text-green-700">
                {stats.deliveredOrders}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-100">
          <CardContent className="p-4 flex items-center gap-4">
            <XCircle className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-xs text-red-600 font-medium">لغو شده</p>
              <p className="text-xl font-bold text-red-700">
                {stats.cancelledOrders}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* آخرین سفارشات */}
      {recentOrders.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">آخرین سفارشات</CardTitle>
            <Link
              href="/admin/orders"
              className="text-sm text-blue-600 hover:underline"
            >
              مشاهده همه
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-right py-2 font-medium text-gray-500">
                      شماره سفارش
                    </th>
                    <th className="text-right py-2 font-medium text-gray-500">
                      مشتری
                    </th>
                    <th className="text-right py-2 font-medium text-gray-500">
                      مبلغ
                    </th>
                    <th className="text-right py-2 font-medium text-gray-500">
                      وضعیت
                    </th>
                    <th className="text-right py-2 font-medium text-gray-500">
                      تاریخ
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentOrders.map((order) => {
                    const sc =
                      statusLabel[order.status] || statusLabel["pending"];
                    return (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="py-3 font-mono text-xs text-gray-400">
                          #{order._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="py-3 font-medium text-gray-700">
                          {order.shippingAddress?.fullName || "—"}
                        </td>
                        <td className="py-3 font-bold text-gray-800">
                          {order.totalAmount?.toLocaleString()} ت
                        </td>
                        <td className="py-3">
                          <span
                            className={`text-xs px-2 py-1 rounded-lg font-medium ${sc.color}`}
                          >
                            {sc.label}
                          </span>
                        </td>
                        <td className="py-3 text-gray-400 text-xs">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
