import axios from "axios";

const ZARINPAL_API = "https://sandbox.zarinpal.com/pg/v4/payment";
const MERCHANT_ID = process.env.ZARINPAL_MERCHANT_ID || "";
const CALLBACK_URL =
  process.env.CALLBACK_URL || "http://localhost:3000/payment/verify";

export const requestPayment = async (
  amount: number, // تومان
  description: string,
  orderId: string,
) => {
  // ✅ حداقل مبلغ زرین‌پال ۱۰۰۰ تومان است
  if (amount < 1000) {
    throw new Error("حداقل مبلغ پرداخت ۱۰۰۰ تومان است");
  }

  const response = await axios.post(`${ZARINPAL_API}/request.json`, {
    merchant_id: MERCHANT_ID,
    amount: amount * 10, // تبدیل تومان به ریال
    description,
    callback_url: `${CALLBACK_URL}?orderId=${orderId}`,
  });

  const { code, authority } = response.data.data;

  if (code !== 100) {
    throw new Error(`خطای زرین‌پال: کد ${code}`);
  }

  return {
    authority,
    paymentUrl: `https://sandbox.zarinpal.com/pg/StartPay/${authority}`,
  };
};

export const verifyPayment = async (authority: string, amount: number) => {
  const response = await axios.post(`${ZARINPAL_API}/verify.json`, {
    merchant_id: MERCHANT_ID,
    amount: amount * 10, // تبدیل تومان به ریال
    authority,
  });

  const { code, ref_id } = response.data.data;

  // code 100 = پرداخت موفق، code 101 = قبلاً verify شده
  if (code !== 100 && code !== 101) {
    throw new Error(`پرداخت ناموفق: کد ${code}`);
  }

  return { refId: ref_id };
};
