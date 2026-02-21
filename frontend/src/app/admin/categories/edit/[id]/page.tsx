"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import categoryService from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ArrowRight, Save, Trash2 } from "lucide-react";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    image: "",
  });

  // ✅ Fetch Category (وابسته به categoryId)
  useEffect(() => {
    if (!categoryId || categoryId.length !== 24) return;

    const fetchCategory = async () => {
      try {
        const category = await categoryService.getCategoryById(categoryId);

        setFormData({
          name: category.name,
          image: category.image || "",
        });
      } catch (error) {
        console.error("Error loading category:", error);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDelete = async () => {
    if (!categoryId) return;

    if (confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
      try {
        await categoryService.deleteCategory(categoryId);
        router.push("/admin/categories");
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId) return;

    setLoading(true);

    try {
      await categoryService.updateCategory(categoryId, {
        name: formData.name,
        image: formData.image || undefined,
      });

      router.push("/admin/categories");
    } catch (error) {
      console.error("Error updating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/categories">
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">ویرایش دسته‌بندی</h1>
        </div>

        <Button
          variant="destructive"
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4 ml-2" />
          حذف
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات دسته‌بندی</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">نام دسته‌بندی</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">آدرس تصویر (اختیاری)</Label>
              <Input
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                dir="ltr"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                <Save className="h-4 w-4 ml-2" />
                {loading ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </Button>

              <Link href="/admin/categories">
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
