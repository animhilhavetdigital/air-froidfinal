"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  Settings,
  X,
  MapPin,
  Minus,
  Plus,
  CheckCircle2,
  Package,
  ArrowRight,
  Info,
  Calendar,
  ShieldCheck,
  Tag,
  Download,
  Trash2
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
  const [hasCommercialPermission, setHasCommercialPermission] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tous");
  const [productsList, setProductsList] = useState<Product[]>([]);
  
  // Product Detail Modal State
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<"specs" | "description">("specs");

  // Request Form Modal State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [siteLocation, setSiteLocation] = useState("");
  const [urgency, setUrgency] = useState("Moyenne");
  const [notes, setNotes] = useState("");
  
  // Success State
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState("");

  const [catalogConfig, setCatalogConfig] = useState<{ products: number[], discount: number } | null>(null);
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>("");
  const [saveFeedbackId, setSaveFeedbackId] = useState<number | null>(null);

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addImgSource, setAddImgSource] = useState<"preset" | "upload">("preset");
  const [newProduct, setNewProduct] = useState({
    title: "",
    reference: "",
    category: "Systèmes de climatisation",
    price: "",
    image: "/images/products/clim-split-12000.jpg",
    description: "",
    brand: "",
    warranty: "",
    badge: ""
  });

  // Edit Product Modal State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [editImgSource, setEditImgSource] = useState<"preset" | "upload">("preset");
  const [editingProductData, setEditingProductData] = useState<Product | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: "new" | "edit") => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (target === "new") {
          setNewProduct(prev => ({ ...prev, image: base64String }));
        } else {
          setEditingProductData(prev => prev ? { ...prev, image: base64String } : null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const savedRole = localStorage.getItem("afe_mock_role") || "client_b2b";
    setRole(savedRole);

    if (savedRole === "commercial") {
      const savedPerms = localStorage.getItem("afe_commercial_catalog_permissions");
      if (savedPerms) {
        const perms = JSON.parse(savedPerms);
        // ID 2 corresponds to Youssef in the mock users list
        if (perms[2] || perms[3]) {
          setHasCommercialPermission(true);
        }
      }
    }

    const savedProducts = localStorage.getItem("afe_catalog_products");
    let initialList = [...PRODUCTS];
    if (savedProducts) {
      initialList = JSON.parse(savedProducts);
    } else {
      const savedPrices = localStorage.getItem("afe_catalog_prices");
      if (savedPrices) {
        const pricesMap = JSON.parse(savedPrices);
        initialList = PRODUCTS.map(p => {
          if (pricesMap[p.id] !== undefined) {
            return { ...p, price: pricesMap[p.id] };
          }
          return p;
        });
      }
      localStorage.setItem("afe_catalog_products", JSON.stringify(initialList));
    }
    setProductsList(initialList);

    if (savedRole === "client_b2b") {
      const currentClientId = localStorage.getItem("afe_current_client_id") || "CLI-402";
      const savedCatalogs = localStorage.getItem("afe_client_catalogs");
      if (savedCatalogs) {
        const catalogs = JSON.parse(savedCatalogs);
        if (catalogs[currentClientId]) {
          setCatalogConfig(catalogs[currentClientId]);
        } else {
          setCatalogConfig({ products: [], discount: 0 });
        }
      } else {
        setCatalogConfig({ products: [], discount: 0 });
      }
    }
  }, []);

  const handleUpdatePrice = (productId: number, newPrice: string) => {
    const updated = productsList.map(p => {
      if (p.id === productId) {
        return { ...p, price: newPrice };
      }
      return p;
    });
    setProductsList(updated);
    localStorage.setItem("afe_catalog_products", JSON.stringify(updated));

    // For legacy/backup support
    const savedPrices = localStorage.getItem("afe_catalog_prices");
    const pricesMap = savedPrices ? JSON.parse(savedPrices) : {};
    pricesMap[productId] = newPrice;
    localStorage.setItem("afe_catalog_prices", JSON.stringify(pricesMap));

    // Trigger visual success feedback
    setSaveFeedbackId(productId);
    setEditingPriceId(null);
    setTimeout(() => {
      setSaveFeedbackId(null);
    }, 2500);
  };

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.reference || !newProduct.price || !newProduct.description) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const nextId = productsList.length > 0 ? Math.max(...productsList.map(p => p.id)) + 1 : 1;
    const productToAdd: Product = {
      id: nextId,
      title: newProduct.title,
      reference: newProduct.reference,
      category: newProduct.category,
      price: newProduct.price,
      image: newProduct.image || "/images/products/clim-split-12000.jpg",
      description: newProduct.description,
      brand: newProduct.brand || undefined,
      warranty: newProduct.warranty || undefined,
      badge: newProduct.badge || undefined,
      features: [],
      specSections: []
    };

    const updated = [productToAdd, ...productsList];
    setProductsList(updated);
    localStorage.setItem("afe_catalog_products", JSON.stringify(updated));

    // Reset and close
    setNewProduct({
      title: "",
      reference: "",
      category: "Systèmes de climatisation",
      price: "",
      image: "/images/products/clim-split-12000.jpg",
      description: "",
      brand: "",
      warranty: "",
      badge: ""
    });
    setShowAddModal(false);
  };

  const handleDeleteProduct = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit du catalogue ?")) {
      const updated = productsList.filter(p => p.id !== productId);
      setProductsList(updated);
      localStorage.setItem("afe_catalog_products", JSON.stringify(updated));
    }
  };

  const handleSaveProductEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProductData) return;

    const updated = productsList.map(p => {
      if (p.id === editingProductData.id) {
        return editingProductData;
      }
      return p;
    });

    setProductsList(updated);
    localStorage.setItem("afe_catalog_products", JSON.stringify(updated));
    setDetailProduct(editingProductData);
    setIsEditingProduct(false);
    setEditingProductData(null);
  };

  const handleExportCSV = (all: boolean) => {
    const listToExport = all ? productsList : filteredProducts;
    
    // CSV headers (UTF-8 BOM is added later for Excel compatibility)
    const headers = ["ID", "Reference", "Designation", "Categorie", "Marque", "Prix (MAD)", "Garantie", "Description"];
    
    const rows = listToExport.map(p => [
      p.id,
      p.reference || "",
      `"${p.title.replace(/"/g, '""')}"`,
      `"${p.category.replace(/"/g, '""')}"`,
      p.brand || "",
      p.price.replace(/\s/g, ''),
      p.warranty || "",
      `"${p.description.replace(/"/g, '""')}"`
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");
    
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `catalogue_afe_${all ? 'complet' : 'selection'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useGSAP(() => {
    gsap.fromTo(".cat-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const getProductPriceInfo = (product: Product) => {
    const originalPriceNum = parseInt(product.price.replace(/\s/g, '')) || 0;
    if (role === "client_b2b" && catalogConfig && catalogConfig.discount > 0) {
      const discountedPrice = Math.round(originalPriceNum * (1 - catalogConfig.discount / 100));
      return {
        hasDiscount: true,
        discountedPrice: discountedPrice.toLocaleString(),
        originalPrice: product.price,
        discountPercentage: catalogConfig.discount
      };
    }
    return {
      hasDiscount: false,
      discountedPrice: product.price,
      originalPrice: product.price,
      discountPercentage: 0
    };
  };

  // Filter products based on category, search query and commercial settings
  const filteredProducts = useMemo(() => {
    return productsList.filter((product) => {
      // Filter strictly if B2B client
      if (role === "client_b2b") {
        if (!catalogConfig || !catalogConfig.products.includes(product.id)) {
          return false;
        }
      }
      
      const matchesCategory = activeCategory === "Tous" || product.category === activeCategory;
      const matchesSearch = 
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.reference && product.reference.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery, role, catalogConfig]);

  const handleOpenRequestModal = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation(); // Stop click from opening details modal
    setSelectedProduct(product);
    setDetailProduct(null); // Close details if open
    setQuantity(1);
    setSiteLocation("");
    setUrgency("Moyenne");
    setNotes("");
  };

  const handleCloseRequestModal = () => {
    setSelectedProduct(null);
  };

  const handleOpenDetailModal = (product: Product) => {
    setDetailProduct(product);
    setActiveDetailTab("specs");
  };

  const handleDownloadFiche = (product: Product) => {
    alert(`Téléchargement de la fiche technique : AFE_FT_${product.reference || 'PROD'}.pdf`);
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    // Simulate request creation
    const randomId = `REQ-B2B-${Math.floor(100 + Math.random() * 900)}`;
    setCreatedRequestId(randomId);
    
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

    // Store in local storage to simulate lifecycle
    const existing = JSON.parse(localStorage.getItem("afe_my_demandes") || "[]");
    localStorage.setItem("afe_my_demandes", JSON.stringify([mockRequest, ...existing]));

    setShowSuccess(true);
    setSelectedProduct(null);
  };

  const canEditCatalogue = role === "super_admin" || (role === "commercial" && hasCommercialPermission);

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="cat-item flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
            Catalogue Professionnel B2B
          </h1>
          <p className="font-montserrat text-gray-500">
            Commandez directement ou demandez un devis pour nos solutions de climatisation, ventilation et solaire.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          {canEditCatalogue && (
            <>
              <button
                onClick={() => handleExportCSV(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-nevan text-xs tracking-wider uppercase transition-colors font-bold"
                title="Exporter l'intégralité du catalogue au format CSV"
              >
                <Download size={16} /> Exporter tout (CSV)
              </button>
              <button
                onClick={() => handleExportCSV(false)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#10748E] hover:bg-[#0c5a6e] text-white rounded-xl font-nevan text-xs tracking-wider uppercase transition-colors shadow-md shadow-[#10748E]/10 font-bold"
                title="Exporter uniquement la liste filtrée au format CSV"
              >
                <Download size={16} /> Exporter la sélection ({filteredProducts.length})
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-nevan text-xs tracking-wider uppercase transition-colors shadow-md shadow-green-600/10 font-bold"
                title="Ajouter un nouveau produit au catalogue"
              >
                <Plus size={16} /> Ajouter un produit
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="cat-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between overflow-hidden">
        
        {/* Search */}
        <div className="relative w-full lg:w-64 shrink-0">
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
        <div className="flex flex-row flex-nowrap overflow-x-auto scrollbar-hide gap-2 w-full lg:flex-1 lg:justify-start min-w-0 pb-1 lg:pb-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-2 rounded-xl font-montserrat text-xs lg:text-sm font-semibold whitespace-nowrap transition-all ${
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
                onClick={() => handleOpenDetailModal(product)}
                className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_15px_30px_-10px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
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
                  {canEditCatalogue && (
                    <button
                      onClick={(e) => handleDeleteProduct(product.id, e)}
                      className="absolute top-4 right-4 z-10 p-2 bg-white/95 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-all shadow-sm border border-gray-100 active:scale-90"
                      title="Supprimer ce produit"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                  
                  <div className="relative w-full h-full">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
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
                    <div className="flex justify-between items-center min-h-[44px] gap-2">
                      <span className="font-montserrat text-xs text-gray-400 font-medium whitespace-nowrap">Prix à partir de</span>
                      {canEditCatalogue ? (
                        <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          {editingPriceId === product.id ? (
                            <>
                              <input
                                type="text"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(e.target.value)}
                                className="w-24 px-2 py-1 text-right font-nevan text-sm border-2 border-[#10748E] rounded-xl focus:outline-none bg-white font-bold"
                                autoFocus
                              />
                              <button
                                onClick={() => handleUpdatePrice(product.id, tempPrice)}
                                className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-nevan text-[10px] uppercase tracking-wider"
                                title="Sauvegarder le prix"
                              >
                                Save
                              </button>
                            </>
                          ) : (
                            <>
                              <div 
                                onClick={() => {
                                  setEditingPriceId(product.id);
                                  setTempPrice(product.price);
                                }}
                                className="cursor-pointer hover:bg-gray-100 px-2.5 py-1 border border-dashed border-[#10748E]/40 rounded-xl flex items-center gap-1.5 font-bold whitespace-nowrap shrink-0"
                                title="Cliquer pour modifier le prix"
                              >
                                <span className="font-nevan text-sm text-[#10748E]">{product.price}</span>
                                <span className="font-montserrat text-[10px] text-gray-400 font-semibold">(Edit)</span>
                              </div>
                              {saveFeedbackId === product.id && (
                                <span className="text-[10px] text-green-600 font-bold">✓ Saved</span>
                              )}
                            </>
                          )}
                          <span className="font-montserrat text-[10px] font-bold text-gray-500 uppercase">MAD</span>
                        </div>
                      ) : (
                        (() => {
                          const priceInfo = getProductPriceInfo(product);
                          return priceInfo.hasDiscount ? (
                            <div className="flex flex-col items-end">
                              <span className="font-montserrat text-[9px] text-[#AF1818] line-through">{priceInfo.originalPrice} MAD</span>
                              <div className="flex items-baseline gap-1">
                                <span className="font-nevan text-lg text-green-600">{priceInfo.discountedPrice}</span>
                                <span className="font-montserrat text-[10px] font-bold text-green-600 uppercase">MAD</span>
                                <span className="ml-1 text-[9px] font-bold bg-green-50 text-green-700 px-1 rounded">-{priceInfo.discountPercentage}%</span>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-baseline gap-1">
                              <span className="font-nevan text-lg text-gray-900">{product.price}</span>
                              <span className="font-montserrat text-[10px] font-bold text-gray-500 uppercase">MAD</span>
                            </div>
                          );
                        })()
                      )}
                    </div>
                    
                    {!canEditCatalogue && (
                      <button
                        onClick={(e) => handleOpenRequestModal(product, e)}
                        className="w-full py-2.5 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2 shadow-sm"
                      >
                        Faire une demande
                      </button>
                    )}
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

      {/* Center Modal - Product Technical Details */}
      {detailProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDetailProduct(null)} />
          
          <div className="relative w-full max-w-4xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-nevan text-xs text-gray-400">{isEditingProduct ? "Administration" : detailProduct.category}</span>
                <h2 className="font-nevan text-xl text-gray-950 uppercase mt-0.5">{isEditingProduct ? "Modifier le produit" : detailProduct.title}</h2>
              </div>
              <div className="flex items-center gap-3">
                {canEditCatalogue && !isEditingProduct && (
                  <button
                    onClick={() => {
                      setIsEditingProduct(true);
                      setEditingProductData(detailProduct);
                      setEditImgSource(detailProduct.image.startsWith("data:") ? "upload" : "preset");
                    }}
                    className="px-4 py-2 bg-[#10748E] hover:bg-[#0c5a6e] text-white rounded-xl font-nevan text-xs tracking-wider uppercase transition-colors font-bold"
                  >
                    Modifier le produit
                  </button>
                )}
                <button 
                  onClick={() => {
                    setDetailProduct(null);
                    setIsEditingProduct(false);
                    setEditingProductData(null);
                  }} 
                  className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {isEditingProduct && editingProductData ? (
              <form onSubmit={handleSaveProductEdit} className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Désignation *</label>
                    <input 
                      type="text" 
                      required
                      value={editingProductData.title}
                      onChange={(e) => setEditingProductData({ ...editingProductData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Référence *</label>
                    <input 
                      type="text" 
                      required
                      value={editingProductData.reference || ""}
                      onChange={(e) => setEditingProductData({ ...editingProductData, reference: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Catégorie *</label>
                    <select
                      value={editingProductData.category}
                      onChange={(e) => setEditingProductData({ ...editingProductData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                    >
                      {CATEGORIES.filter(c => c !== "Tous").map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Prix Pro (MAD) *</label>
                    <input 
                      type="text" 
                      required
                      value={editingProductData.price}
                      onChange={(e) => setEditingProductData({ ...editingProductData, price: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm font-semibold text-gray-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Marque</label>
                    <input 
                      type="text" 
                      value={editingProductData.brand || ""}
                      onChange={(e) => setEditingProductData({ ...editingProductData, brand: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Garantie</label>
                    <input 
                      type="text" 
                      value={editingProductData.warranty || ""}
                      onChange={(e) => setEditingProductData({ ...editingProductData, warranty: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Badge</label>
                    <select
                      value={editingProductData.badge || ""}
                      onChange={(e) => setEditingProductData({ ...editingProductData, badge: e.target.value || undefined })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                    >
                      <option value="">Aucun</option>
                      <option value="Nouveau">Nouveau</option>
                      <option value="Promo">Promo</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Source de l'image</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditImgSource("preset")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                          editImgSource === "preset" ? "bg-[#10748E] text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Prédéfinie
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditImgSource("upload")}
                        className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                          editImgSource === "upload" ? "bg-[#10748E] text-white" : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        Téléverser
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {editImgSource === "preset" ? (
                    <div className="space-y-1">
                      <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Image prédéfinie</label>
                      <select
                        value={editingProductData.image}
                        onChange={(e) => setEditingProductData({ ...editingProductData, image: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                      >
                        <option value="/images/products/clim-split-12000.jpg">Climatiseur Split</option>
                        <option value="/images/products/clim-console-18000.jpg">Climatiseur Console</option>
                        <option value="/images/products/vmc-double-flux.jpg">VMC Double Flux</option>
                        <option value="/images/products/chauffe-eau-solaire-300l.jpg">Chauffe-Eau Solaire</option>
                        <option value="/images/products/panneau-pv-550w.jpg">Panneau Solaire 550W</option>
                        <option value="/images/products/filtre-hepa-h14.jpg">Filtre HEPA H14</option>
                        <option value="/images/products/thermostat-wifi.jpg">Thermostat Connecté</option>
                        <option value="/images/products/extracteur-axe-150.jpg">Extracteur d'Air</option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Téléverser une photo</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "edit")}
                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-montserrat text-sm"
                      />
                      {editingProductData.image && editingProductData.image.startsWith("data:") && (
                        <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                          <span className="font-bold text-green-600">✓ Image chargée</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Description Courte *</label>
                  <textarea 
                    rows={2}
                    required
                    value={editingProductData.description}
                    onChange={(e) => setEditingProductData({ ...editingProductData, description: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Description Longue & Avantages</label>
                  <textarea 
                    rows={4}
                    placeholder="Saisissez la description longue..."
                    value={editingProductData.longDescription || ""}
                    onChange={(e) => setEditingProductData({ ...editingProductData, longDescription: e.target.value })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Avantages Clés (un par ligne)</label>
                  <textarea 
                    rows={3}
                    placeholder="Avantage 1&#10;Avantage 2&#10;Avantage 3"
                    value={editingProductData.features?.join("\n") || ""}
                    onChange={(e) => setEditingProductData({ ...editingProductData, features: e.target.value.split("\n").filter(Boolean) })}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm leading-relaxed"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="font-montserrat text-xs font-bold text-gray-700 uppercase">Spécifications techniques</span>
                    <button
                      type="button"
                      onClick={() => {
                        const existingSections = editingProductData.specSections || [];
                        const updatedSections = JSON.parse(JSON.stringify(existingSections));
                        if (updatedSections.length === 0) {
                          updatedSections.push({ title: "Caractéristiques", items: {} });
                        }
                        updatedSections[0].items[""] = "";
                        setEditingProductData({ ...editingProductData, specSections: updatedSections });
                      }}
                      className="text-[#10748E] hover:text-[#0c5a6e] font-montserrat text-xs font-bold flex items-center gap-1"
                    >
                      <Plus size={14} /> Ajouter une ligne
                    </button>
                  </div>
                  
                  {editingProductData.specSections && editingProductData.specSections.length > 0 ? (
                    editingProductData.specSections.map((section, sIdx) => (
                      <div key={sIdx} className="space-y-2">
                        <input 
                          type="text" 
                          placeholder="Nom de la section (ex: Caractéristiques)"
                          value={section.title}
                          onChange={(e) => {
                            const updatedSections = JSON.parse(JSON.stringify(editingProductData.specSections || []));
                            updatedSections[sIdx].title = e.target.value;
                            setEditingProductData({ ...editingProductData, specSections: updatedSections });
                          }}
                          className="w-full px-3 py-1.5 bg-gray-100 border border-gray-200 rounded-lg font-montserrat text-xs font-bold focus:outline-none"
                        />
                        
                        <div className="space-y-2 pl-4">
                          {Object.entries(section.items).map(([key, val], iIdx) => (
                            <div key={iIdx} className="flex gap-2 items-center">
                              <input 
                                type="text"
                                placeholder="Clé (ex: Tension)"
                                value={key}
                                onChange={(e) => {
                                  const updatedSections = JSON.parse(JSON.stringify(editingProductData.specSections || []));
                                  const items = { ...updatedSections[sIdx].items };
                                  const newKey = e.target.value;
                                  
                                  const newItems: Record<string, string> = {};
                                  Object.entries(items).forEach(([k, v]) => {
                                    if (k === key) {
                                      newItems[newKey] = v as string;
                                    } else {
                                      newItems[k] = v as string;
                                    }
                                  });
                                  updatedSections[sIdx].items = newItems;
                                  setEditingProductData({ ...editingProductData, specSections: updatedSections });
                                }}
                                className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg font-montserrat text-xs focus:outline-none"
                              />
                              <input 
                                type="text"
                                placeholder="Valeur (ex: 220V)"
                                value={val}
                                onChange={(e) => {
                                  const updatedSections = JSON.parse(JSON.stringify(editingProductData.specSections || []));
                                  updatedSections[sIdx].items[key] = e.target.value;
                                  setEditingProductData({ ...editingProductData, specSections: updatedSections });
                                }}
                                className="flex-1 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg font-montserrat text-xs focus:outline-none"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedSections = JSON.parse(JSON.stringify(editingProductData.specSections || []));
                                  delete updatedSections[sIdx].items[key];
                                  setEditingProductData({ ...editingProductData, specSections: updatedSections });
                                }}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Aucune spécification. Cliquez sur "Ajouter une ligne" pour en créer.</p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingProduct(false);
                      setEditingProductData(null);
                    }}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-green-600 text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-green-700 transition-colors shadow-md shadow-green-600/10"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            ) : (
              <>
                {/* Content Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  
                  {/* Product Info Splitted Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    {/* Image block (5 cols) */}
                    <div className="md:col-span-5 bg-gray-50 rounded-2xl p-4 flex items-center justify-center relative overflow-hidden h-72 md:h-80 border border-gray-100">
                      <Image 
                        src={detailProduct.image} 
                        alt={detailProduct.title} 
                        fill 
                        sizes="(max-width: 768px) 100vw, 30vw" 
                        className="object-cover mix-blend-multiply"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Right Quick Info (7 cols) */}
                    <div className="md:col-span-7 space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="font-montserrat font-bold text-gray-900 text-lg">{detailProduct.title}</h3>
                          {detailProduct.brand && (
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-gray-500 font-semibold">
                              <Tag size={12} className="text-[#10748E]" /> Marque: {detailProduct.brand}
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          {role === "super_admin" ? (
                            <div className="flex flex-col items-end gap-1">
                              <span className="font-montserrat text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Modifier le prix</span>
                              <div className="flex items-center gap-1.5">
                                {editingPriceId === detailProduct.id ? (
                                  <>
                                    <input
                                      type="text"
                                      value={tempPrice}
                                      onChange={(e) => setTempPrice(e.target.value)}
                                      className="w-28 px-2 py-1 text-right font-nevan text-base border-2 border-[#10748E] rounded-xl focus:outline-none bg-white font-bold"
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => {
                                        handleUpdatePrice(detailProduct.id, tempPrice);
                                        setDetailProduct({ ...detailProduct, price: tempPrice });
                                      }}
                                      className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-nevan text-[10px] uppercase tracking-wider"
                                    >
                                      Save
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <div 
                                      onClick={() => {
                                        setEditingPriceId(detailProduct.id);
                                        setTempPrice(detailProduct.price);
                                      }}
                                      className="cursor-pointer hover:bg-gray-100 px-3 py-1 border border-dashed border-[#10748E]/40 rounded-xl flex items-center gap-1.5 font-bold"
                                    >
                                      <span className="font-nevan text-lg text-[#10748E]">{detailProduct.price}</span>
                                      <span className="font-montserrat text-[10px] text-gray-400 font-semibold">(Edit)</span>
                                    </div>
                                    {saveFeedbackId === detailProduct.id && (
                                      <span className="text-[10px] text-green-600 font-bold">✓ Saved</span>
                                    )}
                                  </>
                                )}
                                <span className="font-montserrat text-xs font-bold text-gray-500">MAD</span>
                              </div>
                            </div>
                          ) : (
                            (() => {
                              const priceInfo = getProductPriceInfo(detailProduct);
                              return priceInfo.hasDiscount ? (
                                <>
                                  <span className="font-montserrat text-xs text-[#AF1818] line-through block">{priceInfo.originalPrice} MAD</span>
                                  <span className="font-nevan text-2xl text-green-600 block leading-none">{priceInfo.discountedPrice} MAD</span>
                                  <span className="font-montserrat text-[9px] font-bold text-green-600 uppercase tracking-widest block mt-1">Prix Remisé (-{priceInfo.discountPercentage}%)</span>
                                </>
                              ) : (
                                <>
                                  <span className="font-nevan text-2xl text-[#10748E] block leading-none">{detailProduct.price} MAD</span>
                                  <span className="font-montserrat text-[9px] font-bold text-gray-400 uppercase tracking-widest block mt-1">Prix à partir de (hors taxe)</span>
                                </>
                              );
                            })()
                          )}
                        </div>
                      </div>

                      <p className="font-montserrat text-sm text-gray-600 leading-relaxed">
                        {detailProduct.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                          <Info size={14} className="text-[#10748E]" />
                          <div>
                            <span className="font-montserrat text-[9px] text-gray-400 uppercase font-bold block">Référence</span>
                            <span className="font-montserrat text-xs text-gray-800 font-semibold block">{detailProduct.reference || "N/A"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-100/50">
                          <ShieldCheck size={14} className="text-green-600" />
                          <div>
                            <span className="font-montserrat text-[9px] text-gray-400 uppercase font-bold block">Garantie Pro</span>
                            <span className="font-montserrat text-xs text-gray-800 font-semibold block">{detailProduct.warranty || "2 ans"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-2">
                        {role !== "super_admin" && (
                          <button
                            onClick={() => handleOpenRequestModal(detailProduct)}
                            className="w-full py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[#10748E]/10"
                          >
                            Faire une demande de devis
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDownloadFiche(detailProduct)}
                          className="w-full py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 rounded-xl font-nevan text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 font-bold shadow-sm"
                        >
                          <Download size={15} className="text-gray-500" /> Télécharger la fiche technique
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Technical features Tabs & Lists */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex gap-2 border-b border-gray-100 pb-2">
                      <button
                        onClick={() => setActiveDetailTab("specs")}
                        className={`pb-2 px-4 font-nevan text-xs tracking-wider uppercase border-b-2 transition-all ${
                          activeDetailTab === "specs" 
                            ? "border-[#10748E] text-[#10748E]" 
                            : "border-transparent text-gray-400 hover:text-gray-900"
                        }`}
                      >
                        Caractéristiques
                      </button>
                      <button
                        onClick={() => setActiveDetailTab("description")}
                        className={`pb-2 px-4 font-nevan text-xs tracking-wider uppercase border-b-2 transition-all ${
                          activeDetailTab === "description" 
                            ? "border-[#10748E] text-[#10748E]" 
                            : "border-transparent text-gray-400 hover:text-gray-900"
                        }`}
                      >
                        Description & Avantages
                      </button>
                    </div>

                    {/* Tab content - SPECS TABLES */}
                    {activeDetailTab === "specs" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                        {detailProduct.specSections && detailProduct.specSections.length > 0 ? (
                          detailProduct.specSections.map((section, sIdx) => (
                            <div key={sIdx} className="space-y-2">
                              <h4 className="font-nevan text-xs tracking-wider text-gray-900 uppercase border-b border-gray-100 pb-1.5">
                                {section.title}
                              </h4>
                              <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50 text-xs font-montserrat shadow-sm">
                                {Object.entries(section.items).map(([key, val]) => (
                                  <div key={key} className="flex justify-between p-2.5 bg-white hover:bg-gray-50/50">
                                    <span className="text-gray-400 font-medium">{key}</span>
                                    <span className="text-gray-900 font-semibold text-right">{val}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="col-span-full py-6 text-center text-gray-400 font-montserrat text-xs flex items-center justify-center gap-2">
                            <Info size={16} /> Aucune spécification technique détaillée disponible.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tab content - LONG DESCRIPTION & FEATURES */}
                    {activeDetailTab === "description" && (
                      <div className="space-y-4 pt-2 font-montserrat text-sm leading-relaxed text-gray-600">
                        <p className="font-medium text-gray-800">
                          {detailProduct.longDescription || detailProduct.description}
                        </p>
                        
                        {detailProduct.features && detailProduct.features.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <h4 className="font-nevan text-xs tracking-wider text-gray-900 uppercase">Avantages Clés :</h4>
                            <ul className="list-disc pl-5 space-y-1 text-xs md:text-sm text-gray-600">
                              {detailProduct.features.map((feature, fIdx) => (
                                <li key={fIdx} className="pl-1">{feature}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={() => {
                      setDetailProduct(null);
                      setIsEditingProduct(false);
                      setEditingProductData(null);
                    }}
                    className="px-6 py-2.5 border border-gray-200 rounded-xl font-montserrat text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Fermer
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
                  {(() => {
                    const priceInfo = getProductPriceInfo(selectedProduct);
                    return priceInfo.hasDiscount ? (
                      <span className="font-nevan text-sm text-green-600 block mt-0.5">
                        <span className="line-through text-xs text-[#AF1818] mr-1">{priceInfo.originalPrice}</span>
                        {priceInfo.discountedPrice} MAD <span className="font-montserrat text-[9px] text-gray-400 lowercase">l'unité remisée</span>
                      </span>
                    ) : (
                      <span className="font-nevan text-sm text-[#10748E] block mt-0.5">{selectedProduct.price} MAD <span className="font-montserrat text-[9px] text-gray-400 lowercase">l'unité pro</span></span>
                    );
                  })()}
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
                  <span className="font-montserrat text-xs text-gray-400 italic ml-2">
                    Total estimé : {(() => {
                      const priceInfo = getProductPriceInfo(selectedProduct);
                      const activePriceStr = priceInfo.hasDiscount ? priceInfo.discountedPrice : priceInfo.originalPrice;
                      const activePriceNum = parseInt(activePriceStr.replace(/\s/g, '')) || 0;
                      return (activePriceNum * quantity).toLocaleString();
                    })()} MAD
                  </span>
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

      {/* Modal - Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-nevan text-xs text-gray-400">Administration</span>
                <h2 className="font-nevan text-lg text-gray-950 uppercase mt-0.5">Ajouter un produit</h2>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddProduct} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Désignation *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: Climatiseur Gainable 24000 BTU"
                    value={newProduct.title}
                    onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Référence *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: GAI-24K-AFE"
                    value={newProduct.reference}
                    onChange={(e) => setNewProduct({ ...newProduct, reference: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Catégorie *</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                  >
                    {CATEGORIES.filter(c => c !== "Tous").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Prix Pro (MAD) *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="ex: 8 500"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm font-semibold text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Marque</label>
                  <input 
                    type="text" 
                    placeholder="ex: Air Froid Expert"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Garantie</label>
                  <input 
                    type="text" 
                    placeholder="ex: 2 ans"
                    value={newProduct.warranty}
                    onChange={(e) => setNewProduct({ ...newProduct, warranty: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Badge</label>
                  <select
                    value={newProduct.badge}
                    onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                  >
                    <option value="">Aucun</option>
                    <option value="Nouveau">Nouveau</option>
                    <option value="Promo">Promo</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Source de l'image</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAddImgSource("preset")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                        addImgSource === "preset" ? "bg-[#10748E] text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Prédéfinie
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddImgSource("upload")}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold ${
                        addImgSource === "upload" ? "bg-[#10748E] text-white" : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      Téléverser
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {addImgSource === "preset" ? (
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Image prédéfinie</label>
                    <select
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                    >
                      <option value="/images/products/clim-split-12000.jpg">Climatiseur Split</option>
                      <option value="/images/products/clim-console-18000.jpg">Climatiseur Console</option>
                      <option value="/images/products/vmc-double-flux.jpg">VMC Double Flux</option>
                      <option value="/images/products/chauffe-eau-solaire-300l.jpg">Chauffe-Eau Solaire</option>
                      <option value="/images/products/panneau-pv-550w.jpg">Panneau Solaire 550W</option>
                      <option value="/images/products/filtre-hepa-h14.jpg">Filtre HEPA H14</option>
                      <option value="/images/products/thermostat-wifi.jpg">Thermostat Connecté</option>
                      <option value="/images/products/extracteur-axe-150.jpg">Extracteur d'Air</option>
                    </select>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Téléverser une photo</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "new")}
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none font-montserrat text-sm"
                    />
                    {newProduct.image && newProduct.image.startsWith("data:") && (
                      <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                        <span className="font-bold text-green-600">✓ Image chargée</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block">Description *</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Saisissez une description courte et claire des caractéristiques clés..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-100 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-green-600 text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-green-700 transition-colors shadow-md shadow-green-600/10"
                >
                  Enregistrer le produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
