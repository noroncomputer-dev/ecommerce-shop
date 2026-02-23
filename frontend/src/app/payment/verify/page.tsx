"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

function PaymentVerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const Authority = searchParams.get("Authority");
    const Status = searchParams.get("Status");
    const orderId = searchParams.get("orderId");

    if (!Authority || !orderId) {
      router.push("/payment/failed");
      return;
    }

    // ✅ از env variable استفاده میکنه
    window.location.href = `${API_BASE}/payment/verify?Authority=${Authority}&Status=${Status}&orderId=${orderId}`;
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-600 dark:text-gray-300">
          ⏳ در حال تأیید پرداخت، لطفاً صبر کنید...
        </p>
      </div>
    </div>
  );
}

export default function PaymentVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-600">⏳ در حال تأیید پرداخت...</p>
          </div>
        </div>
      }
    >
      <PaymentVerifyContent />
    </Suspense>
  );
}
