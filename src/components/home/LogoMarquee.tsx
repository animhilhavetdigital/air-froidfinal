"use client";

import Image from "next/image";

const LOGOS = [
  "/images/assets/marque-2.png",
  "/images/assets/marque-3.png",
  "/images/assets/marque-4.png",
  "/images/assets/marque-5.png",
  "/images/assets/marque-6.png",
  "/images/assets/marque-7.png",
  "/images/assets/marque-8.png",
  "/images/assets/marque-9.png",
];

export function LogoMarquee() {
  // Duplicate logos for seamless infinite loop
  const allLogos = [...LOGOS, ...LOGOS];

  return (
    <section className="w-full bg-white py-10 border-b border-gray-100 overflow-hidden">
      <div className="relative w-full">
        {/* Gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Marquee track */}
        <div className="flex gap-16 animate-marquee whitespace-nowrap">
          {allLogos.map((src, index) => (
            <div
              key={index}
              className="relative h-12 w-auto flex-shrink-0 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            >
              <Image
                src={src}
                alt={`Marque partenaire ${(index % LOGOS.length) + 1}`}
                height={48}
                width={160}
                className="object-contain h-12 w-auto"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
