"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentVerifyPage() {
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

    window.location.href = `http://localhost:5001/api/payment/verify?Authority=${Authority}&Status=${Status}&orderId=${orderId}`;
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <p>⏳ در حال تأیید پرداخت، لطفاً صبر کنید...</p>
    </div>
  );
}
