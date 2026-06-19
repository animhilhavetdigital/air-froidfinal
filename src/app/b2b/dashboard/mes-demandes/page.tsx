"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { INITIAL_REQUESTS, Request } from "@/lib/requests-data";
import { 
  Briefcase, 
  Search, 
  Filter, 
  ChevronRight, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileEdit,
  Plus,
  MessageSquare,
  Check,
  UserPlus,
  ArrowRight
} from "lucide-react";

export default function CommercialDemandesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");
  const [activeRequest, setActiveRequest] = useState<Request | null>(null);
  const [currentCommercialName] = useState<string>("Youssef");
  
  // Quick Devis States
  const [showQuickDevisModal, setShowQuickDevisModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [clients, setClients] = useState<any[]>([]);

  const router = useRouter();
  
  // Note Form State
  const [newNoteText, setNewNoteText] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReqs = localStorage.getItem("afe_requests");
      if (savedReqs) {
        setRequests(JSON.parse(savedReqs));
      } else {
        localStorage.setItem("afe_requests", JSON.stringify(INITIAL_REQUESTS));
        setRequests(INITIAL_REQUESTS);
      }

      // Load clients
      const savedClients = localStorage.getItem("afe_clients");
      if (savedClients) {
        setClients(JSON.parse(savedClients));
      } else {
        const fallback = [
          { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", ice: "001594823000084", status: "Actif", resp: "Youssef" },
          { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Marrakech, Route de Casa", ice: "000847291000072", status: "Actif", resp: "Youssef" },
          { id: "CLI-403", company: "Riad Dar Anika", type: "B2B", contact: "Fatima Zahra El Amrani", email: "contact@dar-anika.ma", phone: "+212 663-124578", city: "Marrakech", ice: "001928374000123", status: "Actif", resp: "Youssef" },
          { id: "CLI-404", company: "Clinique Al Kaoutar", type: "B2B", contact: "Dr. Omar Benali", email: "o.benali@alkaoutar.ma", phone: "+212 664-332211", city: "Rabat", ice: "002345678901234", status: "Actif", resp: "Youssef" },
          { id: "CLI-405", company: "Restaurant La Table du Marché", type: "B2B", contact: "Karim El Fassi", email: "k.elfassi@latablemarche.ma", phone: "+212 665-998877", city: "Marrakech", ice: "003456789012345", status: "Actif", resp: "Youssef" },
          { id: "CLI-399", company: "Villa Palmeraie", type: "B2B", contact: "Jean Dupont", email: "j.dupont@gmail.com", phone: "+212 665-123456", city: "Marrakech", ice: "002948103000067", status: "Actif", resp: "Sara" },
          { id: "CLI-398", company: "Riad Dar Anika Old", type: "B2B", contact: "Omar Lahrizi", email: "info@daranika.com", phone: "+212 524-389150", city: "Marrakech", ice: "002485910000031", status: "Actif", resp: "Non assigné" },
          { id: "CLI-390", company: "Société Al Boustane", type: "B2B", contact: "Yassine Boustane", email: "y.boustane@alboustane.co.ma", phone: "+212 660-842915", city: "Marrakech", ice: "003512948000095", status: "En attente", resp: "Non assigné" },
        ];
        localStorage.setItem("afe_clients", JSON.stringify(fallback));
        setClients(fallback);
      }
    }
  }, []);

  useGSAP(() => {
    gsap.fromTo(".com-dem-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const allowedRequests = requests.filter(req => req.source === "B2B" && req.resp === currentCommercialName);

  const filteredRequests = allowedRequests.filter(req => {
    const matchesSearch = req.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Tous" || req.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Strict filtration of B2B clients for the commercial's "Ajouter devis rapide"
  const commercialClients = (clients || []).filter(c => c.resp === currentCommercialName);
  const matchingClients = commercialClients.filter(c => 
    c.company.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    c.contact.toLowerCase().includes(clientSearchTerm.toLowerCase()) ||
    (c.ice && c.ice.includes(clientSearchTerm))
  );

  const updateRequestsStore = (newRequests: Request[]) => {
    setRequests(newRequests);
    localStorage.setItem("afe_requests", JSON.stringify(newRequests));
  };

  const handleUpdateStatus = (id: string, statusName: string) => {
    const updated = requests.map(r => r.id === id ? { ...r, status: statusName } : r);
    updateRequestsStore(updated);
    if (activeRequest && activeRequest.id === id) {
      setActiveRequest(prev => prev ? { ...prev, status: statusName } : null);
    }
  };

  const handleAddNote = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const updated = requests.map(r => {
      if (r.id === id) {
        return { ...r, notes: [...(r.notes || []), newNoteText.trim()] };
      }
      return r;
    });
    updateRequestsStore(updated);

    if (activeRequest && activeRequest.id === id) {
      setActiveRequest(prev => prev ? { ...prev, notes: [...(prev.notes || []), newNoteText.trim()] } : null);
    }

    setNewNoteText("");
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="com-dem-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Mes Demandes Actives</h1>
          <p className="font-montserrat text-gray-500">Gérez, qualifiez et relancez les demandes sous votre responsabilité.</p>
        </div>
        <button
          onClick={() => {
            setSelectedClientId("");
            setClientSearchTerm("");
            setShowQuickDevisModal(true);
          }}
          className="px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase tracking-wide hover:bg-[#0c5a6e] transition-colors flex items-center gap-2 shadow-md shadow-[#10748E]/20 shrink-0"
        >
          Ajouter devis rapide
        </button>
      </div>

      {/* KPI mini row */}
      <div className="com-dem-item grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-[#10748E]/10 rounded-xl flex items-center justify-center text-[#10748E]">
            <Briefcase size={24} />
          </div>
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">Mes Demandes</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{requests.length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">En Analyse</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{requests.filter(r => r.status === "Analyse").length}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">Devis Envoyés</div>
            <div className="font-nevan text-2xl text-gray-900 mt-1">{requests.filter(r => r.status === "Devis Envoyé").length}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="com-dem-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher mes dossiers..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="font-montserrat text-xs font-bold text-gray-400 uppercase shrink-0">Statut:</span>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full md:w-48"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Nouveau">Nouveau</option>
            <option value="Analyse">Analyse</option>
            <option value="Devis Envoyé">Devis Envoyé</option>
            <option value="Refusé">Refusé</option>
            <option value="Signé">Signé</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="com-dem-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Réf / Client</th>
                <th className="px-6 py-4">Solution Technique</th>
                <th className="px-6 py-4">Budget</th>
                <th className="px-6 py-4">Localisation</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Reçu le</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/30 transition-colors group cursor-pointer" onClick={() => setActiveRequest(req)}>
                    <td className="px-6 py-4">
                      <div className="font-nevan text-xs text-[#10748E] mb-0.5">{req.id}</div>
                      <div className="font-bold text-gray-900">{req.client}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-700">{req.service}</td>
                    <td className="px-6 py-4 text-gray-900 font-semibold">{req.budget}</td>
                    <td className="px-6 py-4 text-gray-500">{req.location}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Nouveau' ? 'bg-purple-100 text-purple-700' : 
                        req.status === 'Analyse' ? 'bg-orange-100 text-orange-700' : 
                        req.status === 'Devis Envoyé' ? 'bg-[#10748E]/10 text-[#10748E]' : 
                        req.status === 'Refusé' ? 'bg-red-100 text-red-700' : 
                        'bg-emerald-100 text-emerald-700'
                      }`}>{req.status}</span>
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
                    Aucun dossier actif ne correspond aux filtres.
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
                <span className="font-nevan text-xs text-[#10748E]">{activeRequest.id}</span>
                <h2 className="font-nevan text-xl text-gray-900 uppercase mt-0.5">{activeRequest.client}</h2>
              </div>
              <button onClick={() => setActiveRequest(null)} className="p-2 text-gray-400 hover:text-gray-950 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Info grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="font-montserrat text-xs text-gray-500 font-bold uppercase block">Service technique</span>
                  <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{activeRequest.service}</span>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <span className="font-montserrat text-xs text-gray-500 font-bold uppercase block">Estimation budget</span>
                  <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{activeRequest.budget}</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-2">Description de la demande</h3>
                <p className="font-montserrat text-sm text-gray-600 bg-gray-50 p-4 rounded-xl leading-relaxed">
                  {activeRequest.desc}
                </p>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-3">Changer le statut</h3>
                <div className="flex flex-wrap gap-2">
                  {["Nouveau", "Analyse", "Devis Envoyé", "Refusé", "Signé"].map((status) => (
                    <button 
                      key={status}
                      onClick={() => handleUpdateStatus(activeRequest.id, status)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold font-montserrat border transition-all ${
                        activeRequest.status === status
                          ? "bg-[#10748E] text-white border-[#10748E]"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <h3 className="font-nevan text-sm text-gray-950 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <MessageSquare size={16} className="text-[#10748E]" /> Historique des notes internes
                </h3>
                
                <div className="space-y-3 mb-4">
                  {(activeRequest.notes || []).length > 0 ? (
                    (activeRequest.notes || []).map((note, idx) => (
                      <div key={idx} className="bg-blue-50/50 border border-[#10748E]/10 p-3 rounded-xl">
                        <p className="font-montserrat text-sm text-gray-800">{note}</p>
                        <span className="font-montserrat text-[10px] text-gray-400 block mt-1">Écrit par Youssef</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-400 text-xs italic font-montserrat">Aucune note de suivi rédigée pour le moment.</div>
                  )}
                </div>

                <form onSubmit={(e) => handleAddNote(e, activeRequest.id)} className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Ajouter un commentaire de suivi..." 
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                  <button type="submit" className="px-4 py-2 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase hover:bg-[#0c5a6e] transition-colors shrink-0">
                    Ajouter
                  </button>
                </form>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setActiveRequest(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button 
                onClick={() => {
                  updateRequestsStore(requests);
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
                className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2"
              >
                <FileEdit size={16} /> Rédiger Devis
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
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-nevan text-xl text-gray-950 uppercase">Ajouter devis rapide</h2>
                <p className="font-montserrat text-xs text-gray-400 mt-1">Sélectionnez un client professionnel de votre portefeuille.</p>
              </div>
              <button onClick={() => setShowQuickDevisModal(false)} className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Search Bar */}
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
                  <div className="text-center py-6 text-xs text-gray-400 font-montserrat italic">Aucun client trouvé dans votre portefeuille.</div>
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
                Rédiger Devis <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
