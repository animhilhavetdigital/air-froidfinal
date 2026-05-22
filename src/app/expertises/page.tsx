"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Sun, Wrench, Lightbulb, 
  Home, Building2, Settings, 
  ChefHat, Wind, Sliders, 
  UtensilsCrossed, Hammer, 
  FileText, Headset, AlertTriangle 
} from "lucide-react";

const SERVICES = [
  {
    id: "solaire",
    number: "01",
    title: "Solaire",
    desc: "Solutions d'énergie renouvelable pour réduire votre empreinte carbone et vos factures énergétiques avec des installations fiables et durables.",
    image: "/images/assets/tom-rumble-N5q6uTHdtME-unsplash.jpg",
    subServices: [
      { name: "Installation solaire", icon: Sun },
      { name: "Maintenance solaire", icon: Wrench },
      { name: "Consulting solaire", icon: Lightbulb }
    ]
  },
  {
    id: "climatisation",
    number: "02",
    title: "Climatisation",
    desc: "Systèmes de refroidissement de pointe assurant un confort thermique optimal, conçus pour s'intégrer parfaitement à tous types d'espaces.",
    image: "/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg",
    subServices: [
      { name: "Climatisation résidentielle", icon: Home },
      { name: "Climatisation professionnelle", icon: Building2 },
      { name: "Maintenance climatisation", icon: Settings }
    ]
  },
  {
    id: "ventilation",
    number: "03",
    title: "Ventilation",
    desc: "Extraction et traitement de l'air pour garantir un environnement sain, sans humidité ni polluants, dans les espaces clos.",
    image: "/images/assets/adrien-olichon-3-GSjNOsO8Q-unsplash.jpg",
    subServices: [
      { name: "VMC cuisine professionnelle", icon: ChefHat },
      { name: "Ventilation générale", icon: Wind },
      { name: "Solutions spécialisées", icon: Sliders }
    ]
  },
  {
    id: "cuisine-pro",
    number: "04",
    title: "Cuisines Professionnelles",
    desc: "Agencement complet et équipements en froid industriel pour répondre aux normes exigeantes de la restauration et de l'hôtellerie de luxe.",
    image: "/images/assets/zulki-jrzt-Q4f_0gKTMEk-unsplash.jpg",
    subServices: [
      { name: "Équipements cuisine", icon: UtensilsCrossed },
      { name: "Installation", icon: Hammer },
      { name: "Maintenance", icon: Wrench }
    ]
  },
  {
    id: "services-associes",
    number: "05",
    title: "Services Associés",
    desc: "Un accompagnement sur le long terme avec des contrats de suivi et un support réactif pour pérenniser vos installations.",
    image: "/images/assets/dung-ph-m-42xVlUyp7jw-unsplash.jpg", // Using a fallback image we already have
    subServices: [
      { name: "Contrats de maintenance", icon: FileText },
      { name: "Support technique", icon: Headset },
      { name: "Interventions d'urgence", icon: AlertTriangle }
    ]
  }
];

export default function ServicesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Header animation
    gsap.fromTo(".page-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
    
    // Animate each section on scroll
    const sections = gsap.utils.toArray(".service-section") as HTMLElement[];
    sections.forEach((sec, i) => {
      gsap.fromTo(sec, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power2.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-24 overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24">
        
        {/* Header Section */}
        <div className="page-header text-center mb-24 max-w-3xl mx-auto">
          <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block">
            — NOS DOMAINES D'INTERVENTION —
          </span>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 tracking-wide uppercase mb-6">
            Services & <span className="text-[#00883C]">Solutions</span>
          </h1>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed">
            De la conception à l'installation et la maintenance, nous déployons une ingénierie de pointe pour répondre aux exigences des professionnels et des particuliers.
          </p>
        </div>

        {/* Sections */}
        <div className="flex flex-col gap-24 lg:gap-32">
          {SERVICES.map((service, idx) => (
            <div 
              key={service.id} 
              id={service.id}
              className="service-section flex flex-col lg:flex-row items-center gap-12 lg:gap-20 group scroll-mt-32"
            >
              
              {/* Image Container */}
              <div className={`w-full lg:w-1/2 ${idx % 2 !== 0 ? 'lg:order-2' : ''}`}>
                <div className="relative w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                  />
                  {/* Subtle overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Big Number floating on image */}
                  <div className={`absolute bottom-6 font-nevan text-6xl text-white opacity-80 ${idx % 2 !== 0 ? 'left-8' : 'right-8'}`}>
                    {service.number}
                  </div>
                </div>
              </div>

              {/* Text & Features Container */}
              <div className={`w-full lg:w-1/2 ${idx % 2 !== 0 ? 'lg:order-1' : ''}`}>
                <h2 className="font-nevan text-4xl lg:text-5xl text-gray-900 uppercase tracking-wide mb-6">
                  {service.title}
                </h2>
                <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-10">
                  {service.desc}
                </p>
                
                {/* Sub-services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {service.subServices.map((sub, i) => {
                    const Icon = sub.icon;
                    return (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white hover:shadow-md transition-all duration-300">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 text-[#AF1818]">
                          <Icon size={20} strokeWidth={1.5} />
                        </div>
                        <div className="pt-1">
                          <h4 className="font-montserrat font-bold text-gray-900 text-sm leading-snug">
                            {sub.name}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-12 w-16 h-1 bg-gradient-to-r from-[#00883C] to-[#AF1818]" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
