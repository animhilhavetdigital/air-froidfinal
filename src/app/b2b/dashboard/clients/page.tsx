"use client";

import { useRef, useState } from "react";
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
  { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", ice: "001594823000084", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", status: "Actif", resp: "Youssef" },
  { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", ice: "000847291000072", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Casablanca", status: "Actif", resp: "Youssef" },
  { id: "CLI-399", company: "Villa Palmeraie", type: "B2C", ice: "-", contact: "Jean Dupont", email: "j.dupont@gmail.com", phone: "+212 665-123456", city: "Marrakech", status: "Actif", resp: "Sara" },
  { id: "CLI-398", company: "Riad Dar Anika", type: "B2B", ice: "002485910000031", contact: "Omar Lahrizi", email: "info@daranika.com", phone: "+212 524-389150", city: "Marrakech", status: "Actif", resp: "Non assigné" },
  { id: "CLI-390", company: "Société Al Boustane", type: "B2B", ice: "003512948000095", contact: "Yassine Boustane", email: "y.boustane@alboustane.co.ma", phone: "+212 660-842915", city: "Marrakech", status: "En attente", resp: "Non assigné" },
];

export default function SuperAdminClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tous");

  useGSAP(() => {
    gsap.fromTo(".cli-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.ice.includes(searchTerm);
    const matchesType = selectedType === "Tous" || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleValidateAccount = (id: string, action: "validate" | "reject") => {
    setClients(prev => prev.map(c => {
      if (c.id === id) {
        return { 
          ...c, 
          status: action === "validate" ? "Actif" : "Rejeté",
          resp: action === "validate" ? "Youssef" : c.resp
        };
      }
      return c;
    }));
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

    </div>
  );
}
