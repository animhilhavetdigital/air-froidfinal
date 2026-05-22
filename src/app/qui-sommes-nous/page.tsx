"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP, gsap } from "@/lib/gsap";

export default function QuiSommesNousPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".about-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
    
    // Image and Text Animation
    gsap.fromTo(".about-content",
      { opacity: 0, x: -50 },
      {
        opacity: 1, x: 0, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: ".about-content", start: "top 80%" }
      }
    );

    gsap.fromTo(".about-image",
      { opacity: 0, scale: 0.95 },
      {
        opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
        scrollTrigger: { trigger: ".about-image", start: "top 80%" }
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-0 flex flex-col">
      {/* Header Section */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mb-24">
        <div className="about-header text-center max-w-4xl mx-auto mb-20">
          <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block">
            — NOTRE HISTOIRE —
          </span>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 uppercase tracking-wider mb-6 leading-tight">
            L'excellence climatique <br/> <span className="text-[#32A5DE]">au Maroc</span>
          </h1>
          <p className="font-montserrat text-gray-600 text-lg md:text-xl leading-relaxed">
            AIR FROID EXPERT est votre partenaire de confiance pour toutes vos installations de climatisation, de ventilation, d'énergie solaire et d'équipements de cuisine professionnelle.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="about-image relative h-[600px] w-full rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg"
              alt="Notre équipe au travail"
              fill
              className="object-cover"
            />
          </div>

          <div className="about-content flex flex-col justify-center">
            <h2 className="font-nevan text-4xl text-gray-900 uppercase tracking-wider mb-6">
              Une expertise de pointe
            </h2>
            <div className="font-montserrat text-gray-600 space-y-6 text-lg">
              <p>
                Depuis plusieurs années, notre mission est d'allier performance énergétique et confort absolu. Nous accompagnons les particuliers comme les professionnels dans la conception, l'installation et la maintenance de systèmes thermiques haut de gamme.
              </p>
              <p>
                Que ce soit pour équiper une villa de luxe à Marrakech ou pour concevoir la ventilation intégrale d'un complexe hôtelier, nos ingénieurs apportent une attention méticuleuse à chaque détail.
              </p>
            </div>

            <div className="mt-12 flex gap-12">
              <div>
                <span className="block font-nevan text-5xl text-[#32A5DE] mb-2">15+</span>
                <span className="font-montserrat font-bold text-sm uppercase tracking-wider text-gray-900">Années d'expertise</span>
              </div>
              <div>
                <span className="block font-nevan text-5xl text-[#AF1818] mb-2">500+</span>
                <span className="font-montserrat font-bold text-sm uppercase tracking-wider text-gray-900">Projets réalisés</span>
              </div>
            </div>

            <div className="mt-12">
              <Link 
                href="/expertises" 
                className="inline-block px-8 py-4 bg-[#1E293B] text-white rounded-full font-nevan tracking-wider uppercase hover:bg-black transition-colors shadow-lg"
              >
                Découvrir nos services
              </Link>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
