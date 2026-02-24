import Link from "next/link";
import { Tag, Zap, ArrowLeft, Clock, Shield } from "lucide-react";

export default function DiscountBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ستون چپ — تخفیف ویژه */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-orange-500 to-amber-500 p-8 min-h-[280px] flex flex-col justify-between">
          {/* پس‌زمینه دکوراتیو */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/20 translate-y-1/2 -translate-x-1/2 blur-2xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] font-black text-white/5 select-none pointer-events-none leading-none">
            %
          </div>

          {/* محتوا */}
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
              <Zap className="h-3 w-3" />
              پیشنهاد ویژه و محدود
            </span>

            <h2 className="text-4xl font-black text-white mb-2 leading-tight">
              تخفیف‌های
              <br />
              <span className="text-yellow-300">استثنایی</span>
            </h2>
            <p className="text-white/80 text-sm mb-6 max-w-xs">
              تا ۴۰٪ تخفیف روی محصولات منتخب — فقط برای مدت محدود!
            </p>
          </div>

          {/* دکمه */}
          <div className="relative z-10 flex items-center justify-between">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-all hover:scale-105 shadow-lg text-sm"
            >
              مشاهده تخفیف‌ها
              <ArrowLeft className="h-4 w-4" />
            </Link>

            {/* تایمر */}
            <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-xl px-4 py-2">
              <Clock className="h-4 w-4 text-yellow-300" />
              <div className="flex gap-1 text-white text-xs font-bold">
                <span className="bg-white/20 rounded px-1.5 py-0.5">۰۲</span>
                <span>:</span>
                <span className="bg-white/20 rounded px-1.5 py-0.5">۱۴</span>
                <span>:</span>
                <span className="bg-white/20 rounded px-1.5 py-0.5">۳۵</span>
              </div>
            </div>
          </div>
        </div>

        {/* ستون راست — ارسال رایگان + ضمانت */}
        <div className="flex flex-col gap-6">
          {/* ارسال رایگان */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 flex-1 flex items-center gap-6">
            <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

            <div className="text-6xl shrink-0">🚚</div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                <Tag className="h-3 w-3" />
                ارسال سریع
              </span>
              <h3 className="text-2xl font-black text-white mb-1">
                ارسال رایگان
              </h3>
              <p className="text-white/70 text-sm">
                برای سفارش‌های بالای ۱,۰۰۰,۰۰۰ تومان
              </p>
            </div>
          </div>

          {/* ضمانت اصالت */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-green-700 p-6 flex-1 flex items-center gap-6">
            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

            <div className="text-6xl shrink-0">🛡️</div>

            <div className="relative z-10">
              <span className="inline-flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full mb-2">
                <Shield className="h-3 w-3" />
                تضمین کیفیت
              </span>
              <h3 className="text-2xl font-black text-white mb-1">
                ضمانت اصالت
              </h3>
              <p className="text-white/70 text-sm">۷ روز ضمانت بازگشت کالا</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
