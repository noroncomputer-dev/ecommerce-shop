"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import aboutService, { AboutInfo } from "@/services/aboutService";
import teamService, { TeamMember } from "@/services/teamService";
import statsService, { Stats } from "@/services/statsService";
import {
  Award,
  Users,
  ShoppingBag,
  Headphones,
  Truck,
  Shield,
  Star,
  Heart,
  Target,
  Eye,
  Zap,
  Globe,
  Mail,
  Phone,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [aboutData, teamData, statsData] = await Promise.all([
        aboutService.getAboutInfo(),
        teamService.getTeam(true), // true = فقط اعضای فعال
        statsService.getStats(),
      ]);

      setAbout(aboutData);
      setTeam(teamData); // <-- اینجا تیم ست میشه
      setStats(statsData);
    } catch (error) {
      console.error("Error loading about page:", error);
      setError("خطا در بارگذاری اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !about) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "اطلاعاتی یافت نشد"}</p>
          <Button onClick={loadData}>تلاش مجدد</Button>
        </div>
      </div>
    );
  }

  // استفاده از اطلاعات واقعی
  const displayStats = [
    {
      icon: <ShoppingBag className="h-6 w-6" />,
      value:
        stats?.products?.toLocaleString() + "+" ||
        about.stats.products.toLocaleString() + "+",
      label: "محصول",
    },
    {
      icon: <Users className="h-6 w-6" />,
      value:
        stats?.users?.toLocaleString() + "+" ||
        about.stats.customers.toLocaleString() + "+",
      label: "مشتری راضی",
    },
    {
      icon: <Award className="h-6 w-6" />,
      value: about.stats.experience.toString(),
      label: "سال تجربه",
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      value: about.stats.support,
      label: "پشتیبانی",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* هدر اصلی با تصویر پس‌زمینه */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg
            className="absolute bottom-0 left-0 w-full"
            viewBox="0 0 1440 320"
            fill="white"
          >
            <path d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,170.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-24 text-center">
          <Badge className="bg-white/20 text-white border-none mb-4">
            <Heart className="h-3 w-3 ml-1" />
            درباره ما
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            {about.title || "داستان ما، تعهد ما"}
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            {about.description}
          </p>
        </div>
      </div>

      {/* آمار */}
      <div className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {displayStats.map((stat, index) => (
            <Card
              key={index}
              className="text-center p-6 shadow-xl border-0 dark:bg-gray-800"
            >
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* داستان ما */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-none">
              داستان ما
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {about.mission || "از یک ایده ساده تا یک فروشگاه بزرگ"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              {about.history}
            </p>
            <div className="flex gap-4">
              <Link href="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Mail className="h-4 w-4 ml-2" />
                  تماس با ما
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline">
                  محصولات ما
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl">
            <img
              src="/images/about/office.jpg"
              alt="دفتر کار ما"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-sm opacity-90">تیم حرفه‌ای ما</p>
              <p className="text-2xl font-bold">همراه شما در هر لحظه</p>
            </div>
          </div>
        </div>
      </div>

      {/* ارزش‌های ما - ثابت */}
      <div className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-none mb-4">
              ارزش‌های ما
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              چه چیزی ما را متفاوت می‌کند؟
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {about.vision || "اصولی که همیشه به آنها پایبند بوده‌ایم"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 dark:bg-gray-800"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* تیم ما - از بک‌اند */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-none mb-4">
            تیم ما
          </Badge>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            متخصصانی که به آنها اعتماد دارید
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            تیمی از بهترین‌ها در کنار شما هستند
          </p>
        </div>

        <div className="grid md:grid-cols-3 justify-center item-center gap-8">
          {team.length > 0 ? (
            team.map((member) => (
              <Card
                key={member._id}
                className="overflow-hidden w-90  group dark:bg-gray-800"
              >
                <div className="relative w-full h-100  bg-gray-200 dark:bg-gray-700">
                  <img
                    src={member.avatar || "/images/team/placeholder.jpg"}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-3">
                    {member.position}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              اطلاعاتی برای نمایش وجود ندارد
            </p>
          )}
        </div>
      </div>

      {/* اطلاعات تماس - از بک‌اند */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">تلفن پشتیبانی</h3>
              {about.contact.phone.map((phone, index) => (
                <p key={index} className="opacity-90">
                  {phone}
                </p>
              ))}
            </div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                <Mail className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">ایمیل</h3>
              {about.contact.email.map((email, index) => (
                <p key={index} className="opacity-90">
                  {email}
                </p>
              ))}
            </div>

            <div className="space-y-3">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto">
                <MapPin className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold">آدرس</h3>
              <p className="opacity-90">{about.contact.address}</p>
            </div>
          </div>

          <Separator className="my-12 bg-white/20" />

          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">ساعات کاری</h3>
            <div className="flex items-center justify-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              <span>{about.contact.hours}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// مقادیر ثابت (میتونی بعداً به بک‌اند منتقل کنی)
const values = [
  {
    icon: <Heart className="h-8 w-8" />,
    title: "مشتری مداری",
    description:
      "رضایت مشتری اولویت اول ماست و تمام تلاش خود را برای جلب رضایت شما انجام می‌دهیم.",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "اصالت کالا",
    description:
      "تمامی محصولات ما اصل بوده و با ضمانت بازگشت کالا عرضه می‌شوند.",
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "ارسال سریع",
    description:
      "سفارشات شما در سریع‌ترین زمان ممکن به سراسر کشور ارسال می‌شود.",
  },
  {
    icon: <Star className="h-8 w-8" />,
    title: "کیفیت برتر",
    description:
      "ما تنها محصولاتی را عرضه می‌کنیم که خودمان به کیفیت آنها اطمینان داریم.",
  },
  {
    icon: <Target className="h-8 w-8" />,
    title: "هدف‌گذاری دقیق",
    description:
      "هدف ما ارائه بهترین خدمات و محصولات با بالاترین استانداردهای روز دنیاست.",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "نوآوری مداوم",
    description:
      "همواره در تلاشیم تا با جدیدترین تکنولوژی‌ها و متدهای روز، خدمات خود را بهبود بخشیم.",
  },
];
