"use client";

import { useRef } from "react";
import { Star, Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/constants";
import { useGSAP, gsap } from "@/lib/gsap";

export function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Header reveal
      gsap.fromTo(
        ".test-header",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
          },
        }
      );

      // We use CSS for the continuous marquee animation, 
      // but we could use GSAP if we wanted more complex interaction.
    },
    { scope: containerRef }
  );

  return (
    <section ref={containerRef} className="py-24 bg-gray-50 overflow-hidden relative">
      <div className="container mx-auto px-4 max-w-7xl mb-16 text-center test-header relative z-10">
        <h2 className="text-sm font-bold text-primary tracking-widest uppercase mb-3">
          Témoignages
        </h2>
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
          Ce que nos clients disent de nous
        </h3>
      </div>

      {/* Infinite Marquee Container */}
      <div className="relative flex overflow-x-hidden group">
        <div ref={marqueeRef} className="animate-marquee flex whitespace-nowrap gap-6 py-4 px-3">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((test, idx) => (
            <div
              key={idx}
              className="w-[350px] md:w-[450px] shrink-0 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col whitespace-normal group-hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote size={32} className="text-gray-100 rotate-180" />
              </div>
              
              <p className="text-gray-600 text-base leading-relaxed mb-8 flex-1 italic">
                "{test.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{test.name}</h4>
                  <p className="text-xs text-gray-500">{test.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Secondary marquee to create seamless loop */}
        <div className="animate-marquee flex whitespace-nowrap gap-6 py-4 px-3 absolute top-0">
          {[...TESTIMONIALS, ...TESTIMONIALS].map((test, idx) => (
            <div
              key={`clone-${idx}`}
              className="w-[350px] md:w-[450px] shrink-0 bg-white border border-gray-100 rounded-3xl p-8 shadow-sm flex flex-col whitespace-normal group-hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote size={32} className="text-gray-100 rotate-180" />
              </div>
              
              <p className="text-gray-600 text-base leading-relaxed mb-8 flex-1 italic">
                "{test.text}"
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-lg">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{test.name}</h4>
                  <p className="text-xs text-gray-500">{test.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Marquee CSS Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 40s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
}
