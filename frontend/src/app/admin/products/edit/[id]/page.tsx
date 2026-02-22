"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import productService, { Product } from "@/services/productService";
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
import { ArrowRight, Save, X, Trash2, ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const getImageUrl = (path: string): string => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:5001${path}`;
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  // ✅ تصاویر فعلی که از database میان
  const [existingImages, setExistingImages] = useState<string[]>([]);
  // ✅ فایل‌های جدید که کاربر انتخاب می‌کنه
  const [newFiles, setNewFiles] = useState<File[]>([]);
  // ✅ پیش‌نمایش فایل‌های جدید
  const [newPreviews, setNewPreviews] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  useEffect(() => {
    Promise.all([loadCategories(), loadProduct()]);
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const loadProduct = async () => {
    try {
      const product = await productService.getProductById(productId);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category._id,
        stock: product.stock.toString(),
      });
      // ✅ تصاویر فعلی رو جدا نگه میداریم
      setExistingImages(product.images || []);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ حذف تصویر فعلی
  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ انتخاب فایل جدید
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from((e.target.files as FileList) || []);
    if (files.length === 0) return;

    setNewFiles((prev) => [...prev, ...files]);
    const previews = files.map((file) => URL.createObjectURL(file));
    setNewPreviews((prev) => [...prev, ...previews]);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ✅ حذف فایل جدید
  const removeNewFile = (index: number) => {
    URL.revokeObjectURL(newPreviews[index]);
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDelete = async () => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        await productService.deleteProduct(productId);
        router.push("/admin/products");
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", formData.stock);

      // ✅ تصاویر قدیمی که نگه داشتیم
      existingImages.forEach((img, index) => {
        formDataToSend.append(`existingImages[${index}]`, img);
      });

      // ✅ فایل‌های جدید
      newFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      await productService.updateProduct(productId, formDataToSend);
      router.push("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="p-8 text-center">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">ویرایش محصول</h1>
        </div>
        <Button
          variant="destructive"
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4 ml-2" />
          حذف محصول
        </Button>
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
              />
            </div>

            {/* ✅ بخش تصاویر */}
            <div className="space-y-4">
              <Label>تصاویر محصول</Label>

              {/* تصاویر فعلی */}
              {existingImages.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">تصاویر فعلی:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={getImageUrl(img)}
                          alt={`تصویر ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        {index === 0 && (
                          <span className="absolute bottom-1 right-1 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded">
                            اصلی
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* پیش‌نمایش فایل‌های جدید */}
              {newPreviews.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">تصاویر جدید:</p>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {newPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`تصویر جدید ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border border-blue-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewFile(index)}
                          className="absolute top-1 left-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* دکمه انتخاب فایل */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <ImagePlus className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  برای افزودن تصویر جدید کلیک کنید
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG، PNG — حداکثر ۵ مگابایت
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* دکمه‌ها */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 ml-2" />
                {loading ? "در حال ذخیره..." : "به‌روزرسانی محصول"}
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
