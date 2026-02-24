import Link from "next/link";

export default function FooterCTA() {
  return (
    <section className="relative bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-20 lg:py-24 overflow-hidden transition-colors duration-300">
      {/* افکت دکوراتیو - نسخه لایت و دارک */}
      <div className="absolute inset-0 opacity-10 dark:opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-400 dark:bg-blue-600 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400 dark:bg-purple-600 rounded-full filter blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* عنوان */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-3 leading-tight">
            <span className="text-gray-900 dark:text-white">Noron</span>
            <span className="text-blue-600 dark:text-blue-400">Tech</span>
            <span className="text-gray-900 dark:text-white">
              {" "}
              — قدرت واقعی کامپیوتر
            </span>
          </h2>

          {/* زیرعنوان */}
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-6 md:mb-8 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-2xl mx-auto px-4">
            بهترین تجهیزات کامپیوتری با ضمانت اصالت و پشتیبانی ۲۴ ساعته، هفت روز
            هفته
          </p>

          {/* دکمه */}
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-bold px-6 sm:px-8 md:px-10 py-3 sm:py-4 rounded-xl md:rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-xl shadow-blue-600/30 dark:shadow-blue-500/30 text-sm sm:text-base md:text-lg group"
          >
            <span>شروع خرید</span>
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          {/* متن کمکی */}
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-4 sm:mt-6">
            بیش از ۱۰,۰۰۰ مشتری راضی 🚀
          </p>
        </div>
      </div>
    </section>
  );
}
