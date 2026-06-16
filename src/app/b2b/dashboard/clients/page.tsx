"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Search, 
  Filter, 
  Building2, 
  Check, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  MapPin, 
  Briefcase 
} from "lucide-react";

// Mock client data
const INITIAL_CLIENTS = [
  { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", ice: "001594823000084", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)", history: ["Création du dossier B2B", "Validation de l'ICE", "Demande d'étude VRV reçue"] },
  { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", ice: "000847291000072", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Marrakech, Route de Casa", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)", history: ["Première visite technique effectuée", "Prise de contact avec la direction"] },
  { id: "CLI-399", company: "Villa Palmeraie", type: "B2C", ice: "-", contact: "Jean Dupont", email: "j.dupont@gmail.com", phone: "+212 665-123456", city: "Marrakech", status: "Actif", resp: "Sara", addedBy: "Super Admin", history: [] },
  { id: "CLI-398", company: "Riad Dar Anika", type: "B2B", ice: "002485910000031", contact: "Omar Lahrizi", email: "info@daranika.com", phone: "+212 524-389150", city: "Marrakech", status: "Actif", resp: "Non assigné", addedBy: "Portail (Client)", history: [] },
  { id: "CLI-390", company: "Société Al Boustane", type: "B2B", ice: "003512948000095", contact: "Yassine Boustane", email: "y.boustane@alboustane.co.ma", phone: "+212 660-842915", city: "Marrakech", status: "En attente", resp: "Non assigné", addedBy: "Portail (Client)", history: [] },
];

const COMMERCIALS = ["Youssef", "Sara"];

export default function SuperAdminClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<typeof INITIAL_CLIENTS>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tous");
  
  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [pendingValidateId, setPendingValidateId] = useState<string | null>(null);
  const [selectedCommercial, setSelectedCommercial] = useState("Youssef");

  useEffect(() => {
    const saved = localStorage.getItem("afe_clients");
    if (saved) {
      const parsed = JSON.parse(saved);
      const repaired = parsed.map((c: any) => {
        if (!c.addedBy) {
          if (c.history && c.history.some((h: string) => h.toLowerCase().includes("commercial"))) {
            return { ...c, addedBy: `Commercial (${c.resp || "Youssef"})` };
          }
          if (c.status === "Actif") {
            return { ...c, addedBy: "Super Admin" };
          }
          return { ...c, addedBy: "Portail (Client)" };
        }
        return c;
      });
      setClients(repaired);
      localStorage.setItem("afe_clients", JSON.stringify(repaired));
    } else {
      localStorage.setItem("afe_clients", JSON.stringify(INITIAL_CLIENTS));
      setClients(INITIAL_CLIENTS);
    }
  }, []);

  useGSAP(() => {
    if (clients.length > 0) {
      gsap.fromTo(".cli-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [clients]);

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.ice.includes(searchTerm);
    const matchesType = selectedType === "Tous" || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleValidateAccount = (id: string, action: "validate" | "reject") => {
    if (action === "reject") {
      const updated = clients.map(c => {
        if (c.id === id) {
          return { ...c, status: "Rejeté" };
        }
        return c;
      });
      setClients(updated);
      localStorage.setItem("afe_clients", JSON.stringify(updated));
    } else {
      setPendingValidateId(id);
      setShowAssignModal(true);
    }
  };

  const confirmAssign = () => {
    if (!pendingValidateId) return;

    const targetClient = clients.find(c => c.id === pendingValidateId);
    const updated = clients.map(c => {
      if (c.id === pendingValidateId) {
        return { 
          ...c, 
          status: "Actif",
          resp: selectedCommercial,
          addedBy: "Super Admin"
        };
      }
      return c;
    });

    setClients(updated);
    localStorage.setItem("afe_clients", JSON.stringify(updated));

    // Send Notification to Commercial
    const savedNotifs = localStorage.getItem("afe_notifications");
    let notificationsList = [];
    if (savedNotifs) {
      notificationsList = JSON.parse(savedNotifs);
    } else {
      // Default fallback
      notificationsList = [
        { id: 1, type: "Nouveau", title: "Nouveau dossier assigné", desc: "L'administrateur vous a assigné la demande REQ-102 (Hôtel Royal Atlas) pour l'étude thermique du projet VRV/DRV.", time: "Il y a 30 minutes", read: false, category: "demandes", href: "/b2b/dashboard/mes-demandes", role: "commercial" }
      ];
    }

    const newNotif = {
      id: Date.now(),
      type: "Nouveau",
      title: "Nouveau client assigné",
      desc: `Le Super Admin vous a assigné le client ${targetClient?.company || "inconnu"}.`,
      time: "Il y a quelques secondes",
      read: false,
      category: "clients",
      href: "/b2b/dashboard/mes-clients",
      role: "commercial"
    };

    notificationsList = [newNotif, ...notificationsList];
    localStorage.setItem("afe_notifications", JSON.stringify(notificationsList));

    setShowAssignModal(false);
    setPendingValidateId(null);
  };

  const pendingB2B = clients.filter(c => c.status === "En attente");

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="cli-item flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Comptes & Clients</h1>
          <p className="font-montserrat text-gray-500">Gérez les fiches clients et validez les comptes professionnels B2B.</p>
        </div>
      </div>

      {/* Validation Banner (if any accounts pending) */}
      {pendingB2B.length > 0 && (
        <div className="cli-item bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide">Comptes B2B en Attente ({pendingB2B.length})</h3>
              <p className="font-montserrat text-sm text-gray-600 mt-1">
                De nouveaux professionnels se sont inscrits et attendent la validation de leur identifiant fiscal / ICE.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {pendingB2B.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm min-w-[320px]">
                <div>
                  <div className="font-montserrat text-xs font-bold text-[#10748E]">{c.id}</div>
                  <div className="font-montserrat font-bold text-gray-900 text-sm">{c.company}</div>
                  <div className="font-montserrat text-xs text-gray-500 mt-0.5">ICE: {c.ice} • {c.city}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleValidateAccount(c.id, "reject")}
                    className="px-3 py-1.5 bg-red-50 text-[#AF1818] border border-red-100 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                  >
                    <X size={14} /> Refuser
                  </button>
                  <button 
                    onClick={() => handleValidateAccount(c.id, "validate")}
                    className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                  >
                    <Check size={14} /> Valider
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher par Entreprise, Contact, ICE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="font-montserrat text-xs font-bold text-gray-400 uppercase shrink-0">Typologie:</span>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full md:w-48"
          >
            <option value="Tous">Tous les clients</option>
            <option value="B2B">Professionnels (B2B)</option>
            <option value="B2C">Particuliers (B2C)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="cli-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Client / Entreprise</th>
                <th className="px-6 py-4">Typologie</th>
                <th className="px-6 py-4"> ICE / Identifiant</th>
                <th className="px-6 py-4">Contact principal</th>
                <th className="px-6 py-4">Coordonnées</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Créé par</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.length > 0 ? (
                filteredClients.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{c.company}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5"><MapPin size={12} /> {c.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        c.type === 'B2B' ? 'bg-[#10748E]/10 text-[#10748E]' : 'bg-gray-100 text-gray-600'
                      }`}>{c.type}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.ice}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{c.contact}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{c.email}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        c.status === 'Actif' ? 'bg-green-50 text-green-700' : 
                        c.status === 'En attente' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {c.status === 'Actif' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {c.resp === "Non assigné" ? (
                        <span className="text-gray-400 italic">Aucun</span>
                      ) : (
                        <span className="flex items-center gap-1 font-medium"><UserCheck size={14} className="text-[#10748E]" /> {c.resp}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        c.addedBy?.includes("Commercial") 
                          ? "bg-blue-50 text-[#32A5DE] border border-blue-100" 
                          : c.addedBy === "Super Admin"
                          ? "bg-[#AF1818]/10 text-[#AF1818]"
                          : "bg-gray-50 text-gray-500 border border-gray-100"
                      }`}>{c.addedBy || "Portail (Client)"}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-montserrat">
                    Aucun client ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide mb-4">Affectation du commercial</h3>
            <p className="font-montserrat text-sm text-gray-500 mb-6">
              Veuillez sélectionner le commercial en charge du suivi de ce client professionnel.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-2">Choisir le commercial</label>
                <select
                  value={selectedCommercial}
                  onChange={(e) => setSelectedCommercial(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                >
                  {COMMERCIALS.map(comm => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmAssign}
                className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
              >
                Confirmer & Valider
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
