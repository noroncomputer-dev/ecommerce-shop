"use client";

import Link from "next/link";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: any[];
  loading?: boolean;
  title?: string;
  viewAllLink?: string;
}

export function ProductGrid({
  products,
  loading,
  title,
  viewAllLink,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">محصولی یافت نشد</p>
      </div>
    );
  }

  return (
    <section className="my-8">
      {title && (
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              مشاهده همه
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
