"use client";

import Link from "next/link";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const getImageUrl = (path: string) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `http://localhost:5001${path}`;
};

interface Props {
  products: any[];
  loading: boolean;
}

export default function FeaturedProducts({ products, loading }: Props) {
  const { addToCart } = useCart();

  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            محصولات ویژه
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            بهترین‌های NoronTech برای شما
          </p>
        </div>
        <Link
          href="/products"
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium flex items-center gap-1"
        >
          همه محصولات <ChevronLeft className="h-4 w-4" />
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse h-72"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">محصولی یافت نشد</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <div
              key={product._id}
              className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <Link
                href={`/products/${product.slug}`}
                className="block relative bg-gray-50 dark:bg-gray-800 h-44 overflow-hidden"
              >
                {product.images?.[0] ? (
                  <img
                    src={getImageUrl(product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-5xl">
                    💻
                  </div>
                )}
              </Link>
              <div className="p-4 flex-1 flex flex-col">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">
                  {product.category?.name}
                </span>
                <Link href={`/products/${product.slug}`}>
                  <h3 className="font-bold text-gray-800 dark:text-gray-200 text-sm leading-tight mb-3 line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400 mb-0.5">قیمت</p>
                    <p className="font-black text-blue-600 dark:text-blue-400">
                      {product.price.toLocaleString()}
                      <span className="text-xs font-normal text-gray-400 mr-1">
                        تومان
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.stock === 0}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-700 text-white rounded-xl p-2 transition-all hover:scale-110 active:scale-95"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </button>
                </div>
                {product.stock === 0 && (
                  <p className="text-xs text-red-500 mt-2 text-center">
                    ناموجود
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
