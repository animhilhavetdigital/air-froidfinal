"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";

export function HeroSection() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Soft fade up for text elements
      tl.fromTo(
        ".hero-text",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
      );

      // Subtle parallax on the image shape
      gsap.to(".hero-image-container", {
        yPercent: 15,
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: container }
  );

  return (
    <section ref={container} className="relative min-h-[90vh] flex items-center bg-[#FAFAFA] overflow-hidden pt-20">
      {/* Soft background shape */}
      <div className="absolute top-0 right-0 w-2/3 h-full bg-[#F3F4F6] rounded-bl-[100px] -z-10" />

      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="relative z-10 max-w-xl">
            <div className="hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Solutions de climatisation premium
            </div>
            
            <h1 className="hero-text text-5xl md:text-7xl font-bold text-gray-900 leading-[1.1] mb-6 tracking-tight">
              L'excellence<br />
              <span className="text-primary">climatique</span> pour<br />
              votre espace.
            </h1>
            
            <p className="hero-text text-lg text-gray-600 mb-10 leading-relaxed max-w-lg">
              De l'installation industrielle à l'équipement résidentiel, nous concevons des solutions thermiques durables, esthétiques et hautement performantes.
            </p>
            
            <div className="hero-text flex flex-wrap gap-4">
              <Link
                href="/devis"
                className="group flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-semibold hover:bg-primary-hover transition-all shadow-md hover:shadow-lg"
              >
                Demander un devis
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/services"
                className="flex items-center justify-center px-8 py-4 rounded-full font-semibold text-gray-700 bg-white border border-gray-200 hover:border-primary hover:text-primary transition-all shadow-sm"
              >
                Découvrir nos services
              </Link>
            </div>
          </div>

          {/* Visual Content */}
          <div className="relative h-[600px] hidden lg:block hero-image-container">
            {/* Main Image Placeholder - elegant rounded shape */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[90%] h-[90%] bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 opacity-80" />
              
              {/* This would be replaced with actual high-quality product/interior image */}
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold">IMAGE</span>
                </div>
                <p className="text-gray-400 text-sm font-medium">Climatisation Design</p>
              </div>
            </div>

            {/* Floating badge */}
            <div className="hero-text absolute bottom-20 left-0 bg-white p-6 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-4 animate-float">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold text-xl">
                ✓
              </div>
              <div>
                <p className="font-bold text-gray-900">Qualité Premium</p>
                <p className="text-sm text-gray-500">Installation certifiée</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hero-text">
        <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Découvrir</span>
        <ChevronDown size={20} className="text-gray-400 animate-bounce" />
      </div>
    </section>
  );
}
