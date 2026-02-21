"use client";

import { useEffect, useState } from "react";
import orderService, { Order } from "@/services/orderService";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: {
    label: "در انتظار",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  processing: {
    label: "در پردازش",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
  shipped: {
    label: "ارسال شده",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  delivered: {
    label: "تحویل داده شده",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  cancelled: {
    label: "لغو شده",
    color: "text-red-700",
    bg: "bg-red-50",
    border: "border-red-200",
  },
  refunded: {
    label: "برگشت پول",
    color: "text-gray-700",
    bg: "bg-gray-50",
    border: "border-gray-200",
  },
};

// دکمه‌های اکشن برای هر وضعیت
const actionButtons = [
  {
    status: "pending",
    label: "در انتظار",
    emoji: "⏳",
    color: "bg-amber-500 hover:bg-amber-600",
  },
  {
    status: "processing",
    label: "در پردازش",
    emoji: "⚙️",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    status: "shipped",
    label: "ارسال شده",
    emoji: "🚚",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    status: "delivered",
    label: "تحویل داده شده",
    emoji: "✅",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    status: "cancelled",
    label: "لغو شده",
    emoji: "❌",
    color: "bg-red-500 hover:bg-red-600",
  },
  {
    status: "refunded",
    label: "برگشت پول",
    emoji: "💰",
    color: "bg-gray-500 hover:bg-gray-600",
  },
];

const paymentStatusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "در انتظار پرداخت", color: "text-amber-600" },
  paid: { label: "پرداخت شده", color: "text-green-600" },
  failed: { label: "پرداخت ناموفق", color: "text-red-600" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const updated = await orderService.updateOrderStatus(
        orderId,
        newStatus as Order["status"],
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: updated.status } : o,
        ),
      );
      if (selectedOrder?._id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: updated.status } : null,
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    processing: orders.filter((o) => o.status === "processing").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.paymentStatus === "paid")
      .reduce((sum, o) => sum + o.totalAmount, 0),
  };

  const filteredOrders = orders.filter((order) => {
    const matchStatus = filterStatus === "all" || order.status === filterStatus;
    const matchSearch =
      search === "" ||
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      order.shippingAddress.phone.includes(search);
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* هدر */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">مدیریت سفارشات</h1>
        <p className="text-gray-500 mt-1">مشاهده و مدیریت تمام سفارشات</p>
      </div>

      {/* آمار سریع */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "کل سفارشات",
            value: stats.total,
            color: "bg-blue-50 text-blue-700",
          },
          {
            label: "در انتظار",
            value: stats.pending,
            color: "bg-amber-50 text-amber-700",
          },
          {
            label: "در پردازش",
            value: stats.processing,
            color: "bg-purple-50 text-purple-700",
          },
          {
            label: "تحویل شده",
            value: stats.delivered,
            color: "bg-green-50 text-green-700",
          },
          {
            label: "درآمد کل",
            value: `${stats.revenue.toLocaleString()} ت`,
            color: "bg-emerald-50 text-emerald-700",
          },
        ].map((stat, i) => (
          <div key={i} className={`${stat.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-sm mt-1 opacity-80">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6">
        {/* لیست سفارشات */}
        <div className="flex-1 min-w-0">
          {/* فیلتر و جستجو */}
          <div className="flex flex-wrap gap-3 mb-4">
            <input
              type="text"
              placeholder="جستجو با نام، شماره سفارش یا تلفن..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">همه وضعیت‌ها</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* جدول */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-4xl mb-3">📦</p>
                <p>سفارشی یافت نشد</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">
                        شماره سفارش
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">
                        مشتری
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">
                        مبلغ
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">
                        پرداخت
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">
                        وضعیت
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">
                        تاریخ
                      </th>
                      <th className="text-right px-4 py-3 font-medium text-gray-600">
                        جزئیات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredOrders.map((order) => {
                      const sc =
                        statusConfig[order.status] || statusConfig["pending"];
                      return (
                        <tr
                          key={order._id}
                          className={`hover:bg-gray-50 transition-colors ${selectedOrder?._id === order._id ? "bg-blue-50" : ""}`}
                        >
                          <td className="px-4 py-3 font-mono text-gray-500 text-xs">
                            #{order._id.slice(-8).toUpperCase()}
                          </td>
                          <td className="px-4 py-3">
                            <p className="font-medium text-gray-800">
                              {order.shippingAddress.fullName}
                            </p>
                            <p className="text-gray-400 text-xs">
                              {order.shippingAddress.phone}
                            </p>
                          </td>
                          <td className="px-4 py-3 font-bold text-gray-800">
                            {order.totalAmount.toLocaleString()}
                            <span className="text-xs text-gray-400 mr-1">
                              ت
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-medium ${paymentStatusConfig[order.paymentStatus]?.color || "text-gray-500"}`}
                            >
                              {paymentStatusConfig[order.paymentStatus]
                                ?.label || order.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2 py-1 rounded-lg border font-medium ${sc.color} ${sc.bg} ${sc.border}`}
                            >
                              {sc.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-500 text-xs">
                            {new Date(order.createdAt).toLocaleDateString(
                              "fa-IR",
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() =>
                                setSelectedOrder(
                                  selectedOrder?._id === order._id
                                    ? null
                                    : order,
                                )
                              }
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                            >
                              {selectedOrder?._id === order._id
                                ? "بستن"
                                : "مشاهده"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* پنل جزئیات */}
        {selectedOrder && (
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-6">
              {/* هدر پنل */}
              <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-sm">
                  سفارش #{selectedOrder._id.slice(-8).toUpperCase()}
                </h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ×
                </button>
              </div>

              <div className="p-4 space-y-5 text-sm">
                {/* ✅ دکمه‌های تغییر وضعیت */}
                <div>
                  <p className="text-xs text-gray-400 mb-3 font-medium">
                    تغییر وضعیت سفارش:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {actionButtons.map((btn) => {
                      const isActive = selectedOrder.status === btn.status;
                      const isLoading = updatingId === selectedOrder._id;
                      return (
                        <button
                          key={btn.status}
                          onClick={() =>
                            handleStatusChange(selectedOrder._id, btn.status)
                          }
                          disabled={isActive || isLoading}
                          className={`
                            flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-white transition-all
                            ${
                              isActive
                                ? "opacity-100 ring-2 ring-offset-1 ring-gray-400 cursor-default " +
                                  btn.color
                                : btn.color + " opacity-80 hover:opacity-100"
                            }
                            ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                          `}
                        >
                          <span>{btn.emoji}</span>
                          <span>{btn.label}</span>
                          {isActive && <span className="mr-auto">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* نمایش وضعیت فعلی */}
                  <div
                    className={`mt-3 text-center text-xs py-2 rounded-lg font-medium
                    ${statusConfig[selectedOrder.status]?.color}
                    ${statusConfig[selectedOrder.status]?.bg}
                    ${statusConfig[selectedOrder.status]?.border} border`}
                  >
                    وضعیت فعلی: {statusConfig[selectedOrder.status]?.label}
                  </div>
                </div>

                {/* اطلاعات مشتری */}
                <div className="bg-gray-50 rounded-lg p-3 space-y-1.5">
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    اطلاعات مشتری
                  </p>
                  <p className="font-medium text-gray-800">
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p className="text-gray-600">
                    {selectedOrder.shippingAddress.phone}
                  </p>
                  <p className="text-gray-600">
                    {selectedOrder.shippingAddress.city}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {selectedOrder.shippingAddress.address}
                  </p>
                  <p className="text-gray-400 text-xs">
                    کد پستی: {selectedOrder.shippingAddress.postalCode}
                  </p>
                </div>

                {/* محصولات */}
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">
                    محصولات سفارش
                  </p>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-gray-50 rounded-lg p-2"
                      >
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-800 text-xs truncate">
                            {item.name}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {item.quantity} عدد × {item.price.toLocaleString()}{" "}
                            ت
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* مبلغ و پرداخت */}
                <div className="border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>روش پرداخت:</span>
                    <span>
                      {selectedOrder.paymentMethod === "online"
                        ? "آنلاین"
                        : "در محل"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">وضعیت پرداخت:</span>
                    <span
                      className={
                        paymentStatusConfig[selectedOrder.paymentStatus]
                          ?.color || ""
                      }
                    >
                      {paymentStatusConfig[selectedOrder.paymentStatus]?.label}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>مبلغ کل:</span>
                    <span>
                      {selectedOrder.totalAmount.toLocaleString()} تومان
                    </span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  ثبت شده در{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString(
                    "fa-IR",
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
