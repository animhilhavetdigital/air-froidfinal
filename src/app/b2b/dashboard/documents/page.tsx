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
  CheckCircle2 
} from "lucide-react";

// Mock technical documents
const DOCUMENTS_LIST = [
  { id: 1, type: "PDF", title: "Fiche Technique VRV Daikin Série 4", category: "Climatisation Industrielle", size: "2.4 MB", date: "15 Mai 2026" },
  { id: 2, type: "ZIP", title: "Plans BIM - Centrales de Traitement d'Air", category: "Ventilation", size: "45 MB", date: "20 Mai 2026" },
  { id: 3, type: "PDF", title: "Guide d'Installation Panneaux Photovoltaïques B2B", category: "Solaire", size: "8.1 MB", date: "10 Avril 2026" },
  { id: 4, type: "XLS", title: "Matrice de Calcul Thermique Avancée", category: "Outils", size: "1.2 MB", date: "12 Juin 2026" },
  { id: 5, type: "PDF", title: "Catalogue Pièces de Rechange 2026", category: "Maintenance", size: "12 MB", date: "01 Janvier 2026" },
  { id: 6, type: "PDF", title: "Certificats CE & Attestations de Capacité AFE", category: "Qualité", size: "1.5 MB", date: "05 Mars 2026" },
];

export default function B2BDocumentsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tous");
  
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
    const matchesCategory = selectedCategory === "Tous" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDownload = (title: string) => {
    setDownloadingName(title);
    setTimeout(() => setDownloadingName(null), 3000);
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="doc-item">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-3">
          <FolderOpen className="text-[#10748E]" size={32} /> Documents Techniques
        </h1>
        <p className="font-montserrat text-gray-500">Accédez en libre service à la bibliothèque de notices, fiches produits et documentations réglementaires.</p>
      </div>

      {/* Downloading Alert */}
      {downloadingName && (
        <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 text-sm font-semibold font-montserrat doc-item animate-in fade-in duration-300">
          <CheckCircle2 size={20} /> Téléchargement initié pour : <strong>{downloadingName}</strong>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="doc-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher une notice, un plan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Filter Category */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="font-montserrat text-xs font-bold text-gray-400 uppercase shrink-0">Catégorie:</span>
          <select 
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full md:w-48"
          >
            <option value="Tous">Toutes catégories</option>
            <option value="Climatisation Industrielle">Climatisation</option>
            <option value="Ventilation">Ventilation</option>
            <option value="Solaire">Solaire</option>
            <option value="Outils">Outils de calcul</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Qualité">Qualité & CE</option>
          </select>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="doc-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Nom du document</th>
                <th className="px-6 py-4">Catégorie</th>
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
                    <td className="px-6 py-4 text-gray-500">{doc.category}</td>
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
                    Aucun document technique ne correspond aux critères.
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
