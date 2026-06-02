"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Bloquer le scroll pendant le chargement
    document.body.style.overflow = "hidden";
    
    const ctx = gsap.context(() => {
      // Animation d'apparition du logo
      gsap.fromTo(".splash-logo", 
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
      );

      // Animation de disparition (rideau qui se lève) après 1.5s
      gsap.to(".splash-container", {
        yPercent: -100,
        ease: "power4.inOut",
        duration: 0.8,
        delay: 1.5,
        onComplete: () => {
          setIsVisible(false);
          document.body.style.overflow = ""; // Rétablir le scroll
        }
      });
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className="splash-container fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center">
      <div className="splash-logo relative w-72 h-28">
        <Image 
          src="/images/assets/logo-clean.png" 
          alt="Air Froid Expert Logo" 
          fill 
          className="object-contain" 
          priority
        />
      </div>
      <div className="mt-8 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-[#AF1818] animate-bounce" style={{ animationDelay: "0s" }} />
        <div className="w-2 h-2 rounded-full bg-[#AF1818] animate-bounce" style={{ animationDelay: "0.15s" }} />
        <div className="w-2 h-2 rounded-full bg-[#AF1818] animate-bounce" style={{ animationDelay: "0.3s" }} />
      </div>
    </div>
  );
}
