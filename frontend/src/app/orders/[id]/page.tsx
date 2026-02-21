"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import orderService, { Order } from "@/services/orderService";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  MapPin,
  Phone,
  User,
  Home,
  ArrowRight,
} from "lucide-react";

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

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const orderId = params?.id as string;

  useEffect(() => {
    if (!orderId || orderId === "undefined") {
      setError("شناسه سفارش معتبر نیست");
      setLoading(false);
      return;
    }

    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error: any) {
      console.error("Error fetching order:", error);
      if (error.response?.status === 500) {
        setError("خطای سرور، لطفاً دقایقی دیگر تلاش کنید");
      } else if (error.response?.status === 404) {
        setError("سفارش مورد نظر یافت نشد");
      } else {
        setError("خطا در دریافت اطلاعات سفارش");
      }
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-500">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <XCircle className="h-16 w-16 text-red-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">خطا</h1>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link href="/orders">
          <Button>بازگشت به سفارشات</Button>
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">سفارش یافت نشد</h1>
        <Link href="/orders">
          <Button>بازگشت به سفارشات</Button>
        </Link>
      </div>
    );
  }

  // ✅ fallback به pending اگه status ناشناخته بود
  const currentStatus = statusMap[order.status] || statusMap["pending"];
  const StatusIcon = currentStatus.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/orders">
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">جزئیات سفارش</h1>
      </div>

      <div className="grid gap-6">
        {/* وضعیت سفارش */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${currentStatus.color}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">وضعیت سفارش</p>
                <p className="text-xl font-bold">{currentStatus.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* اطلاعات ارسال */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">اطلاعات ارسال</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <User className="h-5 w-5" />
                <span>{order.shippingAddress.fullName}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="h-5 w-5" />
                <span>{order.shippingAddress.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="h-5 w-5" />
                <span>{order.shippingAddress.city}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Home className="h-5 w-5" />
                <span>{order.shippingAddress.address}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* محصولات */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">محصولات</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 py-3 border-b last:border-0"
                >
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`}>
                      <h4 className="font-bold hover:text-blue-600">
                        {item.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-gray-500">
                      تعداد: {item.quantity}
                    </p>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-gray-500">قیمت</p>
                    <p className="font-bold text-blue-600">
                      {(item.price * item.quantity).toLocaleString()} تومان
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between text-lg font-bold">
                <span>مبلغ کل:</span>
                <span className="text-blue-600">
                  {order.totalAmount.toLocaleString()} تومان
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
