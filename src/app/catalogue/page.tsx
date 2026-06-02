"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ArrowRight } from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";

const CATEGORIES = [
  "Tous", 
  "Produits solaires", 
  "Systèmes de climatisation", 
  "Équipements de ventilation", 
  "Équipements Services Associés", 
  "Filtres & accessoires"
];

import { PRODUCTS } from "@/lib/products";

export default function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "Tous" || product.category === activeCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".catalogue-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
    
    // Filters Animation
    gsap.fromTo(".filter-controls",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    // Products Grid Animation on category or search change
    if (filteredProducts.length > 0) {
      gsap.fromTo(".product-card",
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "all" }
      );
    }
  }, { scope: containerRef, dependencies: [activeCategory, searchQuery, filteredProducts.length] });

  return (
    <div ref={containerRef} className="bg-gray-50 min-h-screen pt-32 pb-0 flex flex-col">
      {/* Container for main content */}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mb-24">
        
        {/* Header Section */}
        <div className="catalogue-header text-center max-w-4xl mx-auto mb-16">
          <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block">
            — QUALITÉ PREMIUM —
          </span>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 uppercase tracking-wider mb-6">
            Catalogue & <span className="text-[#32A5DE]">Produits</span>
          </h1>
          <p className="font-montserrat text-gray-600 text-lg md:text-xl">
            Découvrez notre sélection rigoureuse d'équipements de pointe pour le confort thermique, la qualité de l'air et l'efficacité énergétique.
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="filter-controls bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-6 items-center justify-between sticky top-24 z-30">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#32A5DE] transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#32A5DE]/20 focus:border-[#32A5DE] transition-all font-montserrat text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Categories Filter */}
          <div className="w-full md:w-auto flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 mr-2 text-gray-400 hidden lg:flex">
              <Filter size={18} />
              <span className="font-nevan text-sm tracking-widest uppercase">Filtres</span>
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-montserrat text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#10748E] text-white shadow-md shadow-[#10748E]/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200 hover:border-gray-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product) => (
              <Link href={`/catalogue/${product.id}`} key={product.id} className="product-card group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500">
                
                {/* Image Container */}
                <div className="relative h-[280px] w-full bg-[#F8FAFC] overflow-hidden p-6 flex items-center justify-center">
                  {product.badge && (
                    <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-nevan tracking-widest uppercase rounded-lg text-white shadow-sm ${product.badge === 'Promo' ? 'bg-[#AF1818]' : 'bg-[#32A5DE]'}`}>
                      {product.badge}
                    </span>
                  )}
                  {/* Using a fallback gradient if image fails, and adding mix-blend-multiply for product shots */}
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      // Fallback for missing images
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow border-t border-gray-50">
                  <span className="font-nevan text-[11px] tracking-widest text-[#10748E] uppercase mb-3">
                    {product.category}
                  </span>
                  <h3 className="font-montserrat font-bold text-lg text-gray-900 mb-3 leading-snug group-hover:text-[#32A5DE] transition-colors">
                    {product.title}
                  </h3>
                  <p className="font-montserrat text-sm text-gray-500 mb-6 flex-grow leading-relaxed">
                    {product.description}
                  </p>

                  {/* Price */}
                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-nevan text-2xl text-gray-900 tracking-wide">
                          {product.price}
                        </span>
                        <span className="font-montserrat font-semibold text-xs text-gray-500 uppercase">MAD</span>
                      </div>
                      {product.oldPrice && (
                        <span className="font-montserrat text-xs text-gray-400 line-through">
                          {product.oldPrice} MAD
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <Search size={40} />
            </div>
            <h3 className="font-nevan text-3xl text-gray-900 uppercase tracking-wider mb-4">Aucun produit trouvé</h3>
            <p className="font-montserrat text-gray-500">Essayez de modifier vos critères de recherche ou de changer de catégorie.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("Tous");
              }}
              className="mt-8 px-6 py-3 bg-[#10748E] text-white rounded-full font-montserrat font-semibold hover:bg-[#0c5a6e] transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Bottom CTA Section */}
      <div className="w-full bg-[#10748E] py-24 relative overflow-hidden mt-auto">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#AF1818]/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="text-left max-w-2xl">
            <h2 className="font-nevan text-4xl md:text-5xl text-white uppercase tracking-wider mb-6">
              Besoin d'un accompagnement sur mesure ?
            </h2>
            <p className="font-montserrat text-white/80 text-lg">
              Nos experts sont à votre disposition pour vous guider dans le choix de vos équipements et réaliser une étude thermique personnalisée.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link 
              href="/contact"
              className="group w-full sm:w-auto px-8 py-4 bg-white text-gray-900 rounded-full font-nevan tracking-widest uppercase hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-3"
            >
              Demander un devis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
