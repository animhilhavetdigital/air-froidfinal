"use client";

import { useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { MapPin, Phone, Mail, Clock, Send, PhoneCall, MessageSquare, Globe, Camera, Briefcase, ShieldCheck, Scale, FileText, Cookie } from "lucide-react";
import { CONTACT_INFO, SOCIAL_LINKS, WHATSAPP_NUMBER, WHATSAPP_DEFAULT_MESSAGE } from "@/lib/constants";
import Link from "next/link";

export default function ContactPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formType, setFormType] = useState<"contact" | "rappel">("contact");

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".contact-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
    );
    
    // Content Animation
    gsap.fromTo(".contact-card",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-gray-50 min-h-screen pt-32 pb-32">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        
        {/* Header Section */}
        <div className="contact-header text-center mb-16 max-w-3xl mx-auto">
          <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block">
            — DISCUTONS DE VOTRE PROJET —
          </span>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 tracking-wider uppercase mb-6">
            Contactez-<span className="text-[#10748E]">Nous</span>
          </h1>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed">
            Notre équipe d'experts est à votre disposition pour répondre à toutes vos questions et vous accompagner dans la réalisation de vos projets thermiques.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Contact Form & Callback Request */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="contact-card bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-gray-100 relative overflow-hidden">
              
              {/* Form Type Toggles */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-8 relative z-10">
                <button
                  onClick={() => setFormType("contact")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-nevan text-sm tracking-widest uppercase transition-all duration-300 ${
                    formType === "contact" 
                      ? "bg-white text-[#10748E] shadow-sm" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <Mail size={16} /> Formulaire de contact
                </button>
                <button
                  onClick={() => setFormType("rappel")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-nevan text-sm tracking-widest uppercase transition-all duration-300 ${
                    formType === "rappel" 
                      ? "bg-[#AF1818] text-white shadow-sm" 
                      : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <PhoneCall size={16} /> Demande de rappel
                </button>
              </div>

              {/* Dynamic Form Content */}
              <div className="relative z-10">
                {formType === "contact" ? (
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Nom complet *</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" placeholder="Votre nom" />
                      </div>
                      <div>
                        <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Téléphone *</label>
                        <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" placeholder="+212 6..." />
                      </div>
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Adresse Email *</label>
                      <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" placeholder="vous@exemple.com" />
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Sujet</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat appearance-none">
                        <option>Demande d'information générale</option>
                        <option>Demande de devis</option>
                        <option>Service après-vente / Maintenance</option>
                        <option>Autre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Votre message *</label>
                      <textarea rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat resize-none" placeholder="Comment pouvons-nous vous aider ?"></textarea>
                    </div>
                    <button className="w-full flex items-center justify-center gap-3 bg-[#10748E] text-white px-8 py-4 rounded-xl font-nevan text-lg tracking-widest uppercase hover:bg-[#0c5a6e] transition-colors shadow-lg mt-4 group">
                      Envoyer le message <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </button>
                  </form>
                ) : (
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                      <p className="font-montserrat text-[#AF1818] text-sm text-center">
                        Laissez-nous votre numéro et un de nos experts vous rappellera dans les plus brefs délais.
                      </p>
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Nom complet *</label>
                      <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#AF1818] focus:ring-1 focus:ring-[#AF1818] transition-all font-montserrat" placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Numéro de téléphone *</label>
                      <input type="tel" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-lg focus:outline-none focus:border-[#AF1818] focus:ring-1 focus:ring-[#AF1818] transition-all font-montserrat" placeholder="+212 6..." />
                    </div>
                    <div>
                      <label className="block font-montserrat text-sm font-semibold text-gray-900 mb-2">Créneau de rappel souhaité</label>
                      <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#AF1818] focus:ring-1 focus:ring-[#AF1818] transition-all font-montserrat appearance-none">
                        <option>Dès que possible</option>
                        <option>Matin (9h - 12h)</option>
                        <option>Après-midi (14h - 18h)</option>
                      </select>
                    </div>
                    <button className="w-full flex items-center justify-center gap-3 bg-[#AF1818] text-white px-8 py-4 rounded-xl font-nevan text-lg tracking-widest uppercase hover:bg-[#8A1212] transition-colors shadow-lg mt-8 group">
                      Demander à être rappelé <PhoneCall size={18} className="group-hover:rotate-12 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Info & Map */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Contact Info Cards */}
            <div className="contact-card bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col gap-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#10748E]/10 flex items-center justify-center shrink-0">
                  <Phone size={24} className="text-[#10748E]" />
                </div>
                <div>
                  <span className="block font-nevan text-sm tracking-widest text-gray-400 uppercase mb-1">Téléphone</span>
                  <a href={`tel:${CONTACT_INFO.phone.replace(/\s/g, '')}`} className="font-montserrat font-bold text-xl text-gray-900 hover:text-[#10748E] transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#32A5DE]/10 flex items-center justify-center shrink-0">
                  <Mail size={24} className="text-[#32A5DE]" />
                </div>
                <div>
                  <span className="block font-nevan text-sm tracking-widest text-gray-400 uppercase mb-1">Email Général</span>
                  <a href={`mailto:${CONTACT_INFO.email}`} className="font-montserrat font-bold text-lg text-gray-900 hover:text-[#32A5DE] transition-colors break-all">
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <MessageSquare size={24} className="text-[#25D366]" />
                </div>
                <div>
                  <span className="block font-nevan text-sm tracking-widest text-gray-400 uppercase mb-1">WhatsApp Business</span>
                  <p className="font-montserrat text-sm text-gray-500 mb-2">Assistance rapide par message</p>
                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_DEFAULT_MESSAGE)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg font-montserrat font-semibold text-sm hover:bg-[#20bd5a] transition-colors"
                  >
                    Discuter sur WhatsApp
                  </a>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100" />

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Clock size={24} className="text-gray-600" />
                </div>
                <div>
                  <span className="block font-nevan text-sm tracking-widest text-gray-400 uppercase mb-1">Horaires d'ouverture</span>
                  <ul className="font-montserrat text-sm text-gray-900 space-y-1">
                    <li className="flex justify-between gap-4"><span>Lundi - Vendredi:</span> <span className="font-bold">08:00 - 18:00</span></li>
                    <li className="flex justify-between gap-4"><span>Samedi:</span> <span className="font-bold">09:00 - 13:00</span></li>
                    <li className="flex justify-between gap-4 text-gray-400"><span>Dimanche:</span> <span>Fermé</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Google Maps Showroom */}
            <div className="contact-card bg-white rounded-3xl p-4 shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4 px-2 pt-2">
                <MapPin size={20} className="text-[#AF1818]" />
                <h3 className="font-nevan text-lg uppercase text-gray-900 tracking-wider">Localisation Showroom</h3>
              </div>
              <div className="w-full h-[250px] rounded-2xl overflow-hidden bg-gray-200 relative group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1m3!1d108703.11195610815!2d-8.083329241551061!3d31.634620023447993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafee8d96179e51%3A0x5950b6534f87adb8!2sMarrakech!5e0!3m2!1sfr!2sma!4v1700000000000!5m2!1sfr!2sma" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  className="filter grayscale group-hover:grayscale-0 transition-all duration-700"
                ></iframe>
              </div>
              <p className="font-montserrat text-sm text-gray-500 mt-4 px-2 text-center">
                {CONTACT_INFO.address}
              </p>
            </div>

            {/* Social Networks */}
            <div className="contact-card flex justify-center gap-4">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Globe size={22} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#E4405F] hover:bg-[#E4405F] hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Camera size={22} />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all duration-300 hover:-translate-y-1">
                <Briefcase size={22} />
              </a>
            </div>

          </div>
        </div>

        {/* MENTIONS LÉGALES & CONFORMITÉ */}
        <div className="mt-16 contact-card bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="font-nevan text-3xl text-gray-900 uppercase tracking-wider flex items-center justify-center gap-3">
              <ShieldCheck className="text-[#10748E]" size={32} />
              Mentions Légales & Conformité
            </h2>
            <p className="font-montserrat text-gray-500 mt-3">
              Transparence et respect de vos données personnelles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/mentions-legales" className="group p-6 rounded-2xl bg-gray-50 hover:bg-[#10748E] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#10748E] group-hover:text-white mb-4 shadow-sm transition-colors">
                <Scale size={24} />
              </div>
              <h3 className="font-nevan text-lg text-gray-900 group-hover:text-white uppercase mb-2">Mentions Légales</h3>
              <p className="font-montserrat text-xs text-gray-500 group-hover:text-blue-100">Informations juridiques sur la société.</p>
            </Link>

            <Link href="/politique-confidentialite" className="group p-6 rounded-2xl bg-gray-50 hover:bg-[#10748E] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#10748E] group-hover:text-white mb-4 shadow-sm transition-colors">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-nevan text-lg text-gray-900 group-hover:text-white uppercase mb-2">Confidentialité</h3>
              <p className="font-montserrat text-xs text-gray-500 group-hover:text-blue-100">Protection de vos données.</p>
            </Link>

            <Link href="/conditions-generales" className="group p-6 rounded-2xl bg-gray-50 hover:bg-[#10748E] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#10748E] group-hover:text-white mb-4 shadow-sm transition-colors">
                <FileText size={24} />
              </div>
              <h3 className="font-nevan text-lg text-gray-900 group-hover:text-white uppercase mb-2">CGV / CGU</h3>
              <p className="font-montserrat text-xs text-gray-500 group-hover:text-blue-100">Conditions générales de vente et d'utilisation.</p>
            </Link>

            <Link href="/politique-cookies" className="group p-6 rounded-2xl bg-gray-50 hover:bg-[#10748E] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center border border-gray-100">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#10748E] group-hover:text-white mb-4 shadow-sm transition-colors">
                <Cookie size={24} />
              </div>
              <h3 className="font-nevan text-lg text-gray-900 group-hover:text-white uppercase mb-2">Cookies</h3>
              <p className="font-montserrat text-xs text-gray-500 group-hover:text-blue-100">Gestion des traceurs et cookies.</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
