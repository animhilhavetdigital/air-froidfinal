"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP, gsap } from "@/lib/gsap";

const slides = [
  {
    src: "/images/hero-slider/slide-climatisation.jpg",
    title: "Climatisation",
    desc: "Systèmes résidentiels et VRV industriels haute performance.",
  },
  {
    src: "/images/hero-slider/slide-solaire.jpg",
    title: "Énergie Solaire",
    desc: "Solutions photovoltaïques et pompes à chaleur sur mesure.",
  },
  {
    src: "/images/hero-slider/slide-ventilation.jpg",
    title: "Ventilation",
    desc: "Traitement d'air et extraction pour structures complexes.",
  },
  {
    src: "/images/hero-slider/slide-services.jpg",
    title: "Services Associés",
    desc: "Accompagnement, suivi et support technique réactif.",
  },
];

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);
  
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
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 md:px-12 xl:px-24 z-10 pt-32 lg:pt-28 h-full relative">
        <div className="max-w-xl lg:mx-0 lg:ml-8 xl:ml-14 w-full">
          
          <h1 className="font-nevan text-4xl md:text-5xl lg:text-[3.4vw] xl:text-[3.6rem] leading-[1.1] text-gray-900 lg:text-gray-900 uppercase tracking-wide mb-6">
            {titleLines.map((line, idx) => (
              <span key={idx} className="block overflow-hidden pb-2">
                <span className="char-reveal inline-block text-primary drop-shadow-sm lg:drop-shadow-none">
                  {line}
                </span>
              </span>
            ))}
          </h1>
          
          <p className="mt-4 text-gray-800 lg:text-gray-600 font-montserrat text-base md:text-lg leading-relaxed mb-6 char-reveal max-w-lg drop-shadow-sm lg:drop-shadow-none font-medium lg:font-normal">
            Installations de climatisation, ventilation, énergie solaire et Services Associés professionnelle pour particuliers et entreprises à Marrakech et partout au Maroc.
          </p>

          {/* Badges Image */}
          <div className="mb-8 char-reveal relative h-28 sm:h-36 md:h-40 w-full max-w-lg">
            <Image
              src="/images/assets/panneaux-affiche.png"
              alt="Domaines d'expertise"
              fill
              sizes="(max-width: 768px) 100vw, 512px"
              className="object-contain object-left"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 char-reveal mt-4">
            <Link 
              href="/expertises" 
              className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-full font-nevan text-sm tracking-wider uppercase hover:bg-primary-hover transition-colors shadow-lg text-center"
            >
              Découvrir nos services
            </Link>
            <Link 
              href="/devis" 
              className="w-full sm:w-auto px-6 py-3 bg-white/90 backdrop-blur-sm lg:bg-white text-gray-900 border border-gray-200 rounded-full font-nevan text-sm tracking-wider uppercase hover:border-primary hover:text-primary transition-all shadow-sm text-center"
            >
              Demander un devis
            </Link>
          </div>
          
        </div>
      </div>

      {/* Right Column / Mobile Background - Image Slider Background */}
      <div className="absolute inset-0 lg:relative lg:w-1/2 h-full bg-gray-900 z-0">
        <div className="hero-image-container relative w-full h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.src}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                index === currentSlide ? "opacity-15 lg:opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.src}
                alt={slide.title}
                fill
                sizes="100vw"
                priority={index === 0}
                className="object-cover"
              />
              {/* Gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-transparent" />
              {/* Slide text */}
              <div className="absolute bottom-0 left-0 w-full p-6 lg:p-10">
                <h3 className="font-nevan text-xl md:text-2xl lg:text-3xl text-white tracking-wide mb-1 lg:mb-2 uppercase">
                  {slide.title}
                </h3>
                <p className="font-montserrat text-white/90 text-sm md:text-base max-w-md leading-relaxed">
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
          {/* Subtle overlay to integrate the split better */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#F4F7F9] lg:bg-gradient-to-r lg:from-black/20 to-transparent z-20 pointer-events-none" />
        </div>
      </div>

      {/* Center Floating Product - Overlaps Both Sides */}
      <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none z-20">
        <div className="relative w-[162px] xl:w-[252px] aspect-video floating-product drop-shadow-2xl translate-x-[-2%]">
          <Image 
            src="/images/assets/symbol-logo.png" 
            alt="Animated Logo"
            fill
            sizes="(max-width: 1280px) 162px, 252px"
            className="object-contain"
            priority
          />
        </div>
      </div>

    </section>
  );
}
