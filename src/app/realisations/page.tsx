"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";

const CATEGORIES = ["Tous", "Hôtellerie", "Résidentiel", "Industriel"];

const PROJECTS = [
  {
    id: 1,
    title: "Palace Marrakech",
    category: "Hôtellerie",
    image: "/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg",
    location: "Marrakech, Maroc",
    challenge: "Climatisation invisible pour suites royales.",
    solution: "Système VRV 3 tubes à récupération d'énergie avec grilles architecturales."
  },
  {
    id: 2,
    title: "Villa Contemporaine",
    category: "Résidentiel",
    image: "/images/assets/tom-rumble-N5q6uTHdtME-unsplash.jpg",
    location: "Casablanca, Maroc",
    challenge: "Chauffage piscine et autonomie énergétique.",
    solution: "Pompe à chaleur couplée à 40 panneaux photovoltaïques intégrés."
  },
  {
    id: 3,
    title: "Usine Agroalimentaire",
    category: "Industriel",
    image: "/images/assets/adrien-olichon-3-GSjNOsO8Q-unsplash.jpg",
    location: "Tanger, Maroc",
    challenge: "Maintien de la chaîne du froid stricte à -20°C.",
    solution: "Centrales frigorifiques au CO2 transcritique, haute efficacité."
  },
  {
    id: 4,
    title: "Restaurant Gastronomique",
    category: "Hôtellerie",
    image: "/images/assets/zulki-jrzt-Q4f_0gKTMEk-unsplash.jpg",
    location: "Rabat, Maroc",
    challenge: "Extraction hotte sans nuisance sonore en centre-ville.",
    solution: "Ventilation double flux avec caisson d'extraction insonorisé et filtration charbon."
  }
];

export default function RealisationsPage() {
  const [activeFilter, setActiveFilter] = useState("Tous");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProjects = PROJECTS.filter(
    (p) => activeFilter === "Tous" || p.category === activeFilter
  );

  useGSAP(() => {
    // Initial entrance for header
    gsap.fromTo(".page-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );

    // Animate grid items when filter changes
    gsap.fromTo(
      ".project-card",
      { opacity: 0, scale: 0.95, y: 20 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all",
        delay: activeFilter === "Tous" ? 0.3 : 0 // Delay on first load
      }
    );
  }, { scope: containerRef, dependencies: [activeFilter] });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-32">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        
        {/* Header Section */}
        <div className="page-header text-center mb-16">
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 tracking-wide uppercase mb-6">
            Nos <span className="text-primary">Réalisations</span>
          </h1>
          <p className="font-montserrat text-gray-500 text-lg max-w-2xl mx-auto">
            Découvrez nos interventions d'ingénierie climatique et frigorifique à travers des projets d'exception.
          </p>
        </div>

        {/* Filter Bar Component */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-6 py-2 rounded-full font-nevan text-sm tracking-widest uppercase transition-all duration-300 border ${
                activeFilter === cat
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-transparent text-gray-500 border-gray-200 hover:border-gray-900 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Asymmetric Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {filteredProjects.map((project, idx) => (
            <div 
              key={project.id} 
              className={`project-card group relative w-full overflow-hidden rounded-3xl bg-gray-100 ${
                idx % 3 === 0 ? "md:col-span-2 aspect-[21/9]" : "aspect-[4/3]"
              }`}
            >
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              {/* Mini Case-Studies Interaction Overlay */}
              <div className="absolute inset-0 bg-[#10748E]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 md:p-12 backdrop-blur-sm">
                
                <div className="transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                  <span className="font-nevan text-white/70 text-sm tracking-widest uppercase mb-2 block">
                    {project.category}
                  </span>
                  <h3 className="font-nevan text-3xl text-white tracking-wide uppercase mb-6">
                    {project.title}
                  </h3>
                  
                  <div className="space-y-4 font-montserrat">
                    <div>
                      <span className="block text-white/60 text-xs uppercase tracking-wider mb-1">Lieu</span>
                      <p className="text-white font-medium">{project.location}</p>
                    </div>
                    <div>
                      <span className="block text-white/60 text-xs uppercase tracking-wider mb-1">Défi Technique</span>
                      <p className="text-white text-sm">{project.challenge}</p>
                    </div>
                    <div>
                      <span className="block text-white/60 text-xs uppercase tracking-wider mb-1">Solution Déployée</span>
                      <p className="text-white text-sm leading-relaxed">{project.solution}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
