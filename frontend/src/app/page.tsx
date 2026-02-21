"use client";

import { useEffect, useState } from "react";
import DiscountBanner from "@/components/layout/DiscountBanner";
import FeaturedProducts from "@/components/layout/FeaturedProducts";
import FooterCTA from "@/components/layout/FooterCTA";
import HeroSlider from "@/components/layout/HeroSlider";
import Features from "@/components/layout/Features";
import SpecialOffer from "@/components/layout/SpecialOffer";
import { ProductGrid } from "@/components/layout/ProductGrid";
import Categories from "@/components/layout/Categories";

const API = "http://localhost:5001/api";

export default function HomePage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [catRes, prodRes] = await Promise.all([
        fetch(`${API}/categories`),
        fetch(`${API}/products`),
      ]);
      const catData = await catRes.json();
      const prodData = await prodRes.json();
      setCategories(Array.isArray(catData) ? catData.slice(0, 6) : []);
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
    <main className="container mx-auto px-4 py-6">
      <HeroSlider />
      <Features />
      <Categories />
      <SpecialOffer />
      <DiscountBanner />
      <ProductGrid
        title="محصولات ویژه"
        viewAllLink="/products"
        products={products} // اینجا محصولات واقعی رو از API می‌گیری
      />
      <FooterCTA />
    </main>
  );
}
