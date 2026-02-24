"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ArrowLeft } from "lucide-react";
import categoryService, { Category } from "@/services/categoryService";
import productService from "@/services/productService";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesSection() {
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
            } catch {
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

  // رنگ پس‌زمینه کارت‌ها
  const cardStyles = [
    {
      bg: "bg-slate-800",
      accent: "from-blue-500 to-cyan-400",
      text: "text-blue-400",
    },
    {
      bg: "bg-gray-800",
      accent: "from-purple-500 to-pink-400",
      text: "text-purple-400",
    },
    {
      bg: "bg-zinc-800",
      accent: "from-green-500 to-emerald-400",
      text: "text-green-400",
    },
    {
      bg: "bg-neutral-800",
      accent: "from-orange-500 to-amber-400",
      text: "text-orange-400",
    },
    {
      bg: "bg-stone-800",
      accent: "from-rose-500 to-red-400",
      text: "text-rose-400",
    },
    {
      bg: "bg-slate-900",
      accent: "from-indigo-500 to-violet-400",
      text: "text-indigo-400",
    },
  ];

  // fallback emoji
  const getFallbackIcon = (name: string) => {
    const icons: Record<string, string> = {
      ماوس: "🖱️",
      کیبورد: "⌨️",
      مانیتور: "🖥️",
      رم: "🧠",
      "منبع تغذیه": "⚡",
      مادربرد: "🔧",
      پردازنده: "⚙️",
      "کارت گرافیک": "🎮",
      "لپ تاپ": "💻",
      موبایل: "📱",
    };
    for (const [key, icon] of Object.entries(icons)) {
      if (name.includes(key)) return icon;
    }
    return "📦";
  };

  if (loading) {
    return (
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-blue-500 text-sm font-semibold tracking-widest uppercase mb-2">
            دسته‌بندی‌ها
          </p>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white">
            دسته‌بندی‌های محبوب
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            محصولات خود را بر اساس دسته‌بندی پیدا کنید
          </p>
        </div>
        <Link href="/categories">
          <Button
            variant="ghost"
            className="gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700"
          >
            مشاهده همه
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* کارت‌های افقی */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.slice(0, 6).map((category, index) => {
          const style = cardStyles[index % cardStyles.length];
          const hasImage = !!category.image;

          return (
            <Link
              key={category._id}
              href={`/products?category=${category._id}`}
              className="group"
            >
              <div
                className={`relative flex items-center gap-4 p-5 rounded-2xl ${style.bg} overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer border border-white/5`}
              >
                {/* گرادیان پس‌زمینه */}
                <div
                  className={`absolute inset-0 bg-gradient-to-l ${style.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* خط رنگی سمت راست */}
                <div
                  className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.accent} rounded-r-2xl`}
                />

                {/* تصویر / آیکون */}
                <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white/10 flex items-center justify-center">
                  {hasImage ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {getFallbackIcon(category.name)}
                    </span>
                  )}
                </div>

                {/* متن */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-white text-lg mb-1 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className={`text-sm ${style.text}`}>
                    {productCounts[category._id] || 0} محصول
                  </p>
                </div>

                {/* آیکون فلش */}
                <ArrowLeft className="h-5 w-5 text-white/30 group-hover:text-white/80 group-hover:-translate-x-1 transition-all duration-300 shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
