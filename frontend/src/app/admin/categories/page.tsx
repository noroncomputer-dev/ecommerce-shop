"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import categoryService, { Category } from "@/services/categoryService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
      try {
        await categoryService.deleteCategory(id);
        fetchCategories(); // رفرش لیست
      } catch (error) {
        console.error("Error deleting category:", error);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">در حال بارگذاری...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h1>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            دسته‌بندی جدید
          </Button>
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="text-center text-gray-500 py-8">هیچ دسته‌بندی یافت نشد</p>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <FolderTree className="h-5 w-5 text-blue-600" />
                  <div>
                    <h3 className="font-bold">{category.name}</h3>
                    <p className="text-sm text-gray-500">اسلاگ: {category.slug}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/admin/categories/edit/${category._id}`}>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDelete(category._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}