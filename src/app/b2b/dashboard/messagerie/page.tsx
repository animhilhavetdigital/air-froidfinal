"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { gsap } from "@/lib/gsap";
import { Send, Search, CheckCheck, MessageSquare, Plus, X, Shield, UserCheck, ArrowLeft } from "lucide-react";
import { getThreads, saveThreads, createThread, addMessage, createNotification, Thread, ThreadMessage, COMMERCIALS } from "@/lib/messaging";

type CurrentUser = {
  role: "super_admin" | "commercial" | "client_b2b";
  name: string;
  id: string;
  company?: string;
};

export default function MessagerieInternePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activeThreadId, setActiveThreadId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [showNewThreadModal, setShowNewThreadModal] = useState(false);
  const [availableClients, setAvailableClients] = useState<{ id: string; company: string; contact: string; resp?: string; addedBy?: string }[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<CurrentUser>({ role: "client_b2b", name: "Client", id: "" });
  const [selectedCommercial, setSelectedCommercial] = useState<string>("commercial-youssef");
  const [loaded, setLoaded] = useState(false);
  // Super Admin view filters
  const [superAdminView, setSuperAdminView] = useState<"all" | "mine">("all");
  const [superAdminCommercialFilter, setSuperAdminCommercialFilter] = useState<string>("all");
  const [mobileShowChat, setMobileShowChat] = useState(false);

  useEffect(() => {
    if (!loaded || !containerRef.current) return;
    const items = containerRef.current.querySelectorAll(".msg-item");
    if (items.length === 0) return;
    gsap.fromTo(items,
      { opacity: 0, y: 15 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" }
    );
  }, [loaded]);

  // Load current user and threads
  useEffect(() => {
    const role = (localStorage.getItem("afe_mock_role") || "client_b2b") as CurrentUser["role"];
    let user: CurrentUser = { role, name: "Client", id: "" };

    if (role === "super_admin") {
      user = { role, name: "Mada Admin", id: "super-admin" };
    } else if (role === "commercial") {
      user = { role, name: "Youssef", id: "commercial-youssef" };
    } else {
      const currentClientId = localStorage.getItem("afe_current_client_id");
      const savedClients = localStorage.getItem("afe_clients");
      if (savedClients) {
        try {
          const clients = JSON.parse(savedClients);
          const client = currentClientId
            ? clients.find((c: any) => c.id === currentClientId)
            : clients[0];
          if (client) {
            user = { role, name: client.contact, id: client.id, company: client.company };
          }
        } catch {
          // ignore
        }
      }
    }

    setCurrentUser(user);

    // Load threads from localStorage
    const allThreads = getThreads();

    // Filter threads by role
    let visibleThreads: Thread[] = allThreads;
    if (role === "commercial") {
      visibleThreads = allThreads.filter((t) => t.commercialId === user.id);
    } else if (role === "client_b2b") {
      visibleThreads = allThreads.filter((t) => t.clientId === user.id);
    }

    setThreads(visibleThreads);
    if (visibleThreads.length > 0 && !activeThreadId) {
      setActiveThreadId(visibleThreads[0].id);
    }
    setLoaded(true);
  }, []);

  // Save threads whenever local state changes (only after initial load)
  useEffect(() => {
    if (!loaded) return;
    // Merge visible threads back into all threads
    const allThreads = getThreads();
    const otherThreads = allThreads.filter((t) => !threads.some((vt) => vt.id === t.id));
    saveThreads([...otherThreads, ...threads]);
  }, [threads, loaded]);

  // Scroll to bottom when active thread changes or messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThreadId, threads]);

  // Load available clients for new thread modal
  useEffect(() => {
    const saved = localStorage.getItem("afe_clients");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const mapped = parsed.map((c: any) => ({
          id: c.id,
          company: c.company,
          contact: c.contact,
          resp: c.resp,
          addedBy: c.addedBy,
        }));

        if (currentUser.role === "super_admin") {
          setAvailableClients(mapped);
        } else if (currentUser.role === "commercial") {
          setAvailableClients(
            mapped.filter(
              (c: any) =>
                c.resp === currentUser.name ||
                c.resp === "Non assigné" ||
                (c.addedBy && c.addedBy.startsWith("Commercial"))
            )
          );
        } else {
          setAvailableClients([]);
        }
      } catch {
        setAvailableClients([]);
      }
    }
  }, [showNewThreadModal, currentUser]);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputMessage.trim() || !activeThread) return;

    let newMsg: ThreadMessage;
    const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    if (currentUser.role === "super_admin") {
      // Super Admin always replies on behalf of the assigned commercial
      newMsg = {
        id: `m-${Date.now()}`,
        text: inputMessage.trim(),
        time,
        realSender: "super_admin",
        displayAs: "commercial",
        senderName: activeThread.commercialName,
      };
    } else if (currentUser.role === "commercial") {
      newMsg = {
        id: `m-${Date.now()}`,
        text: inputMessage.trim(),
        time,
        realSender: "commercial",
        displayAs: "commercial",
        senderName: currentUser.name,
      };
    } else {
      newMsg = {
        id: `m-${Date.now()}`,
        text: inputMessage.trim(),
        time,
        realSender: "client",
        displayAs: "client",
        senderName: currentUser.name,
      };
    }

    setThreads((prev) => addMessage(prev, activeThread.id, newMsg));
    setInputMessage("");

    // Create notification for the other party
    const isClientMessage = newMsg.displayAs === "client";
    const title = isClientMessage
      ? `Nouveau message de ${activeThread.clientName}`
      : `Nouveau message de ${activeThread.commercialName}`;
    const desc = newMsg.text.length > 60 ? newMsg.text.slice(0, 60) + "..." : newMsg.text;

    if (isClientMessage) {
      // Notify commercial
      createNotification(title, desc, "commercial", "messagerie", "/b2b/dashboard/messagerie");
    } else {
      // Notify client
      createNotification(title, desc, "client_b2b", "messagerie", "/b2b/dashboard/messagerie");
    }
  };

  const filteredThreads = useMemo(() => {
    let result = threads.filter((t) =>
      (t.clientCompany || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.commercialName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (currentUser.role === "super_admin") {
      if (superAdminView === "mine") {
        result = result.filter((t) => t.messages.some((m) => m.realSender === "super_admin"));
      }
      if (superAdminCommercialFilter !== "all") {
        result = result.filter((t) => t.commercialId === superAdminCommercialFilter);
      }
    }

    return result;
  }, [threads, searchTerm, currentUser.role, superAdminView, superAdminCommercialFilter]);

  const filteredClients = availableClients.filter((c) =>
    c.company.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.contact.toLowerCase().includes(clientSearchTerm.toLowerCase())
  );

  const canStartNewThread = currentUser.role === "super_admin" || currentUser.role === "commercial";

  const handleStartNewThread = (client: { id: string; company: string; contact: string }) => {
    const allThreads = getThreads();
    const existing = allThreads.find((t) => t.clientId === client.id);
    if (existing) {
      // Ensure it's visible for current user
      const visible = currentUser.role === "super_admin" ||
        (currentUser.role === "commercial" && existing.commercialId === currentUser.id) ||
        (currentUser.role === "client_b2b" && existing.clientId === currentUser.id);
      if (visible) {
        setActiveThreadId(existing.id);
      } else {
        // Make visible by updating commercialId if needed
        const updatedExisting = { ...existing, commercialId: currentUser.id, commercialName: currentUser.name };
        const updatedAll = allThreads.map((t) => (t.id === existing.id ? updatedExisting : t));
        saveThreads(updatedAll);
        setThreads((prev) => {
          const exists = prev.find((t) => t.id === updatedExisting.id);
          return exists ? prev.map((t) => (t.id === updatedExisting.id ? updatedExisting : t)) : [updatedExisting, ...prev];
        });
        setActiveThreadId(updatedExisting.id);
      }
      setShowNewThreadModal(false);
      return;
    }

    const commercialId = currentUser.role === "super_admin" ? (selectedCommercial || "commercial-youssef") : currentUser.id;
    const commercialName = COMMERCIALS.find((c) => c.id === commercialId)?.name || "Youssef";
    const newThread = createThread(client.id, client.contact, client.company, commercialId, commercialName);

    setThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setShowNewThreadModal(false);
    setClientSearchTerm("");
  };

  const getBubbleSide = (msg: ThreadMessage) => {
    if (currentUser.role === "super_admin") {
      return msg.realSender !== "client" ? "right" : "left";
    }
    if (currentUser.role === "commercial") {
      return msg.realSender === "client" ? "left" : "right";
    }
    return msg.displayAs === "client" ? "right" : "left";
  };

  const getBubbleStyle = (msg: ThreadMessage) => {
    const side = getBubbleSide(msg);
    if (side === "left") {
      return "bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm";
    }
    // Right side
    if (currentUser.role === "commercial" && msg.realSender === "super_admin") {
      return "bg-amber-100 text-amber-900 rounded-br-none border border-amber-200";
    }
    return "bg-[#10748E] text-white rounded-br-none";
  };

  const getSenderLabel = (msg: ThreadMessage) => {
    if (currentUser.role === "super_admin") {
      return msg.realSender === "super_admin" ? "Vous (Super Admin)" : msg.senderName;
    }
    if (currentUser.role === "commercial") {
      if (msg.realSender === "super_admin") return `${msg.senderName} (Super Admin)`;
      return msg.senderName;
    }
    return msg.displayAs === "client" ? "Vous" : msg.senderName;
  };

  if (!loaded) {
    return (
      <div className="p-6 md:p-10 max-w-7xl mx-auto flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="text-gray-400 font-montserrat">Chargement...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="p-3 md:p-10 max-w-7xl mx-auto flex flex-col gap-6 h-[calc(100vh-64px)] md:h-screen">
      {/* Header */}
      <div className="msg-item shrink-0">
        <h1 className="font-nevan text-2xl md:text-4xl text-gray-900 uppercase tracking-wide mb-1 flex items-center gap-3">
          <MessageSquare className="text-[#10748E]" size={28} /> Messagerie Interne
        </h1>
        <p className="font-montserrat text-gray-500 text-sm">
          {currentUser.role === "super_admin"
            ? "Suivez et intervenez dans toutes les conversations clients en toute discrétion."
            : "Échangez en temps réel avec vos interlocuteurs."}
        </p>
      </div>

      {/* Main Messaging Container */}
      <div className="msg-item flex-1 bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row h-full">
        {/* Left Side: Threads List */}
        <aside className={`w-full md:w-80 border-r border-gray-100 flex flex-col shrink-0 ${mobileShowChat ? "hidden md:flex" : "flex"}`}>
          {/* Search bar */}
          <div className="p-4 border-b border-gray-100 space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un fil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>
              {canStartNewThread && (
                <button
                  onClick={() => setShowNewThreadModal(true)}
                  className="p-2 bg-[#10748E] text-white rounded-xl hover:bg-[#0c5a6e] transition-colors shrink-0"
                  title="Nouvelle conversation"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>

            {/* Super Admin filters */}
            {currentUser.role === "super_admin" && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSuperAdminView("all")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-montserrat transition-colors ${
                      superAdminView === "all"
                        ? "bg-[#10748E] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Toutes
                  </button>
                  <button
                    type="button"
                    onClick={() => setSuperAdminView("mine")}
                    className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-montserrat transition-colors ${
                      superAdminView === "mine"
                        ? "bg-[#10748E] text-white"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Mes interventions
                  </button>
                </div>
                <select
                  value={superAdminCommercialFilter}
                  onChange={(e) => setSuperAdminCommercialFilter(e.target.value)}
                  className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#10748E] font-montserrat text-xs"
                >
                  <option value="all">Tous les commerciaux</option>
                  {COMMERCIALS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Threads scrolling container */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filteredThreads.length === 0 && (
              <div className="p-8 text-center text-gray-400 font-montserrat text-sm">
                Aucune conversation trouvée.
              </div>
            )}
            {filteredThreads.map((thread) => {
              const lastMsg = thread.messages[thread.messages.length - 1];
              const avatar = (thread.clientCompany || thread.clientName).charAt(0).toUpperCase();
              return (
                <div
                  key={thread.id}
                  onClick={() => {
                    setActiveThreadId(thread.id);
                    setMobileShowChat(true);
                  }}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors ${
                    activeThreadId === thread.id ? "bg-[#10748E]/5" : "hover:bg-gray-50/50"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-100 text-[#10748E] font-nevan flex items-center justify-center shrink-0 border border-gray-200 uppercase">
                    {avatar}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <h4 className="font-montserrat font-bold text-gray-900 text-sm truncate">
                        {thread.clientCompany || thread.clientName}
                      </h4>
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
        <div className={`flex-1 flex flex-col min-w-0 bg-gray-50/50 ${mobileShowChat ? "flex" : "hidden md:flex"}`}>
          {activeThread ? (
            <>
              {/* Chat Window Header */}
              <div className="p-4 border-b border-gray-100 bg-white flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setMobileShowChat(false)}
                    className="md:hidden p-2 -ml-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-label="Retour à la liste"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-xl bg-[#10748E] text-white font-nevan flex items-center justify-center font-bold uppercase">
                    {(activeThread.clientCompany || activeThread.clientName).charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-gray-900 text-sm leading-tight">
                      {activeThread.clientCompany || activeThread.clientName}
                    </h3>
                    <span className="font-montserrat text-xs text-gray-500 mt-0.5 inline-block">
                      {activeThread.clientName} · Commercial : {activeThread.commercialName}
                    </span>
                  </div>
                </div>
                {currentUser.role === "super_admin" && (
                  <div className="flex items-center gap-2 text-xs font-montserrat text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-100">
                    <Shield size={14} />
                    Mode Super Admin
                  </div>
                )}
              </div>

              {/* Chat Bubbles scrollarea */}
              <div className="flex-grow overflow-y-auto p-4 space-y-5 flex flex-col justify-end">
                {activeThread.messages.map((msg) => {
                  const side = getBubbleSide(msg);
                  const isRight = side === "right";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col max-w-[80%] ${isRight ? "self-end items-end" : "self-start items-start"}`}
                    >
                      <div className="text-[10px] text-gray-400 font-montserrat mb-0.5 px-1">
                        {getSenderLabel(msg)}
                      </div>
                      <div className={`p-3.5 rounded-2xl font-montserrat text-sm leading-relaxed ${getBubbleStyle(msg)}`}>
                        {msg.text}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-gray-400 font-montserrat px-1">
                        {msg.time}
                        {isRight && <CheckCheck size={12} className="text-[#10748E]" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Super Admin impersonation hint */}
              {currentUser.role === "super_admin" && (
                <div className="px-4 pt-3 pb-0 bg-white border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2 text-xs font-montserrat text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-100">
                    <UserCheck size={13} />
                    Vous répondez au nom du commercial : {activeThread.commercialName}
                  </div>
                </div>
              )}

              {/* Message Typing Input bar */}
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder={
                    currentUser.role === "super_admin"
                      ? `Écrire au nom de ${activeThread.commercialName}...`
                      : "Écrire votre message ici..."
                  }
                  className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                />
                <button
                  type="submit"
                  className="p-3 bg-[#10748E] text-white rounded-xl hover:bg-[#0c5a6e] transition-colors shrink-0 flex items-center justify-center"
                >
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

      {/* New Thread Modal */}
      {showNewThreadModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowNewThreadModal(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl max-h-[80vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-nevan text-xl text-gray-950 uppercase">Nouvelle conversation</h2>
                <p className="font-montserrat text-xs text-gray-400 mt-1">Choisissez un client pour démarrer un fil.</p>
              </div>
              <button
                onClick={() => setShowNewThreadModal(false)}
                className="self-end sm:self-auto p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {currentUser.role === "super_admin" && (
              <div className="px-6 pt-4 pb-2">
                <label className="block text-xs font-montserrat text-gray-500 mb-1.5">Assigner au commercial</label>
                <select
                  value={selectedCommercial}
                  onChange={(e) => setSelectedCommercial(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                >
                  {COMMERCIALS.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un client..."
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {filteredClients.length === 0 ? (
                <div className="p-8 text-center text-gray-400 font-montserrat text-sm">
                  Aucun client trouvé.
                </div>
              ) : (
                filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => handleStartNewThread(client)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#10748E] text-white font-nevan flex items-center justify-center shrink-0 font-bold uppercase">
                      {client.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-montserrat font-bold text-gray-900 text-sm truncate">{client.company}</div>
                      <div className="font-montserrat text-xs text-gray-500 truncate">{client.contact}</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
