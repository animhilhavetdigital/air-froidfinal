"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";
import { STATS } from "@/lib/constants";

export function CTASection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Animate stats when scrolling into view
      gsap.fromTo(
        ".stat-item",
        { y: 30, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "back.out(1.5)",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Main Banner */}
        <div className="max-w-5xl mx-auto bg-primary rounded-[40px] p-8 md:p-16 text-center shadow-2xl relative overflow-hidden">
          
          {/* Subtle background shapes for depth */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-10 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl" />

          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6 relative z-10">
            Prêt à optimiser votre <br className="hidden md:block" />
            confort thermique ?
          </h2>
          
          <p className="text-blue-100 md:text-lg mb-10 max-w-2xl mx-auto relative z-10">
            Contactez nos experts pour une étude personnalisée de votre projet. 
            Devis gratuit et sans engagement.
          </p>

          <Link
            href="/devis"
            className="group relative z-10 inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold tracking-wide transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Demander un devis gratuit
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
          {STATS.map((stat, idx) => (
            <div key={idx} className="stat-item text-center">
              <div className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
