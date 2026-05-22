"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";

const B2C_SERVICES = [
  {
    title: "Climatisation Résidentielle",
    desc: "Systèmes réversibles et intégration gainable invisible premium pour villas de haut standing.",
    image: "/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg"
  },
  {
    title: "Énergies Solaires",
    desc: "Chauffage d'eau thermodynamique sur-mesure et design de panneaux solaires architecturaux.",
    image: "/images/assets/tom-rumble-N5q6uTHdtME-unsplash.jpg"
  },
  {
    title: "Ventilation",
    desc: "Traitement d'air neuf haute performance et flux VMC pour architectures contemporaines.",
    image: "/images/assets/dung-ph-m-42xVlUyp7jw-unsplash.jpg"
  }
];

const B2B_SERVICES = [
  {
    title: "Grandes Cuisines Pro",
    desc: "Contracting culinaire clé en main et systèmes de restauration lourds pour hôtels de luxe et hôtellerie à Marrakech.",
    image: "/images/assets/sitemap-AFE.png"
  },
  {
    title: "Génie Climatique & Froid",
    desc: "Chambres froides, centrales de traitement d'air (CTA) massives pour usines, stockages et grands espaces commerciaux.",
    image: "/images/assets/dung-ph-m-42xVlUyp7jw-unsplash.jpg"
  }
];

export default function ExpertisesPage() {
  const [activeTab, setActiveTab] = useState<"B2C" | "B2B">("B2C");
  const containerRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  const handleTabSwitch = (tab: "B2C" | "B2B") => {
    if (tab === activeTab) return;
    
    // Animate out current
    gsap.to(galleryRef.current, {
      opacity: 0,
      x: tab === "B2B" ? -50 : 50,
      duration: 0.4,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(tab);
        // Animate in new
        gsap.fromTo(galleryRef.current, 
          { opacity: 0, x: tab === "B2B" ? 50 : -50 },
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }
        );
      }
    });
  };

  const currentServices = activeTab === "B2C" ? B2C_SERVICES : B2B_SERVICES;

  useGSAP(() => {
    // Initial entrance animation
    gsap.fromTo(".page-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
    
    gsap.fromTo(galleryRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 0.3 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        
        {/* Header Section */}
        <div className="page-header text-center mb-20">
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 tracking-wide uppercase mb-12">
            Nos <span className="text-primary">Expertises</span>
          </h1>
          
          {/* Interactive Tab Switcher */}
          <div className="inline-flex items-center bg-gray-50 border border-gray-100 rounded-full p-1.5 shadow-sm relative">
            {/* Animated active pill background */}
            <div 
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-full shadow-md transition-transform duration-500 ease-out z-0 border border-gray-100"
              style={{ transform: activeTab === "B2C" ? "translateX(0)" : "translateX(100%)" }}
            />
            
            <button
              onClick={() => handleTabSwitch("B2C")}
              className={`relative z-10 px-8 py-3 rounded-full font-nevan tracking-wide text-sm transition-colors ${
                activeTab === "B2C" ? "text-primary" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Particuliers (B2C)
            </button>
            <button
              onClick={() => handleTabSwitch("B2B")}
              className={`relative z-10 px-8 py-3 rounded-full font-nevan tracking-wide text-sm transition-colors ${
                activeTab === "B2B" ? "text-primary" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Professionnels (B2B)
            </button>
          </div>
        </div>

        {/* Fluid Horizontal Slide Gallery */}
        <div ref={galleryRef} className="flex flex-col gap-16">
          {currentServices.map((service, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center gap-12 lg:gap-24 group">
              
              {/* Media Container */}
              <div className={`w-full md:w-1/2 ${idx % 2 !== 0 ? 'md:order-2' : ''}`}>
                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl group-hover:shadow-2xl transition-all duration-700">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-700" />
                </div>
              </div>

              {/* Text Container */}
              <div className={`w-full md:w-1/2 ${idx % 2 !== 0 ? 'md:order-1 md:text-right' : ''}`}>
                <h3 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-6">
                  {service.title}
                </h3>
                <p className="font-montserrat text-lg text-gray-500 leading-relaxed max-w-lg">
                  {service.desc}
                </p>
                <div className={`mt-8 w-12 h-1 bg-primary/20 ${idx % 2 !== 0 ? 'ml-auto' : ''}`} />
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
