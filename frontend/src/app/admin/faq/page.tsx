"use client";

import { useEffect, useState } from "react";
import faqService, { FAQ } from "@/services/faqService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/swal";

export default function AdminFaqPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFaq, setSelectedFaq] = useState<FAQ | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "general" as FAQ["category"],
    order: 0,
  });

  const categoryLabels = {
    general: "عمومی",
    shipping: "حمل و نقل",
    payment: "پرداخت",
    returns: "بازگشت کالا",
    products: "محصولات",
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await faqService.getFAQs();
      setFaqs(data);
    } catch (error) {
      console.error("Error loading FAQs:", error);
      showError("خطا در بارگذاری سوالات");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (faq: FAQ) => {
    setSelectedFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      order: faq.order || 0,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedFaq(null);
    setFormData({
      question: "",
      answer: "",
      category: "general",
      order: faqs.length,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (faq: FAQ) => {
    setSelectedFaq(faq);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedFaq) return;

    try {
      await faqService.deleteFAQ(selectedFaq._id);
      showSuccess("سوال با موفقیت حذف شد");
      loadFaqs();
    } catch (error) {
      showError("خطا در حذف سوال");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedFaq(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedFaq) {
        await faqService.updateFAQ(selectedFaq._id, formData);
        showSuccess("سوال با موفقیت به‌روزرسانی شد");
      } else {
        await faqService.addFAQ(formData);
        showSuccess("سوال جدید با موفقیت اضافه شد");
      }
      setIsDialogOpen(false);
      loadFaqs();
    } catch (error) {
      showError("خطا در ذخیره سوال");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (faq: FAQ) => {
    try {
      await faqService.toggleFAQStatus(faq._id);
      showSuccess(`وضعیت سوال تغییر کرد`);
      loadFaqs();
    } catch (error) {
      showError("خطا در تغییر وضعیت");
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      general:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      shipping:
        "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      payment:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      returns:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      products:
        "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    };

    return colors[category] || colors.general;
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
          مدیریت سوالات متداول
        </h1>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          افزودن سوال جدید
        </Button>
      </div>

      {/* لیست سوالات */}
      <Card>
        <CardHeader>
          <CardTitle>سوالات متداول ({faqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {faqs.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">هیچ سوالی ثبت نشده است</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card
                  key={faq._id}
                  className="border border-gray-200 dark:border-gray-700"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge className={getCategoryBadge(faq.category)}>
                            {categoryLabels[faq.category]}
                          </Badge>
                          <Badge
                            variant={faq.isActive ? "default" : "secondary"}
                            className={
                              faq.isActive
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                            }
                          >
                            {faq.isActive ? (
                              <CheckCircle className="h-3 w-3 ml-1" />
                            ) : (
                              <XCircle className="h-3 w-3 ml-1" />
                            )}
                            {faq.isActive ? "فعال" : "غیرفعال"}
                          </Badge>
                        </div>

                        <h3 className="font-bold text-lg mb-2">
                          {faq.question}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {faq.answer}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mr-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatus(faq)}
                          className="h-8 w-8"
                        >
                          {faq.isActive ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(faq)}
                          className="h-8 w-8 text-blue-600"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(faq)}
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

      {/* دیالوگ افزودن/ویرایش */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFaq ? "ویرایش سوال" : "افزودن سوال جدید"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* دسته‌بندی */}
            <div className="space-y-2">
              <Label>دسته‌بندی</Label>
              <Select
                value={formData.category}
                onValueChange={(value: FAQ["category"]) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب دسته‌بندی" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* سوال */}
            <div className="space-y-2">
              <Label>سوال *</Label>
              <Input
                value={formData.question}
                onChange={(e) =>
                  setFormData({ ...formData, question: e.target.value })
                }
                required
              />
            </div>

            {/* پاسخ */}
            <div className="space-y-2">
              <Label>پاسخ *</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) =>
                  setFormData({ ...formData, answer: e.target.value })
                }
                rows={5}
                required
              />
            </div>

            {/* ترتیب */}
            <div className="space-y-2">
              <Label>ترتیب نمایش</Label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 ml-2 animate-spin" />}
                {selectedFaq ? "به‌روزرسانی" : "افزودن"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                انصراف
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* دیالوگ تأیید حذف */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>حذف سوال</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این سوال اطمینان دارید؟ این عمل قابل بازگشت نیست.
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
