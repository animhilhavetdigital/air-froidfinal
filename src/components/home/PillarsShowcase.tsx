"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";

const PILLARS = [
  {
    title: "Climatisation",
    desc: "Systèmes résidentiels et VRV industriels haute performance.",
    image: "/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg",
  },
  {
    title: "Énergie Solaire",
    desc: "Solutions photovoltaïques et pompes à chaleur sur mesure.",
    image: "/images/assets/tom-rumble-N5q6uTHdtME-unsplash.jpg",
  },
  {
    title: "Ventilation",
    desc: "Traitement d'air et extraction pour structures complexes.",
    image: "/images/assets/adrien-olichon-3-GSjNOsO8Q-unsplash.jpg",
  },
  {
    title: "Cuisines Pro",
    desc: "Agencement et froid industriel pour la restauration de prestige.",
    image: "/images/assets/zulki-jrzt-Q4f_0gKTMEk-unsplash.jpg",
  },
];

export function PillarsShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  useGSAP(() => {
    const panels = gsap.utils.toArray(".pillar-panel") as HTMLElement[];
    
    // Create a master timeline for the pinned section
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=80%", // Reduced even further to make it much faster to scroll
        pin: true,
        scrub: 1, // Smooth scrubbing
        onUpdate: (self) => {
          // Calculate active index based on scroll progress
          const progress = self.progress;
          const index = Math.floor(progress * 3.99);
          // Only trigger React state update if the index actually changes to prevent crashes
          if (index !== activeIndexRef.current) {
            activeIndexRef.current = index;
            setActiveIndex(index);
          }
        }
      }
    });

    // Animate panels within the timeline
    panels.forEach((panel, i) => {
      if (i === 0) {
        // First panel starts visible, but we can set its initial state explicitly
        gsap.set(panel, { opacity: 1, y: 0, zIndex: 10 });
        return;
      }
      
      // Each panel animation takes 1 unit of time in the timeline
      const position = i; 
      
      // Fade out previous panel
      tl.to(panels[i - 1], {
        opacity: 0,
        y: -50,
        duration: 1,
        ease: "power2.inOut"
      }, position - 0.5); // Starts halfway through the step

      // Fade in current panel
      tl.fromTo(panel, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0,
          duration: 1,
          ease: "power2.inOut"
        },
        position - 0.5
      );
      
      // Ensure the active panel is on top
      gsap.set(panel, { zIndex: 10 + i });
    });

  }, { scope: containerRef, dependencies: [] });

  return (
    <section ref={containerRef} className="h-screen w-full bg-white relative overflow-hidden flex items-center">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 h-[80vh] flex flex-col md:flex-row">
        
        {/* Left Column - Fixed Tracker */}
        <div className="w-full md:w-1/3 h-full flex flex-col justify-center relative z-20 pr-8">
          <h2 className="font-nevan text-4xl md:text-5xl text-gray-900 tracking-wide mb-12 uppercase">
            Nos 4 Piliers
          </h2>

          <div className="flex flex-col gap-8 relative">
            {/* Vertical Tracker Line */}
            <div className="absolute left-3 top-2 bottom-2 w-[1px] bg-gray-200" />
            
            {PILLARS.map((pillar, idx) => (
              <div key={idx} className="flex items-center gap-6 relative">
                {/* Tracker Node */}
                <div className="relative z-10 w-6 flex items-center justify-center">
                  <div className={`w-3 h-3 rounded-full transition-all duration-500 ${activeIndex === idx ? 'bg-[#AF1818] scale-150 shadow-[0_0_10px_rgba(175,24,24,0.3)]' : 'bg-gray-300'}`} />
                </div>
                
                <div className={`transition-all duration-500 ${activeIndex === idx ? 'opacity-100 translate-x-2' : 'opacity-40'}`}>
                  <span className="font-nevan text-xl text-primary block mb-1">0{idx + 1}</span>
                  <span className="font-montserrat font-bold text-gray-900 text-lg">{pillar.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Scrolling Content Cards */}
        <div ref={rightColRef} className="w-full md:w-2/3 h-full relative z-10 mt-12 md:mt-0">
          {PILLARS.map((pillar, idx) => (
            <div 
              key={idx} 
              className={`pillar-panel absolute inset-0 w-full h-full flex items-center justify-center ${idx === 0 ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <div className="w-full h-full max-h-[600px] relative rounded-3xl overflow-hidden group shadow-2xl bg-gray-50 border border-gray-100">
                <Image 
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover transition-transform duration-[10s] group-hover:scale-105"
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 w-full p-10 md:p-16">
                  <h3 className="font-nevan text-4xl text-white tracking-wide mb-4 uppercase">
                    {pillar.title}
                  </h3>
                  <p className="font-montserrat text-white/90 text-xl max-w-lg leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
