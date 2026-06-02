"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (windowHeight > 0) {
        const percentage = (scrollPosition / windowHeight) * 100;
        setScrollPercentage(percentage);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 bg-gray-200/50 z-[9999] pointer-events-none backdrop-blur-sm">
      <div 
        className="h-full bg-gradient-to-r from-[#AF1818] to-[#00883C] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(175,24,24,0.5)]"
        style={{ width: `${scrollPercentage}%` }}
      />
    </div>
  );
}
