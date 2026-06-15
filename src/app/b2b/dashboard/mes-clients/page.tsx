"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  UserCheck, 
  Search, 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  X, 
  Plus, 
  ChevronRight,
  ClipboardList
} from "lucide-react";

// Mock clients assigned to Youssef
const INITIAL_MY_CLIENTS = [
  { id: "CLI-402", company: "Hôtel Royal Atlas", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", ice: "001594823000084", history: ["Création du dossier B2B", "Validation de l'ICE", "Demande d'étude VRV reçue"] },
  { id: "CLI-401", company: "Supermarché Marjane", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Marrakech, Route de Casa", ice: "000847291000072", history: ["Première visite technique effectuée", "Prise de contact avec la direction"] },
];

export default function CommercialClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState(INITIAL_MY_CLIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeClient, setActiveClient] = useState<typeof INITIAL_MY_CLIENTS[0] | null>(null);
  const [newLogText, setNewLogText] = useState("");

  useGSAP(() => {
    gsap.fromTo(".com-cli-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const filteredClients = clients.filter(c => 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contact.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLog = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!newLogText.trim()) return;

    setClients(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, history: [newLogText.trim(), ...c.history] };
      }
      return c;
    }));

    if (activeClient && activeClient.id === id) {
      setActiveClient(prev => prev ? { ...prev, history: [newLogText.trim(), ...prev.history] } : null);
    }

    setNewLogText("");
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="com-cli-item flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Mes Clients & Comptes</h1>
          <p className="font-montserrat text-gray-500">Suivez et pilotez votre portefeuille de clients professionnels.</p>
        </div>
      </div>

      {/* KPI Info */}
      <div className="com-cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-fit">
        <div className="w-12 h-12 bg-[#10748E]/10 rounded-xl flex items-center justify-center text-[#10748E]">
          <UserCheck size={24} />
        </div>
        <div>
          <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">Clients Portefeuille</div>
          <div className="font-nevan text-2xl text-gray-900 mt-1">{clients.length}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="com-cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher un client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="com-cli-item grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((c) => (
            <div 
              key={c.id} 
              onClick={() => setActiveClient(c)}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#10748E]/30 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-montserrat text-xs text-gray-400 font-bold uppercase">{c.id}</span>
                    <h3 className="font-montserrat font-bold text-gray-900 text-lg leading-tight mt-0.5">{c.company}</h3>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-[#10748E] transition-colors" />
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 font-montserrat">
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400 shrink-0" /> {c.city}</div>
                  <div className="flex items-center gap-2"><Building2 size={16} className="text-gray-400 shrink-0" /> ICE: {c.ice}</div>
                  <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400 shrink-0" /> {c.phone}</div>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between">
                <span className="font-montserrat text-xs text-gray-400 font-medium">Contact: <strong className="text-gray-700">{c.contact}</strong></span>
                <span className="font-nevan text-[10px] text-[#10748E] uppercase tracking-wider bg-[#10748E]/10 px-2 py-0.5 rounded-full font-bold">Activité récente</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-12 font-montserrat">
            Aucun client ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Client History Log Centered Modal */}
      {activeClient && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveClient(null)} />
          
          {/* Content */}
          <div className="relative w-full max-w-xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-nevan text-xs text-[#10748E]">{activeClient.id}</span>
                <h2 className="font-nevan text-xl text-gray-900 uppercase mt-0.5">{activeClient.company}</h2>
              </div>
              <button onClick={() => setActiveClient(null)} className="p-2 text-gray-400 hover:text-gray-950 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Detailed coordinates */}
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="font-nevan text-xs text-gray-400 uppercase tracking-widest font-bold">Informations de contact</h3>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Contact</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5">{activeClient.contact}</span>
                  </div>
                  <div>
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">ICE marocain</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5">{activeClient.ice}</span>
                  </div>
                  <div>
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">E-mail</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5 flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {activeClient.email}</span>
                  </div>
                  <div>
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Téléphone</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5 flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {activeClient.phone}</span>
                  </div>
                </div>
              </div>

              {/* Logs / History Timeline */}
              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ClipboardList size={16} className="text-[#10748E]" /> Historique de la relation
                </h3>

                <div className="relative border-l border-gray-200 ml-3 pl-6 space-y-6 mb-6">
                  {activeClient.history.map((log, idx) => (
                    <div key={idx} className="relative">
                      {/* Node Bullet */}
                      <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-[#10748E] border border-white" />
                      
                      <div>
                        <p className="font-montserrat text-sm text-gray-800 leading-relaxed">{log}</p>
                        <span className="font-montserrat text-[10px] text-gray-400 block mt-0.5">Youssef • Historique</span>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => handleAddLog(e, activeClient.id)} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Consigner une nouvelle interaction..." 
                    value={newLogText}
                    onChange={(e) => setNewLogText(e.target.value)}
                    className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                  <button type="submit" className="px-4 py-2 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase hover:bg-[#0c5a6e] transition-colors shrink-0">
                    Enregistrer
                  </button>
                </form>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setActiveClient(null)}
                className="w-full py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer la fiche
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
