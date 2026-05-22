"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

const STATS = [
  { value: 20, suffix: "+", label: "Ans d'Expérience" },
  { value: 500, suffix: "+", label: "Projets Réalisés" },
  { value: 1, suffix: "", label: "Showroom Connecté" },
];

export function SocialProofNumbers() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Fade up the containers
    gsap.fromTo(
      ".stat-item",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse"
        }
      }
    );

    // 2. Animate the numbers counting up
    const counters = gsap.utils.toArray(".stat-number") as HTMLElement[];
    counters.forEach((counter, i) => {
      const target = STATS[i].value;
      gsap.fromTo(counter, 
        { innerText: 0 },
        {
          innerText: target,
          duration: 2,
          ease: "power3.out",
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 60%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-24 bg-white border-t border-gray-100">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          
          {STATS.map((stat, idx) => (
            <div key={idx} className="stat-item flex flex-col items-center justify-center pt-8 md:pt-0 text-center group">
              <div className="font-nevan text-6xl md:text-7xl text-[#00883C] tracking-wide mb-2 transition-transform duration-500 group-hover:scale-110 flex items-center">
                <span className="stat-number">0</span>
                <span>{stat.suffix}</span>
              </div>
              <span className="font-montserrat font-bold text-gray-900 text-lg md:text-xl uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
