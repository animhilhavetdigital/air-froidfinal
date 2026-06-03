"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP, gsap } from "@/lib/gsap";
import {
  ChevronLeft,
  MapPin,
  Map,
  Compass,
  ArrowRight,
} from "lucide-react";

const CITY_GROUPS = [
  "Casablanca & Rabat",
  "Tanger & Tétouan",
  "Marrakech & Agadir",
  "Fès & Meknès",
];

const REGIONS = [
  "Nord (Tanger-Tétouan-Al Hoceïma)",
  "Oriental (Oujda-Nador)",
  "Centre (Béni Mellal-Khénifra)",
  "Sud (Laâyoune-Dakhla)",
];

const LOCAL_PAGES = [
  { label: "Climatisation Marrakech", href: "/expertises/climatisation-marrakech" },
  { label: "Ventilation Casablanca", href: "/expertises/ventilation-casablanca" },
  { label: "Solaire Agadir", href: "/expertises/solaire-agadir" },
  { label: "Climatisation Tanger", href: "/expertises/climatisation-tanger" },
];

export default function ZonesDeCouverturePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(
      ".hero-badge",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2 }
    );
    gsap.fromTo(
      ".hero-title-word",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.4 }
    );
    gsap.fromTo(".hero-desc", { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 });

    gsap.fromTo(
      ".zone-card",
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: { trigger: ".zones-grid", start: "top 80%" },
      }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-24 overflow-hidden">
      {/* HERO */}
      <section className="relative w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mb-16 lg:mb-24">
        <div className="mb-8">
          <Link
            href="/expertises"
            className="inline-flex items-center gap-2 font-montserrat text-sm text-gray-500 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Retour aux services
          </Link>
        </div>

        <div className="text-center max-w-4xl mx-auto pt-8 md:pt-12">
          <div className="hero-badge inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10748E] animate-pulse" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">
              Zones de couverture
            </span>
          </div>

          <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 overflow-hidden">
            <span className="hero-title-word font-nevan text-5xl md:text-6xl lg:text-7xl text-gray-900 uppercase tracking-tight">
              Intervention
            </span>
            <span className="hero-title-word font-nevan text-5xl md:text-6xl lg:text-7xl text-[#AF1818] uppercase tracking-tight">
              au Maroc
            </span>
          </h1>

          <p className="hero-desc font-montserrat text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Notre réseau nous permet d&apos;intervenir rapidement sur l&apos;ensemble du territoire national pour répondre à vos besoins en climatisation, ventilation et solutions solaires.
          </p>
        </div>
      </section>

      {/* ZONES GRID */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        <div className="zones-grid grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Toutes les villes */}
          <div className="zone-card bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#10748E] flex items-center justify-center mb-6">
              <MapPin size={32} />
            </div>
            <h2 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-4">
              Toutes les villes
            </h2>
            <p className="font-montserrat text-gray-600 mb-6">
              Nos équipes mobiles interviennent dans toutes les grandes villes du Maroc pour des projets d&apos;envergure et des installations spécifiques.
            </p>
            <ul className="space-y-3 font-montserrat text-sm text-gray-500 font-medium">
              {CITY_GROUPS.map((city) => (
                <li key={city} className="flex items-center gap-2">
                  <ArrowRight size={14} className="text-[#10748E]" />
                  {city}
                </li>
              ))}
            </ul>
          </div>

          {/* En région */}
          <div className="zone-card bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-green-50 text-[#00883C] flex items-center justify-center mb-6">
              <Map size={32} />
            </div>
            <h2 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-4">
              Services en région
            </h2>
            <p className="font-montserrat text-gray-600 mb-6">
              Nous couvrons également les régions périphériques selon les spécificités de vos chantiers et nos accords de partenariat.
            </p>
            <ul className="space-y-3 font-montserrat text-sm text-gray-500 font-medium">
              {REGIONS.map((region) => (
                <li key={region} className="flex items-center gap-2">
                  <ArrowRight size={14} className="text-[#00883C]" />
                  {region}
                </li>
              ))}
            </ul>
          </div>

          {/* Expertise Locale */}
          <div className="zone-card bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#AF1818] flex items-center justify-center mb-6">
              <Compass size={32} />
            </div>
            <h2 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-4">
              Expertise Locale
            </h2>
            <p className="font-montserrat text-gray-600 mb-6">
              Des solutions adaptées au climat spécifique de chaque région pour une efficacité optimale de vos installations.
            </p>
            <div className="flex flex-wrap gap-2">
              {LOCAL_PAGES.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="px-4 py-2 bg-gray-50 hover:bg-[#AF1818] hover:text-white transition-colors border border-gray-100 rounded-full font-montserrat text-xs font-semibold text-gray-700"
                >
                  {page.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mt-16 lg:mt-24">
        <div className="text-center">
          <Link
            href="/devis"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-nevan text-sm uppercase tracking-widest text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-[#AF1818]"
          >
            Demander un devis
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
