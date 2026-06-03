"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search, Filter, ArrowRight, Home, Wind, Sun, SlidersHorizontal, Sparkles,
  ChevronRight, ChevronLeft, CheckCircle2, Thermometer, Droplets, Zap,
  CloudSun, BedDouble, Building2, Droplet, Users, Ruler, Banknote,
  Fan, Activity, Clock, Store, Briefcase
} from "lucide-react";
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

const GUIDE_STEPS = 6;

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
    const { besoin, critere, context1, context2, preference } = guideAnswers;
    if (!besoin) return [];

    // Climatisation
    if (besoin === "climatisation") {
      if (critere === "20-35") {
        if (preference === "sol") return PRODUCTS.filter((p) => p.id === 2);
        return PRODUCTS.filter((p) => p.id === 1);
      }
      if (critere === "35-55") return PRODUCTS.filter((p) => p.id === 2);
      if (critere === "55+") return PRODUCTS.filter((p) => p.id === 2);
      if (preference === "mural") return PRODUCTS.filter((p) => p.id === 1);
      if (preference === "sol") return PRODUCTS.filter((p) => p.id === 2);
    }
    // Ventilation
    if (besoin === "ventilation") {
      if (critere === "vmc") return PRODUCTS.filter((p) => p.id === 3);
      if (critere === "extracteur") return PRODUCTS.filter((p) => p.id === 9);
    }
    // Solaire
    if (besoin === "solaire") {
      if (critere === "eau-chaude") return PRODUCTS.filter((p) => p.id === 4);
      if (critere === "electricite") return PRODUCTS.filter((p) => p.id === 5);
    }
    // Filtres
    if (besoin === "filtres") {
      if (critere === "filtration") return PRODUCTS.filter((p) => p.id === 7);
      if (critere === "controle") return PRODUCTS.filter((p) => p.id === 8);
    }
    return [];
  }, [guideAnswers]);

  const guideConseil = useMemo(() => {
    const { besoin, critere, context1, context2, preference } = guideAnswers;
    const parts: string[] = [];

    if (besoin === "climatisation") {
      parts.push("Pour votre climatisation");
      if (critere === "20-35") parts.push("d'une surface de 20 à 35 m²");
      if (critere === "35-55") parts.push("d'une surface de 35 à 55 m²");
      if (critere === "55+") parts.push("d'une grande surface de plus de 55 m²");
      if (context1 === "oui") parts.push("avec forte exposition au soleil");
      if (context2 === "chambre") parts.push("dans une chambre nécessant un faible niveau sonore");
      if (context2 === "salon") parts.push("pour un salon");
      if (context2 === "bureau") parts.push("dans un bureau");
      if (context2 === "commerce") parts.push("dans un local commercial");
      if (preference === "mural") parts.push("avec installation murale classique");
      if (preference === "sol") parts.push("avec installation au sol ou en bas de mur");
    }
    if (besoin === "ventilation") {
      parts.push("Pour votre ventilation");
      if (critere === "vmc") parts.push("d'une VMC double flux");
      if (critere === "extracteur") parts.push("d'un extracteur d'air");
      if (context1 === "maison") parts.push("dans une maison");
      if (context1 === "appartement") parts.push("dans un appartement");
      if (context2 === "oui") parts.push("avec problème d'humidité");
    }
    if (besoin === "solaire") {
      parts.push("Pour votre projet solaire");
      if (critere === "eau-chaude") parts.push("d'eau chaude sanitaire");
      if (critere === "electricite") parts.push("de production d'électricité");
      if (context1 === "2-3") parts.push("pour 2 à 3 personnes");
      if (context1 === "4-5") parts.push("pour 4 à 5 personnes");
      if (context1 === "6+") parts.push("pour plus de 6 personnes");
      if (context2 === "<10") parts.push("avec peu d'espace de toiture");
      if (context2 === "10-20") parts.push("avec une toiture de taille moyenne");
      if (context2 === ">20") parts.push("avec une grande surface de toiture");
      if (preference === "economies") parts.push("en priorisant les économies");
      if (preference === "autonomie") parts.push("en visant l'autonomie énergétique");
      if (preference === "ecologie") parts.push("avec une approche écologique");
    }
    if (besoin === "filtres") {
      parts.push("Pour vos filtres et accessoires");
      if (critere === "filtration") parts.push("de filtration d'air");
      if (critere === "controle") parts.push("de contrôle intelligent");
      if (context1 === "vmc") parts.push("pour une VMC");
      if (context1 === "clim") parts.push("pour une climatisation");
      if (context1 === "les-deux") parts.push("pour les deux installations");
      if (context2 === "oui") parts.push("avec nécessité de filtration allergène");
      if (preference === "quotidien") parts.push("pour une utilisation quotidienne");
      if (preference === "occasionnel") parts.push("pour une utilisation occasionnelle");
    }

    return parts.join(", ") + ", voici notre recommandation :";
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

  const updateAnswer = (field: string, value: string) => {
    setGuideAnswers((prev) => ({ ...prev, [field]: value }));
  };

  // Step definitions
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
          { id: "55+", label: "Plus de 55 m²", icon: Thermometer, desc: "Surface très grande, open space" },
        ];
      case "ventilation":
        return [
          { id: "vmc", label: "VMC Double Flux", icon: Wind, desc: "Ventilation complète de la maison avec récupération de chaleur" },
          { id: "extracteur", label: "Extracteur d'air", icon: Fan, desc: "Ventilation ponctuelle d'une pièce humide" },
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
    switch (guideAnswers.besoin) {
      case "climatisation":
        return [
          { id: "oui", label: "Oui, très ensoleillée", icon: CloudSun, desc: "Grande baie vitrée, dernier étage, plein sud" },
          { id: "non", label: "Non, exposition normale", icon: Home, desc: "Pièce standard, exposition moyenne" },
        ];
      case "ventilation":
        return [
          { id: "maison", label: "Maison", icon: Home, desc: "Maison individuelle, villa, riad" },
          { id: "appartement", label: "Appartement", icon: Building2, desc: "Appartement en résidence ou immeuble" },
        ];
      case "solaire":
        return [
          { id: "2-3", label: "2 à 3 personnes", icon: Users, desc: "Couple ou petite famille" },
          { id: "4-5", label: "4 à 5 personnes", icon: Users, desc: "Famille moyenne" },
          { id: "6+", label: "6 personnes et plus", icon: Users, desc: "Grande famille ou collectif" },
        ];
      case "filtres":
        return [
          { id: "vmc", label: "VMC", icon: Wind, desc: "Pour une installation de ventilation" },
          { id: "clim", label: "Climatisation", icon: Home, desc: "Pour une unité de climatisation" },
          { id: "les-deux", label: "Les deux", icon: SlidersHorizontal, desc: "Pour VMC et climatisation" },
        ];
      default:
        return [];
    }
  };

  const getStep4Options = () => {
    switch (guideAnswers.besoin) {
      case "climatisation":
        return [
          { id: "chambre", label: "Chambre", icon: BedDouble, desc: "Silence et confort nocturne prioritaires" },
          { id: "salon", label: "Salon", icon: Home, desc: "Pièce de vie principale" },
          { id: "bureau", label: "Bureau", icon: Briefcase, desc: "Espace professionnel ou télétravail" },
          { id: "commerce", label: "Commerce / Local", icon: Store, desc: "Local commercial, boutique, restaurant" },
        ];
      case "ventilation":
        return [
          { id: "oui", label: "Oui, problème d'humidité", icon: Droplet, desc: "Moisissures, condensation, pièces humides" },
          { id: "non", label: "Non, prévention seule", icon: CheckCircle2, desc: "Renouvellement d'air et qualité de l'air" },
        ];
      case "solaire":
        return [
          { id: "<10", label: "Moins de 10 m²", icon: Ruler, desc: "Petite toiture ou peu d'espace" },
          { id: "10-20", label: "10 à 20 m²", icon: Ruler, desc: "Toiture moyenne, idéale pour quelques panneaux" },
          { id: ">20", label: "Plus de 20 m²", icon: Ruler, desc: "Grande toiture, potentiel solaire important" },
        ];
      case "filtres":
        return [
          { id: "oui", label: "Oui, allergies / asthme", icon: Activity, desc: "Nécessité d'une filtration renforcée HEPA" },
          { id: "non", label: "Non, usage standard", icon: CheckCircle2, desc: "Filtration classique suffisante" },
        ];
      default:
        return [];
    }
  };

  const getStep5Options = () => {
    switch (guideAnswers.besoin) {
      case "climatisation":
        return [
          { id: "mural", label: "Mural (hauteur)", icon: Home, desc: "Installation classique en hauteur sur le mur" },
          { id: "sol", label: "Sol / Plafond bas", icon: Building2, desc: "Console au sol ou en bas de mur" },
        ];
      case "ventilation":
        return [
          { id: "<100", label: "Moins de 100 m²", icon: Ruler, desc: "Petite surface habitable" },
          { id: "100-200", label: "100 à 200 m²", icon: Ruler, desc: "Maison ou appartement moyen" },
          { id: ">200", label: "Plus de 200 m²", icon: Ruler, desc: "Grande maison ou plusieurs niveaux" },
        ];
      case "solaire":
        return [
          { id: "economies", label: "Réduire ma facture", icon: Banknote, desc: "Objectif : économies d'énergie rapides" },
          { id: "autonomie", label: "Autonomie énergétique", icon: Zap, desc: "Objectif : dépendre le moins possible du réseau" },
          { id: "ecologie", label: "Approche écologique", icon: Sun, desc: "Objectif : réduire mon empreinte carbone" },
        ];
      case "filtres":
        return [
          { id: "quotidien", label: "Quotidienne", icon: Clock, desc: "Fonctionnement permanent ou très régulier" },
          { id: "occasionnel", label: "Occasionnelle", icon: Clock, desc: "Fonctionnement saisonnier ou ponctuel" },
        ];
      default:
        return [];
    }
  };

  const isStepValid = () => {
    if (guideStep === 1) return !!guideAnswers.besoin;
    if (guideStep === 2) return !!guideAnswers.critere;
    if (guideStep === 3) return !!guideAnswers.context1;
    if (guideStep === 4) return !!guideAnswers.context2;
    if (guideStep === 5) return !!guideAnswers.preference;
    return true;
  };

  return (
    <div ref={containerRef} className="bg-gray-50 min-h-screen pb-0 flex flex-col">
      {/* GUIDE INTERACTIF : HERO SPLIT */}
      {!showGuide ? (
        <div className="w-full bg-[#0c5a6e] relative overflow-hidden">
          <div className="w-full max-w-[1920px] mx-auto flex flex-col lg:flex-row items-stretch min-h-[340px] lg:min-h-[420px]">
            {/* Image gauche */}
            <div className="hidden lg:block lg:w-[30%] relative">
              <Image src="/images/assets/expertises-climatisation.jpg" alt="Climatisation" fill className="object-cover" sizes="30vw" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0c5a6e]/40 to-[#0c5a6e]" />
            </div>

            {/* Contenu centre */}
            <div className="w-full lg:w-[40%] flex flex-col items-center justify-center text-center px-6 pt-24 pb-10 lg:pt-24 lg:pb-0 relative z-10">
              <span className="font-nevan text-white/70 text-sm tracking-[0.2em] uppercase mb-4">
                — Besoin d'aide ? —
              </span>
              <h2 className="font-nevan text-white text-3xl md:text-4xl uppercase tracking-wider mb-4 leading-tight">
                Trouvez le produit <span className="text-[#32A5DE]">idéal</span>
              </h2>
              <p className="font-montserrat text-white/80 text-base md:text-lg mb-8 max-w-md leading-relaxed">
                Notre guide intelligent trouve l'équipement parfait pour votre besoin en quelques clics.
              </p>
              <button
                onClick={() => setShowGuide(true)}
                className="inline-flex items-center gap-3 bg-white text-[#10748E] px-8 py-3.5 rounded-full font-nevan text-sm tracking-widest uppercase hover:bg-gray-100 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5"
              >
                Lancer le guide
                <ArrowRight size={18} />
              </button>
            </div>

            {/* Image droite */}
            <div className="hidden lg:block lg:w-[30%] relative">
              <Image src="/images/assets/expertises-solaire.jpg" alt="Énergie solaire" fill className="object-cover" sizes="30vw" />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0c5a6e]/40 to-[#0c5a6e]" />
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full bg-white pt-24 pb-12 border-b border-gray-100">
          <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
            {/* Header guide */}
            <div className="text-center mb-8">
              <h2 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wider mb-2">
                Trouvez le produit <span className="text-[#32A5DE]">idéal</span>
              </h2>
              <p className="font-montserrat text-gray-500">
                Étape {guideStep} sur {GUIDE_STEPS}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8 relative">
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
                {/* STEP 1 */}
                {guideStep === 1 && (
                  <GuideStep title="1. Quel est votre besoin principal ?">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {besoinOptions.map((opt) => (
                        <GuideOptionCard
                          key={opt.id}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                          selected={guideAnswers.besoin === opt.id}
                          onClick={() => updateAnswer("besoin", opt.id)}
                        />
                      ))}
                    </div>
                  </GuideStep>
                )}

                {/* STEP 2 */}
                {guideStep === 2 && (
                  <GuideStep title={`2. ${getStep2Title(guideAnswers.besoin)}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getStep2Options().map((opt) => (
                        <GuideOptionCard
                          key={opt.id}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                          selected={guideAnswers.critere === opt.id}
                          onClick={() => updateAnswer("critere", opt.id)}
                        />
                      ))}
                    </div>
                  </GuideStep>
                )}

                {/* STEP 3 */}
                {guideStep === 3 && (
                  <GuideStep title={`3. ${getStep3Title(guideAnswers.besoin)}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getStep3Options().map((opt) => (
                        <GuideOptionCard
                          key={opt.id}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                          selected={guideAnswers.context1 === opt.id}
                          onClick={() => updateAnswer("context1", opt.id)}
                        />
                      ))}
                    </div>
                  </GuideStep>
                )}

                {/* STEP 4 */}
                {guideStep === 4 && (
                  <GuideStep title={`4. ${getStep4Title(guideAnswers.besoin)}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getStep4Options().map((opt) => (
                        <GuideOptionCard
                          key={opt.id}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                          selected={guideAnswers.context2 === opt.id}
                          onClick={() => updateAnswer("context2", opt.id)}
                        />
                      ))}
                    </div>
                  </GuideStep>
                )}

                {/* STEP 5 */}
                {guideStep === 5 && (
                  <GuideStep title={`5. ${getStep5Title(guideAnswers.besoin)}`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {getStep5Options().map((opt) => (
                        <GuideOptionCard
                          key={opt.id}
                          icon={opt.icon}
                          label={opt.label}
                          desc={opt.desc}
                          selected={guideAnswers.preference === opt.id}
                          onClick={() => updateAnswer("preference", opt.id)}
                        />
                      ))}
                    </div>
                  </GuideStep>
                )}

                {/* STEP 6 : RÉSULTAT */}
                {guideStep === 6 && (
                  <div className="text-center py-4">
                    <CheckCircle2 size={56} className="text-green-500 mx-auto mb-5" />
                    <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-3">
                      Notre recommandation
                    </h3>
                    <p className="font-montserrat text-gray-600 mb-8 max-w-xl mx-auto leading-relaxed">
                      {guideConseil}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      {guideRecommendations.length > 0 ? (
                        guideRecommendations.map((product) => (
                          <ProductResultCard key={product.id} product={product} />
                        ))
                      ) : (
                        <div className="col-span-full text-gray-500 font-montserrat">
                          Aucune recommandation exacte. Consultez notre catalogue complet ou contactez-nous.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100">
                <button
                  onClick={guideStep === 1 ? () => setShowGuide(false) : handleGuidePrev}
                  className="flex items-center gap-2 font-nevan text-sm tracking-wide uppercase px-6 py-3 rounded-full text-gray-500 hover:bg-gray-100 transition-all"
                >
                  <ChevronLeft size={18} /> {guideStep === 1 ? "Fermer" : "Précédent"}
                </button>

                {guideStep < GUIDE_STEPS ? (
                  <button
                    onClick={handleGuideNext}
                    disabled={!isStepValid()}
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
            </div>
          </div>
        </div>
      )}
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mt-24 mb-24">
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
        <div className="filter-controls bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row gap-4 md:gap-6 items-center justify-between sticky top-24 z-30">
          <div className="relative w-full md:w-64 lg:w-80 shrink-0 group">
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
          <div className="w-full md:w-auto flex flex-wrap md:flex-nowrap items-center gap-2 md:overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-2 mr-2 text-gray-400 hidden xl:flex shrink-0">
              <Filter size={18} />
              <span className="font-nevan text-sm tracking-widest uppercase">Filtres</span>
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 whitespace-nowrap px-4 py-2 md:px-3 md:py-2 lg:px-4 lg:py-2.5 rounded-xl font-montserrat text-sm font-semibold transition-all duration-300 ${
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

/* ———————————————————————————————————————————— */
/* Helper Components                              */
/* ———————————————————————————————————————————— */

function GuideStep({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
}

function GuideOptionCard({
  icon: Icon,
  label,
  desc,
  selected,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-4 p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
        selected
          ? "border-[#AF1818] bg-[#AF1818]/5 ring-4 ring-[#AF1818]/10"
          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
      }`}
    >
      <div className={`p-3 rounded-full shrink-0 ${selected ? "bg-[#AF1818] text-white" : "bg-gray-100 text-gray-500"}`}>
        <Icon size={24} />
      </div>
      <div>
        <span className={`font-montserrat font-bold text-lg block ${selected ? "text-[#AF1818]" : "text-gray-700"}`}>
          {label}
        </span>
        <span className="font-montserrat text-sm text-gray-500">{desc}</span>
      </div>
    </button>
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

/* ———————————————————————————————————————————— */
/* Step Title Helpers                           */
/* ———————————————————————————————————————————— */

function getStep2Title(besoin?: string) {
  switch (besoin) {
    case "climatisation": return "Quelle surface souhaitez-vous climatiser ?";
    case "ventilation": return "Quel type de ventilation recherchez-vous ?";
    case "solaire": return "Quel type d'installation solaire ?";
    case "filtres": return "Quel est votre besoin précis ?";
    default: return "Précisez votre besoin";
  }
}

function getStep3Title(besoin?: string) {
  switch (besoin) {
    case "climatisation": return "La pièce est-elle très ensoleillée ou au dernier étage ?";
    case "ventilation": return "Dans quel type de bâtiment ?";
    case "solaire": return "Combien de personnes dans le foyer ?";
    case "filtres": return "Pour quelle installation ?";
    default: return "Précisez le contexte";
  }
}

function getStep4Title(besoin?: string) {
  switch (besoin) {
    case "climatisation": return "Quel est le type de pièce ?";
    case "ventilation": return "Avez-vous un problème d'humidité ?";
    case "solaire": return "Quelle surface de toiture disposez-vous ?";
    case "filtres": return "Allergies ou sensibilité respiratoire ?";
    default: return "Précisez le contexte";
  }
}

function getStep5Title(besoin?: string) {
  switch (besoin) {
    case "climatisation": return "Quel type d'installation préférez-vous ?";
    case "ventilation": return "Quelle surface habitable à ventiler ?";
    case "solaire": return "Quel est votre objectif principal ?";
    case "filtres": return "Fréquence d'utilisation ?";
    default: return "Précisez votre préférence";
  }
}
