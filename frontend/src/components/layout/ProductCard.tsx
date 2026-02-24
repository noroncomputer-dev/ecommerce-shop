"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Heart,
  ShoppingCart,
  Eye,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "../../../lib/utils";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    images?: string[];
    category: { name: string; slug: string };
    stock: number;
    description?: string;
    discount?: number;
    rating?: number;
  };
  className?: string;
  priority?: boolean;
}

export function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  const hasMultipleImages = product.images && product.images.length > 1;

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.images) {
      setImageIndex((prev) => (prev + 1) % product.images!.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.images) {
      setImageIndex(
        (prev) => (prev - 1 + product.images!.length) % product.images!.length,
      );
    }
  };

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-2xl hover:-translate-y-1",
        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageIndex(0);
      }}
    >
      {/* برچسب‌ها - بهبود یافته */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        {product.discount && (
          <Badge className="bg-red-500 hover:bg-red-600 text-white border-none shadow-lg">
            {product.discount}% تخفیف
          </Badge>
        )}
        {product.stock <= 0 && (
          <Badge variant="destructive" className="border-none shadow-lg">
            ناموجود
          </Badge>
        )}
        {product.stock > 0 && product.stock < 5 && (
          <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-lg">
            فقط {product.stock} عدد
          </Badge>
        )}
      </div>

      {/* دکمه علاقه‌مندی - بهبود یافته */}
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute top-3 left-3 z-20 h-9 w-9 rounded-full",
          "bg-white/90 backdrop-blur-sm shadow-lg",
          "dark:bg-gray-800/90 dark:backdrop-blur-sm",
          "hover:bg-red-50 dark:hover:bg-red-950/30",
          "transition-all duration-300 hover:scale-110",
          isLiked && "text-red-500",
        )}
        onClick={(e) => {
          e.preventDefault();
          setIsLiked(!isLiked);
        }}
      >
        <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
      </Button>

      {/* بخش تصویر محصول - بازنویسی کامل */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
          {product.images && product.images.length > 0 ? (
            <>
              {/* تصویر اصلی با object-cover برای پر کردن کامل فضا */}
              <div className="absolute inset-0">
                <img
                  src={product.images[imageIndex]}
                  alt={product.name}
                  className={cn(
                    "w-full h-full object-cover transition-all duration-700",
                    isHovered && "scale-110",
                  )}
                  loading={priority ? "eager" : "lazy"}
                />
              </div>

              {/* افکت اوورلی رنگی روی تصویر */}
              <div
                className={cn(
                  "absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent",
                  "transition-opacity duration-300",
                  isHovered ? "opacity-100" : "opacity-0",
                )}
              />

              {/* دکمه‌های تغییر تصویر - فقط وقتی چند تصویر وجود داره */}
              {hasMultipleImages && isHovered && (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 shadow-lg"
                    onClick={nextImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-30 h-8 w-8 rounded-full bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 shadow-lg"
                    onClick={prevImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* اندیکاتور تعداد تصاویر */}
              {hasMultipleImages && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      className={cn(
                        "w-1.5 h-1.5 rounded-full transition-all",
                        idx === imageIndex
                          ? "w-4 bg-white"
                          : "bg-white/50 hover:bg-white/80",
                      )}
                      onClick={(e) => {
                        e.preventDefault();
                        setImageIndex(idx);
                      }}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <div className="text-center">
                <span className="text-6xl block mb-2">🖼️</span>
                <span className="text-sm">بدون تصویر</span>
              </div>
            </div>
          )}

          {/* دکمه‌های سریع - بهبود یافته */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex justify-center gap-3 p-4",
              "bg-gradient-to-t from-black/80 via-black/40 to-transparent",
              "transition-all duration-300 transform",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full",
            )}
          >
            <Button
              size="icon"
              className="rounded-full bg-white hover:bg-blue-600 text-gray-700 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 shadow-lg w-10 h-10 transition-all hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                // باز کردن سریع محصول
                window.location.href = `/products/${product.slug}`;
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              className="rounded-full bg-white hover:bg-blue-600 text-gray-700 hover:text-white dark:bg-gray-700 dark:hover:bg-blue-600 dark:text-gray-200 shadow-lg w-10 h-10 transition-all hover:scale-110"
              onClick={(e) => {
                e.preventDefault();
                // اضافه کردن به سبد خرید
                console.log("Add to cart:", product._id);
              }}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      {/* اطلاعات محصول - بهبود یافته */}
      <CardContent className="p-4">
        {/* دسته‌بندی */}
        <Link
          href={`/products?category=${product.category.slug}`}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-1 inline-block font-medium"
        >
          {product.category.name}
        </Link>

        {/* نام محصول */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-lg dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2 min-h-[3.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* توضیحات - اختیاری */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>
        )}

        {/* قیمت و امتیاز */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex-1">
            {discountedPrice ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {discountedPrice.toLocaleString()}
                  </span>
                  <span className="text-xs text-gray-500">تومان</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-gray-400 line-through">
                    {product.price.toLocaleString()}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-red-500 border-red-200 dark:border-red-800 text-xs"
                  >
                    {product.discount}%-
                  </Badge>
                </div>
              </div>
            ) : (
              <div>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs mr-1 text-gray-500 dark:text-gray-400">
                  تومان
                </span>
              </div>
            )}
          </div>

          {/* امتیاز */}
          {product.rating && (
            <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-950/30 px-2 py-1 rounded-lg">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* موجودی - بهبود یافته */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full animate-pulse",
                product.stock > 0 ? "bg-green-500" : "bg-red-500",
              )}
            />
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {product.stock > 0
                ? product.stock > 10
                  ? "موجود در انبار"
                  : `فقط ${product.stock} عدد باقی‌مانده`
                : "ناموجود"}
            </span>
          </div>

          {/* دکمه افزودن به سبد خرید - ساده */}
          {product.stock > 0 && (
            <Button
              size="sm"
              variant="ghost"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950/30"
              onClick={(e) => {
                e.preventDefault();
                console.log("Quick add to cart:", product._id);
              }}
            >
              <ShoppingCart className="h-4 w-4 ml-1" />
              <Link
                href={`/products/${product.slug}`}
                className="text-xs cursor-pointer"
              >
                افزودن
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
