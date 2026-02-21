"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import userService, { UserProfile } from "@/services/userService";
import orderService, { Order } from "@/services/orderService";
import messageService, { ContactMessage } from "@/services/messageService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Phone,
  MapPin,
  Package,
  Lock,
  Camera,
  Save,
  LogOut,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Bell,
  MessageCircle,
} from "lucide-react";
import { showError, showSuccess } from "@/utils/swal";
import Link from "next/link";

// statusMap برای سفارشات
const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
  confirmed: { label: "تأیید شده", color: "bg-blue-100 text-blue-700" },
  processing: { label: "در حال پردازش", color: "bg-blue-100 text-blue-700" },
  shipped: { label: "ارسال شده", color: "bg-purple-100 text-purple-700" },
  delivered: { label: "تحویل شده", color: "bg-green-100 text-green-700" },
  cancelled: { label: "لغو شده", color: "bg-red-100 text-red-700" },
  refunded: { label: "برگشت پول", color: "bg-gray-100 text-gray-700" },
};

// statusMap برای پیام‌ها
const messageStatusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "در انتظار", color: "bg-yellow-100 text-yellow-700" },
  read: { label: "خوانده شده", color: "bg-blue-100 text-blue-700" },
  replied: { label: "پاسخ داده شده", color: "bg-green-100 text-green-700" },
};

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    birthDate: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchProfile(), fetchOrders(), fetchMessages()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const data = await userService.getProfile();
      setProfile(data);
      setProfileForm({
        name: data.name || "",
        phone: data.profile?.phone || "",
        address: data.profile?.address || "",
        city: data.profile?.city || "",
        postalCode: data.profile?.postalCode || "",
        birthDate: data.profile?.birthDate?.split("T")[0] || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  const fetchMessages = async () => {
    try {
      const allMessages = await messageService.getUserMessages();

      // فیلتر برای اینکه فقط پیام‌های پاسخ داده شده رو نشون بدیم
      const repliedMessages = allMessages.filter(
        (msg) => msg.status === "replied",
      );

      setMessages(repliedMessages);

      // تعداد نخونده‌ها برای نوتیف
      const unread = allMessages.filter(
        (msg) => msg.status === "replied" && !msg.readByUser,
      ).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("🔴 Error fetching messages:", error);
      setMessages([]);
    }
  };

  const markMessageAsRead = async (messageId: string) => {
    try {
      await messageService.markMessageAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, readByUser: true } : msg,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
      showSuccess("پیام به عنوان خوانده شده علامت زده شد");
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadMessages = messages.filter((msg) => !msg.readByUser);
      for (const msg of unreadMessages) {
        await messageService.markMessageAsRead(msg._id!);
      }
      setMessages((prev) => prev.map((msg) => ({ ...msg, readByUser: true })));
      setUnreadCount(0);
      showSuccess("همه پیام‌ها به عنوان خوانده شده علامت زده شدند");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updated = await userService.updateProfile({
        name: profileForm.name,
        profile: {
          phone: profileForm.phone,
          address: profileForm.address,
          city: profileForm.city,
          postalCode: profileForm.postalCode,
          birthDate: profileForm.birthDate,
        },
      });
      setProfile(updated);
      updateUser(updated);
      setEditing(false);
      showSuccess("پروفایل با موفقیت به‌روزرسانی شد");
    } catch (error: any) {
      showError(error.message || "خطا در به‌روزرسانی پروفایل");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }

    try {
      await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      showSuccess("رمز عبور با موفقیت تغییر کرد");
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      showError(error.message || "خطا در تغییر رمز عبور");
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await userService.uploadAvatar(file);
      setProfile(result.user);
      updateUser(result.user);
      showSuccess("آواتار با موفقیت آپلود شد");
    } catch (error: any) {
      showError(error.message || "خطا در آپلود آواتار");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">پروفایل کاربری</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* سایدبار */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="relative group mb-4">
                  <Avatar className="w-32 h-32 border-4 border-blue-100">
                    <AvatarImage
                      src={
                        profile?.profile?.avatar
                          ? profile.profile.avatar.startsWith("http")
                            ? profile.profile.avatar
                            : `http://localhost:5001${profile.profile.avatar}`
                          : undefined
                      }
                    />
                    <AvatarFallback className="bg-blue-600 text-white text-2xl">
                      {profile?.name ? getInitials(profile.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <label className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition">
                    <Camera className="h-8 w-8 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>

                <h2 className="text-xl font-bold mb-1">{profile?.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{profile?.email}</p>

                <div className="w-full space-y-2 text-right">
                  <div className="flex items-center gap-2 text-gray-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm">
                      {profile?.role === "admin" ? "مدیر" : "کاربر عادی"}
                    </span>
                  </div>
                  {profile?.profile?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">{profile.profile.phone}</span>
                    </div>
                  )}
                  {profile?.profile?.city && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{profile.profile.city}</span>
                    </div>
                  )}
                </div>

                <div className="w-full mt-4">
                  <div className="flex items-center justify-between p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      پیام‌های جدید
                    </span>
                    {unreadCount > 0 ? (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 p-0 flex items-center justify-center"
                      >
                        {unreadCount}
                      </Badge>
                    ) : (
                      <span className="text-xs text-gray-400">۰</span>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-6 text-red-600 border-red-200 hover:bg-red-50"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 ml-2" />
                  خروج از حساب
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* محتوای اصلی */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">اطلاعات شخصی</TabsTrigger>
              <TabsTrigger value="orders">سفارشات</TabsTrigger>
              <TabsTrigger value="messages" className="relative">
                پیام‌ها
                {unreadCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 px-1 min-w-[20px] flex items-center justify-center animate-pulse"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="security">تغییر رمز</TabsTrigger>
            </TabsList>

            {/* تب اطلاعات شخصی */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>اطلاعات شخصی</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          نام و نام خانوادگی
                        </label>
                        <Input
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              name: e.target.value,
                            })
                          }
                          disabled={!editing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">ایمیل</label>
                        <Input value={profile?.email || ""} disabled />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">تلفن</label>
                        <Input
                          value={profileForm.phone}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              phone: e.target.value,
                            })
                          }
                          disabled={!editing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          تاریخ تولد
                        </label>
                        <Input
                          type="date"
                          value={profileForm.birthDate}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              birthDate: e.target.value,
                            })
                          }
                          disabled={!editing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">شهر</label>
                        <Input
                          value={profileForm.city}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              city: e.target.value,
                            })
                          }
                          disabled={!editing}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">کد پستی</label>
                        <Input
                          value={profileForm.postalCode}
                          onChange={(e) =>
                            setProfileForm({
                              ...profileForm,
                              postalCode: e.target.value,
                            })
                          }
                          disabled={!editing}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">آدرس</label>
                      <Input
                        value={profileForm.address}
                        onChange={(e) =>
                          setProfileForm({
                            ...profileForm,
                            address: e.target.value,
                          })
                        }
                        disabled={!editing}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      {editing ? (
                        <>
                          <Button type="submit">
                            <Save className="h-4 w-4 ml-2" />
                            ذخیره تغییرات
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setEditing(false)}
                          >
                            انصراف
                          </Button>
                        </>
                      ) : (
                        <Button type="button" onClick={() => setEditing(true)}>
                          ویرایش پروفایل
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* تب سفارشات */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>سفارشات اخیر</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">هنوز سفارشی ثبت نکرده‌اید</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => {
                        const currentStatus =
                          statusMap[order.status] || statusMap["pending"];

                        return (
                          <div
                            key={order._id}
                            className="border rounded-lg p-4 hover:shadow-md transition"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-sm text-gray-500">
                                  شماره سفارش: {order._id.slice(-8)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  تاریخ:{" "}
                                  {new Date(order.createdAt).toLocaleDateString(
                                    "fa-IR",
                                  )}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-full text-xs ${currentStatus.color}`}
                              >
                                {currentStatus.label}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-bold text-blue-600">
                                  {order.totalAmount.toLocaleString()} تومان
                                </p>
                                <p className="text-sm text-gray-500">
                                  {order.items.length} کالا
                                </p>
                              </div>
                              <Link href={`/orders/${order._id}`}>
                                <Button variant="outline" size="sm">
                                  مشاهده جزئیات
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* تب پیام‌ها */}
            <TabsContent value="messages">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>پیام‌های شما</CardTitle>
                  {unreadCount > 0 && (
                    <Button variant="outline" size="sm" onClick={markAllAsRead}>
                      <CheckCircle className="h-4 w-4 ml-2" />
                      علامت همه به عنوان خوانده شده
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Mail className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">پیامی وجود ندارد</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((msg) => {
                        const statusStyle =
                          messageStatusMap[msg.status!] ||
                          messageStatusMap.pending;

                        return (
                          <Card
                            key={msg._id}
                            className={`border transition ${
                              !msg.readByUser
                                ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <Badge className={statusStyle.color}>
                                      {statusStyle.label}
                                    </Badge>
                                    {!msg.readByUser && (
                                      <Badge
                                        variant="outline"
                                        className="border-blue-500 text-blue-700 dark:text-blue-300"
                                      >
                                        جدید
                                      </Badge>
                                    )}
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {new Date(
                                        msg.repliedAt || msg.createdAt!,
                                      ).toLocaleDateString("fa-IR")}
                                    </span>
                                  </div>

                                  <h3 className="font-bold text-lg mb-2">
                                    {msg.subject}
                                  </h3>

                                  <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg mb-3">
                                    <p className="text-xs text-gray-500 mb-1">
                                      پیام شما:
                                    </p>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">
                                      {msg.message}
                                    </p>
                                  </div>

                                  {msg.reply && (
                                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg border-r-4 border-green-500">
                                      <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                                        پاسخ ادمین:
                                      </p>
                                      <p className="text-sm text-gray-700 dark:text-gray-300">
                                        {msg.reply}
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {!msg.readByUser && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => markMessageAsRead(msg._id!)}
                                    className="h-8 w-8 text-blue-600 flex-shrink-0 mr-2"
                                    title="علامت به عنوان خوانده شده"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* تب تغییر رمز */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>تغییر رمز عبور</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        رمز عبور فعلی
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            currentPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        رمز عبور جدید
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            newPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        تکرار رمز عبور جدید
                      </label>
                      <Input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) =>
                          setPasswordForm({
                            ...passwordForm,
                            confirmPassword: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <Button type="submit" className="mt-4">
                      <Lock className="h-4 w-4 ml-2" />
                      تغییر رمز عبور
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
