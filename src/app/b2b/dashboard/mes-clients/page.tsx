"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  UserCheck, 
  Search, 
  MapPin, 
  Building2, 
  Phone, 
  Mail, 
  X, 
  Plus, 
  ChevronRight,
  ClipboardList,
  FolderLock,
  Percent,
  Check
} from "lucide-react";
import { PRODUCTS } from "@/lib/products";

// Mock clients fallback
const FALLBACK_CLIENTS = [
  { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", ice: "001594823000084", status: "Actif", resp: "Youssef", history: ["Création du dossier B2B", "Validation de l'ICE", "Demande d'étude VRV reçue"] },
  { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Casablanca", ice: "000847291000072", status: "Actif", resp: "Youssef", history: ["Première visite technique effectuée", "Prise de contact avec la direction"] },
];

const CATEGORIES = [
  "Systèmes de climatisation",
  "Équipements de ventilation",
  "Produits solaires",
  "Filtres & accessoires"
];

export default function CommercialClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [clients, setClients] = useState<typeof FALLBACK_CLIENTS>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeClient, setActiveClient] = useState<typeof FALLBACK_CLIENTS[0] | null>(null);
  const [newLogText, setNewLogText] = useState("");

  // Tab State in Detail Modal
  const [activeTab, setActiveTab] = useState<"history" | "catalog">("history");

  // Catalog configuration state for active client
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [allowedProductIds, setAllowedProductIds] = useState<number[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);

  // Add Client Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState("");
  const [newClient, setNewClient] = useState({
    fullname: "",
    email: "",
    entreprise: "",
    phone: "",
    ice: "",
    city: ""
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = () => {
    const saved = localStorage.getItem("afe_clients");
    if (saved) {
      setClients(JSON.parse(saved));
    } else {
      localStorage.setItem("afe_clients", JSON.stringify(FALLBACK_CLIENTS));
      setClients(FALLBACK_CLIENTS);
    }
  };

  useEffect(() => {
    if (activeClient) {
      // Load catalog config for this client
      const savedCatalogs = localStorage.getItem("afe_client_catalogs");
      if (savedCatalogs) {
        const catalogs = JSON.parse(savedCatalogs);
        if (catalogs[activeClient.id]) {
          setAllowedProductIds(catalogs[activeClient.id].products || []);
          setDiscountPercentage(catalogs[activeClient.id].discount || 0);
          return;
        }
      }
      setAllowedProductIds([]);
      setDiscountPercentage(0);
    }
  }, [activeClient]);

  useGSAP(() => {
    if (clients.length > 0) {
      gsap.fromTo(".com-cli-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [clients]);

  // Filter clients to show only those assigned to Youssef
  const myClients = clients.filter(c => c.resp === "Youssef");

  const filteredClients = myClients.filter(c => 
    c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.contact.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLog = (e: React.FormEvent, id: string) => {
    e.preventDefault();
    if (!newLogText.trim()) return;

    const updated = clients.map(c => {
      if (c.id === id) {
        return { ...c, history: [newLogText.trim(), ...(c.history || [])] };
      }
      return c;
    });

    setClients(updated);
    localStorage.setItem("afe_clients", JSON.stringify(updated));

    if (activeClient && activeClient.id === id) {
      setActiveClient(prev => prev ? { ...prev, history: [newLogText.trim(), ...(prev.history || [])] } : null);
    }

    setNewLogText("");
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    // Validation
    const exists = clients.some(c => 
      c.email.toLowerCase() === newClient.email.toLowerCase() || 
      (newClient.ice !== "-" && c.ice === newClient.ice)
    );

    if (exists) {
      setAddError("Ce client existe déjà et est déjà inscrit dans le système.");
      return;
    }

    const newId = `CLI-${Math.floor(410 + Math.random() * 90)}`;
    const createdClient = {
      id: newId,
      company: newClient.entreprise,
      type: "B2B",
      contact: newClient.fullname,
      email: newClient.email,
      phone: newClient.phone,
      city: newClient.city,
      ice: newClient.ice || "-",
      status: "Actif",
      resp: "Youssef",
      addedBy: "Commercial (Youssef)",
      history: ["Client créé directement par le commercial Youssef."]
    };

    const updated = [createdClient, ...clients];
    setClients(updated);
    localStorage.setItem("afe_clients", JSON.stringify(updated));

    // Send Notification to Super Admin
    const savedNotifs = localStorage.getItem("afe_notifications");
    let notificationsList = [];
    if (savedNotifs) {
      notificationsList = JSON.parse(savedNotifs);
    }
    const adminNotif = {
      id: Date.now(),
      type: "Système",
      title: "Client ajouté par un commercial",
      desc: `Le commercial Youssef a créé et validé le client ${newClient.entreprise} (ICE: ${newClient.ice || "-"}).`,
      time: "Il y a quelques secondes",
      read: false,
      category: "clients",
      href: "/b2b/dashboard/clients",
      role: "super_admin"
    };
    notificationsList = [adminNotif, ...notificationsList];
    localStorage.setItem("afe_notifications", JSON.stringify(notificationsList));

    setShowAddModal(false);
    setNewClient({
      fullname: "",
      email: "",
      entreprise: "",
      phone: "",
      ice: "",
      city: ""
    });
  };

  // Toggle allowed product
  const handleToggleProduct = (productId: number) => {
    setAllowedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Toggle all products in currently selected category
  const categoryProducts = PRODUCTS.filter(p => p.category === selectedCategory);
  const allCategorySelected = categoryProducts.every(p => allowedProductIds.includes(p.id));

  const handleToggleAllCategory = () => {
    const categoryIds = categoryProducts.map(p => p.id);
    if (allCategorySelected) {
      setAllowedProductIds(prev => prev.filter(id => !categoryIds.includes(id)));
    } else {
      setAllowedProductIds(prev => {
        const newIds = [...prev];
        categoryIds.forEach(id => {
          if (!newIds.includes(id)) newIds.push(id);
        });
        return newIds;
      });
    }
  };

  // Save catalog configuration
  const handleSaveCatalogConfig = () => {
    if (!activeClient) return;

    const savedCatalogs = localStorage.getItem("afe_client_catalogs");
    const catalogs = savedCatalogs ? JSON.parse(savedCatalogs) : {};

    catalogs[activeClient.id] = {
      products: allowedProductIds,
      discount: discountPercentage
    };

    localStorage.setItem("afe_client_catalogs", JSON.stringify(catalogs));

    // Send Notification to Client B2B
    const savedNotifs = localStorage.getItem("afe_notifications");
    let notificationsList = [];
    if (savedNotifs) {
      notificationsList = JSON.parse(savedNotifs);
    }
    const clientNotif = {
      id: Date.now(),
      type: "Tarif",
      title: "Catalogue personnalisé mis à jour",
      desc: `Votre commercial a configuré votre catalogue pro avec une remise globale de ${discountPercentage}%.`,
      time: "Il y a quelques secondes",
      read: false,
      category: "devis",
      href: "/b2b/dashboard/catalogue",
      role: "client_b2b" // visible to client
    };
    notificationsList = [clientNotif, ...notificationsList];
    localStorage.setItem("afe_notifications", JSON.stringify(notificationsList));

    alert("Configuration du catalogue et du tarif enregistrée avec succès !");
  };

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="com-cli-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Mes Clients & Comptes</h1>
          <p className="font-montserrat text-gray-500">Suivez et pilotez votre portefeuille de clients professionnels.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#10748E] text-white font-nevan text-xs tracking-wider uppercase rounded-xl hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
        >
          <Plus size={16} /> Ajouter Client
        </button>
      </div>

      {/* KPI Info */}
      <div className="com-cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-fit">
        <div className="w-12 h-12 bg-[#10748E]/10 rounded-xl flex items-center justify-center text-[#10748E]">
          <UserCheck size={24} />
        </div>
        <div>
          <div className="font-montserrat text-xs text-gray-500 font-bold uppercase">Clients Portefeuille</div>
          <div className="font-nevan text-2xl text-gray-900 mt-1">{myClients.length}</div>
        </div>
      </div>

      {/* Search Input */}
      <div className="com-cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher un client..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>
      </div>

      {/* Client List */}
      <div className="com-cli-item grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredClients.length > 0 ? (
          filteredClients.map((c) => (
            <div 
              key={c.id} 
              onClick={() => {
                setActiveClient(c);
                setActiveTab("history");
              }}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#10748E]/30 transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="font-montserrat text-xs text-gray-400 font-bold uppercase">{c.id}</span>
                    <h3 className="font-montserrat font-bold text-gray-900 text-lg leading-tight mt-0.5">{c.company}</h3>
                  </div>
                  <ChevronRight size={20} className="text-gray-400 group-hover:text-[#10748E] transition-colors" />
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 font-montserrat">
                  <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400 shrink-0" /> {c.city}</div>
                  <div className="flex items-center gap-2"><Building2 size={16} className="text-gray-400 shrink-0" /> ICE: {c.ice}</div>
                  <div className="flex items-center gap-2"><Phone size={16} className="text-gray-400 shrink-0" /> {c.phone}</div>
                </div>
              </div>

              <div className="border-t border-gray-100 mt-6 pt-4 flex items-center justify-between">
                <span className="font-montserrat text-xs text-gray-400 font-medium">Contact: <strong className="text-gray-700">{c.contact}</strong></span>
                <span className="font-nevan text-[10px] text-[#10748E] uppercase tracking-wider bg-[#10748E]/10 px-2 py-0.5 rounded-full font-bold">Activité récente</span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500 py-12 font-montserrat">
            Aucun client ne correspond à votre recherche.
          </div>
        )}
      </div>

      {/* Client History Log Centered Modal */}
      {activeClient && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setActiveClient(null)} />
          
          {/* Content */}
          <div className="relative w-full max-w-2xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <span className="font-nevan text-xs text-[#10748E]">{activeClient.id}</span>
                <h2 className="font-nevan text-xl text-gray-900 uppercase mt-0.5">{activeClient.company}</h2>
              </div>
              <button onClick={() => setActiveClient(null)} className="p-2 text-gray-400 hover:text-gray-950 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>
            
            {/* Tab selection */}
            <div className="flex border-b border-gray-100 px-6 bg-gray-50/50">
              <button
                onClick={() => setActiveTab("history")}
                className={`py-3 px-4 font-nevan text-xs tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === "history" 
                    ? "border-[#10748E] text-[#10748E]" 
                    : "border-transparent text-gray-400 hover:text-gray-955"
                }`}
              >
                Relation & Historique
              </button>
              <button
                onClick={() => setActiveTab("catalog")}
                className={`py-3 px-4 font-nevan text-xs tracking-wider uppercase border-b-2 transition-all ${
                  activeTab === "catalog" 
                    ? "border-[#10748E] text-[#10748E]" 
                    : "border-transparent text-gray-400 hover:text-gray-955"
                }`}
              >
                Catalogue & Tarifs Pro
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {activeTab === "history" ? (
                <>
                  {/* Detailed coordinates */}
                  <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h3 className="font-nevan text-xs text-gray-400 uppercase tracking-widest font-bold">Informations de contact</h3>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Contact</span>
                        <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5">{activeClient.contact}</span>
                      </div>
                      <div>
                        <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">ICE marocain</span>
                        <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5">{activeClient.ice}</span>
                      </div>
                      <div>
                        <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">E-mail</span>
                        <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5 flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {activeClient.email}</span>
                      </div>
                      <div>
                        <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Téléphone</span>
                        <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-0.5 flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {activeClient.phone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Logs / History Timeline */}
                  <div>
                    <h3 className="font-nevan text-sm text-gray-955 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <ClipboardList size={16} className="text-[#10748E]" /> Historique de la relation
                    </h3>

                    <div className="relative border-l border-gray-200 ml-3 pl-6 space-y-6 mb-6">
                      {(activeClient.history || []).map((log, idx) => (
                        <div key={idx} className="relative">
                          {/* Node Bullet */}
                          <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-[#10748E] border border-white" />
                          
                          <div>
                            <p className="font-montserrat text-sm text-gray-800 leading-relaxed">{log}</p>
                            <span className="font-montserrat text-[10px] text-gray-400 block mt-0.5">Youssef • Historique</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <form onSubmit={(e) => handleAddLog(e, activeClient.id)} className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Consigner une nouvelle interaction..." 
                        value={newLogText}
                        onChange={(e) => setNewLogText(e.target.value)}
                        className="flex-grow px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                      />
                      <button type="submit" className="px-4 py-2 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase hover:bg-[#0c5a6e] transition-colors shrink-0">
                        Enregistrer
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                /* Catalogue configuration panel */
                <div className="space-y-6">
                  {/* Category choice */}
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-2">1. Sélectionner la catégorie</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Products checklist */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="font-montserrat text-xs font-bold text-gray-700 uppercase">2. Produits autorisés f had la catégorie</label>
                      <button 
                        type="button" 
                        onClick={handleToggleAllCategory}
                        className="text-xs text-[#10748E] font-semibold hover:underline"
                      >
                        {allCategorySelected ? "Tout décocher" : "Tout cocher"}
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 bg-gray-50 max-h-60 overflow-y-auto">
                      {categoryProducts.map(product => {
                        const isChecked = allowedProductIds.includes(product.id);
                        return (
                          <div 
                            key={product.id}
                            onClick={() => handleToggleProduct(product.id)}
                            className="flex items-center gap-3 p-3 hover:bg-white transition-colors cursor-pointer"
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 text-[#10748E] focus:ring-[#10748E] border-gray-300 rounded"
                            />
                            <div className="flex-1">
                              <div className="font-montserrat text-sm font-bold text-gray-900 leading-tight">{product.title}</div>
                              <div className="font-montserrat text-xs text-gray-500">Réf: {product.reference} • {product.price} MAD</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Discount Percentage input */}
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-2">3. Pourcentage de remise globale (%)</label>
                    <div className="relative max-w-[150px]">
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={discountPercentage}
                        onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm font-bold text-gray-900"
                      />
                      <Percent size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  {/* Save button */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleSaveCatalogConfig}
                      className="w-full py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Check size={16} /> Enregistrer la configuration du catalogue
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button 
                onClick={() => {
                  setActiveClient(null);
                  loadClients(); // Reload to refresh history list
                }}
                className="w-full py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer la fiche
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
              <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide">Ajouter un nouveau client</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-colors">
                <X size={18} />
              </button>
            </div>

            {addError && (
              <div className="bg-red-50 text-[#AF1818] p-3 rounded-xl border border-red-100 font-montserrat text-xs mb-4 flex items-center gap-2">
                <span>⚠️ {addError}</span>
              </div>
            )}

            <form onSubmit={handleAddClientSubmit} className="space-y-4 overflow-y-auto pr-1 flex-1">
              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Nom complet (Contact principal)</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Mohamed Alami"
                  value={newClient.fullname}
                  onChange={(e) => setNewClient(prev => ({ ...prev, fullname: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Adresse Email</label>
                <input 
                  type="email"
                  required
                  placeholder="ex: m.alami@entreprise.ma"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Nom de l'entreprise</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Société Alami Frères B2B"
                  value={newClient.entreprise}
                  onChange={(e) => setNewClient(prev => ({ ...prev, entreprise: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Numéro de téléphone</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: +212 661-000000"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">ICE (Identifiant Commun de l'Entreprise)</label>
                <input 
                  type="text"
                  placeholder="ex: 001594823000084"
                  value={newClient.ice}
                  onChange={(e) => setNewClient(prev => ({ ...prev, ice: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1">Ville</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Marrakech"
                  value={newClient.city}
                  onChange={(e) => setNewClient(prev => ({ ...prev, city: e.target.value }))}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                />
              </div>

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
                  className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
                >
                  Ajouter Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
