"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft } from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";
import { getServiceBySlug } from "@/lib/expertises-data";

interface ServiceDetailPageProps {
  slug: string;
}

export function ServiceDetailPage({ slug }: ServiceDetailPageProps) {
  const service = getServiceBySlug(slug);
  if (!service) return null;
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
      ".service-image",
      { opacity: 0, scale: 0.95, clipPath: "inset(5% 5% 5% 5%)" },
      {
        opacity: 1,
        scale: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".service-image", start: "top 75%" },
      }
    );

    gsap.fromTo(
      ".sub-service-card",
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: { trigger: ".sub-services-grid", start: "top 80%" },
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
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">
              {service?.title}
            </span>
          </div>

          <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 overflow-hidden">
            <span className="hero-title-word font-nevan text-5xl md:text-6xl lg:text-7xl text-gray-900 uppercase tracking-tight">
              {service?.title}
            </span>
          </h1>

          <p className="hero-desc font-montserrat text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {service?.desc}
          </p>
        </div>
      </section>

      {/* IMAGE HERO */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mb-16 lg:mb-24">
        <div className="service-image relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden shadow-2xl">
          <Image
            src={service?.image || ""}
            alt={service?.title || ""}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent" />
          <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
            <div className="h-1 w-16 mb-4" style={{ backgroundColor: service.color }} />
            <h2 className="font-nevan text-3xl md:text-4xl text-white uppercase tracking-wider">
              {service.title}
            </h2>
          </div>
        </div>
      </section>

      {/* SUB-SERVICES */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        <h2 className="font-nevan text-3xl lg:text-4xl text-gray-900 uppercase tracking-wide mb-10 text-center">
          Nos prestations
        </h2>

        <div className="sub-services-grid grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {service?.subServices.map((sub, i) => {
            const Icon = sub.icon;
            return (
              <div
                key={i}
                className="sub-service-card group relative bg-gray-50 border border-gray-100 p-8 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-tr-2xl rounded-bl-full transition-opacity duration-300 pointer-events-none"
                  style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${service?.color})` }}
                />
                <div
                  className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                  style={{ color: service?.color }}
                >
                  <Icon size={28} strokeWidth={1.5} />
                </div>
                <h4 className="font-montserrat font-bold text-gray-900 text-lg mb-3">
                  {sub.name}
                </h4>
                <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
                  {sub.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/devis"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-nevan text-sm uppercase tracking-widest text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            style={{ backgroundColor: service?.color }}
          >
            Demander un devis
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/expertises"
            className="inline-flex items-center gap-2 font-montserrat text-sm font-semibold text-gray-500 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} />
            Voir tous les services
          </Link>
        </div>
      </section>
    </div>
  );
}
