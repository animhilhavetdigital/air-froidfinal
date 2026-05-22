"use client";

import { useState, useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { MapPin, Phone, Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS } from "@/lib/constants";

export default function ContactPage() {
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const nextStep = () => {
    gsap.to(".wizard-content", {
      opacity: 0,
      x: -30,
      duration: 0.3,
      onComplete: () => {
        setStep(step + 1);
        gsap.fromTo(".wizard-content", 
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.4 }
        );
      }
    });
  };

  useGSAP(() => {
    gsap.fromTo(
      ".reveal-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-32">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        
        {/* Header Section */}
        <div className="text-center mb-20 reveal-item">
          <span className="font-nevan text-sm tracking-[0.3em] text-[#32A5DE] uppercase mb-4 block">Démarrons votre projet</span>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 tracking-wide uppercase mb-6">
            Contactez <span className="text-primary">Nous</span>
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
          
          {/* Left: Interactive Multi-Step Form Wizard */}
          <div className="w-full lg:w-2/3 reveal-item">
            <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
              
              {/* Step Indicators */}
              <div className="flex items-center gap-4 mb-12">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-nevan text-sm ${
                      step >= i ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
                    }`}>
                      {step > i ? <CheckCircle2 size={16} /> : i}
                    </div>
                    {i < 3 && (
                      <div className={`h-1 flex-1 rounded-full ${
                        step > i ? "bg-primary" : "bg-gray-200"
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Wizard Content */}
              <div className="wizard-content min-h-[300px]">
                {step === 1 && (
                  <div className="space-y-6">
                    <h2 className="font-nevan text-2xl text-gray-900 uppercase mb-8">Votre profil et besoin</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors bg-white">
                        <input type="radio" name="profile" className="w-4 h-4 text-primary" defaultChecked />
                        <span className="font-montserrat text-gray-700">Particulier (B2C)</span>
                      </label>
                      <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-primary transition-colors bg-white">
                        <input type="radio" name="profile" className="w-4 h-4 text-primary" />
                        <span className="font-montserrat text-gray-700">Professionnel (B2B)</span>
                      </label>
                    </div>
                    <div className="pt-4">
                      <select className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-700 focus:outline-none focus:border-primary">
                        <option>Type de service souhaité</option>
                        <option>Climatisation</option>
                        <option>Énergie Solaire</option>
                        <option>Ventilation</option>
                        <option>Grandes Cuisines</option>
                        <option>Maintenance</option>
                      </select>
                    </div>
                    <button onClick={nextStep} className="mt-8 flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-nevan tracking-wide uppercase hover:bg-primary-hover transition-colors ml-auto">
                      Suivant <ArrowRight size={20} />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <h2 className="font-nevan text-2xl text-gray-900 uppercase mb-8">Détails du projet</h2>
                    <textarea 
                      rows={5}
                      placeholder="Décrivez brièvement votre projet (superficie, contraintes spécifiques...)"
                      className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-700 focus:outline-none focus:border-primary resize-none"
                    />
                    <button onClick={nextStep} className="mt-8 flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-nevan tracking-wide uppercase hover:bg-primary-hover transition-colors ml-auto">
                      Suivant <ArrowRight size={20} />
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <h2 className="font-nevan text-2xl text-gray-900 uppercase mb-8">Vos coordonnées</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Nom complet" 
                        className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-700 focus:outline-none focus:border-primary"
                      />
                      <input 
                        type="text" 
                        placeholder="Téléphone" 
                        className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-700 focus:outline-none focus:border-primary"
                      />
                      <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full bg-white border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-700 focus:outline-none focus:border-primary md:col-span-2"
                      />
                    </div>
                    <button className="mt-8 w-full bg-[#AF1818] text-white px-8 py-5 rounded-full font-nevan text-lg tracking-widest uppercase hover:bg-[#8A1212] transition-colors shadow-lg">
                      Envoyer la demande
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Standard Contacts Info & Map */}
          <div className="w-full lg:w-1/3 space-y-12 reveal-item">
            <div>
              <h3 className="font-nevan text-2xl text-gray-900 uppercase mb-8">Siège & Showroom</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-primary" />
                  </div>
                  <div>
                    <span className="block font-montserrat font-semibold text-gray-900 mb-1">Adresse</span>
                    <p className="font-montserrat text-gray-500 text-sm leading-relaxed">{CONTACT_INFO.address}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={24} className="text-primary" />
                  </div>
                  <div>
                    <span className="block font-montserrat font-semibold text-gray-900 mb-1">Téléphone</span>
                    <p className="font-montserrat text-gray-500 text-sm">{CONTACT_INFO.phone}</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Mail size={24} className="text-primary" />
                  </div>
                  <div>
                    <span className="block font-montserrat font-semibold text-gray-900 mb-1">Email</span>
                    <p className="font-montserrat text-gray-500 text-sm">{CONTACT_INFO.email}</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Map Layout Link Visual Placeholder */}
            <div className="w-full aspect-video rounded-3xl overflow-hidden bg-gray-100 relative group cursor-pointer border border-gray-200">
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-nevan text-primary tracking-widest uppercase text-sm border-b-2 border-primary pb-1">
                  Ouvrir dans Maps
                </span>
              </div>
              <div className="w-full h-full bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=Marrakech,Morocco&zoom=13&size=600x300&maptype=roadmap&markers=color:red%7CMarrakech,Morocco&key=YOUR_API_KEY')] bg-cover bg-center opacity-40 grayscale" />
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
