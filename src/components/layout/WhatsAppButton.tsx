"use client";

import { MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/constants";

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_DEFAULT_MESSAGE
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 animate-[pulse-glow_2s_ease-in-out_infinite]"
      aria-label="Contactez-nous sur WhatsApp"
    >
      <MessageCircle size={28} />
      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#25D366]"></span>
      </span>
    </a>
  );
}
