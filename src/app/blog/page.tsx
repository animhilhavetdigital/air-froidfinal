"use client";

import { useRef, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP, gsap } from "@/lib/gsap";
import { ArrowRight, ChevronDown, Calendar, User, Search, Filter } from "lucide-react";

// Categories mapping to the requested structure
const CATEGORIES = [
  "Tous",
  "Climatisation",
  "Ventilation",
  "Solaire",
  "Conseils d'installation",
  "Guides de maintenance",
  "Actualités"
];

// Mock Data for Articles
const ARTICLES = [
  {
    id: 1,
    title: "Comment bien choisir sa climatisation pour une villa ?",
    excerpt: "Découvrez nos conseils d'experts pour dimensionner et choisir le système de climatisation idéal pour les grands espaces résidentiels au Maroc.",
    category: "Climatisation",
    date: "12 Mai 2026",
    author: "Équipe Technique",
    image: "/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg",
    readTime: "5 min"
  },
  {
    id: 2,
    title: "L'importance de la VMC dans les cuisines professionnelles",
    excerpt: "Normes d'hygiène, extraction des graisses et confort du personnel : pourquoi une bonne ventilation est cruciale pour votre restaurant.",
    category: "Ventilation",
    date: "28 Avril 2026",
    author: "Sarah Bennani",
    image: "/images/assets/zulki-jrzt-Q4f_0gKTMEk-unsplash.jpg",
    readTime: "7 min"
  },
  {
    id: 3,
    title: "Guide complet : L'énergie solaire photovoltaïque en 2026",
    excerpt: "Tout ce que vous devez savoir avant de passer à l'énergie solaire : rentabilité, installation et subventions disponibles.",
    category: "Solaire",
    date: "15 Avril 2026",
    author: "Karim Tazi",
    image: "/images/assets/tom-rumble-N5q6uTHdtME-unsplash.jpg",
    readTime: "10 min"
  },
  {
    id: 4,
    title: "5 conseils pour entretenir votre pompe à chaleur avant l'hiver",
    excerpt: "Prolongez la durée de vie de votre équipement et optimisez ses performances avec ces gestes simples de maintenance préventive.",
    category: "Guides de maintenance",
    date: "02 Avril 2026",
    author: "Service SAV",
    image: "/images/assets/dung-ph-m-42xVlUyp7jw-unsplash.jpg",
    readTime: "4 min"
  },
  {
    id: 5,
    title: "Air Froid Expert ouvre un nouveau showroom à Tanger",
    excerpt: "Retrouvez-nous désormais dans la région nord ! Découvrez nos installations en conditions réelles dans notre nouvel espace dédié.",
    category: "Actualités",
    date: "20 Mars 2026",
    author: "Direction",
    image: "/images/assets/adrien-olichon-3-GSjNOsO8Q-unsplash.jpg",
    readTime: "2 min"
  },
  {
    id: 6,
    title: "Les étapes clés d'une installation thermique réussie",
    excerpt: "De l'étude de faisabilité à la mise en service, découvrez notre processus d'installation rigoureux pour garantir votre confort.",
    category: "Conseils d'installation",
    date: "10 Mars 2026",
    author: "Équipe Projet",
    image: "/images/assets/illia-horokhovsky-SJnak9YYFWU-unsplash.jpg",
    readTime: "6 min"
  }
];

// FAQ Data
const FAQS = [
  {
    question: "Quelle est la durée de garantie de vos installations ?",
    answer: "Nous offrons une garantie décennale (10 ans) sur la plupart de nos installations majeures. Les équipements (climatisations, panneaux) bénéficient de la garantie constructeur qui varie généralement entre 2 et 5 ans."
  },
  {
    question: "Proposez-vous des contrats de maintenance annuels ?",
    answer: "Absolument. Nous proposons des contrats d'entretien préventif sur-mesure pour les particuliers et les professionnels, garantissant des visites régulières et un dépannage prioritaire."
  },
  {
    question: "Combien de temps faut-il pour installer des panneaux solaires ?",
    answer: "Pour une installation résidentielle standard, comptez entre 2 et 4 jours d'intervention une fois l'étude technique validée. Les délais peuvent varier pour les installations industrielles complexes."
  },
  {
    question: "Intervenez-vous en dehors de Marrakech ?",
    answer: "Oui, nous intervenons sur l'ensemble du territoire marocain pour les projets professionnels et industriels. Pour le résidentiel, nous couvrons un large périmètre autour de nos agences."
  }
];

export default function BlogPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCat = activeCategory === "Tous" || article.category === activeCategory;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  useGSAP(() => {
    // Header Animation
    gsap.fromTo(".blog-header > *",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: "power3.out" }
    );
    
    gsap.fromTo(".filter-bar",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.3 }
    );
    
    // FAQ Animation
    gsap.fromTo(".faq-item",
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: "power2.out", scrollTrigger: { trigger: ".faq-section", start: "top 80%" } }
    );
  }, { scope: containerRef });

  useGSAP(() => {
    // Articles Grid Animation
    if (filteredArticles.length > 0) {
      gsap.fromTo(".article-card",
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out", clearProps: "all" }
      );
    }
  }, { scope: containerRef, dependencies: [activeCategory, searchQuery, filteredArticles.length] });

  return (
    <div ref={containerRef} className="bg-gray-50 min-h-screen pt-32 pb-0 flex flex-col">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 mb-24">
        
        {/* HEADER */}
        <div className="blog-header text-center max-w-4xl mx-auto mb-16">
          <span className="font-nevan text-sm tracking-[0.2em] text-[#AF1818] uppercase mb-4 block">
            — EXPERTISE & CONSEILS —
          </span>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 uppercase tracking-wider mb-6">
            Espace <span className="text-[#10748E]">Blog</span>
          </h1>
          <p className="font-montserrat text-gray-600 text-lg md:text-xl">
            Retrouvez nos dernières actualités, nos guides pratiques et nos conseils d'experts pour optimiser vos installations thermiques.
          </p>
        </div>

        {/* FILTERS & SEARCH */}
        <div className="filter-bar bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 mb-12 flex flex-col xl:flex-row gap-6 items-center justify-between sticky top-24 z-30">
          <div className="relative w-full xl:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#10748E] transition-colors">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#10748E]/20 focus:border-[#10748E] transition-all font-montserrat text-gray-900"
            />
          </div>

          <div className="w-full xl:w-auto flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2 mr-2 text-gray-400 hidden lg:flex">
              <Filter size={18} />
            </div>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl font-montserrat text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-[#10748E] text-white shadow-md shadow-[#10748E]/20"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ARTICLES GRID */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article key={article.id} className="article-card group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col cursor-pointer hover:-translate-y-1">
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[#10748E] font-nevan tracking-widest uppercase text-xs rounded-lg shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-montserrat text-gray-400 mb-4 uppercase tracking-wide font-semibold">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
                    <span className="flex items-center gap-1"><User size={14} /> {article.author}</span>
                  </div>
                  
                  <h3 className="font-nevan text-2xl text-gray-900 mb-4 leading-tight group-hover:text-[#10748E] transition-colors">
                    {article.title}
                  </h3>
                  
                  <p className="font-montserrat text-gray-600 mb-8 flex-grow leading-relaxed">
                    {article.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-6">
                    <span className="font-nevan text-sm text-[#AF1818] uppercase tracking-widest group-hover:text-[#8A1212] transition-colors flex items-center gap-2">
                      Lire l'article <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="font-montserrat text-xs text-gray-400 font-semibold bg-gray-50 px-2 py-1 rounded-md">
                      {article.readTime}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="w-full py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <Search size={40} />
            </div>
            <h3 className="font-nevan text-3xl text-gray-900 uppercase tracking-wider mb-4">Aucun article trouvé</h3>
            <p className="font-montserrat text-gray-500">Essayez une autre recherche ou catégorie.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("Tous"); }} className="mt-8 px-6 py-3 bg-[#10748E] text-white rounded-full font-montserrat font-semibold hover:bg-[#0c5a6e] transition-colors">
              Voir tous les articles
            </button>
          </div>
        )}
      </div>

      {/* FAQ SECTION */}
      <section className="faq-section bg-[#1A2634] py-24 text-white relative overflow-hidden mt-auto">
        <div className="absolute inset-0 opacity-10">
          <Image src="/images/assets/nikita-fursenko-BKGVpFYmbnM-unsplash.jpg" alt="Bg" fill className="object-cover grayscale" />
        </div>
        
        <div className="w-full max-w-4xl mx-auto px-4 md:px-12 relative z-10">
          <div className="text-center mb-16">
            <span className="font-nevan text-sm tracking-[0.2em] text-[#32A5DE] uppercase mb-4 block">
              — FOIRE AUX QUESTIONS —
            </span>
            <h2 className="font-nevan text-4xl md:text-5xl uppercase tracking-wider mb-6">
              Questions Fréquentes
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div 
                key={idx} 
                className="faq-item border border-white/10 bg-white/5 rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-montserrat font-semibold text-lg pr-8">{faq.question}</span>
                  <ChevronDown 
                    size={24} 
                    className={`shrink-0 text-[#32A5DE] transition-transform duration-300 ${openFaq === idx ? "rotate-180" : ""}`} 
                  />
                </button>
                <div 
                  className="overflow-hidden transition-all duration-500 ease-in-out"
                  style={{ maxHeight: openFaq === idx ? "500px" : "0", opacity: openFaq === idx ? 1 : 0 }}
                >
                  <p className="px-6 pb-6 font-montserrat text-gray-300 leading-relaxed border-t border-white/10 pt-4">
                    {faq.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <p className="font-montserrat text-gray-400 mb-6">Vous ne trouvez pas la réponse à votre question ?</p>
            <Link href="/contact" className="inline-flex px-8 py-3 bg-[#AF1818] text-white rounded-full font-nevan tracking-widest uppercase hover:bg-[#8A1212] transition-colors">
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
