"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP, gsap } from "@/lib/gsap";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const titleLines = [
    "Votre confort climatique,",
    "notre expertise."
  ];

  useGSAP(() => {
    // Reveal text animation
    gsap.fromTo(
      ".char-reveal",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.1,
        ease: "power4.out",
        delay: 0.2
      }
    );

    // Image reveal animation (Right side)
    gsap.fromTo(
      ".hero-image-container",
      { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1.5,
        ease: "power4.inOut",
        delay: 0.4
      }
    );

    // Floating product entrance
    gsap.fromTo(
      ".floating-product",
      { opacity: 0, scale: 0.8, y: 100 },
      {
        opacity: 1,
        scale: 1,
        y: 20,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.8,
        onComplete: () => {
          // Continuous floating effect
          gsap.to(".floating-product", {
            y: -10,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
          });
        }
      }
    );

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen min-h-[800px] flex flex-col lg:flex-row bg-[#F4F7F9] overflow-hidden">
      
      {/* Left Column - Text Content (50%) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 md:px-12 xl:px-24 z-10 pt-32 lg:pt-0 h-full relative">
        <div className="max-w-2xl mx-auto lg:mx-0 w-full">
          
          <h1 className="font-nevan text-4xl md:text-5xl lg:text-[4vw] xl:text-[4.2rem] leading-[1.1] text-gray-900 lg:text-gray-900 uppercase tracking-wide mb-6">
            {titleLines.map((line, idx) => (
              <span key={idx} className="block overflow-hidden pb-2">
                <span className="char-reveal inline-block text-primary drop-shadow-sm lg:drop-shadow-none">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          
          <p className="mt-4 text-gray-800 lg:text-gray-600 font-montserrat text-base md:text-lg leading-relaxed mb-10 char-reveal max-w-lg drop-shadow-sm lg:drop-shadow-none font-medium lg:font-normal">
            Installations de climatisation, ventilation, énergie solaire et cuisine professionnelle pour particuliers et entreprises à Marrakech et partout au Maroc.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 char-reveal">
            <Link 
              href="/expertises" 
              className="w-full sm:w-auto px-8 py-4 bg-primary text-white rounded-full font-nevan tracking-wider uppercase hover:bg-primary-hover transition-colors shadow-lg text-center"
            >
              Découvrir nos services
            </Link>
            <Link 
              href="/devis" 
              className="w-full sm:w-auto px-8 py-4 bg-white/90 backdrop-blur-sm lg:bg-white text-gray-900 border border-gray-200 rounded-full font-nevan tracking-wider uppercase hover:border-primary hover:text-primary transition-all shadow-sm text-center"
            >
              Demander un devis
            </Link>
          </div>
          
        </div>
      </div>

      {/* Right Column / Mobile Background - Video Background */}
      <div className="absolute inset-0 lg:relative lg:w-1/2 h-full bg-gray-900 z-0">
        <div className="hero-image-container relative w-full h-full overflow-hidden">
          <video 
            src="/videos/hero-video.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute inset-0 w-full h-full object-cover opacity-15 lg:opacity-90"
          />
          {/* Subtle overlay to integrate the split better */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F7F9] lg:bg-gradient-to-r lg:from-black/20 to-transparent" />
        </div>
      </div>

      {/* Center Floating Product - Overlaps Both Sides */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-20">
        <div className="relative w-[450px] xl:w-[700px] aspect-video floating-product drop-shadow-2xl translate-x-8">
          <Image 
            src="/images/assets/Air Conditioner.H01.2k.png" 
            alt="Air Conditioner Focus"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

    </section>
  );
}
