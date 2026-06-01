"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight,
  ArrowLeft,
  Building2,
  MapPin,
  Calendar
} from "lucide-react";

export default function B2BDevisPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(1);

  useGSAP(() => {
    gsap.fromTo(".devis-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-5xl mx-auto">
      
      <div className="devis-item mb-10">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
          Demande de Devis Avancée
        </h1>
        <p className="font-montserrat text-gray-500">
          Renseignez les détails de votre projet industriel ou tertiaire pour une étude précise.
        </p>
      </div>

      <div className="devis-item bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Progress Bar */}
        <div className="bg-gray-50 p-6 border-b border-gray-100">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10" />
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#10748E] -z-10 transition-all duration-500" 
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
            
            {[
              { num: 1, label: "Projet" },
              { num: 2, label: "Spécifications" },
              { num: 3, label: "Documents" },
              { num: 4, label: "Validation" }
            ].map((s) => (
              <div key={s.num} className="flex flex-col items-center gap-2 bg-gray-50 px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-nevan text-sm transition-colors duration-300 ${
                  step >= s.num ? "bg-[#10748E] text-white shadow-md shadow-[#10748E]/20" : "bg-white border-2 border-gray-200 text-gray-400"
                }`}>
                  {step > s.num ? <CheckCircle2 size={20} /> : s.num}
                </div>
                <span className={`font-montserrat text-xs font-semibold ${step >= s.num ? "text-gray-900" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* STEP 1: PROJET */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-nevan text-xl text-gray-900 uppercase mb-6 flex items-center gap-2">
                <Building2 className="text-[#10748E]" /> Informations Générales
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">Nom du projet / Chantier</label>
                  <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 font-montserrat" placeholder="Ex: Usine Renault Kénitra Phase 2" />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">Type de bâtiment</label>
                  <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 font-montserrat">
                    <option>Industriel / Usine</option>
                    <option>Tertiaire / Bureaux</option>
                    <option>Hôtellerie / Restauration</option>
                    <option>Santé / Hôpital</option>
                    <option>Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">Superficie totale estimée (m²)</label>
                  <input type="number" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 font-montserrat" placeholder="Ex: 5000" />
                </div>
                <div>
                  <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">Ville d'intervention</label>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 font-montserrat" placeholder="Ex: Casablanca" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SPECIFICATIONS */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-nevan text-xl text-gray-900 uppercase mb-6 flex items-center gap-2">
                <FileText className="text-[#10748E]" /> Besoins Techniques
              </h2>
              
              <div className="space-y-4 mb-6">
                <label className="block font-montserrat text-sm font-semibold text-gray-700">Domaines d'intervention (plusieurs choix possibles)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {['Climatisation VRV/DRV', 'Centrale de Traitement d\'Air', 'Extraction Fumées', 'Parc Photovoltaïque'].map(opt => (
                    <label key={opt} className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#10748E] hover:bg-blue-50/50 transition-colors bg-gray-50">
                      <input type="checkbox" className="w-4 h-4 text-[#10748E] rounded focus:ring-[#10748E]" />
                      <span className="font-montserrat text-sm font-medium text-gray-700">{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">Description détaillée du besoin</label>
                <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 font-montserrat resize-none" placeholder="Décrivez les contraintes techniques, les normes à respecter..."></textarea>
              </div>

              <div>
                <label className="block font-montserrat text-sm font-semibold text-gray-700 mb-2">Date de début souhaitée</label>
                <div className="relative w-full md:w-1/2">
                  <Calendar size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="date" className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 font-montserrat" />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: UPLOAD */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="font-nevan text-xl text-gray-900 uppercase mb-6 flex items-center gap-2">
                <UploadCloud className="text-[#10748E]" /> Pièces jointes
              </h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-[#10748E] hover:bg-blue-50/30 transition-colors cursor-pointer group">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#10748E]/10 group-hover:text-[#10748E] transition-colors">
                  <UploadCloud size={32} className="text-gray-400 group-hover:text-[#10748E]" />
                </div>
                <h3 className="font-montserrat font-bold text-gray-900 mb-2">Glissez vos fichiers ici</h3>
                <p className="font-montserrat text-sm text-gray-500 mb-6">
                  Plans architecturaux (DWG/PDF), Cahier des charges (CCTP), Photos du site...<br/>
                  (Max 50 Mo par fichier)
                </p>
                <button className="px-6 py-2 bg-white border border-gray-200 shadow-sm rounded-lg font-montserrat text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  Parcourir les fichiers
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: VALIDATION */}
          {step === 4 && (
            <div className="text-center py-12 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h2 className="font-nevan text-3xl text-gray-900 uppercase mb-4">Demande Envoyée !</h2>
              <p className="font-montserrat text-gray-500 max-w-md mx-auto mb-8">
                Votre dossier a été transmis à notre bureau d'études. Un ingénieur commercial vous contactera sous 24h ouvrées.
              </p>
              <div className="inline-flex items-center gap-2 bg-gray-50 border border-gray-200 px-6 py-3 rounded-xl font-montserrat text-sm font-semibold text-gray-700">
                N° de suivi : <span className="text-[#10748E]">DEV-2026-8942</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-12 pt-6 border-t border-gray-100">
              <button 
                onClick={prevStep}
                disabled={step === 1}
                className={`flex items-center gap-2 font-nevan text-sm uppercase tracking-widest px-6 py-3 rounded-xl transition-colors ${
                  step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <ArrowLeft size={18} /> Retour
              </button>
              
              <button 
                onClick={nextStep}
                className="flex items-center gap-2 bg-[#10748E] text-white px-8 py-3 rounded-xl font-nevan text-sm tracking-widest uppercase hover:bg-[#0c5a6e] transition-colors shadow-md"
              >
                {step === 3 ? "Envoyer la demande" : "Étape suivante"} <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
