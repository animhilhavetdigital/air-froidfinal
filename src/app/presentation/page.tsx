"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";
import { MapPin, CheckCircle, Leaf, ShieldCheck, Award, Zap, Users, ArrowRight, Building2, Phone } from "lucide-react";

// Data
const TEAM_MEMBERS = [
  { name: "Youssef Alaoui", role: "Directeur Général", image: "/images/assets/team-youssef.jpg" },
  { name: "Sarah Bennani", role: "Ingénieur HVAC", image: "/images/assets/team-sarah.jpg" },
  { name: "Karim Tazi", role: "Chef de Projets", image: "/images/assets/team-karim.jpg" },
];

const CERTIFICATIONS = [
  { title: "Partenaire Daikin", icon: Award, desc: "Installateur agréé de solutions Daikin" },
  { title: "Qualité ISO 9001", icon: ShieldCheck, desc: "Management de la qualité certifié" },
  { title: "RGE Solaire", icon: Zap, desc: "Reconnu Garant de l'Environnement" },
  { title: "Garantie 10 ans", icon: CheckCircle, desc: "Assurance décennale sur nos installations" },
];

const PHILOSOPHY_VALUES = [
  { title: "Engagement Écologique", icon: Leaf, desc: "Nous privilégions les technologies vertes et les pompes à chaleur basse consommation pour réduire l'empreinte carbone." },
  { title: "Proximité Client", icon: Users, desc: "Un accompagnement sur-mesure de la conception à la maintenance, avec un interlocuteur dédié pour chaque projet." },
  { title: "Innovation Constante", icon: Zap, desc: "Veille technologique continue pour vous offrir les solutions climatiques et thermiques de demain." },
];

export default function PresentationPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Animations
    gsap.fromTo(".hero-title-line", 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.2, ease: "power4.out", delay: 0.2 }
    );
    gsap.fromTo(".hero-subtitle",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, delay: 0.8, ease: "power3.out" }
    );

    // Section Headers
    const headers = gsap.utils.toArray<HTMLElement>('.section-header');
    headers.forEach(header => {
      gsap.fromTo(header,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", scrollTrigger: { trigger: header, start: "top 80%" } }
      );
    });

    // About Section
    gsap.fromTo(".about-image-wrapper",
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: "power3.out", scrollTrigger: { trigger: ".about-section", start: "top 70%" } }
    );
    gsap.fromTo(".about-text-content > *",
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.15, scrollTrigger: { trigger: ".about-text-content", start: "top 75%" } }
    );

    // Showroom Section
    gsap.fromTo(".showroom-img",
      { filter: "grayscale(100%)", scale: 1.05 },
      { filter: "grayscale(0%)", scale: 1, duration: 1.5, scrollTrigger: { trigger: ".showroom-section", start: "top 60%" } }
    );
    gsap.fromTo(".showroom-info-card",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, delay: 0.3, scrollTrigger: { trigger: ".showroom-section", start: "top 60%" } }
    );

    // Team
    gsap.fromTo(".team-member",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power3.out", scrollTrigger: { trigger: ".team-grid", start: "top 80%" } }
    );

    // Certifications
    gsap.fromTo(".cert-badge",
      { opacity: 0, scale: 0.8, rotationY: 45 },
      { opacity: 1, scale: 1, rotationY: 0, duration: 0.8, stagger: 0.15, ease: "back.out(1.2)", scrollTrigger: { trigger: ".certifications-grid", start: "top 80%" } }
    );

    // Philosophy
    gsap.fromTo(".philo-card",
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, scrollTrigger: { trigger: ".philo-grid", start: "top 75%" } }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen flex flex-col overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative h-[70vh] min-h-[600px] flex items-center justify-center overflow-hidden pt-12">
        <div className="absolute inset-0 bg-[#10748E]/10 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/60 via-white/80 to-white z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-32">
          <span className="font-nevan text-sm tracking-[0.3em] text-[#AF1818] uppercase mb-8 block">
            — PRÉSENTATION DE L'ENTREPRISE —
          </span>
          <div className="overflow-hidden mb-4">
            <h1 className="hero-title-line font-nevan text-5xl md:text-6xl lg:text-7xl text-gray-900 uppercase tracking-tight leading-none">
              L'Excellence
            </h1>
          </div>
          <div className="overflow-hidden mb-8">
            <h1 className="hero-title-line font-nevan text-5xl md:text-6xl lg:text-7xl text-[#32A5DE] uppercase tracking-tight leading-none">
              Climatique
            </h1>
          </div>
          <p className="hero-subtitle font-montserrat text-gray-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Plus de 15 ans d'expertise au service du confort thermique, de l'efficacité énergétique et de l'innovation au Maroc.
          </p>
        </div>
      </section>

      {/* 1. QUI SOMMES-NOUS */}
      <section className="about-section w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-center">
          <div className="about-image-wrapper relative h-[600px] xl:h-[700px] w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/images/assets/presentation-leader.jpg" alt="Air Froid Expert Histoire" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="font-nevan text-4xl mb-2">Depuis 2008</p>
              <div className="w-12 h-1 bg-[#AF1818]" />
            </div>
          </div>
          
          <div className="about-text-content flex flex-col justify-center">
            <div className="section-header mb-10">
              <span className="font-nevan text-sm tracking-[0.2em] text-[#32A5DE] uppercase mb-4 block flex items-center gap-4">
                <span className="w-8 h-[2px] bg-[#32A5DE]"></span> 01. Qui sommes-nous
              </span>
              <h2 className="font-nevan text-4xl md:text-5xl lg:text-6xl text-gray-900 uppercase tracking-wider leading-tight">
                Leader en solutions <br/> <span className="text-[#10748E]">thermiques</span>
              </h2>
            </div>
            
            <div className="font-montserrat text-gray-600 space-y-6 text-lg leading-relaxed">
              <p>
                <strong>AIR FROID EXPERT</strong> s'impose aujourd'hui comme l'un des acteurs majeurs de l'ingénierie climatique au Maroc. Notre vocation est d'accompagner les particuliers et les professionnels dans la réalisation de leurs projets thermiques avec une exigence de qualité absolue.
              </p>
              <p>
                De l'étude approfondie de vos besoins à l'installation minutieuse, jusqu'à la maintenance de pointe, nos équipes déploient un savoir-faire reconnu pour garantir votre confort, optimiser vos consommations énergétiques et préserver l'environnement.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-12 border-t border-gray-100">
              <div>
                <span className="block font-nevan text-5xl md:text-6xl text-[#32A5DE] mb-2">500+</span>
                <span className="font-montserrat font-semibold text-sm uppercase tracking-wider text-gray-500">Projets réalisés</span>
              </div>
              <div>
                <span className="block font-nevan text-5xl md:text-6xl text-[#AF1818] mb-2">15+</span>
                <span className="font-montserrat font-semibold text-sm uppercase tracking-wider text-gray-500">Années d'expertise</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. NOTRE SHOWROOM */}
      <section className="showroom-section relative w-full py-32 bg-gray-900 text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 showroom-img">
          <Image src="/images/assets/presentation-showroom.jpg" alt="Showroom" fill className="object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="section-header">
              <span className="font-nevan text-sm tracking-[0.2em] text-white uppercase mb-4 block flex items-center gap-4">
                <span className="w-8 h-[2px] bg-white"></span> 02. Notre Showroom
              </span>
              <h2 className="font-nevan text-4xl md:text-6xl uppercase tracking-wider mb-8">
                Vivez l'expérience <br/> grandeur nature
              </h2>
              <p className="font-montserrat text-gray-300 text-lg mb-10 max-w-lg leading-relaxed">
                Parce qu'un investissement thermique se réfléchit, nous vous invitons à découvrir nos équipements en conditions réelles. Un espace de plus de 300m² dédié à l'innovation climatique.
              </p>
              
              <div className="showroom-info-card bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl max-w-md">
                <h3 className="font-nevan text-2xl mb-6 text-white">Venez nous rendre visite</h3>
                <ul className="space-y-4 font-montserrat text-gray-200">
                  <li className="flex items-start gap-4">
                    <MapPin className="text-[#32A5DE] shrink-0 mt-1" size={24} />
                    <span>123 Zone Industrielle Sidi Ghanem,<br/>Marrakech, Maroc</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <Phone className="text-[#32A5DE] shrink-0" size={24} />
                    <span>+212 5 24 33 22 11</span>
                  </li>
                  <li className="flex items-center gap-4 mt-6 pt-6 border-t border-white/10">
                    <Building2 className="text-gray-400 shrink-0" size={24} />
                    <span className="text-sm">Ouvert du Lundi au Samedi<br/>9h00 - 18h00</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOTRE ÉQUIPE */}
      <section className="team-section w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 py-24 lg:py-32 bg-gray-50">
        <div className="section-header text-center max-w-3xl mx-auto mb-20">
          <span className="font-nevan text-sm tracking-[0.2em] text-[#00883C] uppercase mb-4 block justify-center flex items-center gap-4">
            <span className="w-8 h-[2px] bg-[#00883C]"></span> 03. L'Humain <span className="w-8 h-[2px] bg-[#00883C]"></span>
          </span>
          <h2 className="font-nevan text-4xl md:text-5xl lg:text-6xl text-gray-900 uppercase tracking-wider">
            Notre Équipe
          </h2>
          <p className="font-montserrat text-gray-600 mt-6 text-lg">
            La force d'Air Froid Expert réside dans la passion et l'expertise technique de ses collaborateurs.
          </p>
        </div>

        <div className="team-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
          {TEAM_MEMBERS.map((member, i) => (
            <div key={i} className="team-member group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500">
              <div className="relative h-[400px] w-full overflow-hidden">
                <Image src={member.image} alt={member.name} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-nevan text-3xl text-white uppercase mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)' }}>{member.name}</h3>
                <p className="font-montserrat text-[#32A5DE] font-semibold tracking-wide uppercase text-sm mb-4" style={{ textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)' }}>{member.role}</p>
                <div className="w-0 h-[2px] bg-[#AF1818] group-hover:w-12 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. NOS CERTIFICATIONS */}
      <section className="certifications-section w-full bg-[#10748E] py-24 text-white overflow-hidden relative">
        {/* Abstract background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#AF1818]/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
          <div className="section-header text-center mb-16">
            <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block justify-center flex items-center gap-4">
              <span className="w-8 h-[2px] bg-[#AF1818]"></span> 04. Gage de qualité <span className="w-8 h-[2px] bg-[#AF1818]"></span>
            </span>
            <h2 className="font-nevan text-4xl md:text-5xl lg:text-6xl uppercase tracking-wider">
              Nos Certifications
            </h2>
          </div>

          <div className="certifications-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CERTIFICATIONS.map((cert, i) => {
              const Icon = cert.icon;
              return (
                <div key={i} className="cert-badge bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 flex flex-col items-center text-center group">
                  <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#32A5DE] transition-all duration-300">
                    <Icon size={40} className="text-white" />
                  </div>
                  <h3 className="font-nevan text-xl uppercase tracking-wider mb-3">{cert.title}</h3>
                  <p className="font-montserrat text-sm text-gray-200">{cert.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. NOTRE PHILOSOPHIE */}
      <section className="philosophy-section w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 py-24 lg:py-32 mb-16">
        <div className="section-header text-center max-w-3xl mx-auto mb-20">
          <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block justify-center flex items-center gap-4">
            <span className="w-8 h-[2px] bg-[#AF1818]"></span> 05. Notre Vision <span className="w-8 h-[2px] bg-[#AF1818]"></span>
          </span>
          <h2 className="font-nevan text-4xl md:text-5xl lg:text-6xl text-gray-900 uppercase tracking-wider">
            Notre Philosophie
          </h2>
        </div>

        <div className="philo-grid grid grid-cols-1 md:grid-cols-3 gap-8 xl:gap-12">
          {PHILOSOPHY_VALUES.map((val, i) => {
            const Icon = val.icon;
            return (
              <div key={i} className="philo-card relative bg-white border border-gray-100 shadow-xl rounded-3xl p-10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 group-hover:scale-150 transition-all duration-500 pointer-events-none">
                  <Icon size={120} />
                </div>
                
                <div className="w-16 h-16 bg-[#10748E]/10 text-[#10748E] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#10748E] group-hover:text-white transition-colors duration-300">
                  <Icon size={32} />
                </div>
                <h3 className="font-nevan text-2xl text-gray-900 uppercase mb-4 pr-12 leading-snug">{val.title}</h3>
                <p className="font-montserrat text-gray-600 leading-relaxed relative z-10">{val.desc}</p>
                
                <div className="mt-8 flex items-center text-[#AF1818] font-nevan text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  Découvrir <ArrowRight size={16} className="ml-2" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
