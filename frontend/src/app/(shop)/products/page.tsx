"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import productService, { Product } from "@/services/productService";
import categoryService from "@/services/categoryService";
import { ProductCard } from "@/components/layout/ProductCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// ─── کامپوننت Pagination ───
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
      >
        <ChevronRight className="h-4 w-4" />
        قبلی
      </button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${
              currentPage === page
                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900 scale-105"
                : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm font-medium"
      >
        بعدی
        <ChevronLeft className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── کامپوننت اصلی با useSearchParams ───
const ITEMS_PER_PAGE = 12;

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const search = searchParams.get("search") || "";
  const selectedCategory = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "newest";

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory, sortBy]);

  const loadData = async () => {
    try {
      const [prodData, catData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(prodData.products);
      setCategories(Array.isArray(catData) ? catData : []);
    } catch (error) {
      console.error("خطا در بارگذاری:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("/products");
  };

  const filtered = useMemo(() => {
    let result = [...products];

    if (search) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          (p as any).category?._id === selectedCategory ||
          (p as any).category === selectedCategory,
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
    }

    return result;
  }, [products, search, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const activeFiltersCount = [
    search && 1,
    selectedCategory !== "all" && 1,
  ].filter(Boolean).length;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            محصولات
          </h1>
          {loading ? (
            <Skeleton className="h-4 w-24" />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">
              {filtered.length} محصول پیدا شد
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="جستجوی محصول..."
              value={search}
              onChange={(e) => updateFilters("search", e.target.value)}
              className="w-full pr-10 pl-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
            {search && (
              <button
                onClick={() => updateFilters("search", "")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="hidden sm:block w-48">
            <Select
              value={sortBy}
              onValueChange={(value) => updateFilters("sort", value)}
            >
              <SelectTrigger className="rounded-2xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                <SelectValue placeholder="مرتب‌سازی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">جدیدترین</SelectItem>
                <SelectItem value="price-asc">ارزان‌ترین</SelectItem>
                <SelectItem value="price-desc">گران‌ترین</SelectItem>
                <SelectItem value="name">بر اساس نام</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => setShowMobileFilters(true)}
            variant="outline"
            className="sm:hidden rounded-2xl border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm relative"
          >
            <Filter className="h-4 w-4 ml-2" />
            فیلتر
            {activeFiltersCount > 0 && (
              <Badge
                variant="destructive"
                className="mr-1 h-5 w-5 p-0 flex items-center justify-center"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        <div className="hidden sm:flex items-center gap-3 mb-6 flex-wrap">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onClick={() => updateFilters("category", "all")}
            className="rounded-2xl"
          >
            همه
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat._id}
              variant={selectedCategory === cat._id ? "default" : "outline"}
              onClick={() => updateFilters("category", cat._id)}
              className="rounded-2xl"
            >
              {cat.name}
            </Button>
          ))}
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <X className="h-4 w-4 ml-1" />
              پاک کردن همه
            </Button>
          )}
        </div>

        <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
            <SheetHeader>
              <SheetTitle>فیلترها</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-6 overflow-y-auto h-full">
              <div>
                <h3 className="font-medium mb-3">مرتب‌سازی</h3>
                <div className="space-y-2">
                  {[
                    { value: "newest", label: "جدیدترین" },
                    { value: "price-asc", label: "ارزان‌ترین" },
                    { value: "price-desc", label: "گران‌ترین" },
                    { value: "name", label: "بر اساس نام" },
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        updateFilters("sort", item.value);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-right px-4 py-3 rounded-xl transition ${
                        sortBy === item.value
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3">دسته‌بندی</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      updateFilters("category", "all");
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-right px-4 py-3 rounded-xl transition ${
                      selectedCategory === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    همه
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat._id}
                      onClick={() => {
                        updateFilters("category", cat._id);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-right px-4 py-3 rounded-xl transition ${
                        selectedCategory === cat._id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-48 rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24 bg-white/50 dark:bg-gray-900/50 rounded-3xl backdrop-blur-sm">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
              محصولی یافت نشد
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
              با تغییر فیلترها دوباره جستجو کنید
            </p>
            <Button
              onClick={clearFilters}
              variant="outline"
              className="mt-6 rounded-2xl"
            >
              <X className="h-4 w-4 ml-2" />
              پاک کردن فیلترها
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                نمایش {(currentPage - 1) * ITEMS_PER_PAGE + 1} تا{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} از{" "}
                {filtered.length} محصول
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                صفحه {currentPage} از {totalPages}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {paginatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}

// ─── ✅ export default با Suspense ───
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-500">در حال بارگذاری...</p>
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
