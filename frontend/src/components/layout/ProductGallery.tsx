"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "../../../lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductGallery({
  images,
  productName,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const defaultImages = images.length > 0 ? images : ["/placeholder-image.jpg"];

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % defaultImages.length);
  };

  const prevImage = () => {
    setSelectedImage(
      (prev) => (prev - 1 + defaultImages.length) % defaultImages.length,
    );
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomLevel > 1) {
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;
      setMousePosition({ x, y });
    }
  };

  return (
    <>
      {/* گالری اصلی */}
      <div className="space-y-4">
        {/* تصویر اصلی */}
        <div
          className="relative aspect-square bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden cursor-zoom-in group"
          onClick={() => setShowModal(true)}
        >
          <img
            src={defaultImages[selectedImage]}
            alt={`${productName} - تصویر اصلی`}
            className="w-full h-full object-contain p-8 transition-transform duration-300 group-hover:scale-105"
          />

          {/* دکمه بزرگنمایی */}
          <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full bg-white/80 backdrop-blur-sm"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* دکمه‌های ناوبری روی تصویر اصلی */}
          {defaultImages.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevImage();
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  nextImage();
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        {/* تصاویر کوچک */}
        {defaultImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {defaultImages.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                  selectedImage === index
                    ? "border-blue-600 shadow-lg scale-105"
                    : "border-transparent hover:border-gray-300 dark:hover:border-gray-600",
                )}
              >
                <img
                  src={img}
                  alt={`${productName} - تصویر ${index + 1}`}
                  className="w-full h-full object-contain p-2 bg-gray-50 dark:bg-gray-800"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* مودال تمام صفحه با زوم */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-7xl w-screen h-screen p-0 bg-black/95 border-0">
          {/* عنوان مخفی برای دسترسی‌پذیری */}
          <DialogTitle className="sr-only">
            {productName} - گالری تصاویر
          </DialogTitle>

          <div className="relative w-full h-full flex items-center justify-center">
            {/* کنترل‌های بالا */}
            <div className="absolute top-4 right-4 flex gap-2 z-50">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoomLevel((prev) => Math.min(prev + 0.5, 3))}
                className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoomLevel((prev) => Math.max(prev - 0.5, 1))}
                className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>

            {/* شمارنده تصاویر */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
              {selectedImage + 1} / {defaultImages.length}
            </div>

            {/* دکمه‌های ناوبری در مودال */}
            {defaultImages.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-white transition z-50"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 p-3 rounded-full text-white transition z-50"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </>
            )}

            {/* تصویر با قابلیت زوم */}
            <div
              className="relative w-full h-full flex items-center justify-center overflow-hidden"
              onMouseMove={handleMouseMove}
            >
              <img
                src={defaultImages[selectedImage]}
                alt={`${productName} - بزرگنمایی`}
                className="max-w-full max-h-full object-contain transition-transform duration-200"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
