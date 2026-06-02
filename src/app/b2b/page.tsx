"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { Building2, Mail, Lock, User, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

export default function B2BLoginPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);

  useGSAP(() => {
    // Reveal animation
    gsap.fromTo(".auth-card",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, { scope: containerRef });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/registration and redirect to dashboard
    router.push("/b2b/dashboard");
  };

  return (
    <div ref={containerRef} className="bg-[#1A2634] min-h-screen pt-32 pb-32 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/assets/b2b-bg.jpg" alt="B2B Background" fill className="object-cover opacity-[0.05]" />
      </div>
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#10748E] rounded-full blur-[150px] opacity-20 -translate-y-1/2 translate-x-1/3 z-0" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#AF1818] rounded-full blur-[150px] opacity-10 translate-y-1/3 -translate-x-1/3 z-0" />

      <div className="w-full max-w-6xl mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        
        {/* Left Side: Presentation */}
        <div className="w-full lg:w-1/2 text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full font-nevan text-sm tracking-widest uppercase mb-8 border border-white/10">
            <ShieldCheck size={18} className="text-[#32A5DE]" /> Portail Sécurisé
          </div>
          <h1 className="font-nevan text-4xl md:text-5xl lg:text-6xl text-white uppercase tracking-wider mb-6 leading-tight">
            Espace <span className="text-[#32A5DE]">B2B</span> <br />Professionnel
          </h1>
          <p className="font-montserrat text-blue-100 text-base md:text-lg mb-10 leading-relaxed max-w-xl mx-auto lg:mx-0">
            Accédez à votre espace dédié pour suivre vos chantiers, demander des devis sur-mesure, consulter le catalogue professionnel et communiquer avec nos experts.
          </p>
          
          <div className="space-y-6">
            {[
              "Suivi en temps réel de vos commandes et chantiers",
              "Accès direct aux documentations techniques et fiches produits",
              "Conditions tarifaires préférentielles et devis rapides",
              "Messagerie prioritaire avec notre support technique"
            ].map((feature, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#AF1818]/20 flex items-center justify-center shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#AF1818]" />
                </div>
                <span className="font-montserrat text-gray-200">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <div className="auth-card bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl relative">
            
            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-xl p-1 mb-8">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-3 rounded-lg font-nevan text-sm tracking-widest uppercase transition-all duration-300 ${
                  isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Connexion
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-3 rounded-lg font-nevan text-sm tracking-widest uppercase transition-all duration-300 ${
                  !isLogin ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"
                }`}
              >
                Inscription
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Building2 size={20} />
                    </div>
                    <input type="text" required placeholder="Nom de l'entreprise" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <User size={20} />
                      </div>
                      <input type="text" required placeholder="Prénom" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" />
                    </div>
                    <div className="relative">
                      <input type="text" required placeholder="Nom" className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" />
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <Briefcase size={20} />
                    </div>
                    <input type="text" placeholder="Fonction / Poste" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" />
                  </div>
                </>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={20} />
                </div>
                <input type="email" required placeholder="Adresse email pro" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Lock size={20} />
                </div>
                <input type="password" required placeholder="Mot de passe" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat" />
              </div>

              {isLogin && (
                <div className="flex justify-end">
                  <a href="#" className="font-montserrat text-sm text-[#10748E] hover:underline font-semibold">
                    Mot de passe oublié ?
                  </a>
                </div>
              )}

              <button type="submit" className="w-full flex items-center justify-center gap-3 bg-[#10748E] text-white px-8 py-4 rounded-xl font-nevan text-lg tracking-widest uppercase hover:bg-[#0c5a6e] transition-colors shadow-lg mt-6 group">
                {isLogin ? "Se connecter" : "Créer mon compte"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            <div className="mt-8 text-center font-montserrat text-sm text-gray-500">
              {isLogin ? "Vous n'avez pas de compte pro ?" : "Déjà un compte client ?"}
              <button onClick={() => setIsLogin(!isLogin)} className="ml-2 text-[#AF1818] font-semibold hover:underline">
                {isLogin ? "Demander un accès" : "Connectez-vous"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
