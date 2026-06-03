"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Filter, ArrowRight, Home, Wind, Sun, SlidersHorizontal, ChevronRight, ChevronLeft, CheckCircle2, Thermometer, Droplets, Zap } from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";
import { PRODUCTS, Product } from "@/lib/products";

const CATEGORIES = [
  "Tous",
  "Produits solaires",
  "Systèmes de climatisation",
  "Équipements de ventilation",
  "Équipements Services Associés",
  "Filtres & accessoires"
];

const GUIDE_STEPS = 3;

export default function CataloguePage() {
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Guide state
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(1);
  const [guideAnswers, setGuideAnswers] = useState<Record<string, string>>({});

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "Tous" || product.category === activeCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const guideRecommendations = useMemo(() => {
    const { besoin, critere, install } = guideAnswers;
    if (!besoin) return [];

    if (besoin === "climatisation") {
      if (critere === "20-35") return PRODUCTS.filter((p) => p.id === 1);
      if (critere === "35-55") return PRODUCTS.filter((p) => p.id === 2);
      if (critere === "55+") return PRODUCTS.filter((p) => p.id === 2);
      if (install === "mural") return PRODUCTS.filter((p) => p.id === 1);
      if (install === "sol") return PRODUCTS.filter((p) => p.id === 2);
    }
    if (besoin === "ventilation") {
      if (critere === "vmc") return PRODUCTS.filter((p) => p.id === 3);
      if (critere === "extracteur") return PRODUCTS.filter((p) => p.id === 9);
    }
    if (besoin === "solaire") {
      if (critere === "eau-chaude") return PRODUCTS.filter((p) => p.id === 4);
      if (critere === "electricite") return PRODUCTS.filter((p) => p.id === 5);
    }
    if (besoin === "filtres") {
      if (critere === "filtration") return PRODUCTS.filter((p) => p.id === 7);
      if (critere === "controle") return PRODUCTS.filter((p) => p.id === 8);
    }
    return [];
  }, [guideAnswers]);

  useGSAP(() => {
    gsap.fromTo(".catalogue-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
    gsap.fromTo(".filter-controls",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.4 }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    if (filteredProducts.length > 0) {
      gsap.fromTo(".product-card",
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.05, ease: "power2.out", clearProps: "all" }
      );
    }
  }, { scope: containerRef, dependencies: [activeCategory, searchQuery, filteredProducts.length] });

  const handleGuideNext = () => {
    if (guideStep < GUIDE_STEPS) {
      setGuideStep(guideStep + 1);
      gsap.fromTo(".guide-step-content",
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  };

  const handleGuidePrev = () => {
    if (guideStep > 1) {
      setGuideStep(guideStep - 1);
      gsap.fromTo(".guide-step-content",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }
      );
    }
  };

  const resetGuide = () => {
    setGuideStep(1);
    setGuideAnswers({});
  };

  const besoinOptions = [
    { id: "climatisation", label: "Climatisation", icon: Home, desc: "Rafraîchir ou chauffer un espace" },
    { id: "ventilation", label: "Ventilation", icon: Wind, desc: "Renouveler l'air intérieur" },
    { id: "solaire", label: "Produits Solaires", icon: Sun, desc: "Énergie solaire thermique ou photovoltaïque" },
    { id: "filtres", label: "Filtres & Accessoires", icon: SlidersHorizontal, desc: "Filtration et contrôle de la climatisation" },
  ];

  const getStep2Options = () => {
    switch (guideAnswers.besoin) {
      case "climatisation":
        return [
          { id: "20-35", label: "20 – 35 m²", icon: Thermometer, desc: "Chambre, salon moyen, bureau" },
          { id: "35-55", label: "35 – 55 m²", icon: Thermometer, desc: "Grand salon, salle ouverte" },
          { id: "55+", label: "Plus de 55 m²", icon: Thermometer, desc: "Surface très grande" },
        ];
      case "ventilation":
        return [
          { id: "vmc", label: "VMC Double Flux", icon: Wind, desc: "Ventilation complète de la maison" },
          { id: "extracteur", label: "Extracteur d'air", icon: Wind, desc: "Ventilation d'une pièce humide" },
        ];
      case "solaire":
        return [
          { id: "eau-chaude", label: "Eau Chaude Sanitaire", icon: Droplets, desc: "Chauffe-eau solaire pour la maison" },
          { id: "electricite", label: "Électricité", icon: Zap, desc: "Panneaux photovoltaïques pour produire du courant" },
        ];
      case "filtres":
        return [
          { id: "filtration", label: "Filtration d'air", icon: SlidersHorizontal, desc: "Filtres HEPA pour VMC ou climatiseur" },
          { id: "controle", label: "Contrôle intelligent", icon: Thermometer, desc: "Thermostat WiFi pour piloter la température" },
        ];
      default:
        return [];
    }
  };

  const getStep3Options = () => {
    if (guideAnswers.besoin === "climatisation") {
      return [
        { id: "mural", label: "Mural (hauteur)", icon: Home, desc: "Installation classique en hauteur" },
        { id: "sol", label: "Sol / Plafond bas", icon: Home, desc: "Console au sol ou en bas de mur" },
      ];
    }
    return [];
  };

  return (
    <div ref={containerRef} className="bg-gray-50 min-h-screen pt-32 pb-0 flex flex-col">
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
                <div className="relative h-[280px] w-full bg-[#F8FAFC] overflow-hidden p-6 flex items-center justify-center">
                  {product.badge && (
                    <span className={`absolute top-4 left-4 z-10 px-3 py-1 text-xs font-nevan tracking-widest uppercase rounded-lg text-white shadow-sm ${product.badge === 'Promo' ? 'bg-[#AF1818]' : 'bg-[#32A5DE]'}`}>
                      {product.badge}
                    </span>
                  )}
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-gray-100', 'to-gray-200');
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>
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

      {/* ——————————————————————————————— */}
      {/* GUIDE INTERACTIF : Trouvez le produit idéal */}
      {/* ——————————————————————————————— */}
      <div className="w-full bg-white py-24 border-y border-gray-100">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
          {!showGuide ? (
            <div className="text-center">
              <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block">
                — BESOIN D'AIDE ? —
              </span>
              <h2 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wider mb-6">
                Trouvez le produit <span className="text-[#32A5DE]">idéal</span>
              </h2>
              <p className="font-montserrat text-gray-500 text-lg mb-10 max-w-2xl mx-auto">
                Répondez à quelques questions simples, nous vous recommanderons l'équipement le mieux adapté à votre besoin.
              </p>
              <button
                onClick={() => setShowGuide(true)}
                className="inline-flex items-center gap-3 bg-[#10748E] text-white px-8 py-4 rounded-full font-nevan text-lg tracking-widest uppercase hover:bg-[#0c5a6e] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Lancer le guide
                <ArrowRight size={20} />
              </button>
            </div>
          ) : (
            <div>
              {/* Header guide */}
              <div className="text-center mb-10">
                <h2 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wider mb-2">
                  Trouvez le produit <span className="text-[#32A5DE]">idéal</span>
                </h2>
                <p className="font-montserrat text-gray-500">
                  Étape {guideStep} sur {GUIDE_STEPS}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="mb-10 relative">
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 rounded-full z-0" />
                <div
                  className="absolute top-1/2 left-0 h-1 bg-[#AF1818] -translate-y-1/2 rounded-full z-0 transition-all duration-500"
                  style={{ width: `${((guideStep - 1) / (GUIDE_STEPS - 1)) * 100}%` }}
                />
                <div className="relative z-10 flex justify-between">
                  {Array.from({ length: GUIDE_STEPS }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-nevan text-sm border-2 transition-all duration-500 ${
                        guideStep >= i + 1
                          ? "bg-[#AF1818] border-[#AF1818] text-white shadow-lg"
                          : "bg-white border-gray-200 text-gray-400"
                      }`}
                    >
                      {guideStep > i + 1 ? <CheckCircle2 size={18} /> : i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Guide Content */}
              <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
                <div className="guide-step-content">
                  {/* STEP 1 : Besoin principal */}
                  {guideStep === 1 && (
                    <div className="space-y-6">
                      <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide">
                        1. Quel est votre besoin principal ?
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {besoinOptions.map((opt) => {
                          const Icon = opt.icon;
                          const isSelected = guideAnswers.besoin === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setGuideAnswers({ ...guideAnswers, besoin: opt.id })}
                              className={`flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? "border-[#AF1818] bg-[#AF1818]/5 ring-4 ring-[#AF1818]/10"
                                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className={`p-3 rounded-full ${isSelected ? "bg-[#AF1818] text-white" : "bg-gray-100 text-gray-500"}`}>
                                <Icon size={24} />
                              </div>
                              <div>
                                <span className={`font-montserrat font-bold text-lg block ${isSelected ? "text-[#AF1818]" : "text-gray-700"}`}>
                                  {opt.label}
                                </span>
                                <span className="font-montserrat text-sm text-gray-500">{opt.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 2 : Critère spécifique */}
                  {guideStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide">
                        2. Précisez votre besoin
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {getStep2Options().map((opt) => {
                          const Icon = opt.icon;
                          const isSelected = guideAnswers.critere === opt.id;
                          return (
                            <button
                              key={opt.id}
                              onClick={() => setGuideAnswers({ ...guideAnswers, critere: opt.id })}
                              className={`flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                                isSelected
                                  ? "border-[#AF1818] bg-[#AF1818]/5 ring-4 ring-[#AF1818]/10"
                                  : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                              }`}
                            >
                              <div className={`p-3 rounded-full ${isSelected ? "bg-[#AF1818] text-white" : "bg-gray-100 text-gray-500"}`}>
                                <Icon size={24} />
                              </div>
                              <div>
                                <span className={`font-montserrat font-bold text-lg block ${isSelected ? "text-[#AF1818]" : "text-gray-700"}`}>
                                  {opt.label}
                                </span>
                                <span className="font-montserrat text-sm text-gray-500">{opt.desc}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* STEP 3 : Type d'installation (clim) ou résultat direct */}
                  {guideStep === 3 && (
                    <div className="space-y-6">
                      {guideAnswers.besoin === "climatisation" ? (
                        <>
                          <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide">
                            3. Type d'installation préférée ?
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {getStep3Options().map((opt) => {
                              const Icon = opt.icon;
                              const isSelected = guideAnswers.install === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => setGuideAnswers({ ...guideAnswers, install: opt.id })}
                                  className={`flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
                                    isSelected
                                      ? "border-[#AF1818] bg-[#AF1818]/5 ring-4 ring-[#AF1818]/10"
                                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                                  }`}
                                >
                                  <div className={`p-3 rounded-full ${isSelected ? "bg-[#AF1818] text-white" : "bg-gray-100 text-gray-500"}`}>
                                    <Icon size={24} />
                                  </div>
                                  <div>
                                    <span className={`font-montserrat font-bold text-lg block ${isSelected ? "text-[#AF1818]" : "text-gray-700"}`}>
                                      {opt.label}
                                    </span>
                                    <span className="font-montserrat text-sm text-gray-500">{opt.desc}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                          <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-2">
                            Voici notre recommandation
                          </h3>
                          <p className="font-montserrat text-gray-500 mb-8">
                            Basé sur vos réponses, voici le produit le mieux adapté à votre besoin.
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                            {guideRecommendations.map((product) => (
                              <ProductResultCard key={product.id} product={product} />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-100">
                  <button
                    onClick={guideStep === 1 ? () => setShowGuide(false) : handleGuidePrev}
                    className="flex items-center gap-2 font-nevan text-sm tracking-wide uppercase px-6 py-3 rounded-full text-gray-500 hover:bg-gray-100 transition-all"
                  >
                    <ChevronLeft size={18} /> {guideStep === 1 ? "Fermer" : "Précédent"}
                  </button>

                  {guideStep < GUIDE_STEPS ? (
                    <button
                      onClick={handleGuideNext}
                      disabled={
                        (guideStep === 1 && !guideAnswers.besoin) ||
                        (guideStep === 2 && !guideAnswers.critere) ||
                        (guideStep === 3 && guideAnswers.besoin === "climatisation" && !guideAnswers.install)
                      }
                      className="flex items-center gap-2 bg-[#10748E] text-white font-nevan text-sm tracking-wide uppercase px-8 py-3 rounded-full hover:bg-[#0c5a6e] transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Suivant <ChevronRight size={18} />
                    </button>
                  ) : (
                    <button
                      onClick={resetGuide}
                      className="flex items-center gap-2 bg-gray-900 text-white font-nevan text-sm tracking-wide uppercase px-8 py-3 rounded-full hover:bg-black transition-colors shadow-xl"
                    >
                      Recommencer
                    </button>
                  )}
                </div>

                {/* Résultat final pour climatisation (étape 3 + install sélectionné) */}
                {guideStep === 3 && guideAnswers.besoin === "climatisation" && guideAnswers.install && (
                  <div className="mt-10 pt-10 border-t border-gray-100">
                    <div className="text-center mb-8">
                      <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
                      <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-2">
                        Voici notre recommandation
                      </h3>
                      <p className="font-montserrat text-gray-500">
                        Basé sur vos réponses, voici le produit le mieux adapté à votre besoin.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      {guideRecommendations.map((product) => (
                        <ProductResultCard key={product.id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
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

function ProductResultCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/catalogue/${product.id}`}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 flex flex-col"
    >
      <div className="relative h-[200px] w-full bg-[#F8FAFC] overflow-hidden p-4 flex items-center justify-center">
        {product.badge && (
          <span className={`absolute top-3 left-3 z-10 px-3 py-1 text-xs font-nevan tracking-widest uppercase rounded-lg text-white shadow-sm ${product.badge === 'Promo' ? 'bg-[#AF1818]' : 'bg-[#32A5DE]'}`}>
            {product.badge}
          </span>
        )}
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <span className="font-nevan text-[11px] tracking-widest text-[#10748E] uppercase mb-2">
          {product.category}
        </span>
        <h4 className="font-montserrat font-bold text-base text-gray-900 mb-2 leading-snug group-hover:text-[#32A5DE] transition-colors">
          {product.title}
        </h4>
        <p className="font-montserrat text-sm text-gray-500 mb-4 flex-grow line-clamp-2">
          {product.description}
        </p>
        <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
          <div>
            <span className="font-nevan text-xl text-gray-900 tracking-wide">{product.price}</span>
            <span className="font-montserrat font-semibold text-xs text-gray-500 uppercase ml-1">MAD</span>
          </div>
          <span className="text-[#10748E] font-montserrat text-sm font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
            Voir <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
