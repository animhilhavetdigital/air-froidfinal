"use client";

import { useState } from "react";
import { Bot, X, Send } from "lucide-react";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chat Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 bg-navy-800 border border-tech-blue/30 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100 glow-blue"
        }`}
        aria-label="Ouvrir le chatbot MadaTalk"
      >
        <Bot size={28} className="text-tech-blue" />
      </button>

      {/* Chat Window Placeholder */}
      <div
        className={`absolute bottom-0 left-0 w-80 bg-navy-900 border border-tech-blue/20 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 origin-bottom-left ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-0 opacity-0 translate-y-10"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-blue-accent p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot size={24} className="text-white" />
            <span className="font-nevan text-white tracking-wide">MadaTalk</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="h-64 bg-navy-900/50 p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="bg-navy-800 text-light text-sm p-3 rounded-2xl rounded-tl-none border border-tech-blue/10 max-w-[85%]">
            Bonjour ! Je suis l'assistant virtuel d'Air Froid Expert. Comment puis-je vous aider aujourd'hui ?
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-navy-800 border-t border-tech-blue/20 flex gap-2">
          <input
            type="text"
            placeholder="Écrivez votre message..."
            className="flex-1 bg-navy-900 text-white text-sm rounded-full px-4 py-2 border border-tech-blue/30 focus:outline-none focus:border-tech-blue"
          />
          <button className="w-10 h-10 rounded-full bg-tech-blue text-white flex items-center justify-center hover:bg-tech-blue-light transition-colors">
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
