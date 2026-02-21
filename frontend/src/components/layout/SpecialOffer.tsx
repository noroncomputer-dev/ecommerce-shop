"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, ChevronLeft, Zap } from "lucide-react";
import { useEffect, useState, useMemo } from "react";

// ─── تایمر واقعی ───
function useCountdown(endTime: number) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const update = () => {
      const distance = endTime - new Date().getTime();

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]); // ✅ endTime یه عدد ثابته — loop نمیشه

  return timeLeft;
}

const pad = (n: number) => String(n).padStart(2, "0");

export default function SpecialOffer() {
  // ✅ useMemo — فقط یک بار محاسبه میشه
  const endTime = useMemo(() => Date.now() + 3 * 24 * 60 * 60 * 1000, []);
  const { days, hours, minutes, seconds } = useCountdown(endTime);

  const timeUnits = [
    { label: "ثانیه", value: seconds },
    { label: "دقیقه", value: minutes },
    { label: "ساعت", value: hours },
    { label: "روز", value: days },
  ];

  return (
    <section className="py-16">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-red-500 to-orange-500 shadow-2xl shadow-red-200 dark:shadow-red-950">
        {/* پس‌زمینه تزئینی */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-orange-300/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-pink-400/10 blur-3xl" />
          <div className="absolute top-8 left-1/4 w-3 h-3 rounded-full bg-white/30" />
          <div className="absolute bottom-12 left-1/3 w-2 h-2 rounded-full bg-white/20" />
          <div className="absolute top-1/3 right-1/4 w-4 h-4 rounded-full bg-white/10" />
        </div>

        <div className="relative z-10 p-8 lg:p-14">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* بخش راست — متن */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-sm font-semibold">
                  پیشنهاد ویژه و محدود
                </span>
              </div>

              <h2 className="text-4xl lg:text-5xl font-black mb-4 leading-tight">
                تخفیف‌های
                <span className="block text-yellow-300">استثنایی</span>
              </h2>

              <p className="text-lg text-white/85 mb-8 leading-relaxed">
                تا{" "}
                <span className="font-bold text-yellow-300 text-xl">۴۰٪</span>{" "}
                تخفیف روی محصولات منتخب — فقط برای مدت محدود!
              </p>

              <Link href="/products">
                <Button
                  size="lg"
                  className="bg-white text-red-600 hover:bg-yellow-50 font-bold px-8 py-6 text-base rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
                >
                  <Zap className="ml-2 h-5 w-5 text-red-500" />
                  مشاهده تخفیف‌ها
                  <ChevronLeft className="mr-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* بخش چپ — تایمر */}
            <div className="flex flex-col items-center lg:items-end gap-4">
              <p className="text-white/70 text-sm font-medium">
                زمان باقی‌مانده تا پایان تخفیف
              </p>

              <div className="flex items-center gap-3">
                {timeUnits.map((unit, index) => (
                  <div key={unit.label} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="relative bg-white/15 backdrop-blur-sm border border-white/25 rounded-2xl w-20 h-20 flex items-center justify-center shadow-inner">
                        <span className="text-3xl font-black text-white tabular-nums">
                          {pad(unit.value)}
                        </span>
                        <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" />
                      </div>
                      <span className="text-white/70 text-xs mt-2 font-medium">
                        {unit.label}
                      </span>
                    </div>
                    {index < timeUnits.length - 1 && (
                      <span className="text-white/50 text-2xl font-bold mb-4">
                        :
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* progress bar */}
              <div className="w-full max-w-xs">
                <div className="flex justify-between text-xs text-white/60 mb-1">
                  <span>موجودی باقی‌مانده</span>
                  <span>۳۸٪</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-300 rounded-full"
                    style={{ width: "38%" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
