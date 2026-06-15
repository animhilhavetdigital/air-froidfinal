"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Send, 
  Search, 
  CheckCheck, 
  Building2, 
  User, 
  Clock, 
  MessageSquare 
} from "lucide-react";

// Mock conversations
const INITIAL_THREADS = [
  {
    id: 1,
    name: "Société Al Boustane",
    subtitle: "Yassine Boustane",
    avatar: "S",
    unread: 2,
    messages: [
      { sender: "client", text: "Bonjour, j'ai soumis nos documents pour la validation de notre compte B2B.", time: "10:30" },
      { sender: "client", text: "Est-ce qu'il vous manque des pièces comme la patente ou le RC ?", time: "10:32" }
    ]
  },
  {
    id: 2,
    name: "Hôtel Royal Atlas",
    subtitle: "Mohamed Alami",
    avatar: "H",
    unread: 0,
    messages: [
      { sender: "client", text: "Bonjour Youssef, avez-vous pu finaliser l'étude thermique de l'aile Nord ?", time: "Hier, 14:15" },
      { sender: "me", text: "Bonjour Mohamed, oui notre bureau d'études y travaille. Je vous envoie le devis demain matin sans faute.", time: "Hier, 15:30" },
      { sender: "client", text: "Parfait, merci pour votre réactivité.", time: "Hier, 15:45" }
    ]
  },
  {
    id: 3,
    name: "Bureau d'Études Air Froid",
    subtitle: "Sara Belghiti",
    avatar: "B",
    unread: 0,
    messages: [
      { sender: "me", text: "Sara, peux-tu valider le dimensionnement de la PAC pour le projet Villa Palmeraie ?", time: "12 Juin, 11:20" },
      { sender: "client", text: "Oui c'est tout bon. Puissance de 16kW recommandée. J'ai déposé la fiche dans le dossier.", time: "12 Juin, 11:45" }
    ]
  }
];

export default function MessagerieInternePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [threads, setThreads] = useState(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputMessage, setInputMessage] = useState("");

  useGSAP(() => {
    gsap.fromTo(".msg-item",
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const activeThread = threads.find(t => t.id === activeThreadId) || threads[0];

  useEffect(() => {
    // Clear unread count when opening a thread
    setThreads(prev => prev.map(t => t.id === activeThreadId ? { ...t, unread: 0 } : t));
  }, [activeThreadId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      sender: "me",
      text: inputMessage.trim(),
      time: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    };

    setThreads(prev => prev.map(t => {
      if (t.id === activeThreadId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));

    setInputMessage("");
  };

  const filteredThreads = threads.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-6 h-[calc(100vh-80px)] md:h-screen">
      
      {/* Header */}
      <div className="msg-item shrink-0">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-1 flex items-center gap-3">
          <MessageSquare className="text-[#10748E]" size={32} /> Messagerie Interne
        </h1>
        <p className="font-montserrat text-gray-500 text-sm">Échangez en temps réel avec vos clients pro et collaborateurs.</p>
      </div>

      {/* Main Messaging Container */}
      <div className="msg-item flex-1 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row h-full">
        
        {/* Left Side: Threads List */}
        <aside className="w-full md:w-80 border-r border-gray-100 flex flex-col shrink-0">
          
          {/* Search bar */}
          <div className="p-4 border-b border-gray-100">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher un fil..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
              />
            </div>
          </div>

          {/* Threads scrolling container */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              return (
                <div 
                  key={thread.id} 
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeThreadId === thread.id ? "bg-[#10748E]/5" : "hover:bg-gray-50/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#10748E] font-nevan flex items-center justify-center shrink-0 border border-gray-200 uppercase">
                    {thread.avatar}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-montserrat font-bold text-gray-900 text-sm truncate">{thread.name}</h4>
                      <span className="font-montserrat text-[10px] text-gray-400 shrink-0">{lastMsg?.time}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="font-montserrat text-xs text-gray-500 truncate">{lastMsg?.text}</p>
                      {thread.unread > 0 && (
                        <span className="bg-[#AF1818] text-white font-montserrat text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                          {thread.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </aside>

        {/* Right Side: Chat Window */}
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50/50">
          {activeThread ? (
            <>
              {/* Chat Window Header */}
              <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#10748E] text-white font-nevan flex items-center justify-center font-bold">
                    {activeThread.avatar}
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-gray-900 text-sm leading-tight">{activeThread.name}</h3>
                    <span className="font-montserrat text-xs text-gray-500 mt-0.5 inline-block">{activeThread.subtitle}</span>
                  </div>
                </div>
              </div>

              {/* Chat Bubbles scrollarea */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 flex flex-col justify-end">
                {activeThread.messages.map((msg, index) => {
                  const isMe = msg.sender === "me";
                  return (
                    <div 
                      key={index} 
                      className={`flex flex-col max-w-[75%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div className={`p-3.5 rounded-2xl font-montserrat text-sm leading-relaxed ${
                        isMe 
                          ? "bg-[#10748E] text-white rounded-br-none" 
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm"
                      }`}>
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-montserrat px-1">
                        <Clock size={10} />
                        {msg.time}
                        {isMe && <CheckCheck size={12} className="text-[#10748E]" />}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Typing Input bar */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Écrire votre message ici..."
                  className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                />
                <button type="submit" className="p-3 bg-[#10748E] text-white rounded-xl hover:bg-[#0c5a6e] transition-colors shrink-0 flex items-center justify-center">
                  <Send size={18} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-gray-400 font-montserrat">
              <MessageSquare size={48} className="mb-4" />
              Sélectionnez un fil de discussion pour démarrer la messagerie.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
