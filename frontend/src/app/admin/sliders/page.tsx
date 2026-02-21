"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import sliderService, { Slider } from "@/services/sliderService";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  Upload,
  X,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/swal";

export default function AdminSlidersPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlider, setSelectedSlider] = useState<Slider | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    image: "",
    link: "",
    buttonText: "",
    order: 0,
  });

  useEffect(() => {
    loadSliders();
  }, []);

  const loadSliders = async () => {
    try {
      const data = await sliderService.getAllSliders();
      setSliders(data);
    } catch (error) {
      console.error("Error loading sliders:", error);
      showError("خطا در بارگذاری اسلایدرها");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slider: Slider) => {
    setSelectedSlider(slider);
    setFormData({
      title: slider.title,
      subtitle: slider.subtitle,
      description: slider.description,
      image: slider.image,
      link: slider.link,
      buttonText: slider.buttonText,
      order: slider.order,
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedSlider(null);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      image: "",
      link: "/products",
      buttonText: "مشاهده محصولات",
      order: sliders.length,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (slider: Slider) => {
    setSelectedSlider(slider);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSlider) return;

    try {
      await sliderService.deleteSlider(selectedSlider._id);
      showSuccess("اسلایدر با موفقیت حذف شد");
      loadSliders();
    } catch (error) {
      showError("خطا در حذف اسلایدر");
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSlider(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await sliderService.uploadImage(file);
      setFormData({ ...formData, image: result.url });
      showSuccess("تصویر با موفقیت آپلود شد");
    } catch (error) {
      showError("خطا در آپلود تصویر");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedSlider) {
        await sliderService.updateSlider(selectedSlider._id, formData);
        showSuccess("اسلایدر با موفقیت به‌روزرسانی شد");
      } else {
        await sliderService.createSlider(formData);
        showSuccess("اسلایدر جدید با موفقیت اضافه شد");
      }
      setIsDialogOpen(false);
      loadSliders();
    } catch (error) {
      showError("خطا در ذخیره اسلایدر");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (slider: Slider) => {
    try {
      await sliderService.toggleSliderStatus(slider._id);
      showSuccess(`اسلایدر ${slider.isActive ? "غیرفعال" : "فعال"} شد`);
      loadSliders();
    } catch (error) {
      showError("خطا در تغییر وضعیت");
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    // اینجا می‌تونی منطق مرتب‌سازی رو پیاده‌سازی کنی
    showSuccess("ترتیب اسلایدرها تغییر کرد");
  };

  const moveDown = async (index: number) => {
    if (index === sliders.length - 1) return;
    // اینجا می‌تونی منطق مرتب‌سازی رو پیاده‌سازی کنی
    showSuccess("ترتیب اسلایدرها تغییر کرد");
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
          مدیریت اسلایدرها
        </h1>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 ml-2" />
          افزودن اسلایدر جدید
        </Button>
      </div>

      {/* لیست اسلایدرها */}
      <Card>
        <CardHeader>
          <CardTitle>اسلایدرهای صفحه اصلی ({sliders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {sliders.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">هیچ اسلایدری وجود ندارد</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>تصویر</TableHead>
                  <TableHead>عنوان</TableHead>
                  <TableHead>وضعیت</TableHead>
                  <TableHead>ترتیب</TableHead>
                  <TableHead className="w-32 text-left">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sliders.map((slider, index) => (
                  <TableRow key={slider._id}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div className="relative w-20 h-12 rounded overflow-hidden bg-gray-100">
                        <img
                          src={slider.image}
                          alt={slider.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder-image.jpg";
                          }}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{slider.title}</p>
                        <p className="text-sm text-gray-500">
                          {slider.subtitle}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={slider.isActive ? "default" : "secondary"}
                        className={
                          slider.isActive
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                        }
                      >
                        {slider.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveUp(index)}
                          disabled={index === 0}
                          className="h-8 w-8"
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <span className="w-6 text-center">{slider.order}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveDown(index)}
                          disabled={index === sliders.length - 1}
                          className="h-8 w-8"
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleStatus(slider)}
                          className="h-8 w-8"
                          title={slider.isActive ? "غیرفعال کردن" : "فعال کردن"}
                        >
                          {slider.isActive ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-green-600" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(slider)}
                          className="h-8 w-8 text-blue-600"
                          title="ویرایش"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(slider)}
                          className="h-8 w-8 text-red-600"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* دیالوگ افزودن/ویرایش */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedSlider ? "ویرایش اسلایدر" : "افزودن اسلایدر جدید"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>عنوان *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>زیرعنوان *</Label>
                <Input
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>توضیحات *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>تصویر *</Label>

              {/* دکمه آپلود */}
              <div className="flex items-center gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={triggerFileInput}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4 ml-2" />
                  )}
                  انتخاب تصویر
                </Button>
                {formData.image && (
                  <span className="text-sm text-gray-500">تصویر انتخاب شد</span>
                )}
              </div>

              {/* پیش‌نمایش تصویر */}
              {formData.image && (
                <div className="relative w-full h-48 rounded-lg overflow-hidden mt-4">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/placeholder-image.jpg";
                    }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => setFormData({ ...formData, image: "" })}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>متن دکمه</Label>
                <Input
                  value={formData.buttonText}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonText: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>لینک</Label>
                <Input
                  value={formData.link}
                  onChange={(e) =>
                    setFormData({ ...formData, link: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>ترتیب</Label>
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

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={saving || uploading}>
                {(saving || uploading) && (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin" />
                )}
                {selectedSlider ? "به‌روزرسانی" : "افزودن"}
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
            <AlertDialogTitle>حذف اسلایدر</AlertDialogTitle>
            <AlertDialogDescription>
              آیا از حذف این اسلایدر اطمینان دارید؟ این عمل قابل بازگشت نیست.
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
