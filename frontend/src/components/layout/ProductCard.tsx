"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Heart, ShoppingCart, Eye, Star } from "lucide-react";
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
  const { theme } = useTheme();

  const discountedPrice = product.discount
    ? product.price * (1 - product.discount / 100)
    : null;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300",
        "hover:shadow-xl hover:scale-[1.02]",
        "bg-white dark:bg-gray-800",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* برچسب‌ها */}
      <div className="absolute top-3 left-3 right-3 z-10 flex justify-between">
        <div className="flex gap-2">
          {product.discount && (
            <Badge className="bg-red-500 text-white border-none">
              {product.discount}% تخفیف
            </Badge>
          )}
          {product.stock <= 0 && (
            <Badge variant="destructive" className="border-none">
              ناموجود
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm",
            "hover:bg-red-50 dark:bg-gray-800/80 dark:hover:bg-gray-700",
            isLiked && "text-red-500",
          )}
          onClick={() => setIsLiked(!isLiked)}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
        </Button>
      </div>

      {/* تصویر محصول */}
      <Link href={`/products/${product.slug}`}>
        <div className="relative flex items-center p-0  max-w-full h-64 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-900">
          {product.images?.[0] ? (
            <div className="">
              <img
                src={product.images[0]}
                alt={product.name}
                className={cn(
                  "w-full h-full object-contain p-4 transition-all duration-500",
                  isHovered && "scale-110",
                )}
                loading={priority ? "eager" : "lazy"}
              />
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">بدون تصویر</span>
            </div>
          )}

          {/* دکمه‌های روی عکس */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4",
              "bg-gradient-to-t from-black/70 to-transparent",
              "transition-all duration-300",
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-full",
            )}
          >
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white hover:bg-blue-600 hover:text-white dark:bg-gray-800 dark:hover:bg-blue-600"
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Link>

      {/* اطلاعات محصول */}
      <CardContent className="p-4">
        {/* دسته‌بندی */}
        <Link
          href={`/products?category=${product.category.slug}`}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline mb-1 block"
        >
          {product.category.name}
        </Link>

        {/* نام محصول */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-bold text-lg dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>

        {/* توضیحات */}
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* قیمت و امتیاز */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400 block">
              قیمت
            </span>
            {discountedPrice ? (
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {discountedPrice.toLocaleString()}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-xs text-red-500">تومان</span>
              </div>
            ) : (
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {product.price.toLocaleString()}
                <span className="text-xs mr-1 text-gray-500 dark:text-gray-400">
                  تومان
                </span>
              </span>
            )}
          </div>

          {/* امتیاز */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium dark:text-gray-300">
                {product.rating}
              </span>
            </div>
          )}
        </div>

        {/* موجودی */}
        <div className="flex items-center gap-2 mt-3">
          <div
            className={cn(
              "h-2 w-2 rounded-full",
              product.stock > 0 ? "bg-green-500" : "bg-red-500",
            )}
          />
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.stock > 0 ? `${product.stock} عدد موجود` : "ناموجود"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
