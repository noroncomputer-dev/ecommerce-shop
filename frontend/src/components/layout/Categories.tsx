"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import categoryService, { Category } from "@/services/categoryService";
import productService from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>(
    {},
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);

      const data = await categoryService.getCategories();
      setCategories(Array.isArray(data) ? data : []);

      const counts: Record<string, number> = {};

      if (data.length > 0) {
        await Promise.all(
          data.map(async (cat) => {
            try {
              const products = await productService.getProducts({
                category: cat._id,
                limit: 1,
              });

              counts[cat._id] = products.pagination?.total || 0;
            } catch (error) {
              console.error(`Error fetching count for ${cat.name}:`, error);
              counts[cat._id] = 0;
            }
          }),
        );
      }

      setProductCounts(counts);
    } catch (error) {
      console.error("Error loading categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // رنگ‌های مختلف برای هر دسته‌بندی
  const getCategoryColor = (name: string, index: number) => {
    const colors = [
      "from-blue-500 to-blue-600",
      "from-pink-500 to-pink-600",
      "from-green-500 to-green-600",
      "from-orange-500 to-orange-600",
      "from-purple-500 to-purple-600",
      "from-red-500 to-red-600",
      "from-yellow-500 to-yellow-600",
      "from-indigo-500 to-indigo-600",
    ];
    return colors[index % colors.length];
  };

  // آیکون بر اساس نام دسته‌بندی
  const getCategoryIcon = (name: string) => {
    const icons: Record<string, string> = {
      ماوس: "🖱️",
      کیبورد: "⌨️",
      "فن پردازنده": "🌀",
      مانیتور: "🖥️",
      حافظه: "💾",
      "حافظه رم": "🧠",
      پردازنده: "⚙️",
      "کارت گرافیک": "🎮",
      مادربرد: "🔧",
      الکترونیک: "📱",
      "مد و پوشاک": "👕",
      کتاب: "📚",
      ورزشی: "⚽",
      خانه: "🏠",
      زیبایی: "💄",
      آشپزخانه: "🍳",
      موبایل: "📱",
      "لپ تاپ": "💻",
      کامپیوتر: "🖥️",
    };

    // اگه دسته‌بندی دقیقا مطابقت داشت
    if (icons[name]) return icons[name];

    // اگه دسته‌بندی توی لیست نبود، بر اساس کلمات کلیدی جستجو کن
    for (const [key, icon] of Object.entries(icons)) {
      if (name.includes(key)) return icon;
    }

    return "📦"; // آیکون پیش‌فرض
  };

  if (loading) {
    return (
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            دسته‌بندی‌های محبوب
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            محصولات خود را بر اساس دسته‌بندی پیدا کنید
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="border-none shadow-lg">
              <CardContent className="p-4 text-center">
                <Skeleton className="w-16 h-16 rounded-full mx-auto mb-3" />
                <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          دسته‌بندی‌های محبوب
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          محصولات خود را بر اساس دسته‌بندی پیدا کنید
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.slice(0, 6).map((category, index) => (
          <Link key={category._id} href={`/products?category=${category._id}`}>
            <Card className="group cursor-pointer border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-gray-800 overflow-hidden">
              <CardContent className="p-4 text-center">
                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {getCategoryIcon(category.name)}
                </div>

                <h3 className="font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                  {category.name}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {productCounts[category._id]?.toLocaleString() || 0} محصول
                </p>

                <div
                  className={`mt-3 h-1 w-0 group-hover:w-full bg-gradient-to-r ${getCategoryColor(category.name, index)} rounded-full transition-all duration-500`}
                />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="text-center mt-10">
        <Link href="/categories">
          <Button variant="outline" className="gap-2">
            مشاهده همه دسته‌بندی‌ها
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
