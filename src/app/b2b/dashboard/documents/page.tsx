"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  FolderOpen, 
  Search, 
  Download, 
  Eye, 
  FileText, 
  Filter, 
  CheckCircle2,
  FileSpreadsheet,
  Archive
} from "lucide-react";

// Document types for client B2B
const DOC_TYPES = [
  { key: "Tous", label: "Tous les documents", icon: FolderOpen },
  { key: "Devis", label: "Documents de devis", icon: FileText },
  { key: "Fiche technique", label: "Fiches techniques", icon: FileSpreadsheet },
  { key: "Dossier", label: "Dossiers", icon: Archive },
];

// Mock documents with type classification
const DOCUMENTS_LIST = [
  { id: 1, type: "PDF", docType: "Fiche technique", title: "Fiche Technique VRV Daikin Série 4", category: "Climatisation Industrielle", size: "2.4 MB", date: "15 Mai 2026" },
  { id: 2, type: "ZIP", docType: "Dossier", title: "Plans BIM - Centrales de Traitement d'Air", category: "Ventilation", size: "45 MB", date: "20 Mai 2026" },
  { id: 3, type: "PDF", docType: "Fiche technique", title: "Guide d'Installation Panneaux Photovoltaïques B2B", category: "Solaire", size: "8.1 MB", date: "10 Avril 2026" },
  { id: 4, type: "XLS", docType: "Dossier", title: "Matrice de Calcul Thermique Avancée", category: "Outils", size: "1.2 MB", date: "12 Juin 2026" },
  { id: 5, type: "PDF", docType: "Fiche technique", title: "Catalogue Pièces de Rechange 2026", category: "Maintenance", size: "12 MB", date: "01 Janvier 2026" },
  { id: 6, type: "PDF", docType: "Fiche technique", title: "Certificats CE & Attestations de Capacité AFE", category: "Qualité", size: "1.5 MB", date: "05 Mars 2026" },
  { id: 7, type: "PDF", docType: "Devis", title: "Devis VRV Siège Casablanca - DEV-2026-004", category: "Devis", size: "1.1 MB", date: "18 Juin 2026" },
  { id: 8, type: "PDF", docType: "Devis", title: "Devis Froid Commercial Supermarché Marjane - DEV-2026-003", category: "Devis", size: "0.9 MB", date: "15 Juin 2026" },
];

export default function B2BDocumentsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDocType, setSelectedDocType] = useState("Tous");
  
  // Feedback notification
  const [downloadingName, setDownloadingName] = useState<string | null>(null);

  useGSAP(() => {
    gsap.fromTo(".doc-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const filteredDocs = DOCUMENTS_LIST.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedDocType === "Tous" || doc.docType === selectedDocType;
    return matchesSearch && matchesType;
  });

  const handleDownload = (title: string) => {
    setDownloadingName(title);
    setTimeout(() => setDownloadingName(null), 3000);
  };

  return (
    <div ref={containerRef} className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="doc-item">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-3">
          <FolderOpen className="text-[#10748E]" size={32} /> Documents
        </h1>
        <p className="font-montserrat text-gray-500">Accédez à vos devis, fiches techniques et dossiers en libre service.</p>
      </div>

      {/* Downloading Alert */}
      {downloadingName && (
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 text-sm font-semibold font-montserrat doc-item animate-in fade-in duration-300">
          <CheckCircle2 size={20} /> Téléchargement initié pour : <strong>{downloadingName}</strong>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="doc-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher un document..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Document Type Filter Buttons */}
        <div className="flex flex-wrap gap-3">
          {DOC_TYPES.map((docType) => {
            const Icon = docType.icon;
            const isActive = selectedDocType === docType.key;
            return (
              <button
                key={docType.key}
                onClick={() => setSelectedDocType(docType.key)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-montserrat text-sm font-semibold border transition-all ${
                  isActive 
                    ? "bg-[#10748E] text-white border-[#10748E] shadow-md shadow-[#10748E]/20" 
                    : "bg-white text-gray-600 border-gray-200 hover:border-[#10748E] hover:text-[#10748E]"
                }`}
              >
                <Icon size={16} />
                {docType.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="doc-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Nom du document</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Taille</th>
                <th className="px-6 py-4">Mise à jour</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-50 text-[#AF1818] flex items-center justify-center font-bold text-xs shrink-0">
                          {doc.type}
                        </div>
                        <span className="font-semibold text-gray-900 group-hover:text-[#10748E] transition-colors">{doc.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        doc.docType === "Devis" ? "bg-[#10748E]/10 text-[#10748E]" :
                        doc.docType === "Fiche technique" ? "bg-green-50 text-green-700" :
                        "bg-orange-50 text-orange-700"
                      }`}>
                        {doc.docType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">{doc.size}</td>
                    <td className="px-6 py-4 text-gray-400">{doc.date}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => alert(`Aperçu en cours pour : ${doc.title}`)}
                          className="p-2 text-gray-400 hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleDownload(doc.title)}
                          className="p-2 text-gray-400 hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Download size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-montserrat">
                    Aucun document ne correspond aux critères.
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
