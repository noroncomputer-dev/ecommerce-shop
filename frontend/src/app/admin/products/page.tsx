"use client";

import { useEffect, useState } from "react";
import productService, { Product } from "../../../services/productService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getProducts();
      setProducts(data.products);
    } catch (error) {
      console.error("Error loading products : ", error);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async (productId: string) => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      try {
        await productService.deleteProduct(productId);
        loadProducts(); // دوباره لیست رو لود کن
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">مدیریت محصولات</h1>
        <Link href={`/admin/products/new`}>
          <Button>
            <Plus className="h-4 w-4 ml-2" />
            افزودن محصول جدید
          </Button>
        </Link>
      </div>

      {loading ? (
        <p>درحال بارگذاری....</p>
      ) : (
        <div className="grid gap-4">
          {products.map((product) => (
            <Card key={product._id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.price.toLocaleString()} تومان
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant={"ghost"} size={"icon"}>
                    <Link href={`/admin/products/edit/${product._id}`}>
                      <Pencil className="h-4 w-4" />{" "}
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-600"
                    onClick={() => handleDelete(product._id)} // اینجا product._id رو پاس بده
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
