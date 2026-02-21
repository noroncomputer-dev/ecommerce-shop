"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import categoryService, { Category } from "@/services/categoryService";
import productService from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Search,
  Package,
  ChevronLeft,
  Grid3X3,
  List,
  FolderTree,
  Sparkles,
} from "lucide-react";
import { showError } from "@/utils/swal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {},
  );

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      // دریافت دسته‌بندی‌های واقعی از بک‌اند
      const catData = await categoryService.getCategories();
      setCategories(Array.isArray(catData) ? catData : []);

      // دریافت تعداد محصولات هر دسته
      const counts: Record<string, number> = {};
      for (const cat of catData) {
        try {
          const products = await productService.getProducts({
            category: cat._id,
            limit: 1,
          });
          counts[cat._id] = products.pagination?.total || 0;
        } catch (error) {
          counts[cat._id] = 0;
        }
      }
      setProductCounts(counts);
    } catch (error) {
      console.error("خطا در بارگذاری دسته‌بندی‌ها:", error);
      showError("خطا در بارگذاری دسته‌بندی‌ها");
    } finally {
      setLoading(false);
    }
  };

  // فیلتر دسته‌بندی‌ها بر اساس جستجو
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase()),
  );

  // رنگ‌های مختلف برای هر دسته‌بندی (بر اساس نام)
  const getCategoryColor = (name: string, index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-green-500 to-green-600",
      "from-purple-500 to-purple-600",
      "from-orange-500 to-orange-600",
      "from-pink-500 to-pink-600",
      "from-indigo-500 to-indigo-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
    ];
    return colors[index % colors.length];
  };

  // آیکون بر اساس نام دسته‌بندی
  const getCategoryIcon = (name: string) => {
    const icons: Record<string, string> = {
      الکترونیک: "💻",
      کتاب: "📚",
      "مد و پوشاک": "👕",
      ورزشی: "⚽",
      "خانه و آشپزخانه": "🏠",
      "زیبایی و سلامت": "💄",
      اسباب‌بازی: "🧸",
      خودرو: "🚗",
    };

    // اگه دسته‌بندی توی لیست نبود، از اولین حرف استفاده کن
    for (const [key, icon] of Object.entries(icons)) {
      if (name.includes(key)) return icon;
    }

    return "📦"; // آیکون پیش‌فرض
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* هدر صفحه */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            دسته‌بندی محصولات
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            {loading
              ? "در حال بارگذاری..."
              : `${categories.length} دسته‌بندی مختلف`}
          </p>
        </div>

        {/* نوار جستجو و ابزارها */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
          <div className="relative w-full sm:w-96">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="جستجوی دسته‌بندی..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-10 rounded-full border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* تغییر حالت نمایش */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-full"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-full"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* نمایش دسته‌بندی‌ها */}
        {loading ? (
          // حالت لودینگ
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          // حالت خالی
          <Card className="text-center py-16">
            <CardContent>
              <FolderTree className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">دسته‌بندی یافت نشد</h3>
              <p className="text-gray-500 mb-4">
                دسته‌بندی با نام "{search}" وجود ندارد
              </p>
              <Button onClick={() => setSearch("")}>پاک کردن جستجو</Button>
            </CardContent>
          </Card>
        ) : (
          // حالت عادی با اطلاعات واقعی
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredCategories.map((category, index) => (
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
              >
                <Card
                  className={`group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                    viewMode === "list" ? "flex items-center" : ""
                  }`}
                >
                  <CardContent
                    className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                  >
                    <div
                      className={`flex ${viewMode === "list" ? "items-center gap-6" : "flex-col items-center text-center"}`}
                    >
                      {/* آیکون با گرادینت */}
                      <div
                        className={`
                        relative mb-4 rounded-2xl bg-gradient-to-br 
                        ${getCategoryColor(category.name, index)}
                        p-4 text-white group-hover:scale-110 transition-transform duration-300
                        ${viewMode === "list" ? "w-20 h-20" : "w-24 h-24"}
                      `}
                      >
                        <span className="text-4xl">
                          {getCategoryIcon(category.name)}
                        </span>
                      </div>

                      {/* اطلاعات */}
                      <div
                        className={`flex-1 ${viewMode === "list" ? "text-right" : "text-center"}`}
                      >
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition">
                          {category.name}
                        </h3>

                        <div className="flex items-center gap-2 justify-center mb-3">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {productCounts[category._id]?.toLocaleString() || 0}{" "}
                            محصول
                          </span>
                        </div>

                        {/* توضیحات - اگه وجود داشت */}
                        {(category as any).description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                            {(category as any).description}
                          </p>
                        )}

                        {/* دکمه مشاهده */}
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                        >
                          مشاهده محصولات
                          <ChevronLeft className="h-4 w-4 mr-1" />
                        </Button>
                      </div>
                    </div>

                    {/* خط تزئینی پایین */}
                    <div
                      className={`
                      mt-4 h-1 w-0 group-hover:w-full 
                      bg-gradient-to-r ${getCategoryColor(category.name, index)}
                      rounded-full transition-all duration-500
                    `}
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* آمار کلی */}
        {!loading && filteredCategories.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="inline-block">
              <CardContent className="px-8 py-4">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-bold text-blue-600">
                    {filteredCategories.length}
                  </span>{" "}
                  دسته‌بندی با مجموع{" "}
                  <span className="font-bold text-blue-600">
                    {Object.values(productCounts)
                      .reduce((a, b) => a + b, 0)
                      .toLocaleString()}
                  </span>{" "}
                  محصول
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
