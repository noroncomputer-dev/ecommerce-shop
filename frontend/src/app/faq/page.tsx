"use client";

import { useEffect, useState } from "react";
import { HelpCircle, Search, ChevronDown, ChevronUp } from "lucide-react";
import faqService, { FAQ } from "@/services/faqService";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [filteredFaqs, setFilteredFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categoryLabels = {
    general: "عمومی",
    shipping: "حمل و نقل",
    payment: "پرداخت",
    returns: "بازگشت کالا",
    products: "محصولات",
  };

  const categoryColors = {
    general: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    shipping:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    payment:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    returns:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
    products:
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  useEffect(() => {
    filterFAQs();
  }, [search, selectedCategory, faqs]);

  const loadFAQs = async () => {
    try {
      const data = await faqService.getFAQs();
      setFaqs(data);
      setFilteredFaqs(data);
    } catch (error) {
      console.error("Error loading FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterFAQs = () => {
    let filtered = faqs;

    // فیلتر بر اساس جستجو
    if (search) {
      filtered = filtered.filter(
        (faq) =>
          faq.question.toLowerCase().includes(search.toLowerCase()) ||
          faq.answer.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // فیلتر بر اساس دسته‌بندی
    if (selectedCategory !== "all") {
      filtered = filtered.filter((faq) => faq.category === selectedCategory);
    }

    setFilteredFaqs(filtered);
  };

  const categories = [
    { value: "all", label: "همه دسته‌بندی‌ها" },
    ...Object.entries(categoryLabels).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* هدر */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            سوالات متداول
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            پاسخ سوالات خود را در اینجا پیدا کنید
          </p>
        </div>
      </div>

      {/* جستجو */}
      <div className="max-w-4xl mx-auto px-4 -mt-8">
        <Card className="shadow-xl border-0">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="جستجو در سوالات..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-12 py-6 text-lg rounded-xl bg-gray-50 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* دسته‌بندی‌ها */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <Button
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat.value)}
              className={
                selectedCategory === cat.value
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "border-gray-200 dark:border-gray-700 hover:border-blue-400"
              }
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      {/* لیست سوالات */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFaqs.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <HelpCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">نتیجه‌ای یافت نشد</h3>
              <p className="text-gray-500">سوالی با این مشخصات وجود ندارد</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <Card
                key={faq._id}
                className="overflow-hidden hover:shadow-lg transition"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* شماره */}
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold flex-shrink-0">
                      {index + 1}
                    </div>

                    {/* محتوا */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={categoryColors[faq.category]}>
                          {categoryLabels[faq.category]}
                        </Badge>
                      </div>

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem
                          value={`item-${index}`}
                          className="border-none"
                        >
                          <AccordionTrigger className="hover:no-underline py-0">
                            <h3 className="text-lg font-bold text-right">
                              {faq.question}
                            </h3>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-4 text-gray-600 dark:text-gray-400 leading-relaxed">
                              {faq.answer}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* بخش تماس */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">
            پاسخ سوال خود را پیدا نکردید؟
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            با تیم پشتیبانی ما در ارتباط باشید
          </p>
          <Link
            href={"/contact"}
            className="bg-blue-600 p-2 rounded-md hover:bg-blue-700"
          >
            تماس با پشتیبانی
          </Link>
        </div>
      </div>
    </div>
  );
}
