"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  CheckCircle2, 
  MapPin, 
  Settings 
} from "lucide-react";

export default function ProfilPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [scope, setScope] = useState("");
  
  // Feedback states
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  useEffect(() => {
    const savedRole = localStorage.getItem("afe_mock_role") || "client_b2b";
    setRole(savedRole);

    if (savedRole === "super_admin") {
      setName("Mada Admin");
      setEmail("admin@airfroidexpert.ma");
      setPhone("+212 524-889900");
      setScope("Marrakech - Siège Global");
    } else if (savedRole === "commercial") {
      setName("Youssef El Alami");
      setEmail("y.alami@airfroidexpert.ma");
      setPhone("+212 661-458921");
      setScope("Marrakech & Région Tensift");
    } else {
      setName("Maroc Entreprise");
      setEmail("contact@marocentreprise.co.ma");
      setPhone("+212 522-123456");
      setScope("Grand Casablanca (ICE Pro)");
    }
  }, []);

  useGSAP(() => {
    if (role) {
      gsap.fromTo(".prof-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, { scope: containerRef, dependencies: [role] });

  if (!role) return <div className="p-10 text-gray-500 font-montserrat">Chargement du profil...</div>;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setShowProfileSuccess(true);
    setTimeout(() => setShowProfileSuccess(false), 3000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPasswordSuccess(true);
    setTimeout(() => setShowPasswordSuccess(false), 3000);
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-5xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="prof-item">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-3">
          <Settings className="text-[#10748E]" size={32} /> Mon Profil & Paramètres
        </h1>
        <p className="font-montserrat text-gray-500">Mettez à jour vos coordonnées personnelles et gérez la sécurité de votre compte.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Card */}
        <div className="prof-item lg:col-span-1 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center h-fit">
          <div className="w-20 h-20 rounded-full bg-[#10748E] text-white flex items-center justify-center font-nevan text-3xl shadow-md uppercase mb-4">
            {name.charAt(0)}
          </div>
          <h3 className="font-montserrat font-bold text-gray-900 text-lg leading-tight">{name}</h3>
          <span className="font-montserrat text-xs font-bold text-[#10748E] bg-[#10748E]/10 px-2.5 py-0.5 rounded-full mt-2 uppercase tracking-wide">
            {role === "super_admin" ? "Super Administrateur" : role === "commercial" ? "Commercial" : "Compte Client B2B"}
          </span>

          <div className="w-full border-t border-gray-100 mt-6 pt-4 text-left font-montserrat text-xs text-gray-500 space-y-3">
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <span>{scope}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={16} className="text-gray-400 shrink-0" />
              <span className="truncate">{email}</span>
            </div>
          </div>
        </div>

        {/* Update Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* General Info */}
          <div className="prof-item bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="font-nevan text-lg text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <User size={18} className="text-[#10748E]" /> Coordonnées Générales
            </h2>

            {showProfileSuccess && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 text-sm font-semibold font-montserrat mb-6 animate-in fade-in duration-300">
                <CheckCircle2 size={20} /> Profil enregistré avec succès.
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Nom complet</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Adresse email</label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Téléphone portable</label>
                  <input 
                    type="text" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Périmètre / Agence</label>
                  <input 
                    type="text" 
                    disabled
                    value={scope}
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl font-montserrat text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>

          {/* Security */}
          <div className="prof-item bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="font-nevan text-lg text-gray-900 uppercase tracking-wider mb-6 flex items-center gap-2">
              <Lock size={18} className="text-[#10748E]" /> Sécurité & Mot de passe
            </h2>

            {showPasswordSuccess && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center gap-3 text-green-700 text-sm font-semibold font-montserrat mb-6 animate-in fade-in duration-300">
                <CheckCircle2 size={20} /> Votre mot de passe a bien été mis à jour.
              </div>
            )}

            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Ancien mot de passe</label>
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                </div>
                <div className="hidden md:block" />
                <div>
                  <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Nouveau mot de passe</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Nouvelle clé"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                </div>
                <div>
                  <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Confirmer le mot de passe</label>
                  <input 
                    type="password" 
                    required
                    placeholder="Confirmer clé"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md"
                >
                  Mettre à jour la sécurité
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
