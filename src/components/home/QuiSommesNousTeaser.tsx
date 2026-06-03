"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";

function wrapChars(element: HTMLElement) {
  if (element.querySelector(".type-char")) return;

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  );
  const textNodes: Text[] = [];
  let node;
  while ((node = walker.nextNode())) {
    textNodes.push(node as Text);
  }

  textNodes.reverse().forEach((textNode) => {
    const text = textNode.textContent || "";
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const span = document.createElement("span");
      span.textContent = char;
      span.className = "type-char inline";
      span.style.opacity = "0";
      fragment.appendChild(span);
    }
    textNode.parentNode?.replaceChild(fragment, textNode);
  });
}

export function QuiSommesNousTeaser() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const lines = gsap.utils.toArray(".editorial-line") as HTMLElement[];
    lines.forEach((line) => wrapChars(line));

    gsap.fromTo(
      ".type-char",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.04,
        stagger: 0.025,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="py-32 bg-white flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-5xl text-center">
        <h2 className="font-nevan text-primary text-xl tracking-widest mb-12 editorial-line uppercase text-center">
          Notre Héritage
        </h2>
        
        <div className="font-montserrat text-3xl md:text-4xl lg:text-5xl leading-tight text-gray-900 font-medium space-y-4">
          <p className="editorial-line text-center">Forts de plus de 20 ans <span className="bg-gradient-to-r from-[#00883C] to-[#AF1818] bg-clip-text text-transparent font-bold">d&apos;excellence en ingénierie climatique</span>,</p>
          <p className="editorial-line text-center">nous déployons notre expertise à travers <span className="bg-gradient-to-r from-[#00883C] to-[#AF1818] bg-clip-text text-transparent font-bold">tout le Maroc</span>.</p>
          <p className="editorial-line text-gray-400 text-center">Une exécution méticuleuse pour des projets d&apos;exception.</p>
        </div>
      </div>
    </section>
  );
}
