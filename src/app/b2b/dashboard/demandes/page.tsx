"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { INITIAL_REQUESTS, Request } from "@/lib/requests-data";
import { 
  Search, 
  Filter, 
  ChevronRight, 
  ChevronDown,
  X, 
  UserPlus, 
  Check, 
  FileText, 
  Clock, 
  ArrowRight,
  TrendingUp
} from "lucide-react";

export default function SuperAdminDemandesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState<Request[]>(INITIAL_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [showQuickDevisModal, setShowQuickDevisModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [role, setRole] = useState<string>("super_admin");
  const [currentCommercialName] = useState<string>("Youssef");
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("afe_mock_role") || "super_admin";
      setRole(savedRole);

      const savedReqs = localStorage.getItem("afe_requests");
      if (savedReqs) {
        setRequests(JSON.parse(savedReqs));
      } else {
        localStorage.setItem("afe_requests", JSON.stringify(INITIAL_REQUESTS));
        setRequests(INITIAL_REQUESTS);
      }

      const saved = localStorage.getItem("afe_clients");
      if (saved) {
        setClients(JSON.parse(saved));
      } else {
        const fallback = [
          { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", ice: "001594823000084", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)" },
          { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Marrakech, Route de Casa", ice: "000847291000072", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)" },
          { id: "CLI-403", company: "Riad Dar Anika", type: "B2B", contact: "Fatima Zahra El Amrani", email: "contact@dar-anika.ma", phone: "+212 663-124578", city: "Marrakech", ice: "001928374000123", status: "Actif", resp: "Youssef" },
          { id: "CLI-404", company: "Clinique Al Kaoutar", type: "B2B", contact: "Dr. Omar Benali", email: "o.benali@alkaoutar.ma", phone: "+212 664-332211", city: "Rabat", ice: "002345678901234", status: "Actif", resp: "Youssef" },
          { id: "CLI-405", company: "Restaurant La Table du Marché", type: "B2B", contact: "Karim El Fassi", email: "k.elfassi@latablemarche.ma", phone: "+212 665-998877", city: "Marrakech", ice: "003456789012345", status: "Actif", resp: "Youssef" },
          { id: "CLI-399", company: "Villa Palmeraie", type: "B2B", contact: "Jean Dupont", email: "j.dupont@gmail.com", phone: "+212 665-123456", city: "Marrakech", ice: "002948103000067", status: "Actif", resp: "Sara", addedBy: "Super Admin" },
          { id: "CLI-398", company: "Riad Dar Anika Old", type: "B2B", contact: "Omar Lahrizi", email: "info@daranika.com", phone: "+212 524-389150", city: "Marrakech", ice: "002485910000031", status: "Actif", resp: "Non assigné", addedBy: "Portail (Client)" },
          { id: "CLI-390", company: "Société Al Boustane", type: "B2B", contact: "Yassine Boustane", email: "y.boustane@alboustane.co.ma", phone: "+212 660-842915", city: "Marrakech", ice: "003512948000095", status: "En attente", resp: "Non assigné", addedBy: "Portail (Client)" },
        ];
        localStorage.setItem("afe_clients", JSON.stringify(fallback));
        setClients(fallback);
      }
    }
  }, []);

  useGSAP(() => {
    gsap.fromTo(".dem-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const allowedRequests = requests
    .map(req => {
      const clientObj = clients.find(
        (c) => c.company.toLowerCase().includes(req.client.toLowerCase()) ||
               req.client.toLowerCase().includes(c.company.toLowerCase()) ||
               c.contact.toLowerCase().includes(req.client.toLowerCase()) ||
               req.client.toLowerCase().includes(c.contact.toLowerCase())
      );
      let currentResp = req.resp;
      if (currentResp === "Non assigné" && clientObj) {
        currentResp = clientObj.resp;
      }
      return { ...req, resp: currentResp, source: "B2B" };
    })
    .filter(req => req.resp && req.resp !== "Non assigné");

  const filteredRequests = allowedRequests.filter(req => {
    const matchesSearch = req.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Tous" || req.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Strict filtration of B2B clients for the commercial if simulated
  const allowedClients = role === "commercial" 
    ? (clients || []).filter(c => c.resp === currentCommercialName)
    : (clients || []);

  const matchingClients = allowedClients.filter(c => 
    c.company.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.contact.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    (c.ice && c.ice.includes(clientSearchTerm))
  );

  const handleAssignResp = (id: string, respName: string) => {
    const updated = requests.map(r => r.id === id ? { ...r, resp: respName, status: r.status === "Nouveau" ? "Analyse" : r.status } : r);
    setRequests(updated);
    localStorage.setItem("afe_requests", JSON.stringify(updated));
    if (activeRequest && activeRequest.id === id) {
      setActiveRequest(prev => prev ? { ...prev, resp: respName, status: prev.status === "Nouveau" ? "Analyse" : prev.status } : null);
    }
  };

  const handleUpdateStatus = (id: string, statusName: string) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: statusName } : r);
    setRequests(updated);
    localStorage.setItem("afe_requests", JSON.stringify(updated));
    if (activeRequest && activeRequest.id === id) {
      setActiveRequest(prev => prev ? { ...prev, status: statusName } : null);
    }
  };

  return (
    <div ref={containerRef} className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="dem-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Tour de contrôle des Demandes</h1>
          <p className="font-montserrat text-gray-500">Supervisez et orientez toutes les demandes entrantes de la plateforme Air Froid Expert.</p>
        </div>
        <button
          onClick={() => {
            setSelectedClientId("");
            setClientSearchTerm("");
            setShowQuickDevisModal(true);
          }}
          className="w-full sm:w-auto justify-center px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase tracking-wide hover:bg-[#0c5a6e] transition-colors flex items-center gap-2 shadow-md shadow-[#10748E]/20 shrink-0"
        >
          Ajouter devis rapide
        </button>
      </div>

      {/* KPI mini row */}
      <div className="dem-item grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">Total Demandes</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{allowedRequests.length}</div>
          </div>
          <FileText className="text-[#10748E]" size={28} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">Non assignées</div>
            <div className="font-nevan text-2xl text-[#AF1818] mt-1">{allowedRequests.filter(r => r.resp === "Non assigné").length}</div>
          </div>
          <UserPlus className="text-[#AF1818]" size={28} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">En Analyse</div>
            <div className="font-nevan text-2xl text-orange-600 mt-1">{allowedRequests.filter(r => r.status === "Analyse").length}</div>
          </div>
          <Clock className="text-orange-500" size={28} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">Taux d'affection</div>
            <div className="font-nevan text-2xl text-green-600 mt-1">
              {allowedRequests.length > 0 
                ? Math.round(((allowedRequests.length - allowedRequests.filter(r => r.resp === "Non assigné").length) / allowedRequests.length) * 100) 
                : 0}%
            </div>
          </div>
          <TrendingUp className="text-green-500" size={28} />
        </div>
      </div>

      {/* Filters */}
      <div className="dem-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher (Client, ID, type)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-montserrat text-xs font-bold text-gray-400 uppercase shrink-0">Statut:</span>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full sm:w-48"
            >
              <option value="Tous">Tous</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Analyse">Analyse</option>
              <option value="Devis Envoyé">Devis Envoyé</option>
              <option value="Refusé">Refusé</option>
              <option value="Signé">Signé</option>
              <option value="Clos">Clos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main requests list */}
      <div className="dem-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">ID / Client</th>
                <th className="px-6 py-4">Type de Projet</th>
                <th className="px-6 py-4">Canal</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => setActiveRequest(req)}>
                    <td className="px-6 py-4">
                      <div className="font-nevan text-xs text-gray-400 mb-0.5">{req.id}</div>
                      <div className="font-bold text-gray-900">{req.client}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{req.service}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-md text-xs font-semibold bg-blue-100 text-blue-700">
                        {req.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Nouveau' ? 'bg-purple-100 text-purple-700' : 
                        req.status === 'Analyse' ? 'bg-orange-100 text-orange-700' : 
                        req.status === 'Devis Envoyé' ? 'bg-[#10748E]/10 text-[#10748E]' : 
                        req.status === 'Refusé' ? 'bg-red-100 text-red-700' : 
                        req.status === 'Signé' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-green-100 text-green-700'
                      }`}>{req.status}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {req.resp === "Non assigné" ? (
                        <span className="text-[#AF1818] flex items-center gap-1"><UserPlus size={14} /> Non assigné</span>
                      ) : (
                        <span>{req.resp}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-500">{req.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 group-hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors">
                        <ChevronRight size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-montserrat">
                    Aucune demande trouvée avec les filtres actuels.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Accordion View */}
        <div className="block md:hidden divide-y divide-gray-100 font-montserrat">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((req) => {
              const isExpanded = !!expandedRows[req.id];
              return (
                <div key={req.id} className="p-4 flex flex-col transition-all">
                  {/* Item Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedRows(prev => ({ ...prev, [req.id]: !prev[req.id] }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isExpanded ? 'bg-[#10748E] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Client</span>
                        <span className="font-bold text-[#10748E] text-sm truncate max-w-[160px] sm:max-w-[280px]">{req.client}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono font-semibold shrink-0">{req.id}</span>
                  </div>

                  {/* Expanded Item Details */}
                  {isExpanded && (
                    <div className="mt-4 pl-10 pr-2 space-y-3.5 border-l-2 border-gray-100/80 animate-in fade-in duration-200">
                      <div className="grid grid-cols-3 gap-y-3 py-1 font-montserrat text-xs">
                        <span className="text-gray-400 font-bold uppercase">Name</span>
                        <span className="col-span-2 text-gray-900 font-semibold break-all">{req.client}</span>

                        <span className="text-gray-400 font-bold uppercase">Type</span>
                        <span className="col-span-2 text-gray-900 font-semibold">{req.service}</span>

                        <span className="text-gray-400 font-bold uppercase">Canal</span>
                        <span className="col-span-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-700">
                            {req.source}
                          </span>
                        </span>

                        <span className="text-gray-400 font-bold uppercase">Status</span>
                        <span className="col-span-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            req.status === 'Nouveau' ? 'bg-purple-100 text-purple-700' : 
                            req.status === 'Analyse' ? 'bg-orange-100 text-orange-700' : 
                            req.status === 'Devis Envoyé' ? 'bg-[#10748E]/10 text-[#10748E]' : 
                            req.status === 'Refusé' ? 'bg-red-100 text-red-700' : 
                            req.status === 'Signé' ? 'bg-emerald-100 text-emerald-700' : 
                            'bg-green-100 text-green-700'
                          }`}>{req.status}</span>
                        </span>

                        <span className="text-gray-400 font-bold uppercase">Responsable</span>
                        <span className="col-span-2 text-gray-900 font-semibold">
                          {req.resp === "Non assigné" ? (
                            <span className="text-[#AF1818] flex items-center gap-1"><UserPlus size={12} /> Non assigné</span>
                          ) : (
                            <span>{req.resp}</span>
                          )}
                        </span>

                        <span className="text-gray-400 font-bold uppercase">Date</span>
                        <span className="col-span-2 text-gray-500">{req.date}</span>

                        <span className="text-gray-400 font-bold uppercase self-center">Action</span>
                        <div className="col-span-2 flex gap-2">
                          <button 
                            onClick={() => setActiveRequest(req)}
                            className="px-3 py-1.5 bg-[#10748E] text-white text-[10px] font-bold rounded-lg hover:bg-[#0c5a6e] transition-colors shadow-sm"
                          >
                            Gérer / Ouvrir
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 font-montserrat text-sm">
              Aucune demande trouvée avec les filtres actuels.
            </div>
          )}
        </div>
      </div>

      {/* Detail Centered Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveRequest(null)} />
          <div className="relative w-full max-w-xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <span className="font-nevan text-xs text-gray-400">{activeRequest.id}</span>
                <h2 className="font-nevan text-xl text-gray-955 uppercase mt-0.5">{activeRequest.client}</h2>
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-2 text-gray-400 hover:text-gray-955 hover:bg-gray-50 rounded-xl transition-colors shrink-0">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="font-montserrat text-xs text-gray-500 font-bold uppercase block">Type de service</span>
                  <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{activeRequest.service}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="font-montserrat text-xs text-gray-500 font-bold uppercase block">Budget Estimé</span>
                  <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{activeRequest.budget}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="font-montserrat text-xs text-gray-500 font-bold uppercase block">Localisation</span>
                  <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{activeRequest.location}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="font-montserrat text-xs text-gray-500 font-bold uppercase block">Date d'arrivée</span>
                  <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{activeRequest.date}</span>
                </div>
              </div>

              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-2">Description du besoin</h3>
                <p className="font-montserrat text-sm text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">
                  {activeRequest.desc}
                </p>
              </div>

              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-3">Statut actuel</h3>
                <div className="flex flex-wrap gap-2">
                  {["Nouveau", "Analyse", "Devis Envoyé", "Refusé", "Signé", "Clos"].map((status) => (
                    <button 
                      key={status}
                      onClick={() => handleUpdateStatus(activeRequest.id, status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-montserrat border transition-all ${
                        activeRequest.status === status
                          ? "bg-[#10748E] text-white border-[#10748E] shadow-sm shadow-[#10748E]/20"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-3">Responsable affecté</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { name: "Non assigné", role: "Aucun" },
                    { name: "Youssef", role: "Commercial Marrakech" },
                    { name: "Sara", role: "Bureau d'études" }
                  ].map((commercial) => (
                    <button 
                      key={commercial.name}
                      onClick={() => handleAssignResp(activeRequest.id, commercial.name)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        activeRequest.resp === commercial.name
                          ? "border-[#10748E] bg-[#10748E]/5 text-gray-950"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-montserrat text-sm font-bold">{commercial.name}</span>
                        {activeRequest.resp === commercial.name && <Check size={16} className="text-[#10748E]" />}
                      </div>
                      <span className="font-montserrat text-[10px] text-gray-400 mt-1 block">{commercial.role}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setActiveRequest(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button 
                onClick={() => {
                  localStorage.setItem("afe_requests", JSON.stringify(requests));
                  setActiveRequest(null);
                }}
                className="flex-1 py-3 bg-white text-[#10748E] border border-[#10748E] rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#10748E]/5 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={16} /> Enregistrer
              </button>
              <button 
                onClick={() => {
                  setActiveRequest(null);
                  router.push(`/b2b/dashboard/devis/${activeRequest.id}`);
                }}
                className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#10748E]/20"
              >
                Créer Devis <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Devis B2B Modal */}
      {showQuickDevisModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setShowQuickDevisModal(false)} />
          
          <div className="relative w-full max-w-xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200 font-montserrat">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-nevan text-xl text-gray-955 uppercase">
                  {role === "commercial" ? "Ajouter devis rapide" : "Ajouter devis rapide B2B"}
                </h2>
                <p className="font-montserrat text-xs text-gray-400 mt-1">
                  {role === "commercial" 
                    ? "Sélectionnez un client professionnel de votre portefeuille." 
                    : "Sélectionnez un client professionnel inscrit sur la plateforme."}
                </p>
              </div>
              <button onClick={() => setShowQuickDevisModal(false)} className="p-2 text-gray-400 hover:text-gray-955 hover:bg-gray-50 rounded-xl transition-colors shrink-0">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Search size={16} />
                </div>
                <input 
                  type="text" 
                  placeholder="Rechercher par entreprise, contact, ICE..." 
                  value={clientSearchTerm}
                  onChange={(e) => setClientSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              {/* Client List */}
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {matchingClients.length > 0 ? (
                  matchingClients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-start justify-between transition-all ${
                        selectedClientId === client.id
                          ? "border-[#10748E] bg-[#10748E]/5 text-[#10748E]"
                          : "border-gray-200 hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      <div>
                        <div className="font-montserrat text-sm font-bold text-gray-900">{client.company}</div>
                        <div className="font-montserrat text-xs text-gray-500 mt-1">
                          ICE: {client.ice} | Contact: {client.contact}
                        </div>
                        <div className="font-montserrat text-[10px] text-gray-400 mt-0.5">{client.city}</div>
                      </div>
                      {selectedClientId === client.id && <Check size={18} className="text-[#10748E]" />}
                    </button>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-gray-400 font-montserrat italic">
                    {role === "commercial" 
                      ? "Aucun client trouvé dans votre portefeuille." 
                      : "Aucun client professionnel trouvé."}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setShowQuickDevisModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button 
                onClick={() => {
                  if (!selectedClientId) return;
                  setShowQuickDevisModal(false);
                  router.push(`/b2b/dashboard/devis/client-${selectedClientId}`);
                }}
                disabled={!selectedClientId}
                className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#10748E]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Créer Devis <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
