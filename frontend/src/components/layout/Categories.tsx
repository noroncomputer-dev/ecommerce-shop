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

  // رنگ‌های بهینه‌شده برای دارک/لایت مود
  const cardStyles = [
    {
      bg: "bg-white dark:bg-slate-800",
      border: "border-blue-100 dark:border-blue-900",
      accent: "from-blue-500 to-cyan-400",
      text: "text-blue-600 dark:text-blue-400",
      shadow: "shadow-blue-100/50 dark:shadow-blue-900/30",
      hover: "hover:shadow-blue-200/50 dark:hover:shadow-blue-800/30",
    },
    {
      bg: "bg-white dark:bg-gray-800",
      border: "border-purple-100 dark:border-purple-900",
      accent: "from-purple-500 to-pink-400",
      text: "text-purple-600 dark:text-purple-400",
      shadow: "shadow-purple-100/50 dark:shadow-purple-900/30",
      hover: "hover:shadow-purple-200/50 dark:hover:shadow-purple-800/30",
    },
    {
      bg: "bg-white dark:bg-zinc-800",
      border: "border-green-100 dark:border-green-900",
      accent: "from-green-500 to-emerald-400",
      text: "text-green-600 dark:text-green-400",
      shadow: "shadow-green-100/50 dark:shadow-green-900/30",
      hover: "hover:shadow-green-200/50 dark:hover:shadow-green-800/30",
    },
    {
      bg: "bg-white dark:bg-neutral-800",
      border: "border-orange-100 dark:border-orange-900",
      accent: "from-orange-500 to-amber-400",
      text: "text-orange-600 dark:text-orange-400",
      shadow: "shadow-orange-100/50 dark:shadow-orange-900/30",
      hover: "hover:shadow-orange-200/50 dark:hover:shadow-orange-800/30",
    },
    {
      bg: "bg-white dark:bg-stone-800",
      border: "border-rose-100 dark:border-rose-900",
      accent: "from-rose-500 to-red-400",
      text: "text-rose-600 dark:text-rose-400",
      shadow: "shadow-rose-100/50 dark:shadow-rose-900/30",
      hover: "hover:shadow-rose-200/50 dark:hover:shadow-rose-800/30",
    },
    {
      bg: "bg-white dark:bg-slate-900",
      border: "border-indigo-100 dark:border-indigo-900",
      accent: "from-indigo-500 to-violet-400",
      text: "text-indigo-600 dark:text-indigo-400",
      shadow: "shadow-indigo-100/50 dark:shadow-indigo-900/30",
      hover: "hover:shadow-indigo-200/50 dark:hover:shadow-indigo-800/30",
    },
  ];

  // fallback emoji (بدون تغییر)
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
            <Skeleton className="h-8 w-48 mb-2 bg-gray-200 dark:bg-gray-700" />
            <Skeleton className="h-4 w-64 bg-gray-200 dark:bg-gray-700" />
          </div>
          <Skeleton className="h-10 w-28 bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-16 px-4 max-w-7xl mx-auto transition-colors duration-300">
      {/* Header - بهینه شده برای دارک/لایت */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-widest uppercase mb-2">
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
            className="gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30"
          >
            مشاهده همه
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* کارت‌های افقی - با پشتیبانی کامل از دارک/لایت */}
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
                className={`relative flex items-center gap-4 p-5 rounded-2xl ${style.bg} border ${style.border} overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${style.shadow} ${style.hover} cursor-pointer`}
              >
                {/* گرادیان پس‌زمینه - در هاور برای هر دو تم */}
                <div
                  className={`absolute inset-0 bg-gradient-to-l ${style.accent} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`}
                />

                {/* خط رنگی سمت راست */}
                <div
                  className={`absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b ${style.accent} rounded-r-2xl`}
                />

                {/* تصویر / آیکون - بهینه شده */}
                <div className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/10 flex items-center justify-center border border-gray-200 dark:border-white/5">
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
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">
                    {category.name}
                  </h3>
                  <p className={`text-sm ${style.text} font-medium`}>
                    {productCounts[category._id] || 0} محصول
                  </p>
                </div>

                {/* آیکون فلش - بهینه شده */}
                <ArrowLeft className="h-5 w-5 text-gray-400 dark:text-white/30 group-hover:text-blue-600 dark:group-hover:text-white/80 group-hover:-translate-x-1 transition-all duration-300 shrink-0" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
