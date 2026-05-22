"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";

export default function ShowroomPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Fade up experience paragraphs on scroll
    gsap.fromTo(
      ".exp-para",
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.3,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".exp-section",
          start: "top 70%",
        }
      }
    );

    // Grid images parallax
    gsap.utils.toArray(".grid-image-container").forEach((container: any) => {
      const img = container.querySelector("img");
      gsap.fromTo(
        img,
        { scale: 1.2, yPercent: -10 },
        {
          scale: 1,
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-32">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        
        {/* Header */}
        <div className="text-center mb-24">
          <span className="font-nevan text-sm tracking-[0.3em] text-[#32A5DE] uppercase mb-4 block">La Vitrine Connectée</span>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 tracking-wide uppercase">
            Le Showroom <span className="text-primary">Marrakech</span>
          </h1>
        </div>

        {/* Conceptual Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 mb-32 h-[80vh] min-h-[600px]">
          {/* Main Large Image */}
          <div className="grid-image-container md:col-span-8 relative rounded-3xl overflow-hidden bg-gray-100 h-full">
            <Image 
              src="/images/assets/dung-ph-m-42xVlUyp7jw-unsplash.jpg"
              alt="Lounge Architectural"
              fill
              className="object-cover"
            />
          </div>
          {/* Side Stacked Images */}
          <div className="md:col-span-4 flex flex-col gap-6 md:gap-8 h-full">
            <div className="grid-image-container relative rounded-3xl overflow-hidden bg-gray-100 h-1/2">
              <Image 
                src="/images/assets/adrien-olichon-3-GSjNOsO8Q-unsplash.jpg"
                alt="Consulting Technique"
                fill
                className="object-cover"
              />
            </div>
            <div className="grid-image-container relative rounded-3xl overflow-hidden bg-gray-100 h-1/2">
              <Image 
                src="/images/assets/tom-rumble-N5q6uTHdtME-unsplash.jpg"
                alt="Testing Matériel"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* L'Expérience Showroom Section */}
        <div className="exp-section max-w-3xl mx-auto text-center mb-32">
          <h2 className="font-nevan text-3xl text-gray-900 uppercase tracking-wide mb-12">
            L'Expérience
          </h2>
          <div className="space-y-8 font-montserrat text-xl text-gray-500 leading-relaxed">
            <p className="exp-para">
              Dès votre arrivée, plongez dans un espace conçu comme un <strong className="text-gray-900 font-semibold">lounge architectural</strong>. Notre bureau d'études vous accompagne pour un consulting d'ingénierie personnalisé.
            </p>
            <p className="exp-para">
              Modélisez vos futurs espaces grâce à nos outils de <strong className="text-primary font-semibold">rendu 3D en temps réel</strong>. Visualisez l'intégration invisible de nos systèmes directement sur vos plans architecturaux.
            </p>
            <p className="exp-para">
              Ressentez la puissance et le silence. Notre espace de <strong className="text-gray-900 font-semibold">stress-testing physique</strong> vous permet d'éprouver les performances acoustiques et thermiques du matériel avant toute validation.
            </p>
          </div>
        </div>

        {/* Booking Widget Section */}
        <div className="max-w-2xl mx-auto relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/5 via-[#32A5DE]/5 to-primary/5 rounded-[2.5rem] blur-xl opacity-70" />
          <div className="relative bg-white border border-gray-100 rounded-3xl p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.05)] text-center">
            <h3 className="font-nevan text-3xl text-gray-900 uppercase tracking-wide mb-4">
              Réserver une Visite Privée
            </h3>
            <p className="font-montserrat text-gray-500 mb-10">
              Sélectionnez un créneau pour une présentation exclusive avec l'un de nos ingénieurs experts.
            </p>
            
            {/* Minimalist form / Placeholder for Calendly */}
            <form className="flex flex-col gap-4 text-left" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="text" 
                placeholder="Nom complet" 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-colors"
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="email" 
                  placeholder="Email professionnel" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                />
                <input 
                  type="text" 
                  placeholder="Téléphone" 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-6 py-4 font-montserrat text-gray-900 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                />
              </div>
              <button className="mt-4 w-full bg-[#AF1818] text-white font-nevan uppercase tracking-wider py-5 rounded-full hover:bg-[#8A1212] transition-colors shadow-md">
                Confirmer le Rendez-vous
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
