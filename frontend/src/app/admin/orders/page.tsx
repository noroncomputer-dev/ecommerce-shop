"use client";

import { useEffect, useState } from "react";
import orderService, { Order } from "@/services/orderService";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  DollarSign,
  Eye,
  Download,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { cn } from "../../../../lib/utils";

const statusConfig: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  pending: {
    label: "در انتظار",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
  },
  processing: {
    label: "در پردازش",
    color: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    border: "border-purple-200 dark:border-purple-800",
  },
  shipped: {
    label: "ارسال شده",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    border: "border-blue-200 dark:border-blue-800",
  },
  delivered: {
    label: "تحویل داده شده",
    color: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-950/30",
    border: "border-green-200 dark:border-green-800",
  },
  cancelled: {
    label: "لغو شده",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
  },
  refunded: {
    label: "برگشت پول",
    color: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-800",
    border: "border-gray-200 dark:border-gray-700",
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
    label: "تحویل شده",
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
  pending: {
    label: "در انتظار پرداخت",
    color: "text-amber-600 dark:text-amber-400",
  },
  paid: {
    label: "پرداخت شده",
    color: "text-green-600 dark:text-green-400",
  },
  failed: {
    label: "پرداخت ناموفق",
    color: "text-red-600 dark:text-red-400",
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [mobileDetailsOpen, setMobileDetailsOpen] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-600 dark:border-t-blue-400"></div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            در حال بارگذاری سفارشات...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            مدیریت سفارشات
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            مشاهده و مدیریت تمام سفارشات فروشگاه
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadOrders}
          className="gap-2 border-gray-200 dark:border-gray-700"
        >
          <RefreshCw className="h-4 w-4" />
          بروزرسانی
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4">
        {[
          {
            label: "کل سفارشات",
            value: stats.total,
            icon: Package,
            color: "from-blue-500 to-cyan-500",
            bg: "bg-blue-50 dark:bg-blue-950/30",
            text: "text-blue-600 dark:text-blue-400",
          },
          {
            label: "در انتظار",
            value: stats.pending,
            icon: Clock,
            color: "from-amber-500 to-orange-500",
            bg: "bg-amber-50 dark:bg-amber-950/30",
            text: "text-amber-600 dark:text-amber-400",
          },
          {
            label: "در پردازش",
            value: stats.processing,
            icon: Package,
            color: "from-purple-500 to-pink-500",
            bg: "bg-purple-50 dark:bg-purple-950/30",
            text: "text-purple-600 dark:text-purple-400",
          },
          {
            label: "تحویل شده",
            value: stats.delivered,
            icon: CheckCircle,
            color: "from-green-500 to-emerald-500",
            bg: "bg-green-50 dark:bg-green-950/30",
            text: "text-green-600 dark:text-green-400",
          },
          {
            label: "درآمد کل",
            value: `${stats.revenue.toLocaleString()} ت`,
            icon: DollarSign,
            color: "from-emerald-500 to-teal-500",
            bg: "bg-emerald-50 dark:bg-emerald-950/30",
            text: "text-emerald-600 dark:text-emerald-400",
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card
              key={i}
              className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${stat.bg}`}>
                    <Icon className={`h-5 w-5 ${stat.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-lg md:text-xl font-bold text-gray-900 dark:text-white truncate">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="جستجو با نام، شماره سفارش یا تلفن..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-9 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <Filter className="h-4 w-4 ml-2" />
            <SelectValue placeholder="همه وضعیت‌ها" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
            {Object.entries(statusConfig).map(([key, val]) => (
              <SelectItem key={key} value={key}>
                {val.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        {filteredOrders.length === 0 ? (
          <CardContent className="p-12 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                <Package className="h-8 w-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                هیچ سفارشی یافت نشد
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                با تغییر فیلترها یا جستجو می‌توانید سفارشات را مشاهده کنید
              </p>
            </div>
          </CardContent>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      شماره سفارش
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      مشتری
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      مبلغ
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      پرداخت
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      وضعیت
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      تاریخ
                    </th>
                    <th className="text-right px-4 py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                      عملیات
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {filteredOrders.map((order) => {
                    const sc =
                      statusConfig[order.status] || statusConfig.pending;
                    return (
                      <tr
                        key={order._id}
                        className={cn(
                          "hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors",
                          selectedOrder?._id === order._id &&
                            "bg-blue-50/50 dark:bg-blue-950/20",
                        )}
                      >
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            #{order._id.slice(-8).toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {order.shippingAddress.fullName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {order.shippingAddress.phone}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-900 dark:text-white">
                            {order.totalAmount.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
                            تومان
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-medium ${paymentStatusConfig[order.paymentStatus]?.color}`}
                          >
                            {paymentStatusConfig[order.paymentStatus]?.label ||
                              order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={cn(sc.bg, sc.border, sc.color)}
                          >
                            {sc.label}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString(
                            "fa-IR",
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedOrder(
                                selectedOrder?._id === order._id ? null : order,
                              )
                            }
                            className={cn(
                              "gap-2",
                              selectedOrder?._id === order._id
                                ? "text-blue-600 dark:text-blue-400"
                                : "text-gray-500 dark:text-gray-400",
                            )}
                          >
                            <Eye className="h-4 w-4" />
                            {selectedOrder?._id === order._id
                              ? "بستن"
                              : "جزئیات"}
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3 p-3">
              {filteredOrders.map((order) => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                return (
                  <Card
                    key={order._id}
                    className="bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-700"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-mono text-xs text-gray-500 dark:text-gray-400 bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(sc.bg, sc.border, sc.color)}
                        >
                          {sc.label}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            مشتری:
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {order.shippingAddress.fullName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            تلفن:
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {order.shippingAddress.phone}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            مبلغ:
                          </span>
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            {order.totalAmount.toLocaleString()} تومان
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            پرداخت:
                          </span>
                          <span
                            className={`text-xs font-medium ${paymentStatusConfig[order.paymentStatus]?.color}`}
                          >
                            {paymentStatusConfig[order.paymentStatus]?.label}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            تاریخ:
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString(
                              "fa-IR",
                            )}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedOrder(order);
                            setMobileDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 ml-2" />
                          مشاهده جزئیات
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {/* Order Details Panel - Desktop */}
      {selectedOrder && (
        <div className="hidden lg:block fixed left-6 top-24 w-96">
          <OrderDetailsPanel
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        </div>
      )}

      {/* Order Details Sheet - Mobile */}
      <Sheet open={mobileDetailsOpen} onOpenChange={setMobileDetailsOpen}>
        <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="text-right">جزئیات سفارش</SheetTitle>
          </SheetHeader>
          {selectedOrder && (
            <div className="mt-4 overflow-y-auto h-full pb-20">
              <OrderDetailsPanel
                order={selectedOrder}
                onClose={() => {
                  setMobileDetailsOpen(false);
                  setSelectedOrder(null);
                }}
                onStatusChange={handleStatusChange}
                updatingId={updatingId}
                isMobile
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// Order Details Panel Component
function OrderDetailsPanel({
  order,
  onClose,
  onStatusChange,
  updatingId,
  isMobile,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, status: string) => void;
  updatingId: string | null;
  isMobile?: boolean;
}) {
  return (
    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
        <h3 className="font-bold text-white text-sm">
          سفارش #{order._id.slice(-8).toUpperCase()}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20 h-8 w-8"
        >
          <XCircle className="h-4 w-4" />
        </Button>
      </div>

      <CardContent className="p-4 space-y-5 text-sm max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Status Buttons */}
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 font-medium">
            تغییر وضعیت سفارش:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {actionButtons.map((btn) => {
              const isActive = order.status === btn.status;
              const isLoading = updatingId === order._id;
              return (
                <Button
                  key={btn.status}
                  size="sm"
                  onClick={() => onStatusChange(order._id, btn.status)}
                  disabled={isActive || isLoading}
                  className={cn(
                    "gap-1.5 text-white transition-all",
                    isActive
                      ? "ring-2 ring-offset-2 ring-gray-400"
                      : "opacity-90 hover:opacity-100",
                    btn.color,
                    isLoading && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <span>{btn.emoji}</span>
                  <span className="text-xs">{btn.label}</span>
                  {isActive && <span className="mr-auto">✓</span>}
                </Button>
              );
            })}
          </div>

          {/* Current Status */}
          <div
            className={cn(
              "mt-3 text-center text-xs py-2 rounded-lg font-medium border",
              statusConfig[order.status]?.bg,
              statusConfig[order.status]?.border,
              statusConfig[order.status]?.color,
            )}
          >
            وضعیت فعلی: {statusConfig[order.status]?.label}
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 space-y-1.5">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            اطلاعات مشتری
          </p>
          <p className="font-medium text-gray-900 dark:text-white">
            {order.shippingAddress.fullName}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {order.shippingAddress.phone}
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            {order.shippingAddress.city}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-xs leading-relaxed">
            {order.shippingAddress.address}
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs">
            کد پستی: {order.shippingAddress.postalCode}
          </p>
        </div>

        {/* Products */}
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
            محصولات سفارش
          </p>
          <div className="space-y-2">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 dark:text-white text-xs truncate">
                    {item.name}
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">
                    {item.quantity} عدد × {item.price.toLocaleString()} تومان
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>روش پرداخت:</span>
            <span className="font-medium">
              {order.paymentMethod === "online" ? "آنلاین" : "در محل"}
            </span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              وضعیت پرداخت:
            </span>
            <span className={paymentStatusConfig[order.paymentStatus]?.color}>
              {paymentStatusConfig[order.paymentStatus]?.label}
            </span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 dark:text-white">
            <span>مبلغ کل:</span>
            <span>{order.totalAmount.toLocaleString()} تومان</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 text-center pt-2">
          ثبت شده در {new Date(order.createdAt).toLocaleDateString("fa-IR")}
        </p>
      </CardContent>
    </Card>
  );
}
