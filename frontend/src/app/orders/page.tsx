"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import orderService, { Order } from "@/services/orderService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, Clock, CheckCircle, XCircle, Truck } from "lucide-react";

// ✅ confirmed اضافه شد + type کامل
const statusMap: Record<string, { label: string; color: string; icon: any }> = {
  pending: {
    label: "در انتظار بررسی",
    color: "bg-yellow-100 text-yellow-700",
    icon: Clock,
  },
  confirmed: {
    label: "تأیید شده",
    color: "bg-blue-100 text-blue-700",
    icon: CheckCircle,
  },
  processing: {
    label: "در حال پردازش",
    color: "bg-blue-100 text-blue-700",
    icon: Package,
  },
  shipped: {
    label: "ارسال شده",
    color: "bg-purple-100 text-purple-700",
    icon: Truck,
  },
  delivered: {
    label: "تحویل شده",
    color: "bg-green-100 text-green-700",
    icon: CheckCircle,
  },
  cancelled: {
    label: "لغو شده",
    color: "bg-red-100 text-red-700",
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">سفارشات من</h1>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">شما هنوز سفارشی ثبت نکرده‌اید</p>
            <Link href="/products">
              <Button className="mt-4">مشاهده محصولات</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            // ✅ fallback به pending اگه status ناشناخته بود
            const currentStatus =
              statusMap[order.status] || statusMap["pending"];
            const StatusIcon = currentStatus.icon;

            return (
              <Card key={order._id}>
                <CardContent className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        شماره سفارش: {order._id.slice(-8)}
                      </p>
                      <p className="font-bold mb-2">
                        {new Date(order.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                      <div
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${currentStatus.color}`}
                      >
                        <StatusIcon className="h-4 w-4" />
                        <span>{currentStatus.label}</span>
                      </div>
                    </div>

                    <div className="text-left">
                      <p className="text-sm text-gray-500 mb-1">مبلغ کل</p>
                      <p className="text-xl font-bold text-blue-600">
                        {order.totalAmount.toLocaleString()} تومان
                      </p>
                      <p className="text-sm text-gray-500">
                        {order.items.length} کالا
                      </p>
                    </div>

                    <Link href={`/orders/${order._id}`}>
                      <Button variant="outline">جزئیات سفارش</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
