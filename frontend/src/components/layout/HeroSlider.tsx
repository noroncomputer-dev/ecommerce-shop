"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import sliderService, { Slider } from "@/services/sliderService";
import { Skeleton } from "@/components/ui/skeleton";

export default function HeroSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  useEffect(() => {
    loadSliders();
  }, []);

  useEffect(() => {
    if (!isAutoPlay || sliders.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliders.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, sliders.length]);

  const loadSliders = async () => {
    try {
      const data = await sliderService.getActiveSliders();
      setSliders(data);
    } catch (error) {
      console.error("Error loading sliders:", error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
  };

  const prevSlide = () => {
    setIsAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
  };

  if (loading) {
    return (
      <div className="relative h-[500px] lg:h-[600px] overflow-hidden rounded-3xl">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (sliders.length === 0) {
    return null;
  }

  return (
    <div className="relative h-[500px] lg:h-[600px] overflow-hidden rounded-3xl group">
      {sliders.map((slide, index) => {
        // ساخت آدرس کامل تصویر
        const imageUrl = slide.image.startsWith("http")
          ? slide.image
          : `http://localhost:5001${slide.image}`;

        return (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-all duration-1000 ease-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105 pointer-events-none"
            }`}
          >
            {/* تصویر پس‌زمینه */}
            <img
              src={imageUrl}
              alt={slide.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                e.currentTarget.style.background = "#1a1a1a"; // رنگ پس‌زمینه
              }}
            />

            {/* اویرلی تیره */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

            {/* محتوا */}
            <div className="relative h-full container mx-auto px-4 flex items-center">
              <div className="max-w-2xl text-white">
                <p className="text-lg sm:text-xl mb-2 opacity-90 animate-fade-in">
                  {slide.subtitle}
                </p>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 animate-slide-up">
                  {slide.title}
                </h1>
                <p className="text-lg sm:text-xl mb-8 opacity-90 animate-fade-in delay-200">
                  {slide.description}
                </p>
                <Link href={slide.link}>
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 text-lg px-8 py-6 transform transition hover:scale-105 active:scale-95"
                  >
                    {slide.buttonText}
                    <ChevronLeft className="mr-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* دکمه‌های ناوبری */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={prevSlide}
          className="bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition transform hover:scale-110 active:scale-90"
          aria-label="اسلاید قبلی"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="bg-white/30 hover:bg-white/50 text-white p-3 rounded-full backdrop-blur-sm transition transform hover:scale-110 active:scale-90"
          aria-label="اسلاید بعدی"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      </div>

      {/* نقاط اسلایدر */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {sliders.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsAutoPlay(false);
              setCurrentSlide(index);
            }}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-white"
                : "w-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`برو به اسلاید ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
