"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, ShoppingCart, Sun, Moon, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import messageService, { ContactMessage } from "@/services/messageService";

// ── Theme Toggle ──────────────────────────────────────────
function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </Button>
  );
}

// ── Message Notifications ─────────────────────────────────
function MessageNotifications() {
  const { isAuthenticated } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadMessages([]);
      return;
    }
    loadUnreadMessages();
    const interval = setInterval(loadUnreadMessages, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const loadUnreadMessages = async () => {
    try {
      const data = await messageService.getUnreadUserMessages();
      setUnreadMessages(data);
    } catch (error) {}
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messageService.markMessageAsRead(messageId);
      setUnreadMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (error) {}
  };

  if (!isAuthenticated) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <Bell className="h-5 w-5" />
          {unreadMessages.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {unreadMessages.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 dark:bg-gray-900 dark:border-gray-700"
        align="end"
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h3 className="font-bold text-sm dark:text-white">
            پیام‌های پاسخ داده شده
          </h3>
          {unreadMessages.length > 0 && (
            <button
              onClick={() => unreadMessages.forEach((m) => markAsRead(m._id!))}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              خواندن همه
            </button>
          )}
        </div>
        <div className="max-h-72 overflow-y-auto">
          {unreadMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">پیام جدیدی ندارید</p>
            </div>
          ) : (
            <div className="divide-y dark:divide-gray-700">
              {unreadMessages.map((msg) => (
                <Link
                  key={msg._id}
                  href={`/profile?tab=messages&message=${msg._id}`}
                  onClick={() => {
                    markAsRead(msg._id!);
                    setOpen(false);
                  }}
                  className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <p className="text-sm font-medium dark:text-white line-clamp-1">
                    {msg.subject}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {msg.reply}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {msg.repliedAt
                      ? new Date(msg.repliedAt).toLocaleDateString("fa-IR")
                      : ""}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="p-2 border-t dark:border-gray-700">
          <Link href="/profile?tab=messages" onClick={() => setOpen(false)}>
            <Button
              variant="ghost"
              className="w-full text-sm dark:text-gray-300"
            >
              مشاهده همه پیام‌ها
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ── User Menu ─────────────────────────────────────────────
function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  const getUserInitial = () => user?.name?.charAt(0).toUpperCase() || "U";
  const getAvatarUrl = () => {
    const avatar = (user as any)?.profile?.avatar;
    if (!avatar) return undefined;
    return avatar.startsWith("http")
      ? avatar
      : `http://localhost:5001${avatar}`;
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/login">
          <Button variant="ghost" className="dark:text-gray-300">
            ورود
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            ثبت‌نام
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={getAvatarUrl()} alt={user?.name} />
            <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-sm">
              {getUserInitial()}
            </AvatarFallback>
          </Avatar>
          <span className="hidden lg:inline">{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 dark:bg-gray-900 dark:border-gray-700"
      >
        <DropdownMenuLabel className="dark:text-gray-300">
          حساب کاربری
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:border-gray-700" />
        <DropdownMenuItem
          asChild
          className="dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Link href="/profile">پروفایل</Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          asChild
          className="dark:text-gray-300 dark:hover:bg-gray-800"
        >
          <Link href="/orders">سفارشات</Link>
        </DropdownMenuItem>
        {user?.role === "admin" && (
          <DropdownMenuItem
            asChild
            className="dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <Link href="/admin">پنل مدیریت</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator className="dark:border-gray-700" />
        <DropdownMenuItem
          onClick={logout}
          className="text-red-600 dark:text-red-400 cursor-pointer"
        >
          خروج
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Mobile Menu ───────────────────────────────────────────
function MobileMenu({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const { user, isAuthenticated, logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }
    messageService
      .getUnreadUserMessages()
      .then((data) => setUnreadCount(data.length))
      .catch(() => {});
  }, [isAuthenticated]);

  const getUserInitial = () => user?.name?.charAt(0).toUpperCase() || "U";
  const getAvatarUrl = () => {
    const avatar = (user as any)?.profile?.avatar;
    if (!avatar) return undefined;
    return avatar.startsWith("http")
      ? avatar
      : `http://localhost:5001${avatar}`;
  };

  const menuItems = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/products", label: "محصولات" },
    { href: "/categories", label: "دسته‌بندی" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
    { href: "/faq", label: "سوالات متداول" },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="dark:text-gray-300">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] dark:bg-gray-900 dark:border-gray-700 p-0 overflow-y-auto"
      >
        <SheetTitle className="sr-only">منوی موبایل</SheetTitle>

        {isAuthenticated && (
          <div className="flex items-center gap-3 p-4 border-b dark:border-gray-800 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
            <Avatar className="h-12 w-12 border-2 border-white dark:border-gray-700">
              <AvatarImage src={getAvatarUrl()} alt={user?.name} />
              <AvatarFallback className="bg-blue-600 text-white">
                {getUserInitial()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-gray-900 dark:text-white">
                {user?.name}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-col p-4">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 border-b border-gray-100 dark:border-gray-800 transition"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                href="/profile"
                className="py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 border-b border-gray-100 dark:border-gray-800 transition flex items-center justify-between"
                onClick={() => setIsOpen(false)}
              >
                پروفایل
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>
              <Link
                href="/orders"
                className="py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 border-b border-gray-100 dark:border-gray-800 transition"
                onClick={() => setIsOpen(false)}
              >
                سفارشات
              </Link>
              {user?.role === "admin" && (
                <Link
                  href="/admin"
                  className="py-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 border-b border-gray-100 dark:border-gray-800 transition"
                  onClick={() => setIsOpen(false)}
                >
                  پنل مدیریت
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="py-3 text-red-600 dark:text-red-400 text-right mt-2"
              >
                خروج از حساب
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-3 mt-4">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button
                  variant="outline"
                  className="w-full dark:border-gray-600 dark:text-gray-300"
                >
                  ورود
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  ثبت‌نام
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ── Main Navbar ───────────────────────────────────────────
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems } = useCart();

  const menuItems = [
    { href: "/", label: "صفحه اصلی" },
    { href: "/products", label: "محصولات" },
    { href: "/categories", label: "دسته‌بندی" },
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
    { href: "/faq", label: "سوالات متداول" },
  ];

  return (
    <nav className="border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* لوگو */}
          <Link
            href="/"
            className="text-2xl font-bold text-blue-600 dark:text-blue-400"
          >
            Noron<span className="text-gray-800 dark:text-white">Tech</span>
          </Link>

          {/* دسکتاپ منو - با آیتم‌های جدید */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex gap-6">
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm font-medium"
                    >
                      {item.label}
                    </Link>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* راست */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <MessageNotifications />

            {/* سبد خرید */}
            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden md:block">
              <UserMenu />
            </div>
            <div className="md:hidden">
              <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
