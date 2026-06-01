"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Download, 
  FileText, 
  Search, 
  Filter,
  Eye,
  Settings
} from "lucide-react";

const DOCS = [
  { id: 1, type: "PDF", title: "Fiche Technique VRV Daikin Série 4", category: "Climatisation Industrielle", size: "2.4 MB" },
  { id: 2, type: "ZIP", title: "Plans BIM - Centrales de Traitement d'Air", category: "Ventilation", size: "45 MB" },
  { id: 3, type: "PDF", title: "Guide d'Installation Panneaux Photovoltaïques B2B", category: "Solaire", size: "8.1 MB" },
  { id: 4, type: "XLS", title: "Matrice de Calcul Thermique Avancée", category: "Outils", size: "1.2 MB" },
  { id: 5, type: "PDF", title: "Catalogue Pièces de Rechange 2026", category: "Maintenance", size: "12 MB" },
];

export default function B2BCataloguePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useGSAP(() => {
    gsap.fromTo(".cat-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto">
      
      <div className="cat-item mb-10">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
          Catalogue Professionnel
        </h1>
        <p className="font-montserrat text-gray-500">
          Accédez à la documentation technique détaillée et aux fiches produits réservées aux professionnels.
        </p>
      </div>

      <div className="cat-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher une documentation..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-montserrat text-sm font-semibold hover:bg-gray-100 transition-colors shrink-0">
          <Filter size={18} /> Filtrer par catégorie
        </button>
      </div>

      <div className="cat-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-12">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Catégorie</th>
                <th className="px-6 py-4">Taille</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {DOCS.filter(d => d.title.toLowerCase().includes(searchTerm.toLowerCase())).map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-red-50 text-[#AF1818] flex items-center justify-center font-bold text-xs shrink-0">
                        {doc.type}
                      </div>
                      <span className="font-semibold text-gray-900 group-hover:text-[#10748E] transition-colors">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{doc.category}</td>
                  <td className="px-6 py-4 text-gray-500">{doc.size}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors">
                        <Download size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="cat-item bg-[#1A2634] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#32A5DE] rounded-full blur-[100px] opacity-20" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-4 text-[#32A5DE]">
            <Settings size={24} />
            <h3 className="font-nevan text-2xl uppercase tracking-wider">Solutions Sur-Mesure</h3>
          </div>
          <p className="font-montserrat text-gray-300 leading-relaxed">
            Vous ne trouvez pas la configuration exacte pour votre projet ? Nos ingénieurs conçoivent des systèmes thermiques industriels sur-mesure répondant à vos cahiers des charges les plus stricts.
          </p>
        </div>
        <button className="relative z-10 shrink-0 bg-[#32A5DE] text-white px-8 py-4 rounded-xl font-nevan tracking-widest uppercase hover:bg-[#2884b2] transition-colors shadow-lg">
          Contacter le bureau d'études
        </button>
      </div>

    </div>
  );
}
