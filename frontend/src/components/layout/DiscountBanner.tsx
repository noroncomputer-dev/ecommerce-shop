import Link from "next/link";

export default function DiscountBanner() {
  return (
    <section className="max-w-7xl mx-auto px-4 pb-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 to-red-600 p-8 md:p-12">
        <div className="relative z-10">
          <span className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
            🔥 پیشنهاد ویژه
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            تخفیف‌های استثنایی
          </h2>
          <p className="text-white/80 mb-6 max-w-md">
            تا ۴۰٪ تخفیف روی محصولات منتخب — فقط برای مدت محدود!
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition-all hover:scale-105 shadow-lg"
          >
            مشاهده تخفیف‌ها
          </Link>
        </div>
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-4 left-4 text-8xl opacity-10 font-black text-white select-none">
          %
        </div>
      </div>
    </section>
  );
}
