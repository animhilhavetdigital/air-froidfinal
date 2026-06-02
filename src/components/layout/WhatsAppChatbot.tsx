"use client";

import { useState } from "react";
import Image from "next/image";
import { MessageCircle, X, Send } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

export function WhatsAppChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (message: string) => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      {isOpen && (
        <div className="pointer-events-auto bg-white dark:bg-[#111827] rounded-2xl shadow-2xl w-80 mb-4 overflow-hidden border border-gray-100 dark:border-gray-800 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex justify-between items-center shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden">
                  <Image 
                    src="/images/assets/logo-clean.png" 
                    alt="Air Froid" 
                    width={40} 
                    height={40} 
                    className="object-contain" 
                  />
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#25D366] rounded-full" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Air Froid Expert</h3>
                <p className="text-xs text-green-100 font-medium">En ligne</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-white hover:text-green-100 hover:rotate-90 transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 relative min-h-[200px] bg-gray-50 dark:bg-gray-900/50">
            <div className="relative z-10 space-y-4">
              <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-3 rounded-2xl rounded-tl-sm text-sm shadow-sm inline-block max-w-[90%] border border-gray-100 dark:border-gray-700">
                Salam ! 👋 Bienvenue chez Air Froid Expert. Comment pouvons-nous vous aider aujourd'hui ?
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                <button 
                  onClick={() => handleOptionClick("Salam, je vous contacte pour demander un devis gratuit.")}
                  className="bg-white dark:bg-gray-800 text-[#10748E] dark:text-[#32A5DE] hover:bg-[#10748E] hover:text-white dark:hover:bg-[#32A5DE] dark:hover:text-white border border-[#10748E]/20 dark:border-[#32A5DE]/30 px-4 py-2.5 rounded-full text-sm font-medium transition-colors text-left flex items-center justify-between group shadow-sm"
                >
                  Je veux un devis
                  <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  onClick={() => handleOptionClick("Salam, j'aimerais avoir plus d'informations sur vos services.")}
                  className="bg-white dark:bg-gray-800 text-[#10748E] dark:text-[#32A5DE] hover:bg-[#10748E] hover:text-white dark:hover:bg-[#32A5DE] dark:hover:text-white border border-[#10748E]/20 dark:border-[#32A5DE]/30 px-4 py-2.5 rounded-full text-sm font-medium transition-colors text-left flex items-center justify-between group shadow-sm"
                >
                  Plus d'informations
                  <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button 
                  onClick={() => handleOptionClick("Salam, je vous contacte pour un problème SAV ou de maintenance.")}
                  className="bg-white dark:bg-gray-800 text-[#10748E] dark:text-[#32A5DE] hover:bg-[#10748E] hover:text-white dark:hover:bg-[#32A5DE] dark:hover:text-white border border-[#10748E]/20 dark:border-[#32A5DE]/30 px-4 py-2.5 rounded-full text-sm font-medium transition-colors text-left flex items-center justify-between group shadow-sm"
                >
                  SAV / Maintenance
                  <Send size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300 relative group"
        aria-label="Ouvrir le chat WhatsApp"
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-gray-900"></span>
          </span>
        )}
      </button>
    </div>
  );
}
