"use client";

import React, { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext"; // ✅ مسیر اشتباه fix شد
import { useRouter } from "next/navigation";
import Link from "next/link";
import { showError, showSuccess, showLoginSuccess } from "../../../utils/swal";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); // ✅ حذف error state اضافه

  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showError("رمز عبور و تکرار آن مطابقت ندارند");
      return;
    }

    if (password.length < 6) {
      showError("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    setLoading(true);

    try {
      const userData = await register({ name, email, password });
      await showSuccess("ثبت‌نام با موفقیت انجام شد!");
      await showLoginSuccess(userData?.name || "کاربر");
      router.push("/");
    } catch (err: any) {
      showError(err.response?.data?.message || "خطا در ثبت‌نام");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-50 py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-md w-full space-y-8 bg-gray-300 shadow-lg rounded-md py-12 px-12 mt-20 mx-auto">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          ثبت نام در فروشگاه
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          با ثبت‌ نام می‌تونی از تمام امکانات فروشگاه استفاده کنی
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                نام و نام خانوادگی
              </label>
              <input
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="علی رضایی"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                ایمیل
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="ali@example.com"
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                رمز عبور
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="حداقل ۶ کاراکتر"
                dir="ltr"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                تکرار رمز عبور
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-600 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="دوباره رمز را وارد کنید"
                dir="ltr"
              />
            </div>

            <div>
              <button
                disabled={loading}
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" // ✅ CSS typo fix شد
              >
                {loading ? "در حال ثبت‌نام..." : "ثبت‌ نام"}
              </button>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
            >
              قبلاً ثبت‌نام کرده‌اید؟ وارد شوید
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
