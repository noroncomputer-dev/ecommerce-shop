"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import messageService, { ContactMessage } from "@/services/messageService";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageCircle, CheckCheck, Bell, Loader2 } from "lucide-react";
import { showSuccess } from "@/utils/swal";

export default function MessageNotifications() {
  const { isAuthenticated } = useAuth();
  const [unreadMessages, setUnreadMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadUnreadMessages();
      // هر ۳۰ ثانیه چک کن
      const interval = setInterval(loadUnreadMessages, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadUnreadMessages = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const data = await messageService.getUnreadUserMessages();
      setUnreadMessages(data);
    } catch (error) {
      console.error("Error loading unread messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messageService.markMessageAsRead(messageId);
      setUnreadMessages((prev) => prev.filter((m) => m._id !== messageId));
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      for (const msg of unreadMessages) {
        await markAsRead(msg._id!);
      }
      showSuccess("همه پیام‌ها به عنوان خوانده شده علامت زده شدند");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadMessages.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 min-w-[20px] px-1 flex items-center justify-center animate-pulse"
            >
              {unreadMessages.length > 9 ? "9+" : unreadMessages.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-bold">پیام‌های پاسخ داده شده</h3>
          {unreadMessages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="h-8 text-xs"
            >
              <CheckCheck className="h-3 w-3 ml-1" />
              خواندن همه
            </Button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            </div>
          ) : unreadMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">پیام جدیدی ندارید</p>
            </div>
          ) : (
            <div className="divide-y">
              {unreadMessages.map((msg) => (
                <div
                  key={msg._id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <Link
                    href={`/profile?tab=messages`}
                    onClick={() => {
                      markAsRead(msg._id!);
                      setOpen(false);
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1">
                          {msg.subject}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                          {msg.reply || "پاسخی ثبت شده است"}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {msg.repliedAt
                            ? new Date(msg.repliedAt).toLocaleDateString(
                                "fa-IR",
                              )
                            : new Date(msg.createdAt!).toLocaleDateString(
                                "fa-IR",
                              )}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-2 border-t">
          <Link href="/profile?tab=messages" onClick={() => setOpen(false)}>
            <Button variant="ghost" className="w-full text-sm">
              مشاهده همه پیام‌ها
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
