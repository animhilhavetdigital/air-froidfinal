import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export { gsap, ScrollTrigger, useGSAP };

// Common GSAP animation presets
export const animations = {
  // Float up into place (fade in up)
  fadeInUp: (element: Element | string, options?: gsap.TweenVars) => {
    return gsap.fromTo(
      element,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        ...options,
      }
    );
  },
  
  // Floating / Antigravity effect
  antigravity: (element: Element | string, options?: gsap.TweenVars) => {
    return gsap.to(element, {
      y: "-=15",
      rotation: "random(-1.5, 1.5)",
      duration: "random(3, 5)",
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      ...options,
    });
  },

  // Staggered list reveal
  staggerReveal: (elements: NodeListOf<Element> | string, options?: gsap.TweenVars) => {
    return gsap.fromTo(
      elements,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        ...options,
      }
    );
  }
};
