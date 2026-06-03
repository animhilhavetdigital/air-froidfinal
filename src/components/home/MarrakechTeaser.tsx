"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP, gsap } from "@/lib/gsap";

const slides = [
  "/images/assets/showroom-marrakech-bg.jpg",
  "/images/assets/showroom-001.jpg",
  "/images/assets/showroom-002.jpg",
  "/images/assets/showroom-003.jpg",
];

export function MarrakechTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".teaser-content",
      { opacity: 0, x: -50 },
      {
        opacity: 1,
        x: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );

    gsap.fromTo(
      ".teaser-image",
      { opacity: 0, scale: 0.95, clipPath: "inset(10% 0 10% 0)" },
      {
        opacity: 1,
        scale: 1,
        clipPath: "inset(0% 0 0% 0)",
        duration: 1.5,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-white overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          
          {/* Left: Typography Description */}
          <div className="w-full lg:w-5/12 flex flex-col justify-center">
            <span className="teaser-content font-nevan text-sm tracking-[0.2em] text-[#32A5DE] uppercase mb-4 block">
              L'Expérience
            </span>
            <h2 className="teaser-content font-nevan text-4xl md:text-5xl text-gray-900 tracking-wide uppercase mb-8 leading-tight">
              Le Showroom <br />
              <span className="text-primary">Marrakech</span>
            </h2>
            <p className="teaser-content font-montserrat text-gray-600 text-lg leading-relaxed mb-10">
              Plongez au cœur de l'innovation climatique. Notre espace exclusif à Marrakech est conçu comme un lounge architectural, pensé pour vous offrir une consultation technique et visuelle sans précédent. Testez nos équipements en conditions réelles et modélisez votre projet en 3D avec nos experts.
            </p>
            <div className="teaser-content">
              <Link 
                href="/showroom" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-nevan tracking-wider uppercase text-sm transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                Découvrir le Showroom
              </Link>
            </div>
          </div>

          {/* Right: Media Wrapper */}
          <div className="w-full lg:w-7/12">
            <div className="teaser-image relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
              {slides.map((slide, index) => (
                <Image
                  key={slide}
                  src={slide}
                  alt={`Showroom Marrakech ${index + 1}`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={`object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  priority={index === 0}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
