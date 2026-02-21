"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Minus,
  Plus,
  Shield,
  Truck,
  RefreshCw,
  CreditCard,
  MapPin,
  Phone,
  User,
  Home,
  Mail,
  ChevronLeft,
} from "lucide-react";
import { showError, showSuccess, showWarning } from "@/utils/swal";
import orderService from "@/services/orderService";

const API_BASE = "http://localhost:5001/api";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice,
    clearCart,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const [step, setStep] = useState<"cart" | "checkout" | "payment">("cart");
  const [loading, setLoading] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  const subtotal = totalPrice;
  const shippingCost = subtotal > 1000000 ? 0 : 50000;
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shippingCost - discount;

  const handleRemoveItem = (productId: string, productName: string) => {
    showWarning(`آیا از حذف ${productName} از سبد خرید اطمینان دارید؟`).then(
      (result) => {
        if (result.isConfirmed) {
          removeFromCart(productId);
          showSuccess("محصول با موفقیت حذف شد");
        }
      },
    );
  };

  const handleApplyPromo = () => {
    if (promoCode.toLowerCase() === "discount10") {
      setPromoApplied(true);
      showSuccess("کد تخفیف با موفقیت اعمال شد");
    } else {
      showError("کد تخفیف نامعتبر است");
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      showError("لطفاً ابتدا وارد شوید");
      router.push("/login?redirect=cart");
      return;
    }
    setStep("checkout");
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      showError("لطفاً تمام فیلدهای الزامی را پر کنید");
      return;
    }
    setStep("payment");
  };

  // ✅ پرداخت واقعی — ساخت order + redirect به زرین‌پال
  const handlePayment = async () => {
    setLoading(true);
    try {
      // ۱. ساخت order در backend
      const orderData = {
        items: items.map((item) => ({
          productId: item.product._id, // ✅ backend انتظار productId داره
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress,
        totalAmount: total,
        paymentMethod: "zarinpal",
      };

      const order = await orderService.createOrder(orderData);

      // ۲. درخواست پرداخت از زرین‌پال
      const payRes = await fetch(`${API_BASE}/payment/request`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ orderId: order._id }),
      });

      if (!payRes.ok) {
        const err = await payRes.json();
        throw new Error(err.message || "خطا در ایجاد لینک پرداخت");
      }

      const { paymentUrl } = await payRes.json();

      // ۳. پاک کردن سبد خرید و redirect به زرین‌پال
      clearCart();
      window.location.href = paymentUrl;
    } catch (error: any) {
      showError(error.message || "خطا در ثبت سفارش");
    } finally {
      setLoading(false);
    }
  };

  // ── سبد خالی ──
  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-8 dark:bg-gray-900 dark:border-gray-800">
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold dark:text-white">
              سبد خرید خالی است
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              محصولی به سبد خرید خود اضافه نکرده‌اید
            </p>
            <Link href="/products">
              <Button
                size="lg"
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="h-5 w-5" />
                مشاهده محصولات
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ── صفحه ارسال ──
  if (step === "checkout") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => setStep("cart")}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">اطلاعات ارسال</h1>
        </div>

        <form onSubmit={handleAddressSubmit} className="space-y-6">
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    label: "نام و نام خانوادگی",
                    key: "fullName",
                    icon: User,
                    placeholder: "علی رضایی",
                  },
                  {
                    label: "شماره تماس",
                    key: "phone",
                    icon: Phone,
                    placeholder: "۰۹۱۲۳۴۵۶۷۸۹",
                  },
                  {
                    label: "شهر",
                    key: "city",
                    icon: MapPin,
                    placeholder: "تهران",
                  },
                  {
                    label: "کد پستی",
                    key: "postalCode",
                    icon: Mail,
                    placeholder: "۱۲۳۴۵۶۷۸۹۰",
                  },
                ].map(({ label, key, icon: Icon, placeholder }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2 dark:text-gray-300">
                      <Icon className="h-4 w-4" /> {label}
                    </label>
                    <Input
                      value={(shippingAddress as any)[key]}
                      onChange={(e) =>
                        setShippingAddress({
                          ...shippingAddress,
                          [key]: e.target.value,
                        })
                      }
                      placeholder={placeholder}
                      required={key !== "postalCode"}
                      className="dark:bg-gray-800 dark:border-gray-700"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 dark:text-gray-300">
                  <Home className="h-4 w-4" /> آدرس کامل
                </label>
                <Input
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({
                      ...shippingAddress,
                      address: e.target.value,
                    })
                  }
                  placeholder="خیابان، کوچه، پلاک"
                  required
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
              </div>

              {/* خلاصه */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mt-4">
                <h3 className="font-medium mb-3 dark:text-white">
                  خلاصه سفارش
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between dark:text-gray-300">
                    <span>مبلغ کل:</span>
                    <span>{subtotal.toLocaleString()} تومان</span>
                  </div>
                  <div className="flex justify-between dark:text-gray-300">
                    <span>هزینه ارسال:</span>
                    <span>
                      {shippingCost > 0
                        ? `${shippingCost.toLocaleString()} تومان`
                        : "رایگان"}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>تخفیف:</span>
                      <span>- {discount.toLocaleString()} تومان</span>
                    </div>
                  )}
                  <Separator className="my-2 dark:border-gray-700" />
                  <div className="flex justify-between font-bold text-lg dark:text-white">
                    <span>قابل پرداخت:</span>
                    <span className="text-blue-600 dark:text-blue-400">
                      {total.toLocaleString()} تومان
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep("cart")}
              className="flex-1"
            >
              بازگشت
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              ادامه و پرداخت
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // ── صفحه پرداخت ──
  if (step === "payment") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setStep("checkout")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold dark:text-white">پرداخت</h1>
        </div>

        <div className="space-y-6">
          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4 dark:text-white">روش پرداخت</h3>
              <label className="flex items-center gap-3 p-4 border dark:border-gray-700 rounded-xl cursor-pointer hover:border-blue-500 transition">
                <input
                  type="radio"
                  name="payment"
                  defaultChecked
                  className="w-4 h-4 text-blue-600"
                />
                <CreditCard className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="font-medium dark:text-white">
                    پرداخت آنلاین — زرین‌پال
                  </p>
                  <p className="text-sm text-gray-500">
                    با تمام کارت‌های عضو شتاب
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="p-6">
              <h3 className="font-medium mb-4 dark:text-white">خلاصه سفارش</h3>
              <div className="space-y-3">
                {items.slice(0, 3).map((item) => (
                  <div
                    key={item.product._id}
                    className="flex justify-between text-sm dark:text-gray-300"
                  >
                    <span>
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>
                      {(item.product.price * item.quantity).toLocaleString()}{" "}
                      تومان
                    </span>
                  </div>
                ))}
                {items.length > 3 && (
                  <p className="text-sm text-gray-500">
                    و {items.length - 3} محصول دیگر...
                  </p>
                )}
                <Separator className="dark:border-gray-700" />
                <div className="flex justify-between font-bold text-lg dark:text-white">
                  <span>مبلغ نهایی:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {total.toLocaleString()} تومان
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                در حال انتقال به درگاه...
              </span>
            ) : (
              "پرداخت و ثبت سفارش"
            )}
          </Button>
        </div>
      </div>
    );
  }

  // ── سبد خرید اصلی ──
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50 dark:bg-gray-950">
      <h1 className="text-3xl font-black mb-8 flex items-center gap-2 dark:text-white">
        <ShoppingBag className="h-8 w-8" />
        سبد خرید
        <Badge variant="secondary" className="mr-2">
          {totalItems}
        </Badge>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* لیست محصولات */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card
              key={item.product._id}
              className="overflow-hidden hover:shadow-lg transition dark:bg-gray-900 dark:border-gray-800"
            >
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-28 h-28 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden shrink-0">
                    {item.product.images?.[0] ? (
                      <img
                        src={
                          item.product.images[0].startsWith("http")
                            ? item.product.images[0]
                            : `http://localhost:5001${item.product.images[0]}`
                        }
                        alt={item.product.name}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <ShoppingBag className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <Link href={`/products/${item.product.slug}`}>
                      <h3 className="font-bold text-lg hover:text-blue-600 transition line-clamp-1 dark:text-white">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                      {item.product.category?.name}
                    </p>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center border dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                        <button
                          className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition font-bold"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          −
                        </button>
                        <span className="w-10 text-center text-sm font-bold dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 transition font-bold"
                          onClick={() =>
                            updateQuantity(item.product._id, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.product.stock}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm"
                        onClick={() =>
                          handleRemoveItem(item.product._id, item.product.name)
                        }
                      >
                        <Trash2 className="h-4 w-4" /> حذف
                      </button>
                    </div>
                  </div>

                  <div className="text-left shrink-0">
                    <p className="text-xs text-gray-400">قیمت واحد</p>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      {item.product.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">مجموع</p>
                    <p className="font-black text-gray-800 dark:text-white">
                      {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">تومان</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* خلاصه */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 dark:bg-gray-900 dark:border-gray-800">
            <CardContent className="p-6 space-y-4">
              <h3 className="font-bold text-lg dark:text-white">خلاصه سفارش</h3>

              <div className="flex gap-2">
                <Input
                  placeholder="کد تخفیف"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={promoApplied}
                  className="dark:bg-gray-800 dark:border-gray-700"
                />
                <Button
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={promoApplied || !promoCode}
                  className="dark:border-gray-600"
                >
                  اعمال
                </Button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between dark:text-gray-300">
                  <span>قیمت کالاها:</span>
                  <span>{subtotal.toLocaleString()} تومان</span>
                </div>
                <div className="flex justify-between dark:text-gray-300">
                  <span>هزینه ارسال:</span>
                  <span>
                    {shippingCost > 0
                      ? `${shippingCost.toLocaleString()} تومان`
                      : "رایگان"}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>تخفیف:</span>
                    <span>- {discount.toLocaleString()} تومان</span>
                  </div>
                )}
                <Separator className="dark:border-gray-700" />
                <div className="flex justify-between font-bold text-lg dark:text-white">
                  <span>قابل پرداخت:</span>
                  <span className="text-blue-600 dark:text-blue-400">
                    {total.toLocaleString()} تومان
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t dark:border-gray-700">
                {[
                  { icon: Shield, text: "ضمانت اصالت کالا" },
                  { icon: Truck, text: "ارسال سریع به سراسر کشور" },
                  { icon: RefreshCw, text: "۷ روز ضمانت بازگشت" },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                  >
                    <Icon className="h-4 w-4" /> {text}
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                >
                  ادامه فرآیند خرید
                </Button>
                <Link href="/products">
                  <Button
                    variant="outline"
                    className="w-full dark:border-gray-600 dark:text-gray-300"
                  >
                    ادامه خرید
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
