import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { CartProvider } from "@/lib/CartContext";
import { SmoothScroll } from "@/components/SmoothScroll";
import { LayoutShell } from "@/components/layout/LayoutShell";
import { SplashScreen } from "@/components/layout/SplashScreen";
import { ThemeProvider } from "@/components/ThemeProvider";

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
      <body className="min-h-full font-montserrat antialiased selection:bg-primary selection:text-white transition-colors duration-300" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <SplashScreen />
          <CartProvider>
            <SmoothScroll>
              <LayoutShell>
                {children}
              </LayoutShell>
            </SmoothScroll>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
