"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import productService, { Product } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Truck,
  Shield,
  RefreshCw,
  Minus,
  Plus,
  Check,
  AlertCircle,
} from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { showSuccess, showError } from "@/utils/swal";
import ProductGallery from "@/components/layout/ProductGallery";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      loadProduct();
    }
  }, [slug]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductBySlug(slug as string);
      setProduct(data);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    
    if (!isAuthenticated) {
      showError("لطفاً ابتدا وارد شوید");
      return;
    }

    addToCart(product, quantity);
    showSuccess(`${product.name} با موفقیت به سبد خرید اضافه شد`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">محصول یافت نشد</h2>
          <p className="text-gray-500 mb-4">محصول مورد نظر شما وجود ندارد</p>
          <Link href="/products">
            <Button>بازگشت به محصولات</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* مسیر راهنما */}
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <Link href="/" className="hover:text-blue-600 transition">خانه</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-blue-600 transition">محصولات</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.slug}`} className="hover:text-blue-600 transition">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 dark:text-gray-100 font-medium">{product.name}</span>
        </div>

        {/* محتوای اصلی */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* گالری تصاویر */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* اطلاعات محصول */}
          <div className="space-y-6">
            {/* عنوان و وضعیت */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {product.category.name}
                </Badge>
                {product.stock > 0 ? (
                  <Badge variant="outline" className="text-green-600 border-green-200 dark:border-green-800">
                    <Check className="h-3 w-3 ml-1" />
                    موجود در انبار
                  </Badge>
                ) : (
                  <Badge variant="destructive">ناموجود</Badge>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {product.name}
              </h1>

              {/* امتیاز و نظرات */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < 4
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                  <span className="mr-2 text-gray-600 dark:text-gray-400">۴.۵ از ۵</span>
                </div>
                <span className="text-gray-300 dark:text-gray-700">|</span>
                <span className="text-gray-600 dark:text-gray-400">۱۲ نظر</span>
              </div>
            </div>

            <Separator />

            {/* قیمت */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                {product.price.toLocaleString()}
              </span>
              <span className="text-gray-500 dark:text-gray-400">تومان</span>
            </div>

            {/* توضیحات کوتاه */}
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.description}
            </p>

            {/* ویژگی‌ها */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-bold mb-3">ویژگی‌ها</h3>
                  <div className="space-y-2">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex text-sm">
                        <span className="w-32 text-gray-500 dark:text-gray-400">{key}:</span>
                        <span className="text-gray-900 dark:text-gray-100 font-medium">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* گارانتی و خدمات */}
            <div className="grid grid-cols-3 gap-3 py-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-xs font-medium">ارسال سریع</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-xs font-medium">ضمانت اصالت</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <RefreshCw className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-xs font-medium">۷ روز بازگشت</p>
              </div>
            </div>

            <Separator />

            {/* انتخاب تعداد و افزودن به سبد */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-300">تعداد:</span>
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(prev => Math.max(prev - 1, 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-none"
                    onClick={() => setQuantity(prev => prev + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {product.stock} عدد موجود
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 ml-2" />
                  افزودن به سبد خرید
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ml-2 ${isLiked ? "fill-red-500 text-red-500" : ""}`} />
                  {isLiked ? "محصول مورد علاقه" : "افزودن به علاقه‌مندی‌ها"}
                </Button>
              </div>
            </div>

            {/* اشتراک‌گذاری */}
            <div className="flex items-center gap-3 pt-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">اشتراک‌گذاری:</span>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* توضیحات کامل با تب‌ها */}
        <div className="mt-12">
          <Tabs defaultValue="description" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="description">توضیحات</TabsTrigger>
              <TabsTrigger value="specs">مشخصات</TabsTrigger>
              <TabsTrigger value="reviews">نظرات</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="p-4 bg-white dark:bg-gray-900 rounded-xl">
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p>{product.description}</p>
                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد.</p>
              </div>
            </TabsContent>
            
            <TabsContent value="specs" className="p-4 bg-white dark:bg-gray-900 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(product.attributes).map(([key, value]) => (
                  <div key={key} className="flex border-b pb-2">
                    <span className="w-32 text-gray-500">{key}:</span>
                    <span className="text-gray-900 dark:text-gray-100 font-medium">{String(value)}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="p-4 bg-white dark:bg-gray-900 rounded-xl">
              <p className="text-center text-gray-500">هنوز نظری ثبت نشده است</p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}