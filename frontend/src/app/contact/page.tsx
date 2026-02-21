"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { showSuccess, showError } from "@/utils/swal";
import messageService from "@/services/messageService";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await messageService.sendMessage(formData);
      showSuccess("پیام شما با موفقیت ارسال شد");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error: any) {
      showError(error.response?.data?.message || "خطا در ارسال پیام");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* هدر */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Mail className="h-16 w-16 mx-auto mb-4 opacity-80" />
          <h1 className="text-4xl md:text-5xl font-black mb-4">تماس با ما</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            با ما در ارتباط باشید
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {/* اطلاعات تماس */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">تلفن پشتیبانی</p>
                    <p className="font-bold">۰۲۱-۱۲۳۴۵۶۷۸</p>
                    <p className="font-bold">۰۹۱۲-۳۴۵۶۷۸۹</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-green-600">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ایمیل</p>
                    <p className="font-bold">info@shop.com</p>
                    <p className="font-bold">support@shop.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center text-purple-600">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">آدرس</p>
                    <p className="font-bold">تهران، خیابان ولیعصر</p>
                    <p className="font-bold">پلاک ۱۲۳۴</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center text-orange-600">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ساعات کاری</p>
                    <p className="font-bold">شنبه تا پنجشنبه ۹-۲۱</p>
                    <p className="font-bold">جمعه ۱۰-۱۸</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* فرم تماس */}
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6">ارسال پیام</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>نام و نام خانوادگی *</Label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>ایمیل *</Label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>تلفن (اختیاری)</Label>
                      <Input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>موضوع *</Label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>پیام *</Label>
                    <Textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Send className="h-5 w-5 ml-2" />
                        ارسال پیام
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
