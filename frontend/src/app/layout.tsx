import { Vazirmatn } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import Navbar from "../components/layout/Navbar";
import "./globals.css";
import Footer from "@/components/layout/Footer";
import { Providers } from "./providers";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="h-full" suppressHydrationWarning>
      <head>
        {/* جلوگیری از کش شدن صفحات */}
        <meta
          httpEquiv="Cache-Control"
          content="no-cache, no-store, must-revalidate"
        />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body
        className={`${vazirmatn.className} h-full bg-white dark:bg-gray-950 transition-colors duration-300`}
      >
        <Providers>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-full flex flex-col">
                <Navbar />
                {children}
                <Footer />
              </div>
            </CartProvider>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
