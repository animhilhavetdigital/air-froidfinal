"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppChatbot } from "@/components/layout/WhatsAppChatbot";
import { ChatbotWidget } from "@/components/layout/ChatbotWidget";

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/b2b/dashboard");
  const isB2BLogin = pathname === "/b2b";
  const isPresentation = pathname === "/presentation";
  const isHome = pathname === "/";
  const noPadding = isB2BLogin || isPresentation || isHome;

  if (isDashboard) {
    return (
      <main className="flex-1 block">
        {children}
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className={`flex-1 block ${noPadding ? '' : 'pt-[114px] lg:pt-[100px]'}`}>
        {children}
      </main>
      <Footer />
      <WhatsAppChatbot />
      <ChatbotWidget />
    </>
  );
}
