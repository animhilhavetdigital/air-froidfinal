"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { INITIAL_REQUESTS, Request } from "@/lib/requests-data";
import { 
  Search, 
  Filter, 
  ChevronRight, 
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
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [selectedSource, setSelectedSource] = useState("Tous");
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const router = useRouter();

  useGSAP(() => {
    gsap.fromTo(".dem-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Tous" || req.status === selectedStatus;
    const matchesSource = selectedSource === "Tous" || req.source === selectedSource;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleAssignResp = (id: string, respName: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, resp: respName, status: r.status === "Nouveau" ? "Analyse" : r.status } : r));
    if (activeRequest && activeRequest.id === id) {
      setActiveRequest(prev => prev ? { ...prev, resp: respName, status: prev.status === "Nouveau" ? "Analyse" : prev.status } : null);
    }
  };

  const handleUpdateStatus = (id: string, statusName: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: statusName } : r));
    if (activeRequest && activeRequest.id === id) {
      setActiveRequest(prev => prev ? { ...prev, status: statusName } : null);
    }
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="dem-item flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Tour de contrôle des Demandes</h1>
          <p className="font-montserrat text-gray-500">Supervisez et orientez toutes les demandes entrantes de la plateforme Air Froid Expert.</p>
        </div>
      </div>

      {/* KPI mini row */}
      <div className="dem-item grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">Total Demandes</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{requests.length}</div>
          </div>
          <FileText className="text-[#10748E]" size={28} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">Non assignées</div>
            <div className="font-nevan text-2xl text-[#AF1818] mt-1">{requests.filter(r => r.resp === "Non assigné").length}</div>
          </div>
          <UserPlus className="text-[#AF1818]" size={28} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">En Analyse</div>
            <div className="font-nevan text-2xl text-orange-600 mt-1">{requests.filter(r => r.status === "Analyse").length}</div>
          </div>
          <Clock className="text-orange-500" size={28} />
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-semibold uppercase">Taux d'affection</div>
            <div className="font-nevan text-2xl text-green-600 mt-1">
              {Math.round(((requests.length - requests.filter(r => r.resp === "Non assigné").length) / requests.length) * 100)}%
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
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full"
            >
              <option value="Tous">Tous</option>
              <option value="Nouveau">Nouveau</option>
              <option value="Analyse">Analyse</option>
              <option value="Devis Envoyé">Devis Envoyé</option>
              <option value="Clos">Clos</option>
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="font-montserrat text-xs font-bold text-gray-400 uppercase shrink-0">Source:</span>
            <select 
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full"
            >
              <option value="Tous">Tous</option>
              <option value="B2B">Portail B2B</option>
              <option value="Formulaire">Site Web</option>
              <option value="WhatsApp">WhatsApp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main requests list */}
      <div className="dem-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-montserrat text-sm">
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
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        req.source === 'WhatsApp' ? 'bg-green-100 text-green-700' : 
                        req.source === 'B2B' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>{req.source}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Nouveau' ? 'bg-purple-100 text-purple-700' : 
                        req.status === 'Analyse' ? 'bg-orange-100 text-orange-700' : 
                        req.status === 'Devis Envoyé' ? 'bg-[#10748E]/10 text-[#10748E]' : 'bg-green-100 text-green-700'
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
      </div>

      {/* Detail Centered Modal */}
      {activeRequest && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveRequest(null)} />
          
          {/* Content */}
          <div className="relative w-full max-w-xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-nevan text-xs text-gray-400">{activeRequest.id}</span>
                <h2 className="font-nevan text-xl text-gray-950 uppercase mt-0.5">{activeRequest.client}</h2>
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
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

              {/* Description */}
              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-2">Description du besoin</h3>
                <p className="font-montserrat text-sm text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">
                  {activeRequest.desc}
                </p>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-3">Statut actuel</h3>
                <div className="flex flex-wrap gap-2">
                  {["Nouveau", "Analyse", "Devis Envoyé", "Clos"].map((status) => (
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

              {/* Commercial Assignment */}
              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-3">Responsable affecté</h3>
                <div className="grid grid-cols-3 gap-3">
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

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => setActiveRequest(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
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

    </div>
  );
}
