import Link from "next/link";
import { CheckCircle, ShoppingBag, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Card className="max-w-md w-full text-center p-8">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            سفارش شما با موفقیت ثبت شد
          </h1>

          <p className="text-gray-600 dark:text-gray-400">
            سفارش شما با موفقیت ثبت شد و در حال پردازش است. کد پیگیری سفارش برای
            شما پیامک خواهد شد.
          </p>

          <div className="pt-4 space-y-3">
            <Link href="/orders">
              <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                <ShoppingBag className="h-4 w-4" />
                مشاهده سفارشات
              </Button>
            </Link>

            <Link href="/">
              <Button variant="outline" className="w-full gap-2">
                <Home className="h-4 w-4" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
