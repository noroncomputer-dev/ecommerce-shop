"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import aboutService, { AboutInfo } from "@/services/aboutService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  Save,
  Plus,
  X,
  Loader2,
  Building2,
  Target,
  Eye,
  History,
  BarChart3,
  Phone,
  Mail,
  MapPin,
  Clock,
  Globe,
  Instagram,
  Send,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import { showSuccess, showError } from "@/utils/swal";

export default function AdminAboutPage() {
  const router = useRouter();
  const [about, setAbout] = useState<AboutInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("main");

  useEffect(() => {
    loadAbout();
  }, []);

  const loadAbout = async () => {
    try {
      const data = await aboutService.getAboutInfo();
      setAbout(data);
    } catch (error) {
      console.error("Error loading about:", error);
      showError("خطا در بارگذاری اطلاعات");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!about) return;

    setSaving(true);
    try {
      await aboutService.updateAboutInfo(about);
      showSuccess("اطلاعات با موفقیت ذخیره شد");
    } catch (error) {
      showError("خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  const handleAddPhone = () => {
    setAbout((prev) =>
      prev
        ? {
            ...prev,
            contact: {
              ...prev.contact,
              phone: [...prev.contact.phone, ""],
            },
          }
        : null,
    );
  };

  const handleRemovePhone = (index: number) => {
    setAbout((prev) =>
      prev
        ? {
            ...prev,
            contact: {
              ...prev.contact,
              phone: prev.contact.phone.filter((_, i) => i !== index),
            },
          }
        : null,
    );
  };

  const handleAddEmail = () => {
    setAbout((prev) =>
      prev
        ? {
            ...prev,
            contact: {
              ...prev.contact,
              email: [...prev.contact.email, ""],
            },
          }
        : null,
    );
  };

  const handleRemoveEmail = (index: number) => {
    setAbout((prev) =>
      prev
        ? {
            ...prev,
            contact: {
              ...prev.contact,
              email: prev.contact.email.filter((_, i) => i !== index),
            },
          }
        : null,
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!about) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-bold mb-2">اطلاعاتی یافت نشد</h3>
        <Button onClick={loadAbout}>تلاش مجدد</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* هدر */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
          مدیریت درباره ما
        </h1>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 ml-2 animate-spin" />
              در حال ذخیره...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 ml-2" />
              ذخیره تغییرات
            </>
          )}
        </Button>
      </div>

      {/* تب‌ها */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger
            value="main"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Building2 className="h-4 w-4 ml-2" />
            اصلی
          </TabsTrigger>
          <TabsTrigger
            value="mission"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Target className="h-4 w-4 ml-2" />
            ماموریت
          </TabsTrigger>
          <TabsTrigger
            value="vision"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Eye className="h-4 w-4 ml-2" />
            چشم‌انداز
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <History className="h-4 w-4 ml-2" />
            تاریخچه
          </TabsTrigger>
          <TabsTrigger
            value="stats"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <BarChart3 className="h-4 w-4 ml-2" />
            آمار
          </TabsTrigger>
          <TabsTrigger
            value="contact"
            className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
          >
            <Phone className="h-4 w-4 ml-2" />
            تماس
          </TabsTrigger>
        </TabsList>

        {/* تب اصلی */}
        <TabsContent value="main" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات اصلی فروشگاه</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>عنوان فروشگاه</Label>
                <Input
                  value={about.title}
                  onChange={(e) =>
                    setAbout({ ...about, title: e.target.value })
                  }
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label>توضیحات کوتاه</Label>
                <Textarea
                  value={about.description}
                  onChange={(e) =>
                    setAbout({ ...about, description: e.target.value })
                  }
                  rows={4}
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تب ماموریت */}
        <TabsContent value="mission" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>ماموریت فروشگاه</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={about.mission}
                onChange={(e) =>
                  setAbout({ ...about, mission: e.target.value })
                }
                rows={6}
                className="bg-white dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* تب چشم‌انداز */}
        <TabsContent value="vision" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>چشم‌انداز فروشگاه</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={about.vision}
                onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                rows={6}
                className="bg-white dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* تب تاریخچه */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>تاریخچه فروشگاه</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={about.history}
                onChange={(e) =>
                  setAbout({ ...about, history: e.target.value })
                }
                rows={8}
                className="bg-white dark:bg-gray-800"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* تب آمار */}
        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>آمار فروشگاه</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>تعداد محصولات</Label>
                <Input
                  type="number"
                  value={about.stats.products}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      stats: {
                        ...about.stats,
                        products: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label>تعداد مشتریان</Label>
                <Input
                  type="number"
                  value={about.stats.customers}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      stats: {
                        ...about.stats,
                        customers: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label>سال تجربه</Label>
                <Input
                  type="number"
                  value={about.stats.experience}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      stats: {
                        ...about.stats,
                        experience: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              <div className="space-y-2">
                <Label>پشتیبانی</Label>
                <Input
                  value={about.stats.support}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      stats: { ...about.stats, support: e.target.value },
                    })
                  }
                  className="bg-white dark:bg-gray-800"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* تب تماس */}
        <TabsContent value="contact" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>اطلاعات تماس</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* تلفن‌ها */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    شماره تلفن‌ها
                  </Label>
                  <Button variant="outline" size="sm" onClick={handleAddPhone}>
                    <Plus className="h-4 w-4 ml-1" />
                    افزودن
                  </Button>
                </div>
                {about.contact.phone.map((phone, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...about.contact.phone];
                        newPhones[index] = e.target.value;
                        setAbout({
                          ...about,
                          contact: { ...about.contact, phone: newPhones },
                        });
                      }}
                      placeholder="شماره تلفن"
                      className="bg-white dark:bg-gray-800"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemovePhone(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* ایمیل‌ها */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    ایمیل‌ها
                  </Label>
                  <Button variant="outline" size="sm" onClick={handleAddEmail}>
                    <Plus className="h-4 w-4 ml-1" />
                    افزودن
                  </Button>
                </div>
                {about.contact.email.map((email, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...about.contact.email];
                        newEmails[index] = e.target.value;
                        setAbout({
                          ...about,
                          contact: { ...about.contact, email: newEmails },
                        });
                      }}
                      placeholder="ایمیل"
                      dir="ltr"
                      className="bg-white dark:bg-gray-800"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEmail(index)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* آدرس */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  آدرس
                </Label>
                <Input
                  value={about.contact.address}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      contact: { ...about.contact, address: e.target.value },
                    })
                  }
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              {/* ساعات کاری */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  ساعات کاری
                </Label>
                <Input
                  value={about.contact.hours}
                  onChange={(e) =>
                    setAbout({
                      ...about,
                      contact: { ...about.contact, hours: e.target.value },
                    })
                  }
                  className="bg-white dark:bg-gray-800"
                />
              </div>

              {/* شبکه‌های اجتماعی */}
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  شبکه‌های اجتماعی
                </Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-600" />
                    <Input
                      placeholder="اینستاگرام"
                      value={about.socialMedia?.instagram || ""}
                      onChange={(e) =>
                        setAbout({
                          ...about,
                          socialMedia: {
                            ...about.socialMedia,
                            instagram: e.target.value,
                          },
                        })
                      }
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-500" />
                    <Input
                      placeholder="تلگرام"
                      value={about.socialMedia?.telegram || ""}
                      onChange={(e) =>
                        setAbout({
                          ...about,
                          socialMedia: {
                            ...about.socialMedia,
                            telegram: e.target.value,
                          },
                        })
                      }
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Twitter className="h-5 w-5 text-sky-500" />
                    <Input
                      placeholder="توییتر"
                      value={about.socialMedia?.twitter || ""}
                      onChange={(e) =>
                        setAbout({
                          ...about,
                          socialMedia: {
                            ...about.socialMedia,
                            twitter: e.target.value,
                          },
                        })
                      }
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Linkedin className="h-5 w-5 text-blue-700" />
                    <Input
                      placeholder="لینکدین"
                      value={about.socialMedia?.linkedin || ""}
                      onChange={(e) =>
                        setAbout({
                          ...about,
                          socialMedia: {
                            ...about.socialMedia,
                            linkedin: e.target.value,
                          },
                        })
                      }
                      className="bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
