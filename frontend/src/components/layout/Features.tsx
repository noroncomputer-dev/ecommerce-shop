"use client";

import {
  Truck,
  Shield,
  Headphones,
  Star,
  CreditCard,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: "ارسال سریع",
    description: "ارسال به سراسر کشور در کمتر از ۳ روز کاری",
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "ضمانت بازگشت",
    description: "۷ روز ضمانت بازگشت کالا برای خریدهای اینترنتی",
    color: "from-green-500 to-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: "پشتیبانی ۲۴/۷",
    description: "پشتیبانی آنلاین در تمام ساعات شبانه‌روز",
    color: "from-purple-500 to-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "محصولات اصل",
    description: "ضمانت اصالت کالا و بهترین کیفیت",
    color: "from-yellow-500 to-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "text-yellow-600 dark:text-yellow-400",
  },
  {
    icon: <CreditCard className="h-8 w-8" />,
    title: "پرداخت امن",
    description: "پرداخت آنلاین با امنیت بالا و درگاه‌های معتبر",
    color: "from-red-500 to-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/30",
    iconColor: "text-red-600 dark:text-red-400",
  },
  {
    icon: <RefreshCw className="h-8 w-8" />,
    title: "تعویض آسان",
    description: "امکان تعویض کالا در صورت نارضایتی",
    color: "from-indigo-500 to-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/30",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
];

export default function Features() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          چرا ما را انتخاب می‌کنید؟
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ما بهترین خدمات را با بالاترین کیفیت به شما ارائه می‌دهیم
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="group border-none shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-gray-800"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* آیکون با پس‌زمینه */}
                <div
                  className={`relative ${feature.bgColor} rounded-2xl p-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className={`${feature.iconColor}`}>{feature.icon}</div>

                  {/* افکت نور هنگام هاور */}
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />
                </div>

                {/* متن */}
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* خط تزئینی پایین */}
              <div
                className={`mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r ${feature.color} rounded-full transition-all duration-500`}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
