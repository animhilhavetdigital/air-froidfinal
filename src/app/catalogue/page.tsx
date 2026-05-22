"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { useGSAP, gsap } from "@/lib/gsap";

// Mock Data for the catalogue
const CATEGORIES = ["Tous", "Climatisation", "Ventilation", "Solaire", "Cuisine Pro", "Accessoires"];

const PRODUCTS = [
  {
    id: 1,
    title: "Climatiseur Split Inverter 12000 BTU",
    category: "Climatisation",
    description: "Ultra-silencieux, faible consommation énergétique.",
    price: "4 200",
    image: "/images/assets/Air Conditioner.H01.2k.png",
    badge: "Nouveau"
  },
  {
    id: 2,
    title: "Climatiseur Console 18000 BTU",
    category: "Climatisation",
    description: "Design compact, installation au sol ou mural.",
    price: "6 200",
    image: "/images/assets/Air Conditioner.H02.2k.png"
  },
  {
    id: 3,
    title: "VMC Double Flux Haut Rendement",
    category: "Ventilation",
    description: "Récupération de chaleur jusqu'à 95%.",
    price: "18 900",
    oldPrice: "21 500",
    image: "/images/services/ventilation-bg.jpg",
    badge: "Promo"
  },
  {
    id: 4,
    title: "Chauffe-Eau Solaire 300L",
    category: "Solaire",
    description: "Ballon d'eau sub-combiné avec capteurs solaires.",
    price: "12 500",
    image: "/images/services/solaire-bg.jpg"
  },
  {
    id: 5,
    title: "Panneau Photovoltaïque 550W",
    category: "Solaire",
    description: "Haut rendement, garantie 25 ans.",
    price: "2 850",
    image: "/images/services/solaire-bg.jpg"
  },
  {
    id: 6,
    title: "Hotte Professionnelle avec Filtration",
    category: "Cuisine Pro",
    description: "Extracteur puissant, filtres à charbon actif.",
    price: "15 800",
    image: "/images/services/cuisine-pro-bg.jpg"
  },
  {
    id: 7,
    title: "Filtre HEPA H14 (lot de 2)",
    category: "Accessoires",
    description: "Filtration à 99.995%, compatible VMC.",
    price: "450",
    image: "/images/services/ventilation-bg.jpg"
  },
  {
    id: 8,
    title: "Thermostat Intelligent WiFi",
    category: "Accessoires",
    description: "Contrôle à distance, programmation horaire.",
    price: "1 800",
    image: "/images/assets/Air Conditioner.H01.2k.png",
    badge: "Nouveau"
  },
  {
    id: 9,
    title: "Extracteur d'Air 150mm",
    category: "Ventilation",
    description: "Débit 350 m³/h, ultra-silencieux.",
    price: "1 200",
    image: "/images/services/ventilation-bg.jpg"
  }
];

export default function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const { addToCart } = useCart();
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProducts = PRODUCTS.filter((product) => 
    activeCategory === "Tous" ? true : product.category === activeCategory
  );

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".catalogue-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
    
    // Filters Animation
    gsap.fromTo(".filter-btn",
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.05, ease: "back.out(1.5)", delay: 0.4 }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    // Products Grid Animation on category change
    gsap.fromTo(".product-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", clearProps: "all" }
    );
  }, { scope: containerRef, dependencies: [activeCategory] });

  return (
    <div ref={containerRef} className="bg-white min-h-screen pt-32 pb-0 flex flex-col">
      {/* Container for main content */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mb-24">
        
        {/* Header Section */}
        <div className="catalogue-header text-center max-w-3xl mx-auto mb-16">
          <span className="font-nevan text-sm tracking-[0.2em] text-gray-400 uppercase mb-4 block">
            — CATALOGUE —
          </span>
          <h1 className="font-nevan text-5xl text-gray-900 uppercase tracking-wider mb-6">
            Nos produits
          </h1>
          <p className="font-montserrat text-gray-600 text-lg">
            Découvrez notre sélection de produits premium pour le confort thermique, la ventilation et l'énergie solaire.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`filter-btn px-6 py-2 rounded-full font-montserrat text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-[#1E293B] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-card group flex flex-col bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              
              {/* Image Container */}
              <div className="relative h-[300px] w-full bg-[#F4F7F9] overflow-hidden">
                {product.badge && (
                  <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-bold uppercase rounded-md text-white ${product.badge === 'Promo' ? 'bg-[#AF1818]' : 'bg-[#32A5DE]'}`}>
                    {product.badge}
                  </span>
                )}
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                <span className="font-nevan text-[10px] tracking-widest text-gray-400 uppercase mb-2">
                  {product.category}
                </span>
                <h3 className="font-montserrat font-semibold text-lg text-gray-900 mb-2 leading-tight">
                  {product.title}
                </h3>
                <p className="font-montserrat text-sm text-gray-500 mb-6 flex-grow">
                  {product.description}
                </p>

                {/* Price and Action */}
                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-montserrat font-bold text-xl text-gray-900">
                        {product.price} MAD
                      </span>
                      {product.oldPrice && (
                        <span className="font-montserrat text-xs text-gray-400 line-through">
                          {product.oldPrice} MAD
                        </span>
                      )}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      addToCart();
                      // Optional: Add a small visual feedback here like a toast if needed later
                    }}
                    className="w-10 h-10 bg-[#1E293B] text-white flex items-center justify-center rounded-md hover:bg-black transition-colors shadow-sm active:scale-95"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className="w-full bg-[#1A2634] py-24 relative overflow-hidden mt-auto">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/services/climatisation-bg.jpg"
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 relative z-10 text-center">
          <h2 className="font-nevan text-4xl md:text-5xl text-white uppercase tracking-wider mb-6">
            Besoin de conseils pour choisir ?
          </h2>
          <p className="font-montserrat text-gray-300 text-lg max-w-2xl mx-auto mb-10">
            Nos experts sont à votre disposition pour vous guider dans le choix de vos équipements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-[#32A5DE] text-white rounded-full font-nevan tracking-wider uppercase hover:bg-[#2886b5] transition-colors shadow-lg"
            >
              Demander un devis
            </Link>
            <Link 
              href="/contact"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-nevan tracking-wider uppercase hover:bg-gray-100 transition-colors shadow-lg"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
