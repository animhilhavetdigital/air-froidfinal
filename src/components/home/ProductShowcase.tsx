"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";

export function ProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Master timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=80%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        }
      });

      // Initial states
      gsap.set(".showcase-text-1", { opacity: 0, y: 50 });
      gsap.set(".showcase-text-2", { opacity: 0, y: 50 });
      gsap.set(".showcase-text-3", { opacity: 0, y: 50 });
      
      // Initial states for the images
      gsap.set(".img-front", { opacity: 1, scale: 1 });
      gsap.set(".img-angled", { opacity: 0, scale: 0.9 });

      // PHASE 1: Text 1 (Right) enters and leaves
      tl.to(".showcase-text-1", { opacity: 1, y: 0, duration: 1 })
        .to(".showcase-text-1", { opacity: 0, y: -50, duration: 1 }, "+=1");

      // PHASE 2: Image transition (3D Turn Illusion) + Text 2 (Left) enters and leaves
      const phase2Start = 3;
      tl.to(".img-front", { opacity: 0, scale: 1.1, duration: 2 }, phase2Start)
        .to(".img-angled", { opacity: 1, scale: 1, duration: 2 }, phase2Start)
        .to(".showcase-text-2", { opacity: 1, y: 0, duration: 1 }, phase2Start)
        .to(".showcase-text-2", { opacity: 0, y: -50, duration: 1 }, phase2Start + 2);

      // PHASE 3: Image cinematic push-in + Text 3 (Right) Metrics enter
      const phase3Start = 6;
      tl.to(".img-angled", { scale: 1.05, duration: 2 }, phase3Start)
        .to(".showcase-text-3", { opacity: 1, y: 0, duration: 1 }, phase3Start);

      // Add a slight buffer at the end so it doesn't immediately unpin
      tl.to({}, { duration: 1 });
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="relative w-full md:h-screen bg-white overflow-hidden flex items-center justify-center border-t border-gray-50 py-24 md:py-0"
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 md:h-full relative flex flex-col md:block">

        {/* OPTION A: High-Res PNG Sequence */}
        <div className="relative md:absolute md:inset-0 w-full md:h-full z-10 flex items-center justify-center pointer-events-none mb-16 md:mb-0">
          <div className="relative w-full md:w-[60vw] lg:w-[45vw] xl:w-[800px] aspect-video">
            <Image 
              src="/images/assets/Air Conditioner.H01.2k.png"
              alt="Air Conditioner Front View"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="img-front object-contain drop-shadow-2xl"
              priority
            />
            <Image 
              src="/images/assets/Air Conditioner.H02.2k.png"
              alt="Air Conditioner Angled View"
              fill
              sizes="(max-width: 768px) 100vw, 800px"
              className="img-angled object-contain drop-shadow-2xl hidden md:block"
            />
          </div>
        </div>

        {/* TEXT OVERLAYS */}
        <div className="flex flex-col gap-16 md:h-full md:block z-20 relative w-full">
          {/* Phase 1: Right Side */}
          <div className="showcase-text-1 md:absolute md:inset-y-0 md:right-0 w-full md:w-5/12 lg:w-4/12 flex flex-col justify-center pr-0 md:pr-12 md:pointer-events-none text-center md:text-right">
            <span className="font-nevan text-xs md:text-sm tracking-[0.2em] text-[#32A5DE] uppercase mb-4 block">
              Phase 01 / Design
            </span>
            <h2 className="font-nevan text-3xl md:text-4xl lg:text-[3vw] xl:text-5xl text-[#10748E] uppercase tracking-wide leading-[1.1] mb-6">
              Ingénierie Climatique <br className="hidden md:block" /> Invisible
            </h2>
            <p className="font-montserrat text-gray-600 text-base md:text-lg leading-relaxed md:ml-auto max-w-md mx-auto md:mx-0">
              L'excellence visuelle alliée à la performance. Nos unités s'intègrent de manière transparente dans les plafonds architecturaux de luxe, préservant l'esthétique de vos espaces de haut standing.
            </p>
          </div>

          {/* Phase 2: Left Side */}
          <div className="showcase-text-2 md:absolute md:inset-y-0 md:left-0 w-full md:w-5/12 lg:w-4/12 flex flex-col justify-center pl-0 md:pl-12 md:pointer-events-none text-center md:text-left">
            <span className="font-nevan text-xs md:text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block">
              Phase 02 / Acoustique
            </span>
            <h2 className="font-nevan text-3xl md:text-4xl lg:text-[3vw] xl:text-5xl text-[#10748E] uppercase tracking-wide leading-[1.1] mb-6">
              Rendement Énergétique <br className="hidden md:block" /> Ultra-Silencieux
            </h2>
            <p className="font-montserrat text-gray-600 text-base md:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Une ingénierie de précision réduisant les émissions sonores à moins de 19 dB. Le confort thermique parfait, dans un silence absolu, propulsé par une technologie Eco-Smart adaptative.
            </p>
          </div>

          {/* Phase 3: Right Side (Metrics) */}
          <div className="showcase-text-3 md:absolute md:inset-y-0 md:right-0 w-full md:w-5/12 lg:w-4/12 flex flex-col justify-center pr-0 md:pr-12 md:pointer-events-none text-center md:text-right">
            <span className="font-nevan text-xs md:text-sm tracking-[0.2em] text-[#32A5DE] uppercase mb-4 block">
              Phase 03 / Spécifications
            </span>
            <h2 className="font-nevan text-2xl md:text-3xl text-gray-900 uppercase tracking-wide mb-10">
              Fiabilité Industrielle
            </h2>
            
            <div className="flex flex-col gap-8 md:ml-auto w-full max-w-md md:border-r-2 border-gray-100 md:pr-6 items-center md:items-end mx-auto md:mx-0">
              <div className="flex flex-col items-center md:items-end">
                <h3 className="font-nevan text-4xl md:text-5xl text-[#10748E] tracking-wide mb-1">99.9%</h3>
                <p className="font-montserrat text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500">Taux de Fiabilité H24</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <h3 className="font-nevan text-4xl md:text-5xl text-[#10748E] tracking-wide mb-1">150°</h3>
                <p className="font-montserrat text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500">Flux d'Air Multidirectionnel</p>
              </div>
              <div className="flex flex-col items-center md:items-end">
                <h3 className="font-nevan text-4xl md:text-5xl text-[#10748E] tracking-wide mb-1">1 sec</h3>
                <p className="font-montserrat text-xs md:text-sm font-semibold uppercase tracking-wider text-gray-500">Réactivité Thermique</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
