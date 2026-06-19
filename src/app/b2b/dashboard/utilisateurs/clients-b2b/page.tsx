"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck,
  MapPin,
  ChevronRight
} from "lucide-react";

// Fallback client data (must stay in sync with clients/page.tsx shape)
const INITIAL_CLIENTS = [
  { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", ice: "001594823000084", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)", history: ["Création du dossier B2B", "Validation de l'ICE", "Demande d'étude VRV reçue"] },
  { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", ice: "000847291000072", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Marrakech, Route de Casa", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)", history: ["Première visite technique effectuée", "Prise de contact avec la direction"] },
  { id: "CLI-399", company: "Villa Palmeraie", type: "B2B", ice: "002948103000067", contact: "Jean Dupont", email: "j.dupont@gmail.com", phone: "+212 665-123456", city: "Marrakech", status: "Actif", resp: "Sara", addedBy: "Super Admin", history: [] },
  { id: "CLI-398", company: "Riad Dar Anika", type: "B2B", ice: "002485910000031", contact: "Omar Lahrizi", email: "info@daranika.com", phone: "+212 524-389150", city: "Marrakech", status: "Actif", resp: "Non assigné", addedBy: "Portail (Client)", history: [] },
  { id: "CLI-390", company: "Société Al Boustane", type: "B2B", ice: "003512948000095", contact: "Yassine Boustane", email: "y.boustane@alboustane.co.ma", phone: "+212 660-842915", city: "Marrakech", status: "En attente", resp: "Non assigné", addedBy: "Portail (Client)", history: [] },
];

export default function ClientsB2BPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [clients, setClients] = useState<typeof INITIAL_CLIENTS>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("afe_clients");
    if (saved) {
      const parsed = JSON.parse(saved);
      const repaired = parsed.map((c: any) => {
        let addedByVal = c.addedBy;
        if (!addedByVal) {
          if (c.history && c.history.some((h: string) => h.toLowerCase().includes("commercial"))) {
            addedByVal = "Commercial";
          } else if (c.status === "Actif") {
            addedByVal = "Super Admin";
          } else {
            addedByVal = "Portail (Client)";
          }
        } else if (addedByVal.startsWith("Commercial")) {
          addedByVal = "Commercial";
        }
        return { ...c, addedBy: addedByVal };
      });
      setClients(repaired);
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
    return matchesSearch;
  });

  const toggleClientStatus = (id: string) => {
    const updated = clients.map(c => {
      if (c.id === id) {
        // For pending accounts, keep them in "En attente" unless explicitly validated elsewhere.
        // Here we only toggle Actif <=> Suspendu.
        if (c.status === "En attente") return c;
        return { ...c, status: c.status === "Actif" ? "Suspendu" : "Actif" };
      }
      return c;
    });
    setClients(updated);
    localStorage.setItem("afe_clients", JSON.stringify(updated));
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="cli-item flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Comptes Clients B2B</h1>
          <p className="font-montserrat text-gray-500">Gérez les entreprises inscrites sur le portail B2B, leur statut et leurs accès.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="cli-item grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#10748E]/10 rounded-xl flex items-center justify-center text-[#10748E]">
            <Building2 size={24} />
          </div>
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">Total Clients B2B</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{clients.length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <ShieldCheck size={24} />
          </div>
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">Comptes Actifs</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{clients.filter(c => c.status === "Actif").length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <ShieldAlert size={24} />
          </div>
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">En Attente de Validation</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{clients.filter(c => c.status === "En attente").length}</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher par entreprise, contact, email, ICE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="cli-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Entreprise / Contact</th>
                <th className="px-6 py-4">ICE</th>
                <th className="px-6 py-4">Email / Téléphone</th>
                <th className="px-6 py-4">Ville</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Commercial assigné</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.length > 0 ? (
                filteredClients.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => router.push(`/b2b/dashboard/mes-clients/${c.id}`)}
                    className="hover:bg-[#10748E]/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#10748E]/10 text-[#10748E] font-nevan text-sm flex items-center justify-center">
                          {c.company.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-[#10748E] transition-colors">{c.company}</div>
                          <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5">{c.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.ice}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{c.email}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      <span className="flex items-center gap-1"><MapPin size={12} className="text-gray-400" /> {c.city}</span>
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
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleClientStatus(c.id);
                        }}
                        disabled={c.status === "En attente"}
                        className={`text-xs font-bold font-montserrat px-3 py-1.5 rounded-lg border transition-colors ${
                          c.status === "En attente"
                            ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                            : c.status === "Actif"
                            ? "bg-red-50 text-[#AF1818] border-red-100 hover:bg-red-100"
                            : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                        }`}
                      >
                        {c.status === "En attente" ? "En attente" : c.status === "Actif" ? "Suspendre" : "Réactiver"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-montserrat">
                    Aucun client B2B ne correspond aux critères de recherche.
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
