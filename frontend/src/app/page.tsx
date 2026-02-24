"use client";

import { useEffect, useState } from "react";
import DiscountBanner from "@/components/layout/DiscountBanner";
import FooterCTA from "@/components/layout/FooterCTA";
import HeroSlider from "@/components/layout/HeroSlider";
import Features from "@/components/layout/Features";
import SpecialOffer from "@/components/layout/SpecialOffer";
import { ProductGrid } from "@/components/layout/ProductGrid";
import Categories from "@/components/layout/Categories";

// ✅ از env variable استفاده میکنه
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const prodRes = await fetch(`${API}/products`);
      const prodData = await prodRes.json();
      setProducts(
        Array.isArray(prodData.products) ? prodData.products.slice(0, 8) : [],
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container mx-auto px-4 py-6">
        <HeroSlider />
        <Categories />
        <Features />
        <SpecialOffer />
        <DiscountBanner />
        <ProductGrid
          title="محصولات ویژه"
          viewAllLink="/products"
          products={products}
          loading={loading}
        />
        <FooterCTA />
      </main>
    </>
  );
}
