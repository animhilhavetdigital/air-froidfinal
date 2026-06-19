"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  FileText,
  ChevronDown,
  Search,
  XCircle,
  Send
} from "lucide-react";
import { INITIAL_REQUESTS, Request } from "@/lib/requests-data";

interface TimelineStep {
  step: string;
  date: string;
  done: boolean;
  active: boolean;
  icon: any;
}

export default function B2BSuiviPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [currentClientCompany, setCurrentClientCompany] = useState<string>("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Tous");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Load current B2B client
    const currentClientId = localStorage.getItem("afe_current_client_id") || "CLI-402";
    const savedClients = localStorage.getItem("afe_clients");
    let companyName = "";
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      const client = clients.find((c: any) => c.id === currentClientId);
      if (client) {
        companyName = client.company;
      }
    }
    if (!companyName) {
      // Fallback mapping for default clients
      const fallbackMap: Record<string, string> = {
        "CLI-402": "Hôtel Royal Atlas",
        "CLI-401": "Supermarché Marjane",
        "CLI-399": "Villa Palmeraie",
        "CLI-398": "Riad Dar Anika",
        "CLI-390": "Société Al Boustane",
      };
      companyName = fallbackMap[currentClientId] || "";
    }
    setCurrentClientCompany(companyName);

    // Load requests
    const savedReqs = localStorage.getItem("afe_requests");
    if (savedReqs) {
      setRequests(JSON.parse(savedReqs));
    } else {
      localStorage.setItem("afe_requests", JSON.stringify(INITIAL_REQUESTS));
      setRequests(INITIAL_REQUESTS);
    }
  }, []);

  useGSAP(() => {
    gsap.fromTo(".suivi-item",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const getStepIndex = (status: string) => {
    if (status === "Refusé" || status === "Signé" || status === "Accepté") return 2;
    if (status === "Devis Envoyé") return 1;
    return 0; // Nouveau / Analyse / default
  };

  const getTimeline = (req: Request): TimelineStep[] => {
    const activeIndex = getStepIndex(req.status);
    const isRefused = req.status === "Refusé";
    
    return [
      { 
        step: "Encore en analyse", 
        date: activeIndex === 0 ? "En cours" : "Terminé", 
        done: activeIndex >= 0, 
        active: activeIndex === 0,
        icon: Clock 
      },
      { 
        step: "Devis envoyé", 
        date: activeIndex >= 1 ? (activeIndex === 1 ? "Devis transmis" : "Terminé") : "En attente", 
        done: activeIndex >= 1, 
        active: activeIndex === 1,
        icon: Send 
      },
      { 
        step: isRefused ? "Devis refusé" : "Devis accepté", 
        date: activeIndex === 2 ? (isRefused ? "Refusé" : "Accepté") : "En attente", 
        done: activeIndex >= 2, 
        active: activeIndex === 2,
        icon: isRefused ? XCircle : CheckCircle2 
      },
    ];
  };

  const getRequestStatus = (status: string) => {
    if (status === "Refusé") return "Refusé";
    if (status === "Signé" || status === "Accepté") return "Accepté";
    if (status === "Devis Envoyé") return "Devis envoyé";
    return "En analyse";
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "Refusé") return "bg-red-100 text-red-700";
    if (status === "Signé" || status === "Accepté") return "bg-emerald-100 text-emerald-700";
    if (status === "Devis Envoyé") return "bg-[#10748E]/10 text-[#10748E]";
    return "bg-orange-100 text-orange-700";
  };

  const getProgress = (status: string) => {
    const idx = getStepIndex(status);
    return ((idx + 1) / 3) * 100;
  };

  const clientRequests = requests.filter(req => 
    req.source === "B2B" && 
    req.client.toLowerCase() === currentClientCompany.toLowerCase()
  );

  const filteredRequests = clientRequests.filter(req => {
    const matchesSearch = req.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          req.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "Tous" || getRequestStatus(req.status) === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-5xl mx-auto">
      
      <div className="suivi-item mb-10">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
          Suivi de mes demandes de devis
        </h1>
        <p className="font-montserrat text-gray-500">
          Suivez l'avancement de vos demandes de devis : analyse, envoi, acceptation ou refus.
        </p>
      </div>

      <div className="suivi-item flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher une demande (ID, service, ville)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 shadow-sm font-montserrat text-sm"
          />
        </div>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-6 py-3 focus:outline-none focus:border-[#10748E] shadow-sm font-montserrat text-sm font-semibold text-gray-700"
        >
          <option value="Tous">Tous les statuts</option>
          <option value="En analyse">En analyse</option>
          <option value="Devis envoyé">Devis envoyé</option>
          <option value="Accepté">Accepté</option>
          <option value="Refusé">Refusé</option>
        </select>
      </div>

      <div className="space-y-6">
        {filteredRequests.length > 0 ? filteredRequests.map((req) => {
          const timeline = getTimeline(req);
          const statusLabel = getRequestStatus(req.status);
          const progress = getProgress(req.status);
          
          return (
            <div key={req.id} className="suivi-item bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              
              {/* Header / Summary */}
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                onClick={() => setExpandedId(expandedId === req.id ? null : req.id)}
              >
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-nevan text-sm text-gray-400">{req.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-montserrat ${getStatusBadgeClass(req.status)}`}>
                      {statusLabel}
                    </span>
                  </div>
                  <h3 className="font-montserrat font-bold text-gray-900 text-lg mb-2">{req.service}</h3>
                  <div className="flex items-center gap-6 text-sm font-montserrat text-gray-500">
                    <span className="flex items-center gap-1"><MapPin size={16} /> {req.location}</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> Reçu le {req.date}</span>
                  </div>
                </div>
                
                <div className="w-full md:w-48 shrink-0 flex items-center gap-6">
                  <div className="flex-grow">
                    <div className="flex justify-between text-xs font-montserrat mb-1">
                      <span className="text-gray-500">Avancement</span>
                      <span className="font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${req.status === "Refusé" ? "bg-red-500" : req.status === "Signé" || req.status === "Accepté" ? "bg-emerald-500" : "bg-[#10748E]"}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                  <ChevronDown 
                    size={24} 
                    className={`text-gray-400 transition-transform duration-300 ${expandedId === req.id ? 'rotate-180' : ''}`} 
                  />
                </div>
              </div>

              {/* Timeline Details */}
              <div 
                className="overflow-hidden transition-all duration-500 ease-in-out bg-gray-50/50"
                style={{ maxHeight: expandedId === req.id ? "800px" : "0", opacity: expandedId === req.id ? 1 : 0 }}
              >
                <div className="p-6 md:p-8 border-t border-gray-100">
                  <h4 className="font-nevan text-sm text-gray-900 uppercase tracking-widest mb-8">Détail des étapes</h4>
                  
                  <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
                    {timeline.map((step, idx) => {
                      const Icon = step.icon;
                      return (
                        <div key={idx} className="relative pl-8">
                          {/* Node Icon */}
                          <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${
                            step.active 
                              ? req.status === "Refusé" ? 'bg-red-500 text-white' : 'bg-[#10748E] text-white' 
                              : step.done 
                                ? req.status === "Refusé" 
                                  ? 'bg-red-500 text-white' 
                                  : 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-400'
                          }`}>
                            <Icon size={step.active ? 18 : 16} />
                          </div>
                          
                          <div>
                            <h5 className={`font-montserrat font-bold mb-1 ${step.done || step.active ? 'text-gray-900' : 'text-gray-500'}`}>
                              {step.step}
                            </h5>
                            <p className="font-montserrat text-sm text-gray-500 flex items-center gap-2">
                              <Clock size={14} /> {step.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-lg font-montserrat text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                      <FileText size={16} /> Télécharger le devis (PDF)
                    </button>
                  </div>
                </div>
              </div>

            </div>
          );
        }) : (
          <div className="suivi-item bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
              <FileText size={32} />
            </div>
            <h3 className="font-montserrat font-bold text-gray-900 text-lg mb-2">Aucune demande trouvée</h3>
            <p className="font-montserrat text-sm text-gray-500">
              Vous n'avez pas encore de demande de devis suivant ces critères.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
