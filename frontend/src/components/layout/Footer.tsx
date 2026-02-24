import Link from "next/link";
import {
  Instagram,
  Send,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
} from "lucide-react";

const links = {
  shop: [
    { href: "/products", label: "همه محصولات" },
    { href: "/categories", label: "دسته‌بندی‌ها" },
    { href: "/products?sale=true", label: "تخفیف‌ها" },
    { href: "/products?new=true", label: "جدیدترین‌ها" },
  ],
  account: [
    { href: "/profile", label: "پروفایل" },
    { href: "/orders", label: "سفارشات من" },
    { href: "/cart", label: "سبد خرید" },
    { href: "/login", label: "ورود / ثبت‌نام" },
  ],
  support: [
    { href: "/about", label: "درباره ما" },
    { href: "/contact", label: "تماس با ما" },
    { href: "/faq", label: "سوالات متداول" },
    { href: "/warranty", label: "شرایط ضمانت" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto border-t border-gray-800">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Grid: موبایل 1 ستون، تبلت 2 ستون، دسکتاپ 4 ستون */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {/* Brand Section - در موبایل عرض کامل */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="text-2xl font-black text-white inline-block mb-4 hover:text-blue-400 transition-colors"
            >
              Noron<span className="text-blue-500">Tech</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6 max-w-md lg:max-w-full">
              فروشگاه تخصصی کامپیوتر و لوازم جانبی با بیش از ۱۰ سال تجربه در
              ارائه بهترین محصولات با ضمانت اصالت.
            </p>

            {/* Social Icons - ریسپانسیو و با فاصله مناسب */}
            <div className="flex gap-3">
              {[
                {
                  icon: Instagram,
                  href: "#",
                  label: "اینستاگرام",
                  color: "hover:bg-pink-600",
                },
                {
                  icon: Send,
                  href: "#",
                  label: "تلگرام",
                  color: "hover:bg-blue-500",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  aria-label={s.label}
                  className={`w-10 h-10 bg-gray-800 hover:${s.color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg`}
                >
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* فروشگاه - لینک‌ها */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:right-0 after:w-10 after:h-0.5 after:bg-blue-500">
              فروشگاه
            </h4>
            <ul className="space-y-3">
              {links.shop.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-white hover:pr-2 transition-all duration-200 block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* حساب کاربری - لینک‌ها */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:right-0 after:w-10 after:h-0.5 after:bg-blue-500">
              حساب کاربری
            </h4>
            <ul className="space-y-3">
              {links.account.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-white hover:pr-2 transition-all duration-200 block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* تماس با ما - ریسپانسیو شده */}
          <div>
            <h4 className="text-white font-bold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:bottom-[-8px] after:right-0 after:w-10 after:h-0.5 after:bg-blue-500">
              تماس با ما
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                  <Phone className="h-4 w-4 text-blue-500 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">تلفن پشتیبانی</p>
                  <a
                    href="tel:02100000000"
                    className="text-sm text-gray-300 hover:text-white transition-colors block truncate"
                    dir="ltr"
                  >
                    ۰۲۱-۰۰۰۰۰۰۰۰
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                  <Mail className="h-4 w-4 text-blue-500 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">ایمیل</p>
                  <a
                    href="mailto:info@norontech.ir"
                    className="text-sm text-gray-300 hover:text-white transition-colors block truncate"
                  >
                    info@norontech.ir
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-blue-600 transition-colors duration-300">
                  <MapPin className="h-4 w-4 text-blue-500 group-hover:text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-0.5">آدرس</p>
                  <p className="text-sm text-gray-300">تهران، خیابان ولیعصر</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar - کاملاً ریسپانسیو */}
      <div className="border-t border-gray-800 bg-gray-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-right">
            <p className="text-xs text-gray-500 order-2 sm:order-1">
              © {new Date().getFullYear()} NoronTech — تمام حقوق محفوظ است.
            </p>
            <div className="flex gap-6 order-1 sm:order-2">
              <Link
                href="/privacy"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-px after:bg-gray-300 after:transition-all hover:after:w-full"
              >
                حریم خصوصی
              </Link>
              <Link
                href="/terms"
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-px after:bg-gray-300 after:transition-all hover:after:w-full"
              >
                قوانین و مقررات
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
