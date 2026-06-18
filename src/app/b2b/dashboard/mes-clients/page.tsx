"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  UserCheck, 
  Search, 
  MapPin, 
  Building2, 
  Phone, 
  Plus, 
  ChevronRight,
  X
} from "lucide-react";

// Mock clients fallback
const FALLBACK_CLIENTS = [
  { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", ice: "001594823000084", status: "Actif", resp: "Youssef", history: ["Création du dossier B2B", "Validation de l'ICE", "Demande d'étude VRV reçue"] },
  { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Casablanca", ice: "000847291000072", status: "Actif", resp: "Youssef", history: ["Première visite technique effectuée", "Prise de contact avec la direction"] },
];

const CATEGORIES = [
  "Systèmes de climatisation",
  "Équipements de ventilation",
  "Produits solaires",
  "Filtres & accessoires"
];

export default function CommercialClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [clients, setClients] = useState<typeof FALLBACK_CLIENTS>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Add Client Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState("");
  const [newClient, setNewClient] = useState({
    fullname: "",
    email: "",
    entreprise: "",
    phone: "",
    ice: "",
    city: ""
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const saved = localStorage.getItem("afe_clients");
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      localStorage.setItem("afe_clients", JSON.stringify(FALLBACK_CLIENTS));
      setClients(FALLBACK_CLIENTS);
    }
  };

  useGSAP(() => {
    if (clients.length > 0) {
      gsap.fromTo(".com-cli-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [clients]);

  // Filter clients to show only those assigned to Youssef
  const myClients = clients.filter(c => c.resp === "Youssef");

  const filteredClients = myClients.filter(c => 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contact.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    // Validation
    const exists = clients.some(c => 
      c.email.toLowerCase() === newClient.email.toLowerCase() || 
      (newClient.ice !== "-" && c.ice === newClient.ice)
    );

    if (exists) {
      setAddError("Ce client existe déjà et est déjà inscrit dans le système.");
      return;
    }

    const newId = `CLI-${Math.floor(410 + Math.random() * 90)}`;
    const timestamp = new Date().toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const createdClient = {
      id: newId,
      company: newClient.entreprise,
      type: "B2B",
      contact: newClient.fullname,
      email: newClient.email,
      phone: newClient.phone,
      city: newClient.city,
      ice: newClient.ice || "-",
      status: "Actif",
      resp: "Youssef",
      addedBy: "Commercial",
      history: [`[${timestamp}] Client créé directement par le commercial Youssef.`]
    };

    const updated = [createdClient, ...clients];
    setClients(updated);
    localStorage.setItem("afe_clients", JSON.stringify(updated));

    // Send Notification to Super Admin
    const savedNotifs = localStorage.getItem("afe_notifications");
    let notificationsList = [];
    if (savedNotifs) {
      notificationsList = JSON.parse(savedNotifs);
    }
    const adminNotif = {
      id: Date.now(),
      type: "Système",
      title: "Client ajouté par un commercial",
      desc: `Le commercial Youssef a créé et validé le client ${newClient.entreprise} (ICE: ${newClient.ice || "-"}).`,
      time: "Il y a quelques secondes",
      read: false,
      category: "clients",
      href: "/b2b/dashboard/clients",
      role: "super_admin"
    };
    notificationsList = [adminNotif, ...notificationsList];
    localStorage.setItem("afe_notifications", JSON.stringify(notificationsList));

    setShowAddModal(false);
    setNewClient({
      fullname: "",
      email: "",
      entreprise: "",
      phone: "",
      ice: "",
      city: ""
    });
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="com-cli-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Mes Clients & Comptes</h1>
          <p className="font-montserrat text-gray-500">Suivez et pilotez votre portefeuille de clients professionnels.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#10748E] text-white font-nevan text-xs tracking-wider uppercase rounded-xl hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
        >
          <Plus size={16} /> Ajouter Client
        </button>
      </div>

      {/* KPI Info */}
      <div className="com-cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-fit">
        <div className="w-12 h-12 bg-[#10748E]/10 rounded-xl flex items-center justify-center text-[#10748E]">
          <UserCheck size={24} />
        </div>
        <div>
          <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">Clients Portefeuille</div>
          <div className="font-nevan text-2xl text-gray-900 mt-1">{myClients.length}</div>
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
              onClick={() => router.push(`/b2b/dashboard/mes-clients/${c.id}`)}
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

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide">Ajouter un nouveau client</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {addError && (
              <div className="bg-red-50 text-[#AF1818] p-3 rounded-xl border border-red-100 font-montserrat text-xs mb-4 flex items-center gap-2">
                <span>⚠️ {addError}</span>
              </div>
            )}

            <form onSubmit={handleAddClientSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Nom complet (Contact principal)</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Mohamed Alami"
                  value={newClient.fullname}
                  onChange={(e) => setNewClient(prev => ({ ...prev, fullname: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Adresse Email</label>
                <input 
                  type="email"
                  required
                  placeholder="ex: m.alami@entreprise.ma"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Nom de l'entreprise</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Société Alami Frères B2B"
                  value={newClient.entreprise}
                  onChange={(e) => setNewClient(prev => ({ ...prev, entreprise: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Numéro de téléphone</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: +212 661-000000"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">ICE (Identifiant Commun de l'Entreprise)</label>
                <input 
                  type="text"
                  placeholder="ex: 001594823000084"
                  value={newClient.ice}
                  onChange={(e) => setNewClient(prev => ({ ...prev, ice: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Ville</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Marrakech"
                  value={newClient.city}
                  onChange={(e) => setNewClient(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
                >
                  Ajouter Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
