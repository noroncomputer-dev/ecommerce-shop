"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import orderService, { Order } from "@/services/orderService";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  pending: {
    label: "در انتظار بررسی",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  processing: {
    label: "در حال پردازش",
    color: "text-purple-700",
    bg: "bg-purple-50",
  },
  shipped: { label: "ارسال شده", color: "text-blue-700", bg: "bg-blue-50" },
  delivered: {
    label: "تحویل داده شده",
    color: "text-green-700",
    bg: "bg-green-50",
  },
  cancelled: { label: "لغو شده", color: "text-red-700", bg: "bg-red-50" },
  refunded: { label: "برگشت وجه", color: "text-gray-700", bg: "bg-gray-50" },
};

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "در انتظار پرداخت", color: "text-amber-600" },
  paid: { label: "پرداخت شده ✓", color: "text-green-600" },
  failed: { label: "پرداخت ناموفق", color: "text-red-600" },
  refunded: { label: "وجه برگشت داده شده", color: "text-gray-600" },
};

// timeline وضعیت‌های سفارش
const statusTimeline = ["pending", "processing", "shipped", "delivered"];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!orderId) return;
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError("سفارش یافت نشد یا دسترسی ندارید");
    } finally {
      setLoading(false);
    }
  };

  // index وضعیت فعلی در timeline
  const currentStatusIndex = statusTimeline.indexOf(order?.status || "");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-6xl mb-4">📦</p>
        <h2 className="text-xl font-bold text-gray-800 mb-2">سفارش یافت نشد</h2>
        <p className="text-gray-500 mb-6">{error}</p>
        <Link
          href={isAdmin ? "/admin/orders" : "/orders"}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          بازگشت به سفارشات
        </Link>
      </div>
    );
  }

  const sc = statusConfig[order.status] || statusConfig["pending"];
  const pc =
    paymentStatusConfig[order.paymentStatus] || paymentStatusConfig["pending"];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* هدر */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Link
            href={isAdmin ? "/admin/orders" : "/orders"}
            className="text-sm text-blue-600 hover:underline mb-1 block"
          >
            ← بازگشت به سفارشات
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            جزئیات سفارش #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            ثبت شده در {new Date(order.createdAt).toLocaleDateString("fa-IR")}
          </p>
        </div>

        <div
          className={`px-4 py-2 rounded-xl text-sm font-medium ${sc.color} ${sc.bg}`}
        >
          {sc.label}
        </div>
      </div>

      {/* ✅ Timeline وضعیت — فقط اگه لغو/برگشت نشده */}
      {order.status !== "cancelled" && order.status !== "refunded" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-5">مرحله سفارش شما</h3>
          <div className="flex items-center justify-between relative">
            {/* خط اتصال */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
            <div
              className="absolute top-4 left-0 h-0.5 bg-blue-500 z-0 transition-all duration-500"
              style={{
                width: `${Math.max(0, currentStatusIndex / (statusTimeline.length - 1)) * 100}%`,
              }}
            />

            {statusTimeline.map((status, index) => {
              const isDone = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;
              const labels: Record<string, string> = {
                pending: "ثبت سفارش",
                processing: "در پردازش",
                shipped: "ارسال شد",
                delivered: "تحویل داده شد",
              };
              return (
                <div
                  key={status}
                  className="flex flex-col items-center z-10 relative"
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                    ${isDone ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"}
                    ${isCurrent ? "ring-4 ring-blue-100" : ""}
                  `}
                  >
                    {isDone ? "✓" : index + 1}
                  </div>
                  <p
                    className={`text-xs mt-2 font-medium ${isDone ? "text-blue-600" : "text-gray-400"}`}
                  >
                    {labels[status]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* لغو یا برگشت وجه */}
      {(order.status === "cancelled" || order.status === "refunded") && (
        <div
          className={`rounded-xl border p-4 mb-6 flex items-center gap-3
          ${order.status === "cancelled" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}
        >
          <span className="text-2xl">
            {order.status === "cancelled" ? "❌" : "💰"}
          </span>
          <div>
            <p
              className={`font-bold ${order.status === "cancelled" ? "text-red-700" : "text-gray-700"}`}
            >
              {order.status === "cancelled"
                ? "سفارش لغو شده"
                : "وجه برگشت داده شده"}
            </p>
            <p className="text-sm text-gray-500">
              {order.status === "refunded"
                ? "مبلغ پرداختی به حساب شما برگشت داده خواهد شد"
                : "این سفارش لغو شده است"}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* اطلاعات ارسال */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>📍</span> اطلاعات ارسال
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <span className="font-medium text-gray-800">نام:</span>{" "}
              {order.shippingAddress.fullName}
            </p>
            <p>
              <span className="font-medium text-gray-800">تلفن:</span>{" "}
              {order.shippingAddress.phone}
            </p>
            <p>
              <span className="font-medium text-gray-800">شهر:</span>{" "}
              {order.shippingAddress.city}
            </p>
            <p>
              <span className="font-medium text-gray-800">آدرس:</span>{" "}
              {order.shippingAddress.address}
            </p>
            <p>
              <span className="font-medium text-gray-800">کد پستی:</span>{" "}
              {order.shippingAddress.postalCode}
            </p>
          </div>
        </div>

        {/* اطلاعات پرداخت */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <span>💳</span> اطلاعات پرداخت
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">روش پرداخت:</span>
              <span className="font-medium">
                {order.paymentMethod === "online" ? "آنلاین" : "در محل"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">وضعیت پرداخت:</span>
              <span className={`font-medium ${pc.color}`}>{pc.label}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="font-bold text-gray-800">مبلغ کل:</span>
              <span className="font-bold text-blue-600 text-lg">
                {order.totalAmount.toLocaleString()} تومان
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* محصولات */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <span>📦</span> محصولات سفارش
        </h3>
        <div className="space-y-3">
          {order.items.map((item: any, index: number) => (
            <div key={index} className="flex gap-4 p-3 bg-gray-50 rounded-lg">
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
              <div className="flex-1">
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {item.quantity} عدد × {item.price?.toLocaleString()} تومان
                </p>
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-800">
                  {(item.quantity * item.price)?.toLocaleString()} تومان
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
