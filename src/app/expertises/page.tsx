"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";
import Link from "next/link";
import { 
  Home, Building2, Settings, 
  ChefHat, Wind, Sliders, 
  Sun, Wrench, Lightbulb, 
  FileText, Headset, AlertTriangle,
  ArrowRight, MapPin, Map, Compass
} from "lucide-react";

const SERVICES = [
  {
    id: "climatisation",
    number: "01",
    title: "Climatisation",
    desc: "Systèmes de refroidissement de pointe assurant un confort thermique optimal, conçus pour s'intégrer parfaitement à tous types d'espaces avec une efficacité énergétique maximale.",
    image: "/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg",
    color: "#10748E",
    subServices: [
      { name: "Climatisation résidentielle", icon: Home, desc: "Splits, multi-splits et gainables pour villas et appartements" },
      { name: "Climatisation professionnelle", icon: Building2, desc: "VRV/DRV et groupes d'eau glacée pour bureaux et industries" },
      { name: "Maintenance climatisation", icon: Settings, desc: "Entretien préventif et curatif pour pérenniser vos installations" }
    ]
  },
  {
    id: "ventilation",
    number: "02",
    title: "Ventilation",
    desc: "Extraction et traitement de l'air pour garantir un environnement sain, sans odeurs ni polluants, dans les espaces clos et professionnels.",
    image: "/images/assets/adrien-olichon-3-GSjNOsO8Q-unsplash.jpg",
    color: "#32A5DE",
    subServices: [
      { name: "VMC cuisine professionnelle", icon: ChefHat, desc: "Hottes et extraction sur-mesure pour la restauration" },
      { name: "Ventilation générale", icon: Wind, desc: "VMC Double flux et centrales de traitement d'air (CTA)" },
      { name: "Solutions spécialisées", icon: Sliders, desc: "Filtration absolue et désenfumage" }
    ]
  },
  {
    id: "solaire",
    number: "03",
    title: "Solaire",
    desc: "Solutions d'énergie renouvelable pour réduire votre empreinte carbone et vos factures énergétiques avec des installations photovoltaïques fiables et durables.",
    image: "/images/assets/tom-rumble-N5q6uTHdtME-unsplash.jpg",
    color: "#00883C",
    subServices: [
      { name: "Installation solaire", icon: Sun, desc: "Dimensionnement et pose de panneaux photovoltaïques" },
      { name: "Maintenance solaire", icon: Wrench, desc: "Nettoyage et contrôle des équipements et onduleurs" },
      { name: "Consulting solaire", icon: Lightbulb, desc: "Audits énergétiques et études de faisabilité" }
    ]
  },
  {
    id: "services-associes",
    number: "04",
    title: "Services Associés",
    desc: "Un accompagnement sur le long terme avec des contrats de suivi et un support technique réactif pour garantir la performance continue de vos équipements.",
    image: "/images/assets/dung-ph-m-42xVlUyp7jw-unsplash.jpg", 
    color: "#AF1818",
    subServices: [
      { name: "Contrats de maintenance", icon: FileText, desc: "Programmes d'entretien personnalisés et réguliers" },
      { name: "Support technique", icon: Headset, desc: "Assistance experte par téléphone ou sur site" },
      { name: "Interventions d'urgence", icon: AlertTriangle, desc: "Dépannage rapide 7j/7 pour vos systèmes critiques" }
    ]
  }
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Hero Animations
    gsap.fromTo(".hero-badge", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.2 });
    gsap.fromTo(".hero-title-word", 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power4.out", delay: 0.4 }
    );
    gsap.fromTo(".hero-desc", { opacity: 0 }, { opacity: 1, duration: 1, delay: 1 });

    // Services Scroll Animation
    const serviceBlocks = gsap.utils.toArray<HTMLElement>('.service-block');
    serviceBlocks.forEach((block, i) => {
      const image = block.querySelector('.service-image');
      const content = block.querySelector('.service-content');
      
      gsap.fromTo(image,
        { opacity: 0, scale: 0.9, rotation: i % 2 === 0 ? -2 : 2 },
        { opacity: 1, scale: 1, rotation: 0, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: block, start: "top 75%" } }
      );
      
      gsap.fromTo(content?.children ? Array.from(content.children) : [],
        { opacity: 0, x: i % 2 === 0 ? 50 : -50 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: block, start: "top 70%" } }
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-24 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mb-24 lg:mb-32">
        <div className="text-center max-w-4xl mx-auto pt-12 md:pt-20">
          <div className="hero-badge inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#32A5DE] animate-pulse" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">Nos domaines d'expertise</span>
          </div>
          
          <h1 className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-8 overflow-hidden">
            <span className="hero-title-word font-nevan text-6xl md:text-7xl lg:text-8xl text-gray-900 uppercase tracking-tight">Services</span>
            <span className="hero-title-word font-nevan text-6xl md:text-7xl lg:text-8xl text-gray-900 uppercase tracking-tight">&</span>
            <span className="hero-title-word font-nevan text-6xl md:text-7xl lg:text-8xl text-[#10748E] uppercase tracking-tight">Solutions</span>
          </h1>
          
          <p className="hero-desc font-montserrat text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Une gamme complète de solutions sur-mesure pour le confort thermique, la qualité de l'air et l'efficacité énergétique, accompagnées d'un service d'excellence.
          </p>
        </div>
      </section>

      {/* SERVICES LIST */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        <div className="flex flex-col gap-32">
          {SERVICES.map((service, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div 
                key={service.id} 
                id={service.id}
                className="service-block flex flex-col lg:flex-row items-center gap-12 lg:gap-20 scroll-mt-32"
              >
                {/* Image Side */}
                <div className={`w-full lg:w-5/12 ${!isEven ? 'lg:order-2' : ''}`}>
                  <div className="service-image relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
                    
                    {/* Number styling */}
                    <div className="absolute top-8 left-8 flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                      <span className="font-nevan text-4xl text-white">{service.number}</span>
                    </div>

                    <div className="absolute bottom-10 left-10 right-10">
                      <div className="h-1 w-16 mb-6" style={{ backgroundColor: service.color }} />
                      <h3 className="font-nevan text-4xl text-white uppercase tracking-wider">{service.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`service-content w-full lg:w-7/12 ${!isEven ? 'lg:order-1' : ''}`}>
                  <h2 className="font-nevan text-3xl lg:text-5xl text-gray-900 uppercase tracking-wide mb-6">
                    {service.title}
                  </h2>
                  <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-12 max-w-2xl">
                    {service.desc}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    {service.subServices.map((sub, i) => {
                      const Icon = sub.icon;
                      return (
                        <div key={i} className="group relative bg-gray-50 border border-gray-100 p-6 rounded-2xl hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                          <div 
                            className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-0 group-hover:opacity-10 rounded-tr-2xl rounded-bl-full transition-opacity duration-300 pointer-events-none"
                            style={{ backgroundImage: `linear-gradient(to bottom right, transparent, ${service.color})` }}
                          />
                          <div 
                            className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110"
                            style={{ color: service.color }}
                          >
                            <Icon size={24} strokeWidth={1.5} />
                          </div>
                          <h4 className="font-montserrat font-bold text-gray-900 text-[15px] mb-2">
                            {sub.name}
                          </h4>
                          <p className="font-montserrat text-sm text-gray-500 leading-relaxed">
                            {sub.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <a 
                    href="#contact" 
                    className="inline-flex items-center gap-3 font-nevan text-sm uppercase tracking-widest text-gray-900 hover:text-gray-600 transition-colors group"
                  >
                    Demander un devis pour ce service
                    <span 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-2"
                      style={{ backgroundColor: service.color }}
                    >
                      <ArrowRight size={16} />
                    </span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ZONES DE COUVERTURE */}
      <section className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mt-24 lg:mt-32 border-t border-gray-100 pt-24 lg:pt-32">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10748E] animate-pulse" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">Zones de couverture</span>
          </div>
          <h2 className="font-nevan text-4xl md:text-5xl lg:text-6xl text-gray-900 uppercase tracking-tight mb-8">
            Intervention au <span className="text-[#AF1818]">Maroc</span>
          </h2>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed">
            Notre réseau nous permet d'intervenir rapidement sur l'ensemble du territoire national pour répondre à vos besoins en climatisation, ventilation et solutions solaires.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Toutes les villes */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#10748E] flex items-center justify-center mb-6">
              <MapPin size={32} />
            </div>
            <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-4">
              Toutes les villes
            </h3>
            <p className="font-montserrat text-gray-600 mb-6">
              Nos équipes mobiles interviennent dans toutes les grandes villes du Maroc pour des projets d'envergure et des installations spécifiques.
            </p>
            <ul className="space-y-3 font-montserrat text-sm text-gray-500 font-medium">
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#10748E]"/> Casablanca & Rabat</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#10748E]"/> Tanger & Tétouan</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#10748E]"/> Marrakech & Agadir</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#10748E]"/> Fès & Meknès</li>
            </ul>
          </div>

          {/* En région */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-green-50 text-[#00883C] flex items-center justify-center mb-6">
              <Map size={32} />
            </div>
            <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-4">
              Services en région
            </h3>
            <p className="font-montserrat text-gray-600 mb-6">
              Nous couvrons également les régions périphériques selon les spécificités de vos chantiers et nos accords de partenariat.
            </p>
            <ul className="space-y-3 font-montserrat text-sm text-gray-500 font-medium">
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#00883C]"/> Nord (Tanger-Tétouan-Al Hoceïma)</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#00883C]"/> Oriental (Oujda-Nador)</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#00883C]"/> Centre (Béni Mellal-Khénifra)</li>
              <li className="flex items-center gap-2"><ArrowRight size={14} className="text-[#00883C]"/> Sud (Laâyoune-Dakhla)</li>
            </ul>
          </div>

          {/* Pages Locales SEO */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-lg hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 rounded-full bg-red-50 text-[#AF1818] flex items-center justify-center mb-6">
              <Compass size={32} />
            </div>
            <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-4">
              Expertise Locale
            </h3>
            <p className="font-montserrat text-gray-600 mb-6">
              Des solutions adaptées au climat spécifique de chaque région pour une efficacité optimale de vos installations.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/expertises/climatisation-marrakech" className="px-4 py-2 bg-gray-50 hover:bg-[#AF1818] hover:text-white transition-colors border border-gray-100 rounded-full font-montserrat text-xs font-semibold text-gray-700">
                Climatisation Marrakech
              </Link>
              <Link href="/expertises/ventilation-casablanca" className="px-4 py-2 bg-gray-50 hover:bg-[#AF1818] hover:text-white transition-colors border border-gray-100 rounded-full font-montserrat text-xs font-semibold text-gray-700">
                Ventilation Casablanca
              </Link>
              <Link href="/expertises/solaire-agadir" className="px-4 py-2 bg-gray-50 hover:bg-[#AF1818] hover:text-white transition-colors border border-gray-100 rounded-full font-montserrat text-xs font-semibold text-gray-700">
                Solaire Agadir
              </Link>
              <Link href="/expertises/climatisation-tanger" className="px-4 py-2 bg-gray-50 hover:bg-[#AF1818] hover:text-white transition-colors border border-gray-100 rounded-full font-montserrat text-xs font-semibold text-gray-700">
                Climatisation Tanger
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
