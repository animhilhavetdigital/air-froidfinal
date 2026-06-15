"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  MessageSquare, 
  Plus, 
  X, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  CheckCheck
} from "lucide-react";

// Mock tickets
const INITIAL_TICKETS = [
  { id: "SUP-8902", subject: "Problème débit d'air CTA Sidi Maarouf", category: "Assistance Technique", status: "En cours", date: "15 Juin 2026" },
  { id: "SUP-8741", subject: "Demande de plans DWG pour VRV Daikin", category: "Bureau d'études", status: "Résolu", date: "10 Juin 2026" },
];

// Mock ticket messages database
const INITIAL_TICKET_MESSAGES: Record<string, Array<{ sender: "client" | "support", text: string, time: string }>> = {
  "SUP-8902": [
    { sender: "client", text: "Le groupe extérieur fait un bruit anormal et le débit d'air dans le bureau principal semble très faible.", time: "15 Juin, 09:00" },
    { sender: "support", text: "Bonjour, nous avons programmé le déplacement d'un technicien aujourd'hui à 14h30 pour vérifier l'installation et le débit d'air.", time: "15 Juin, 10:15" }
  ],
  "SUP-8741": [
    { sender: "client", text: "Pouvez-vous nous envoyer les plans d'exécution DWG et d'implantation pour le bloc VRV Daikin ?", time: "10 Juin, 11:30" },
    { sender: "support", text: "Bonjour, les fichiers DWG ont été déposés dans votre espace documents techniques. Vous pouvez les télécharger directement.", time: "10 Juin, 14:00" },
    { sender: "client", text: "C'est bien reçu. Merci beaucoup.", time: "10 Juin, 14:30" }
  ]
};

export default function B2BSupportPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [ticketMessages, setTicketMessages] = useState(INITIAL_TICKET_MESSAGES);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Assistance Technique");
  const [message, setMessage] = useState("");

  const [showSuccess, setShowSuccess] = useState(false);
  
  // Interactive Exchanges Drawer state
  const [activeTicketId, setActiveTicketId] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState("");

  useGSAP(() => {
    gsap.fromTo(".sup-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;

    const newTicketId = `SUP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: newTicketId,
      subject: subject,
      category: category,
      status: "Nouveau",
      date: "Aujourd'hui"
    };

    // Add to tickets
    setTickets(prev => [newTicket, ...prev]);
    
    // Add first message to messages database
    setTicketMessages(prev => ({
      ...prev,
      [newTicketId]: [
        { sender: "client", text: message, time: "Aujourd'hui, à l'instant" }
      ]
    }));

    setSubject("");
    setMessage("");
    setShowForm(false);
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleSendChatMessage = (e: React.FormEvent, ticketId: string) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg = {
      sender: "client" as const,
      text: chatInput.trim(),
      time: "Aujourd'hui, à l'instant"
    };

    setTicketMessages(prev => ({
      ...prev,
      [ticketId]: [...(prev[ticketId] || []), newMsg]
    }));

    setChatInput("");
  };

  const activeTicket = tickets.find(t => t.id === activeTicketId);
  const activeMessages = activeTicketId ? (ticketMessages[activeTicketId] || []) : [];

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="sup-item flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-3">
            <MessageSquare className="text-[#10748E]" size={32} /> Support Dédié
          </h1>
          <p className="font-montserrat text-gray-500">Ouvrez un ticket de support pour entrer en contact direct avec notre Bureau d'Études et service technique.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase hover:bg-[#0c5a6e] transition-colors shadow-lg shadow-[#10748E]/20 shrink-0"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />} {showForm ? "Fermer le formulaire" : "Nouveau Ticket"}
        </button>
      </div>

      {showSuccess && (
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 text-sm font-semibold font-montserrat sup-item animate-in fade-in duration-300">
          <CheckCircle2 size={20} /> Votre ticket de support a bien été créé. Notre équipe technique l'analyse.
        </div>
      )}

      {/* Ticket form */}
      {showForm && (
        <div className="sup-item bg-white p-6 md:p-8 rounded-3xl border border-[#10748E]/20 shadow-lg animate-in slide-in-from-top-4 duration-300">
          <h2 className="font-nevan text-lg text-gray-900 uppercase tracking-wider mb-6">Ouvrir un nouveau dossier</h2>
          
          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Sujet de la demande</label>
                <input 
                  type="text" 
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Température fluctuante VRV salon 3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>
              <div>
                <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Catégorie</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                >
                  <option value="Assistance Technique">Assistance Technique / SAV</option>
                  <option value="Bureau d'études">Bureau d'études / Plans</option>
                  <option value="Facturation B2B">Facturation & Contrats</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Description détaillée</label>
              <textarea 
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Expliquez en détail les contraintes ou le problème rencontré..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-gray-200 rounded-xl font-montserrat text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button 
                type="submit"
                className="px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md"
              >
                Soumettre le ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets list */}
      <div className="sup-item bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wider">Mes Tickets Récents</h2>
        </div>
        
        <div className="divide-y divide-gray-50">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
              <div>
                <div className="flex items-center gap-3">
                  <span className="font-nevan text-xs text-[#10748E]">{ticket.id}</span>
                  <span className="font-montserrat text-xs text-gray-400 font-semibold">• {ticket.category}</span>
                </div>
                <h3 className="font-montserrat font-bold text-gray-900 text-base mt-1">{ticket.subject}</h3>
                <span className="font-montserrat text-xs text-gray-500 block mt-1">Créé le : {ticket.date}</span>
              </div>
              
              <div className="flex items-center gap-4 shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  ticket.status === 'Résolu' ? 'bg-green-50 text-green-700' : 
                  ticket.status === 'Nouveau' ? 'bg-purple-50 text-purple-700' : 'bg-orange-50 text-orange-700'
                }`}>
                  {ticket.status === 'Résolu' ? <CheckCircle2 size={14} /> : 
                   ticket.status === 'Nouveau' ? <AlertCircle size={14} /> : <Clock size={14} />}
                  {ticket.status}
                </span>
                <button 
                  onClick={() => setActiveTicketId(ticket.id)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-montserrat text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-[#10748E] hover:text-[#10748E] transition-all"
                >
                  Voir les échanges
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exchanges Centered Modal */}
      {activeTicketId && activeTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveTicketId(null)} />
          
          {/* Content */}
          <div className="relative w-full max-w-xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-nevan text-xs text-gray-400">{activeTicket.id} • {activeTicket.category}</span>
                <h2 className="font-nevan text-lg text-gray-900 uppercase mt-0.5">{activeTicket.subject}</h2>
              </div>
              <button onClick={() => setActiveTicketId(null)} className="p-2 text-gray-400 hover:text-gray-950 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Messages bubbles area */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-gray-50 flex flex-col justify-end">
              {activeMessages.map((msg, idx) => {
                const isMe = msg.sender === "client";
                return (
                  <div 
                    key={idx} 
                    className={`flex flex-col max-w-[80%] ${isMe ? "self-end items-end" : "self-start items-start"}`}
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

            {/* Chat Input form */}
            <form onSubmit={(e) => handleSendChatMessage(e, activeTicket.id)} className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Écrire votre message d'assistance..."
                className="flex-grow px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
              />
              <button type="submit" className="p-3 bg-[#10748E] text-white rounded-xl hover:bg-[#0c5a6e] transition-colors shrink-0">
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
