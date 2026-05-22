"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sun, Snowflake, Wind, Utensils } from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";

const HOME_SERVICES = [
  {
    id: "solaire",
    title: "Énergie Solaire",
    icon: Sun,
    desc: "Solutions photovoltaïques pour une transition énergétique rentable et durable.",
    color: "text-amber-500",
    bgHover: "group-hover:bg-amber-50"
  },
  {
    id: "climatisation",
    title: "Climatisation",
    icon: Snowflake,
    desc: "Confort thermique optimal pour vos espaces résidentiels et professionnels.",
    color: "text-primary",
    bgHover: "group-hover:bg-blue-50"
  },
  {
    id: "ventilation",
    title: "Ventilation",
    icon: Wind,
    desc: "Qualité de l'air maîtrisée avec nos systèmes de traitement et d'extraction.",
    color: "text-teal-500",
    bgHover: "group-hover:bg-teal-50"
  },
  {
    id: "cuisine",
    title: "Cuisine Pro",
    icon: Utensils,
    desc: "Équipements et froid commercial pour les professionnels de la restauration.",
    color: "text-rose-500",
    bgHover: "group-hover:bg-rose-50"
  },
];

export function ServicesGrid() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Title reveal
      gsap.fromTo(
        ".sg-title",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 80%",
          },
        }
      );

      // Grid items staggered reveal
      gsap.fromTo(
        ".sg-item",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".sg-grid",
            start: "top 85%",
          },
        }
      );
    },
    { scope: container }
  );

  return (
    <section ref={container} className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="sg-title max-w-2xl">
            <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">
              Nos Domaines d'Expertise
            </h2>
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              Des solutions adaptées à chaque besoin
            </h3>
          </div>
          <Link 
            href="/services" 
            className="sg-title group flex items-center gap-2 text-gray-900 font-semibold hover:text-primary transition-colors"
          >
            Voir tous nos services
            <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* Services Grid */}
        <div className="sg-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOME_SERVICES.map((service) => (
            <Link
              key={service.id}
              href={`/services/${service.id}`}
              className={`sg-item group relative bg-white border border-gray-100 rounded-3xl p-8 overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${service.bgHover}`}
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-8 transition-colors duration-500 group-hover:bg-white ${service.color}`}>
                  <service.icon size={26} strokeWidth={1.5} />
                </div>
                
                <h4 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                  {service.title}
                </h4>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-8 flex-1">
                  {service.desc}
                </p>

                <div className="flex items-center gap-2 text-sm font-semibold text-primary mt-auto">
                  Découvrir
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
