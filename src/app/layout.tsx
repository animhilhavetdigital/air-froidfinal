import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { ChatbotWidget } from "@/components/layout/ChatbotWidget";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { CartProvider } from "@/lib/CartContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { SmoothScroll } from "@/components/SmoothScroll";

// Google Font fallback since we don't have all weights of Montserrat locally
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Local Font for Nevan
const nevan = localFont({
  src: "./fonts/NevanRUS.ttf",
  variable: "--font-nevan",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${montserrat.variable} ${nevan.variable}`} suppressHydrationWarning>
      <body className="min-h-full font-montserrat bg-white text-gray-900 antialiased selection:bg-primary selection:text-white" suppressHydrationWarning>
        <CartProvider>
          <SmoothScroll>
            <ScrollToTop />
            <Navbar />
            <main className="flex-1 block pt-[114px] lg:pt-[100px]">
              {/* Padding top accounts for fixed header heights */}
              {children}
            </main>
            <Footer />
            <WhatsAppButton />
            <ChatbotWidget />
          </SmoothScroll>
        </CartProvider>
      </body>
    </html>
  );
}
