"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Filter,
  Settings,
  X,
  Check,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  Plus,
  Minus,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { PRODUCTS, Product } from "@/lib/products";

const CATEGORIES = [
  "Tous",
  "Systèmes de climatisation",
  "Équipements de ventilation",
  "Produits solaires",
  "Filtres & accessoires"
];

export default function B2BCataloguePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  
  // Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [siteLocation, setSiteLocation] = useState("");
  const [urgency, setUrgency] = useState("Moyenne");
  const [notes, setNotes] = useState("");
  
  // Success State
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState("");

  useEffect(() => {
    setRole(localStorage.getItem("afe_mock_role") || "client_b2b");
  }, []);

  useGSAP(() => {
    gsap.fromTo(".cat-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  // Filter products based on category and search query
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = activeCategory === "Tous" || product.category === activeCategory;
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.reference && product.reference.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleOpenRequestModal = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setSiteLocation("");
    setUrgency("Moyenne");
    setNotes("");
  };

  const handleCloseRequestModal = () => {
    setSelectedProduct(null);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Simulate request creation
    const randomId = `REQ-B2B-${Math.floor(100 + Math.random() * 900)}`;
    setCreatedRequestId(randomId);
    
    // Save to local storage mock requests if needed, or just display success
    const mockRequest = {
      id: randomId,
      product: selectedProduct.title,
      reference: selectedProduct.reference,
      quantity,
      location: siteLocation || "Non précisé",
      urgency,
      notes,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      status: "Nouveau"
    };

    // Store in session storage/local storage to simulate lifecycle
    const existing = JSON.parse(localStorage.getItem("afe_my_demandes") || "[]");
    localStorage.setItem("afe_my_demandes", JSON.stringify([mockRequest, ...existing]));

    setShowSuccess(true);
    setSelectedProduct(null);
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="cat-item">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
          Catalogue Professionnel B2B
        </h1>
        <p className="font-montserrat text-gray-500">
          Commandez directement ou demandez un devis pour nos solutions de climatisation, ventilation et solaire.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="cat-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between overflow-hidden">
        
        {/* Search */}
        <div className="relative w-full lg:w-80 shrink-0">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher un produit, référence..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Categories tabs */}
        <div className="flex flex-row flex-nowrap overflow-x-auto scrollbar-hide gap-2 w-full lg:flex-1 lg:justify-end min-w-0 pb-1 lg:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2.5 rounded-xl font-montserrat text-sm font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#10748E] text-white shadow-md shadow-[#10748E]/10"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="cat-item">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                {/* Image Wrapper */}
                <div className="relative h-[220px] w-full bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                  {product.badge && (
                    <span className={`absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-nevan tracking-wider uppercase rounded-md text-white ${
                      product.badge === "Promo" ? "bg-[#AF1818]" : "bg-[#32A5DE]"
                    }`}>
                      {product.badge}
                    </span>
                  )}
                  
                  {/* Fallback styling for images */}
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        // If local images are not present, style gracefully
                        e.currentTarget.style.display = 'none';
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl">
                              <span class="font-nevan text-slate-400 text-sm tracking-wider">AIR FROID</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow border-t border-gray-50">
                  <span className="font-nevan text-[10px] tracking-widest text-[#10748E] uppercase mb-1 block">
                    {product.category}
                  </span>
                  <h3 className="font-montserrat font-bold text-base text-gray-900 group-hover:text-[#32A5DE] transition-colors line-clamp-1 mb-1">
                    {product.title}
                  </h3>
                  {product.reference && (
                    <span className="font-montserrat text-[11px] text-gray-400 block mb-3">
                      Réf: {product.reference}
                    </span>
                  )}
                  <p className="font-montserrat text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-grow">
                    {product.description}
                  </p>

                  <div className="pt-4 border-t border-gray-50 mt-auto flex flex-col gap-3">
                    <div className="flex justify-between items-baseline">
                      <span className="font-montserrat text-xs text-gray-400 font-medium">Prix Professionnel :</span>
                      <div className="flex items-baseline gap-1">
                        <span className="font-nevan text-lg text-gray-900">{product.price}</span>
                        <span className="font-montserrat text-[10px] font-bold text-gray-500 uppercase">MAD</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleOpenRequestModal(product)}
                      className="w-full py-2.5 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2 shadow-sm"
                    >
                      Faire une demande
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center shadow-sm">
            <Package className="text-gray-300 mx-auto mb-4" size={48} />
            <h3 className="font-nevan text-xl text-gray-900 uppercase mb-2">Aucun produit trouvé</h3>
            <p className="font-montserrat text-gray-500 text-sm max-w-md mx-auto">
              Nous n'avons trouvé aucun équipement correspondant à vos critères de recherche. Essayez d'autres mots-clés.
            </p>
          </div>
        )}
      </div>

      {/* Center Modal - Product Request Form */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleCloseRequestModal} />
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-nevan text-xs text-gray-400">Demande de devis pro</span>
                <h2 className="font-nevan text-lg text-gray-950 uppercase mt-0.5">{selectedProduct.title}</h2>
              </div>
              <button 
                onClick={handleCloseRequestModal} 
                className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitRequest} className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Product preview */}
              <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center shrink-0">
                  <Image 
                    src={selectedProduct.image} 
                    alt={selectedProduct.title} 
                    fill 
                    sizes="64px" 
                    className="object-cover mix-blend-multiply"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div>
                  <span className="font-montserrat text-xs text-gray-400 block">Réf : {selectedProduct.reference || "N/A"}</span>
                  <span className="font-montserrat text-sm font-bold text-gray-900">{selectedProduct.title}</span>
                  <span className="font-nevan text-sm text-[#10748E] block mt-0.5">{selectedProduct.price} MAD <span className="font-montserrat text-[9px] text-gray-400 lowercase">l'unité pro</span></span>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-2">
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Quantité souhaitée</label>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number" 
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 border border-gray-200 rounded-xl text-center font-montserrat font-bold focus:outline-none focus:border-[#10748E]"
                  />
                  <button 
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 active:scale-95 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                  <span className="font-montserrat text-xs text-gray-400 italic ml-2">Total estimé : {(parseInt(selectedProduct.price.replace(/\s/g, '')) * quantity).toLocaleString()} MAD</span>
                </div>
              </div>

              {/* Site Location */}
              <div className="space-y-2">
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Lieu du chantier / livraison</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    placeholder="ex: Casablanca, Zone Industrielle Nouaceur" 
                    value={siteLocation}
                    onChange={(e) => setSiteLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Niveau d'urgence</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Faible", "Moyenne", "Élevée"].map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setUrgency(level)}
                      className={`py-2 rounded-xl text-xs font-bold font-montserrat border transition-all ${
                        urgency === level 
                          ? "bg-[#10748E]/10 border-[#10748E] text-[#10748E]" 
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Spécifications ou instructions complémentaires</label>
                <textarea 
                  rows={3}
                  placeholder="Précisez ici les détails techniques de l'installation, contraintes de hauteur, ou options requises..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <button
                  type="button"
                  onClick={handleCloseRequestModal}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
                >
                  Envoyer la demande
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowSuccess(false)} />
          
          <div className="relative w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} />
            </div>
            
            <h3 className="font-nevan text-xl text-gray-900 uppercase tracking-wide mb-2">
              Demande enregistrée
            </h3>
            
            <p className="font-montserrat text-sm text-gray-500 leading-relaxed mb-6">
              Votre demande de cotation a été créée avec succès sous la référence <span className="font-bold text-[#10748E]">{createdRequestId}</span>. 
              Un commercial du bureau d'études vous transmettra une offre personnalisée sous peu.
            </p>

            <div className="flex flex-col gap-2">
              <Link 
                href="/b2b/dashboard/suivi"
                className="w-full py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-sm"
              >
                Suivre mes projets & devis
              </Link>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full py-3 border border-gray-200 rounded-xl font-montserrat text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour au catalogue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Custom Solutions CTA */}
      <div className="cat-item bg-[#1A2634] rounded-2xl p-8 md:p-12 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#32A5DE] rounded-full blur-[100px] opacity-20" />
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-3 mb-4 text-[#32A5DE]">
            <Settings size={24} />
            <h3 className="font-nevan text-2xl uppercase tracking-wider">Solutions Thermiques Sur-Mesure</h3>
          </div>
          <p className="font-montserrat text-gray-300 leading-relaxed">
            Vous concevez un projet industriel ou tertiaire spécifique ? Notre bureau d'études étudie vos cahiers des charges pour concevoir des configurations thermiques sur-mesure.
          </p>
        </div>
        <Link 
          href={role === "client_b2b" ? "/b2b/dashboard/support" : "/b2b/dashboard/messagerie"}
          className="relative z-10 shrink-0 bg-[#32A5DE] text-white px-8 py-4 rounded-xl font-nevan tracking-widest uppercase hover:bg-[#2884b2] transition-colors shadow-lg text-center font-bold"
        >
          Contacter le bureau d'études
        </Link>
      </div>

    </div>
  );
}

