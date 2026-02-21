"use client";

import { useEffect, useState } from "react";
import contactService, { ContactMessage } from "@/services/contactService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  User,
  Phone,
  MessageSquare,
  Calendar,
  Send,
  Reply,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/swal";

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(
    null,
  );
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    filterMessages();
  }, [search, activeTab, messages]);

  const loadMessages = async () => {
    try {
      const data = await contactService.getMessages();
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      showError("خطا در بارگذاری پیام‌ها");
    } finally {
      setLoading(false);
    }
  };

  const filterMessages = () => {
    let filtered = messages;

    // فیلتر بر اساس وضعیت
    if (activeTab !== "all") {
      filtered = filtered.filter((msg) => msg.status === activeTab);
    }

    // فیلتر بر اساس جستجو
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(searchLower) ||
          msg.email.toLowerCase().includes(searchLower) ||
          msg.subject.toLowerCase().includes(searchLower) ||
          msg.message.toLowerCase().includes(searchLower),
      );
    }

    setFilteredMessages(filtered);
  };

  const handleView = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsViewDialogOpen(true);

    // اگر پیام خوانده نشده بود، آپدیت کن
    if (message.status === "pending") {
      updateStatus(message._id!, "read");
    }
  };

  const handleReply = (message: ContactMessage) => {
    setSelectedMessage(message);
    setReplyText("");
    setIsReplyDialogOpen(true);
  };

  const sendReply = async () => {
    if (!selectedMessage?._id || !replyText.trim()) return;

    setSendingReply(true);
    try {
      // اینجا باید API پاسخ رو پیاده‌سازی کنی
      // await contactService.replyToMessage(selectedMessage._id, replyText);

      // به‌روزرسانی وضعیت به replied
      await contactService.updateMessageStatus(selectedMessage._id, "replied");

      showSuccess("پاسخ با موفقیت ارسال شد");
      setIsReplyDialogOpen(false);
      loadMessages();
    } catch (error) {
      showError("خطا در ارسال پاسخ");
    } finally {
      setSendingReply(false);
    }
  };

  const updateStatus = async (
    id: string,
    status: "pending" | "read" | "replied",
  ) => {
    try {
      await contactService.updateMessageStatus(id, status);
      loadMessages();
    } catch (error) {
      console.error("Error updating message status:", error);
    }
  };

  const handleDelete = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMessage?._id) return;

    try {
      await contactService.deleteMessage(selectedMessage._id);
      showSuccess("پیام با موفقیت حذف شد");
      loadMessages();
    } catch (error) {
      showError("خطا در حذف پیام");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedMessage(null);
    }
  };

  const getStatusBadge = (status: string = "pending") => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            در انتظار
          </Badge>
        );
      case "read":
        return (
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            خوانده شده
          </Badge>
        );
      case "replied":
        return (
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
            پاسخ داده شده
          </Badge>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
          مدیریت پیام‌ها
        </h1>
        <Button variant="outline" onClick={loadMessages}>
          <RefreshCw className="h-4 w-4 ml-2" />
          بروزرسانی
        </Button>
      </div>

      {/* آمار */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-2xl flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">در انتظار</p>
              <p className="text-2xl font-bold">
                {messages.filter((m) => m.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
              <Eye className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">خوانده شده</p>
              <p className="text-2xl font-bold">
                {messages.filter((m) => m.status === "read").length}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">پاسخ داده شده</p>
              <p className="text-2xl font-bold">
                {messages.filter((m) => m.status === "replied").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* جستجو و تب‌ها */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="جستجو در پیام‌ها..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-10"
              />
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full md:w-auto"
            >
              <TabsList>
                <TabsTrigger value="all">همه</TabsTrigger>
                <TabsTrigger value="pending">در انتظار</TabsTrigger>
                <TabsTrigger value="read">خوانده شده</TabsTrigger>
                <TabsTrigger value="replied">پاسخ داده شده</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* لیست پیام‌ها */}
          {filteredMessages.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">هیچ پیامی یافت نشد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card key={message._id} className="hover:shadow-md transition">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(message.status)}
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(message.createdAt!).toLocaleDateString(
                              "fa-IR",
                            )}
                          </span>
                        </div>

                        <h3 className="font-bold text-lg mb-1">
                          {message.subject}
                        </h3>

                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-2">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {message.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {message.email}
                          </span>
                          {message.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {message.phone}
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                          {message.message}
                        </p>

                        {message.reply && (
                          <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border-r-4 border-green-500">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-bold">پاسخ شما:</span>{" "}
                              {message.reply}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(message)}
                          className="h-8 w-8 text-blue-600"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {message.status !== "replied" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReply(message)}
                            className="h-8 w-8 text-green-600"
                          >
                            <Reply className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(message)}
                          className="h-8 w-8 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* دیالوگ مشاهده پیام */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>مشاهده پیام</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">نام</p>
                  <p className="font-medium">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">ایمیل</p>
                  <p className="font-medium">{selectedMessage.email}</p>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <p className="text-sm text-gray-500">تلفن</p>
                    <p className="font-medium">{selectedMessage.phone}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-500">تاریخ</p>
                  <p className="font-medium">
                    {new Date(selectedMessage.createdAt!).toLocaleDateString(
                      "fa-IR",
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">وضعیت</p>
                  <div className="mt-1">
                    {getStatusBadge(selectedMessage.status)}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">موضوع</p>
                <p className="font-medium text-lg">{selectedMessage.subject}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">متن پیام</p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              {selectedMessage.reply && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">پاسخ شما</p>
                  <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg border-r-4 border-green-500">
                    <p>{selectedMessage.reply}</p>
                  </div>
                </div>
              )}

              <DialogFooter className="gap-2">
                {selectedMessage.status !== "replied" && (
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleReply(selectedMessage);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Reply className="h-4 w-4 ml-2" />
                    پاسخ
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  بستن
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* دیالوگ پاسخ به پیام */}
      <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>پاسخ به پیام</DialogTitle>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">پیام اصلی:</p>
                <p className="font-medium">{selectedMessage.message}</p>
                <p className="text-xs text-gray-400 mt-2">
                  از: {selectedMessage.name} - {selectedMessage.email}
                </p>
              </div>

              <div className="space-y-2">
                <Label>پاسخ شما</Label>
                <Textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={6}
                  placeholder="پاسخ خود را بنویسید..."
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  onClick={sendReply}
                  disabled={sendingReply || !replyText.trim()}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {sendingReply ? (
                    <Loader2 className="h-4 w-4 animate-spin ml-2" />
                  ) : (
                    <Send className="h-4 w-4 ml-2" />
                  )}
                  ارسال پاسخ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsReplyDialogOpen(false)}
                >
                  انصراف
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* دیالوگ تأیید حذف */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف پیام</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این پیام اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
