"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function PaymentFailedPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            پرداخت ناموفق
          </h1>
          <p className="text-gray-600 mb-6">
            پرداخت شما انجام نشد. سفارش شما ذخیره شده و می‌توانید دوباره تلاش
            کنید.
          </p>

          <div className="flex flex-col gap-3">
            {orderId && (
              <Link href={`/orders/${orderId}`}>
                <Button className="w-full">تلاش مجدد برای پرداخت</Button>
              </Link>
            )}
            <Link href="/orders">
              <Button variant="outline" className="w-full">
                مشاهده سفارشات
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
