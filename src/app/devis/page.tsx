"use client";

import { useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Sun, Wind, Home, ChefHat, 
  MapPin, Camera, User, Phone, 
  Mail, CheckCircle2, ChevronRight, 
  ChevronLeft, MessageSquare 
} from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/constants";

const SERVICES = [
  { id: "solaire", label: "Énergie Solaire", icon: Sun },
  { id: "climatisation", label: "Climatisation", icon: Home },
  { id: "ventilation", label: "Ventilation", icon: Wind },
  { id: "cuisine", label: "Cuisine Pro", icon: ChefHat },
];

export default function DevisPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    service: "",
    description: "",
    ville: "",
    nom: "",
    telephone: "",
    email: ""
  });
  
  // Update form data
  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // WhatsApp dynamic link
  const generateWhatsAppLink = () => {
    const serviceText = formData.service ? ` concernant le service ${formData.service}` : "";
    const text = encodeURIComponent(`Bonjour, je vous contacte depuis votre site web${serviceText}. J'aimerais avoir plus d'informations.`);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
      gsap.fromTo(".step-content", 
        { opacity: 0, x: 20 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
      gsap.fromTo(".step-content", 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-32 pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 tracking-wide uppercase mb-4">
            Demande de <span className="text-primary">Devis</span>
          </h1>
          <p className="font-montserrat text-gray-500 text-lg">
            Remplissez ce formulaire pour obtenir une estimation gratuite et rapide.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full z-0 transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          />
          <div className="relative z-10 flex justify-between">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-nevan text-sm border-2 transition-all duration-500 ${
                  step >= i 
                    ? "bg-primary border-primary text-white shadow-lg" 
                    : "bg-white border-gray-200 text-gray-400"
                }`}
              >
                {step > i ? <CheckCircle2 size={18} /> : i}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100 relative overflow-hidden">
          
          <div className="step-content">
            {/* STEP 1: Service Selection */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="font-nevan text-2xl text-gray-900 uppercase">1. Quel est votre besoin ?</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {SERVICES.map((s) => {
                    const Icon = s.icon;
                    const isSelected = formData.service === s.label;
                    return (
                      <button
                        key={s.id}
                        onClick={() => updateForm("service", s.label)}
                        className={`flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                          isSelected 
                            ? "border-primary bg-primary/5 ring-4 ring-primary/10" 
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-3 rounded-full ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                          <Icon size={24} />
                        </div>
                        <span className={`font-montserrat font-bold text-lg ${isSelected ? "text-primary" : "text-gray-700"}`}>
                          {s.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: Description & Location */}
            {step === 2 && (
              <div className="space-y-8">
                <h2 className="font-nevan text-2xl text-gray-900 uppercase">2. Décrivez votre projet</h2>
                
                <div className="space-y-4">
                  <label className="font-montserrat font-semibold text-gray-700 block">Description détaillée</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => updateForm("description", e.target.value)}
                    rows={4}
                    placeholder="Expliquez-nous votre besoin, la surface concernée, etc."
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl font-montserrat focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <label className="font-montserrat font-semibold text-gray-700 block">Où se situe le projet ?</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text"
                      value={formData.ville}
                      onChange={(e) => updateForm("ville", e.target.value)}
                      placeholder="Ville ou adresse"
                      className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl font-montserrat focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Photos (Optional) */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="font-nevan text-2xl text-gray-900 uppercase">3. Photos du chantier <span className="text-gray-400 text-sm normal-case">(Optionnel)</span></h2>
                <p className="font-montserrat text-gray-500">Ajouter des photos nous aide à évaluer la complexité de l'installation.</p>
                
                <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                    <Camera size={32} className="text-gray-400" />
                  </div>
                  <span className="font-montserrat font-semibold text-gray-700 block mb-2">Cliquez ou glissez vos photos ici</span>
                  <span className="font-montserrat text-sm text-gray-400">PNG, JPG jusqu'à 10MB</span>
                </div>
              </div>
            )}

            {/* STEP 4: Contact Info */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="font-nevan text-2xl text-gray-900 uppercase">4. Vos coordonnées</h2>
                
                <div className="space-y-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="text"
                      value={formData.nom}
                      onChange={(e) => updateForm("nom", e.target.value)}
                      placeholder="Nom complet ou Entreprise"
                      className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl font-montserrat focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="tel"
                      value={formData.telephone}
                      onChange={(e) => updateForm("telephone", e.target.value)}
                      placeholder="Numéro de téléphone"
                      className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl font-montserrat focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      placeholder="Adresse e-mail"
                      className="w-full p-4 pl-12 bg-gray-50 border border-gray-200 rounded-xl font-montserrat focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className={`flex items-center gap-2 font-nevan text-sm tracking-wide uppercase px-6 py-3 rounded-full transition-all ${
                step === 1 ? "opacity-0 pointer-events-none" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <ChevronLeft size={18} /> Précédent
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                disabled={step === 1 && !formData.service}
                className="flex items-center gap-2 bg-primary text-white font-nevan text-sm tracking-wide uppercase px-8 py-3 rounded-full hover:bg-[#8F1313] transition-colors shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant <ChevronRight size={18} />
              </button>
            ) : (
              <button
                onClick={() => alert("Devis envoyé avec succès ! (Simulation)")}
                className="flex items-center gap-2 bg-gray-900 text-white font-nevan text-sm tracking-wide uppercase px-8 py-3 rounded-full hover:bg-black transition-colors shadow-xl"
              >
                <CheckCircle2 size={18} /> Envoyer la demande
              </button>
            )}
          </div>
        </div>

        {/* WhatsApp Quick Access (5.3) */}
        <div className="mt-12 bg-white rounded-3xl p-8 border border-green-100 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-green-50 rounded-full blur-3xl z-0" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-200">
              <MessageSquare size={32} />
            </div>
            <div>
              <h3 className="font-nevan text-2xl text-gray-900 uppercase mb-1">Besoin d'une réponse immédiate ?</h3>
              <p className="font-montserrat text-gray-500">
                {formData.service 
                  ? `Contactez notre expert ${formData.service} directement sur WhatsApp.` 
                  : "Nos experts sont disponibles sur WhatsApp pour vous conseiller."}
              </p>
            </div>
          </div>

          <a 
            href={generateWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 flex items-center gap-2 bg-[#25D366] text-white font-nevan tracking-wide uppercase px-8 py-4 rounded-full hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 whitespace-nowrap"
          >
            Discuter sur WhatsApp
          </a>
        </div>

      </div>
    </div>
  );
}
