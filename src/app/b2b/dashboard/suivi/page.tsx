"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Wrench, 
  FileCheck,
  ChevronDown,
  Search
} from "lucide-react";

const CHANTIERS = [
  {
    id: "PRJ-2026-042",
    name: "Installation VRV Siège Casablanca",
    status: "En cours",
    progress: 65,
    location: "Casablanca, Sidi Maarouf",
    date: "Début : 12 Mai 2026",
    timeline: [
      { step: "Validation Devis", date: "02 Mai 2026", done: true },
      { step: "Approvisionnement Matériel", date: "10 Mai 2026", done: true },
      { step: "Pose des unités intérieures", date: "15 Mai 2026", done: true },
      { step: "Installation groupes extérieurs", date: "Prévu le 20 Mai 2026", done: false },
      { step: "Mise en service & Tests", date: "Prévu le 25 Mai 2026", done: false },
    ]
  },
  {
    id: "PRJ-2026-038",
    name: "Maintenance Annuelle Entrepôt",
    status: "Planifié",
    progress: 0,
    location: "Tanger Free Zone",
    date: "Prévu : 28 Mai 2026",
    timeline: [
      { step: "Validation Contrat", date: "15 Avr 2026", done: true },
      { step: "Intervention sur site", date: "Prévu le 28 Mai 2026", done: false },
      { step: "Rapport d'intervention", date: "Prévu le 29 Mai 2026", done: false },
    ]
  }
];

export default function B2BSuiviPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>("PRJ-2026-042");

  useGSAP(() => {
    gsap.fromTo(".suivi-item",
      { opacity: 0, x: -20 },
      { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-5xl mx-auto">
      
      <div className="suivi-item mb-10">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
          Suivi des Chantiers & Interventions
        </h1>
        <p className="font-montserrat text-gray-500">
          Suivez l'avancement de vos projets en temps réel, de la validation à la mise en service.
        </p>
      </div>

      <div className="suivi-item flex gap-4 mb-8">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Rechercher un projet (ID, Nom, Ville)..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 shadow-sm font-montserrat text-sm"
          />
        </div>
        <select className="bg-white border border-gray-200 rounded-xl px-6 py-3 focus:outline-none focus:border-[#10748E] shadow-sm font-montserrat text-sm font-semibold text-gray-700">
          <option>Tous les statuts</option>
          <option>En cours</option>
          <option>Planifié</option>
          <option>Terminé</option>
        </select>
      </div>

      <div className="space-y-6">
        {CHANTIERS.map((chantier) => (
          <div key={chantier.id} className="suivi-item bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Header / Summary */}
            <div 
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
              onClick={() => setExpandedId(expandedId === chantier.id ? null : chantier.id)}
            >
              <div className="flex-grow">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-nevan text-sm text-gray-400">{chantier.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-montserrat ${
                    chantier.status === 'En cours' ? 'bg-blue-100 text-[#10748E]' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {chantier.status}
                  </span>
                </div>
                <h3 className="font-montserrat font-bold text-gray-900 text-lg mb-2">{chantier.name}</h3>
                <div className="flex items-center gap-6 text-sm font-montserrat text-gray-500">
                  <span className="flex items-center gap-1"><MapPin size={16} /> {chantier.location}</span>
                  <span className="flex items-center gap-1"><Clock size={16} /> {chantier.date}</span>
                </div>
              </div>
              
              <div className="w-full md:w-48 shrink-0 flex items-center gap-6">
                <div className="flex-grow">
                  <div className="flex justify-between text-xs font-montserrat mb-1">
                    <span className="text-gray-500">Avancement</span>
                    <span className="font-bold">{chantier.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-[#10748E] transition-all duration-1000"
                      style={{ width: `${chantier.progress}%` }}
                    />
                  </div>
                </div>
                <ChevronDown 
                  size={24} 
                  className={`text-gray-400 transition-transform duration-300 ${expandedId === chantier.id ? 'rotate-180' : ''}`} 
                />
              </div>
            </div>

            {/* Timeline Details */}
            <div 
              className="overflow-hidden transition-all duration-500 ease-in-out bg-gray-50/50"
              style={{ maxHeight: expandedId === chantier.id ? "800px" : "0", opacity: expandedId === chantier.id ? 1 : 0 }}
            >
              <div className="p-6 md:p-8 border-t border-gray-100">
                <h4 className="font-nevan text-sm text-gray-900 uppercase tracking-widest mb-8">Détail des étapes</h4>
                
                <div className="relative border-l-2 border-gray-200 ml-4 space-y-8">
                  {chantier.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-8">
                      {/* Node Icon */}
                      <div className={`absolute -left-[17px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${
                        step.done ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {step.done ? <CheckCircle2 size={16} /> : <Wrench size={14} />}
                      </div>
                      
                      <div>
                        <h5 className={`font-montserrat font-bold mb-1 ${step.done ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.step}
                        </h5>
                        <p className="font-montserrat text-sm text-gray-500 flex items-center gap-2">
                          <Clock size={14} /> {step.date}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                  <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-200 rounded-lg font-montserrat text-sm font-semibold text-gray-700 hover:bg-gray-50 shadow-sm transition-colors">
                    <FileCheck size={16} /> Télécharger le rapport (PDF)
                  </button>
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
