"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

export function QuiSommesNousTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".editorial-line",
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-white flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="font-nevan text-primary text-xl tracking-widest mb-12 editorial-line uppercase">
          Notre Héritage
        </h2>
        
        <div className="font-montserrat text-3xl md:text-4xl lg:text-5xl leading-tight text-gray-900 font-medium space-y-4">
          <p className="editorial-line">Forts de plus de 20 ans d'excellence en ingénierie climatique,</p>
          <p className="editorial-line">nous déployons notre expertise à travers tout le Maroc.</p>
          <p className="editorial-line text-gray-400">Une exécution méticuleuse pour des projets d'exception.</p>
        </div>
      </div>
    </section>
  );
}
