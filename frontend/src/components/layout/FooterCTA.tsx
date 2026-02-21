import Link from "next/link";

export default function FooterCTA() {
  return (
    <section className="bg-gray-900 dark:bg-black py-14">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-black text-white mb-3">
          NoronTech — قدرت واقعی کامپیوتر
        </h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          بهترین تجهیزات کامپیوتری با ضمانت اصالت و پشتیبانی ۲۴ ساعته
        </p>
        <Link
          href="/products"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-2xl transition-all hover:scale-105 shadow-lg shadow-blue-600/30"
        >
          شروع خرید
        </Link>
      </div>
    </section>
  );
}
