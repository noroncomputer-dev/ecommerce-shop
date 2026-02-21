"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "../../../lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* نوار بالای ادمین */}
      <nav className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-sm sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="px-4">
          <div className="flex justify-between items-center h-16">
            {/* بخش راست - دکمه همبرگری و لوگو */}
            <div className="flex items-center gap-4">
              {/* دکمه همبرگری برای موبایل */}
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 w-64">
                  <SheetTitle className="sr-only">منوی مدیریت</SheetTitle>
                  <div className="h-full bg-white dark:bg-gray-900">
                    <div className="p-4 border-b dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={getAvatarUrl()} />
                          <AvatarFallback className="bg-blue-600 text-white">
                            {getUserInitial()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ادمین
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-2">
                      {menuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <span className="text-xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
                پنل مدیریت
              </span>
            </div>

            {/* بخش وسط - خوش‌آمدگویی (فقط دسکتاپ) */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                خوش آمدید،
              </span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {user.name}
              </span>
            </div>

            {/* بخش چپ - دکمه‌ها */}
            <div className="flex items-center gap-2">
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

              {/* دکمه خروج */}
              <Button
                variant="ghost"
                onClick={logout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <LogOut className="h-4 w-4 ml-2" />
                <span className="hidden sm:inline">خروج</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* سایدبار دسکتاپ */}
        <aside className="hidden lg:block w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-l border-gray-200 dark:border-gray-800 min-h-[calc(100vh-64px)] transition-colors">
          <div className="p-4">
            {/* پروفایل کاربر */}
            <div className="flex items-center gap-3 p-3 mb-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl">
              <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-800">
                <AvatarImage src={getAvatarUrl()} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {getUserInitial()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold dark:text-white">{user.name}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                  مدیر ارشد
                </p>
              </div>
            </div>

            {/* منو */}
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 text-gray-700 dark:text-gray-300 rounded-xl",
                      "hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400",
                      "transition-all group relative overflow-hidden",
                    )}
                  >
                    {/* خط کناری */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-blue-600 rounded-full group-hover:h-8 transition-all duration-300" />

                    <item.icon className="h-5 w-5 relative z-10" />
                    <span className="relative z-10">{item.label}</span>

                    {/* آماری */}
                    {item.href === "/admin/messages" && (
                      <span className="mr-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        ۳
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>

            {/* نسخه */}
            <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800 text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                نسخه ۱.۰.۰
              </p>
            </div>
          </div>
        </aside>

        {/* محتوای اصلی */}
        <main className="flex-1 p-6 transition-colors">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 p-6 transition-colors">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
