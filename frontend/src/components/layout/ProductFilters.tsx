"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, X, Filter } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  count?: number;
}

interface ProductFiltersProps {
  categories: Category[];
  minPrice: number;
  maxPrice: number;
  onClose?: () => void;
}

function ProductFiltersContent({
  categories,
  minPrice,
  maxPrice,
  onClose,
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [priceRange, setPriceRange] = useState<[number, number]>([
    Number(searchParams.get("minPrice")) || minPrice,
    Number(searchParams.get("maxPrice")) || maxPrice,
  ]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get("category")?.split(",").filter(Boolean) || [],
  );

  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "newest");
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategories.length)
      params.set("category", selectedCategories.join(","));
    if (priceRange[0] > minPrice)
      params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < maxPrice)
      params.set("maxPrice", priceRange[1].toString());
    if (sortBy !== "newest") params.set("sort", sortBy);
    router.push(`/products?${params.toString()}`);
    onClose?.();
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setPriceRange([minPrice, maxPrice]);
    setSortBy("newest");
    router.push("/products");
    onClose?.();
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId],
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="جستجوی محصولات..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      <Accordion type="multiple" defaultValue={["categories", "price", "sort"]}>
        <AccordionItem value="categories">
          <AccordionTrigger className="text-lg font-bold">
            دسته‌بندی‌ها
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-2">
              {categories.map((category) => (
                <div
                  key={category._id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <Checkbox
                      id={category._id}
                      checked={selectedCategories.includes(category._id)}
                      onCheckedChange={() => toggleCategory(category._id)}
                    />
                    <Label
                      htmlFor={category._id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </Label>
                  </div>
                  {category.count && (
                    <span className="text-xs text-gray-500">
                      ({category.count})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-bold">
            محدوده قیمت
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <Slider
                min={minPrice}
                max={maxPrice}
                step={10000}
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
                className="py-4"
              />
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <Label className="text-xs">از</Label>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([Number(e.target.value), priceRange[1]])
                    }
                    className="text-left"
                    dir="ltr"
                  />
                </div>
                <div className="flex-1">
                  <Label className="text-xs">تا</Label>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="text-left"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sort">
          <AccordionTrigger className="text-lg font-bold">
            مرتب‌سازی
          </AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={sortBy}
              onValueChange={setSortBy}
              className="space-y-3 pt-2"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="newest" id="newest" />
                <Label htmlFor="newest">جدیدترین</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="price_asc" id="price_asc" />
                <Label htmlFor="price_asc">قیمت: کم به زیاد</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="price_desc" id="price_desc" />
                <Label htmlFor="price_desc">قیمت: زیاد به کم</Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="popular" id="popular" />
                <Label htmlFor="popular">محبوب‌ترین</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={applyFilters}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          <Filter className="h-4 w-4 ml-2" />
          اعمال فیلتر
        </Button>
        <Button onClick={clearFilters} variant="outline" className="flex-1">
          <X className="h-4 w-4 ml-2" />
          پاک کردن
        </Button>
      </div>
    </div>
  );
}

export default function ProductFilters(props: ProductFiltersProps) {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-40 bg-gray-200 rounded" />
        </div>
      }
    >
      <ProductFiltersContent {...props} />
    </Suspense>
  );
}
