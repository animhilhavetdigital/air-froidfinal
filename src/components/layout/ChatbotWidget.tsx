"use client";

import { useState } from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chat Bubble Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-[#10748E] text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:shadow-2xl hover:bg-[#0c5a6e] transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        }`}
        aria-label="Ouvrir le chatbot MadaTalk"
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <div
        className={`absolute bottom-0 left-0 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-left ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-0 opacity-0 translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="bg-[#10748E] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <span className="font-nevan text-white tracking-wide block text-sm">MadaTalk</span>
              <span className="text-[10px] text-white/80 font-montserrat">Assistant virtuel</span>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-64 bg-gray-50 p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 bg-[#10748E] rounded-full flex items-center justify-center shrink-0 mt-1">
              <Sparkles size={14} className="text-white" />
            </div>
            <div className="bg-white text-gray-700 text-sm p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm max-w-[85%] leading-relaxed">
              Bonjour ! Je suis l'assistant virtuel d'Air Froid Expert. Comment puis-je vous aider aujourd'hui ?
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          <input
            type="text"
            placeholder="Écrivez votre message..."
            className="flex-1 bg-gray-50 text-gray-900 text-sm rounded-full px-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#10748E]/20 focus:border-[#10748E] transition-all font-montserrat placeholder-gray-400"
          />
          <button className="w-10 h-10 rounded-full bg-[#10748E] text-white flex items-center justify-center hover:bg-[#0c5a6e] transition-colors shadow-md">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
