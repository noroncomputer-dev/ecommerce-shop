"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  LogOut,
  LucideListOrdered,
  Menu,
  X,
  Sun,
  Moon,
  FileText,
  HelpCircle,
  Mail,
  Users2,
  Settings,
  ChevronLeft,
  Bell,
  Search,
  Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "../../../lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications] = useState(3); // نمونه تعداد نوتیفیکیشن

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (!isAdmin) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, router]);

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "داشبورد" },
    { href: "/admin/products", icon: Package, label: "مدیریت محصولات" },
    { href: "/admin/categories", icon: FolderTree, label: "مدیریت دسته‌بندی" },
    { href: "/admin/orders", icon: LucideListOrdered, label: "مدیریت سفارشات" },
    { href: "/admin/sliders", icon: Settings, label: "مدیریت اسلایدرها" },
    { href: "/admin/users", icon: Users, label: "مدیریت کاربران" },
    { href: "/admin/about", icon: FileText, label: "درباره ما" },
    { href: "/admin/team", icon: Users2, label: "تیم ما" },
    { href: "/admin/faq", icon: HelpCircle, label: "سوالات متداول" },
    { href: "/admin/messages", icon: Mail, label: "پیام‌ها" },
  ];

  const getUserInitial = () => {
    if (!user?.name) return "U";
    return user.name.charAt(0).toUpperCase();
  };

  const getAvatarUrl = () => {
    const avatar = (user as any)?.profile?.avatar;
    if (!avatar) return undefined;
    if (avatar.startsWith("http")) return avatar;
    return `http://localhost:5001${avatar}`;
  };

  if (!mounted || !isAuthenticated || !isAdmin || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <div className="w-20 h-20 border-4 border-purple-600 border-b-transparent rounded-full animate-spin mx-auto absolute inset-0 opacity-50" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-4">
            در حال بارگذاری...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 transition-colors duration-300">
      {/* نوار بالای ادمین - بهبود یافته */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-sm sticky top-0 z-30 border-b border-gray-200/50 dark:border-gray-800/50 transition-all">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* بخش راست - دکمه همبرگری و لوگو */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* دکمه همبرگری برای موبایل */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-80 sm:w-96">
                  <SheetTitle className="sr-only">منوی مدیریت</SheetTitle>
                  <div className="h-full bg-white dark:bg-gray-900 overflow-y-auto">
                    {/* هدر موبایل */}
                    <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-4 z-10">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          پنل مدیریت
                        </span>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </SheetClose>
                      </div>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12 border-2 border-blue-600/20">
                          <AvatarImage src={getAvatarUrl()} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                            {getUserInitial()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 dark:text-white truncate">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email || "admin@example.com"}
                          </p>
                          <Badge
                            variant="outline"
                            className="mt-1 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                          >
                            مدیر ارشد
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* منوی موبایل */}
                    <div className="p-3">
                      {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                              "flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all",
                              isActive
                                ? "bg-gradient-to-l from-blue-600 to-purple-600 text-white shadow-lg"
                                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                            )}
                          >
                            <item.icon className="h-5 w-5" />
                            <span className="flex-1">{item.label}</span>
                            {item.href === "/admin/messages" &&
                              notifications > 0 && (
                                <Badge
                                  className={cn(
                                    "text-xs",
                                    isActive
                                      ? "bg-white text-blue-600"
                                      : "bg-red-500 text-white",
                                  )}
                                >
                                  {notifications}
                                </Badge>
                              )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* لوگو */}
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block">
                  NoronTech
                </span>
              </Link>

              {/* دکمه بازگشت به سایت */}
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-400"
                >
                  <Home className="h-4 w-4" />
                  <span>مشاهده سایت</span>
                </Button>
              </Link>
            </div>

            {/* بخش جستجو - دسکتاپ */}
            <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="جستجو در پنل مدیریت..."
                  className="w-full pr-10 bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            </div>

            {/* بخش چپ - دکمه‌ها */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* دکمه نوتیفیکیشن */}
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* دکمه تغییر تم */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>

              {/* پروفایل کاربر - دسکتاپ */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="hidden lg:flex items-center gap-2 px-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={getAvatarUrl()} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xs">
                        {getUserInitial()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.email?.slice(0, 15)}...
                      </p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/profile")}
                  >
                    <Users className="h-4 w-4 ml-2" />
                    پروفایل
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => router.push("/admin/settings")}
                  >
                    <Settings className="h-4 w-4 ml-2" />
                    تنظیمات
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="h-4 w-4 ml-2" />
                    خروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* دکمه خروج - موبایل */}
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="lg:hidden text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* سایدبار دسکتاپ - بهبود یافته */}
        <aside className="hidden lg:block w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-800/50 min-h-[calc(100vh-80px)] sticky top-20 transition-all">
          <div className="p-4 h-full overflow-y-auto">
            {/* پروفایل کاربر */}
            <div className="relative mb-6 p-4 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-2xl border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16 border-3 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage src={getAvatarUrl()} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl">
                    {getUserInitial()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 dark:text-white truncate text-lg">
                    {user.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {user.email || "admin@norontech.ir"}
                  </p>
                  <Badge className="mt-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-none">
                    مدیر ارشد
                  </Badge>
                </div>
              </div>
            </div>

            {/* منوی اصلی */}
            <div className="space-y-1">
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-l from-blue-600 to-purple-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    {/* خط کناری */}
                    <div
                      className={cn(
                        "absolute right-0 top-1/2 -translate-y-1/2 w-1 rounded-full transition-all duration-300",
                        isActive
                          ? "h-8 bg-white"
                          : "h-0 group-hover:h-6 bg-blue-600",
                      )}
                    />

                    <item.icon
                      className={cn(
                        "h-5 w-5 relative z-10",
                        isActive
                          ? "text-white"
                          : "text-gray-500 dark:text-gray-400",
                      )}
                    />
                    <span className="relative z-10 flex-1">{item.label}</span>

                    {/* آماری */}
                    {item.href === "/admin/messages" && notifications > 0 && (
                      <Badge
                        className={cn(
                          "text-xs relative z-10",
                          isActive
                            ? "bg-white text-blue-600"
                            : "bg-red-500 text-white",
                        )}
                      >
                        {notifications}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* فوتر سایدبار */}
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                  نسخه ۲.۰.۰
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">
                    آخرین به‌روزرسانی
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    بهمن ۱۴۰۴
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* محتوای اصلی - بهبود یافته */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 transition-colors">
          {/* مسیر فعلی (Breadcrumb) */}
          <div className="flex items-center gap-2 mb-4 text-sm">
            <Link
              href="/admin"
              className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              داشبورد
            </Link>
            {pathname !== "/admin" && (
              <>
                <ChevronLeft className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {menuItems.find((item) => item.href === pathname)?.label ||
                    "صفحه"}
                </span>
              </>
            )}
          </div>

          {/* کانتینر محتوا */}
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-800/50 p-4 sm:p-6 lg:p-8 transition-all">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
