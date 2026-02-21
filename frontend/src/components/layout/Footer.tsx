import Link from "next/link";
import { Instagram, Send, Phone, Mail, MapPin } from "lucide-react";

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
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-auto">

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-black text-white mb-4 block">
              Noron<span className="text-blue-500">Tech</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              فروشگاه تخصصی کامپیوتر و لوازم جانبی با بیش از ۱۰ سال تجربه در ارائه بهترین محصولات با ضمانت اصالت.
            </p>

            {/* Social */}
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: "#", label: "اینستاگرام" },
                { icon: Send, href: "#", label: "تلگرام" },
              ].map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label}
                  className="w-9 h-9 bg-gray-800 dark:bg-gray-900 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors duration-300">
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-white font-bold mb-5">فروشگاه</h4>
            <ul className="space-y-3">
              {links.shop.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h4 className="text-white font-bold mb-5">حساب کاربری</h4>
            <ul className="space-y-3">
              {links.account.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-5">تماس با ما</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">تلفن پشتیبانی</p>
                  <a href="tel:02100000000" className="text-sm text-gray-300 hover:text-white transition-colors">
                    ۰۲۱-۰۰۰۰۰۰۰۰
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">ایمیل</p>
                  <a href="mailto:info@norontech.ir" className="text-sm text-gray-300 hover:text-white transition-colors">
                    info@norontech.ir
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">آدرس</p>
                  <p className="text-sm text-gray-300">تهران، خیابان ولیعصر</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 dark:border-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NoronTech — تمام حقوق محفوظ است.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              حریم خصوصی
            </Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              قوانین و مقررات
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}