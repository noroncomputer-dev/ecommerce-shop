"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import productService from "@/services/productService";
import categoryService, { Category } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Save, X, Upload, ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ فایل‌های انتخاب شده
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // ✅ پیش‌نمایش تصاویر
  const [previews, setPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ انتخاب فایل‌ها و ساختن پیش‌نمایش
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // اضافه کردن به فایل‌های قبلی
    const newFiles = [...selectedFiles, ...files];
    setSelectedFiles(newFiles);

    // ساختن URL پیش‌نمایش برای هر فایل
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);

    // reset input تا بشه دوباره همون فایل رو انتخاب کرد
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ حذف یه تصویر
  const removeImage = (index: number) => {
    // آزاد کردن حافظه URL
    URL.revokeObjectURL(previews[index]);

    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      alert("لطفاً حداقل یک تصویر انتخاب کنید");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);

      // ✅ اضافه کردن فایل‌های تصویر
      selectedFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await productService.createProduct(formDataToSend);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error creating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* هدر */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products">
          <Button variant="ghost" size="icon">
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">افزودن محصول جدید</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات محصول</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* نام محصول */}
            <div className="space-y-2">
              <Label htmlFor="name">نام محصول</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="مثال: آیفون ۱۴"
              />
            </div>

            {/* توضیحات */}
            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={5}
                placeholder="توضیحات کامل محصول..."
              />
            </div>

            {/* قیمت و دسته‌بندی */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">قیمت (تومان)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="مثال: 45000000"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">دسته‌بندی</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* موجودی */}
            <div className="space-y-2">
              <Label htmlFor="stock">موجودی</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                placeholder="مثال: 10"
              />
            </div>

            {/* ✅ بخش آپلود تصاویر */}
            <div className="space-y-4">
              <Label>تصاویر محصول</Label>

              {/* پیش‌نمایش تصاویر انتخاب شده */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`تصویر ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      {/* دکمه حذف */}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      {/* نشانه تصویر اول */}
                      {index === 0 && (
                        <span className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                          اصلی
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* دکمه انتخاب فایل */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <ImagePlus className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-600">
                  برای انتخاب تصویر کلیک کنید
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG، PNG — حداکثر ۵ مگابایت برای هر فایل
                </p>
              </div>

              {/* input مخفی */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />

              {selectedFiles.length > 0 && (
                <p className="text-sm text-gray-500">
                  {selectedFiles.length} تصویر انتخاب شده — اولین تصویر به عنوان
                  تصویر اصلی نمایش داده میشه
                </p>
              )}
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 ml-2" />
                {loading ? "در حال ذخیره..." : "ذخیره محصول"}
              </Button>

              <Link href="/admin/products">
                <Button type="button" variant="outline">
                  انصراف
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
