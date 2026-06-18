"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { gsap } from "@/lib/gsap";
import { PRODUCTS } from "@/lib/products";
import { Quote, getQuotes } from "@/lib/quotes";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  ClipboardList,
  Percent,
  Check,
  Plus,
  FileText,
  MessageSquare,
  TrendingUp,
  Send,
  FolderOpen,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

interface Client {
  id: string;
  company: string;
  type: string;
  contact: string;
  email: string;
  phone: string;
  city: string;
  ice: string;
  status: string;
  resp: string;
  addedBy?: string;
  history?: string[];
}

const CATEGORIES = [
  "Systèmes de climatisation",
  "Équipements de ventilation",
  "Produits solaires",
  "Filtres & accessoires",
];

function formatCurrency(amount: number): string {
  return amount.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getClientById(id: string): Client | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("afe_clients");
  if (!saved) return null;
  try {
    const clients = JSON.parse(saved);
    return clients.find((c: Client) => c.id === id) || null;
  } catch {
    return null;
  }
}

function getClientCatalog(clientId: string): { products: number[]; discount: number } {
  if (typeof window === "undefined") return { products: [], discount: 0 };
  const saved = localStorage.getItem("afe_client_catalogs");
  if (!saved) return { products: [], discount: 0 };
  try {
    const catalogs = JSON.parse(saved);
    return catalogs[clientId] || { products: [], discount: 0 };
  } catch {
    return { products: [], discount: 0 };
  }
}

function saveClientCatalog(clientId: string, products: number[], discount: number): void {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("afe_client_catalogs");
  const catalogs = saved ? JSON.parse(saved) : {};
  catalogs[clientId] = { products, discount };
  localStorage.setItem("afe_client_catalogs", JSON.stringify(catalogs));
}

function updateClientHistory(clientId: string, event: string): void {
  if (typeof window === "undefined") return;
  const saved = localStorage.getItem("afe_clients");
  if (!saved) return;
  try {
    const clients = JSON.parse(saved);
    const idx = clients.findIndex((c: Client) => c.id === clientId);
    if (idx >= 0) {
      const timestamp = new Date().toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      clients[idx].history = [`[${timestamp}] ${event}`, ...(clients[idx].history || [])];
      localStorage.setItem("afe_clients", JSON.stringify(clients));
    }
  } catch {
    // ignore
  }
}

function createNotification(title: string, desc: string, role: string, category: string, href?: string): void {
  if (typeof window === "undefined") return;
  const savedNotifs = localStorage.getItem("afe_notifications");
  const allNotifs: any[] = savedNotifs ? JSON.parse(savedNotifs) : [];
  allNotifs.unshift({
    id: Date.now() + Math.random(),
    type: "Tarif",
    title,
    desc,
    time: "À l'instant",
    read: false,
    category,
    href,
    role,
  });
  localStorage.setItem("afe_notifications", JSON.stringify(allNotifs));
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = typeof params.id === "string" ? params.id : "";

  const containerRef = useRef<HTMLDivElement>(null);
  const [client, setClient] = useState<Client | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "history" | "catalog" | "quotes" | "documents">("overview");
  const [newLogText, setNewLogText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [allowedProductIds, setAllowedProductIds] = useState<number[]>([]);
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [clientQuotes, setClientQuotes] = useState<Quote[]>([]);
  const [documents, setDocuments] = useState<{ id: string; name: string; date: string; size: string }[]>([]);

  useEffect(() => {
    if (!client || !containerRef.current) return;
    const sections = containerRef.current.querySelectorAll(".cli-section");
    if (sections.length === 0) return;
    gsap.fromTo(
      sections,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, [client]);

  useEffect(() => {
    const c = getClientById(clientId);
    if (!c) {
      router.push("/b2b/dashboard/mes-clients");
      return;
    }
    setClient(c);

    const catalog = getClientCatalog(clientId);
    setAllowedProductIds(catalog.products);
    setDiscountPercentage(catalog.discount);

    const quotes = getQuotes().filter((q) => q.client === c.company);
    setClientQuotes(quotes);

    // Mock documents
    setDocuments([
      { id: "doc-1", name: "Fiche technique VRV.pdf", date: "15/06/2026", size: "2.4 MB" },
      { id: "doc-2", name: "Contrat de maintenance.pdf", date: "10/06/2026", size: "1.1 MB" },
    ]);
  }, [clientId, router]);

  const categoryProducts = useMemo(
    () => PRODUCTS.filter((p) => p.category === selectedCategory),
    [selectedCategory]
  );
  const allCategorySelected = categoryProducts.every((p) => allowedProductIds.includes(p.id));

  const stats = useMemo(() => {
    const totalQuotes = clientQuotes.length;
    const sentQuotes = clientQuotes.filter((q) => q.status === "Envoyé").length;
    const totalAmount = clientQuotes.reduce((sum, q) => sum + q.total, 0);
    return { totalQuotes, sentQuotes, totalAmount };
  }, [clientQuotes]);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogText.trim() || !client) return;
    updateClientHistory(client.id, newLogText.trim());
    setClient((prev) => (prev ? { ...prev, history: [`[${new Date().toLocaleString("fr-FR")}] ${newLogText.trim()}`, ...(prev.history || [])] } : null));
    setNewLogText("");
  };

  const handleToggleProduct = (productId: number) => {
    setAllowedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleToggleAllCategory = () => {
    const categoryIds = categoryProducts.map((p) => p.id);
    if (allCategorySelected) {
      setAllowedProductIds((prev) => prev.filter((id) => !categoryIds.includes(id)));
    } else {
      setAllowedProductIds((prev) => Array.from(new Set([...prev, ...categoryIds])));
    }
  };

  const handleSaveCatalogConfig = () => {
    if (!client) return;
    saveClientCatalog(client.id, allowedProductIds, discountPercentage);
    updateClientHistory(client.id, `Catalogue personnalisé mis à jour (remise ${discountPercentage}%)`);
    createNotification(
      "Catalogue personnalisé mis à jour",
      `Votre commercial a configuré votre catalogue pro avec une remise globale de ${discountPercentage}%.`,
      "client_b2b",
      "devis",
      "/b2b/dashboard/catalogue"
    );
    alert("Configuration du catalogue et du tarif enregistrée avec succès !");
  };

  const handleCreateQuote = () => {
    if (!client) return;
    router.push(`/b2b/dashboard/devis/client-${client.id}`);
  };

  const handleSendMessage = () => {
    if (!client) return;
    router.push("/b2b/dashboard/messagerie");
  };

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="font-montserrat text-gray-500">Chargement du client...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Navigation */}
      <div className="cli-section bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => router.push("/b2b/dashboard/mes-clients")}
            className="flex items-center gap-2 text-gray-600 hover:text-[#10748E] font-montserrat text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <span className="font-nevan text-xs text-[#10748E] uppercase tracking-wider">{client.id}</span>
            <h1 className="font-nevan text-lg sm:text-xl text-gray-900 uppercase tracking-wide hidden sm:block">{client.company}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
        {/* Header Card */}
        <div className="cli-section bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#10748E] text-white font-nevan text-2xl flex items-center justify-center shrink-0 uppercase">
                {client.company.charAt(0)}
              </div>
              <div>
                <span className="font-montserrat text-xs text-gray-400 font-bold uppercase tracking-wider block">{client.type}</span>
                <h2 className="font-nevan text-2xl md:text-3xl text-gray-900 uppercase tracking-wide">{client.company}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold font-montserrat ${client.status === "Actif" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {client.status}
                  </span>
                  <span className="font-montserrat text-sm text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> {client.city}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleSendMessage}
                className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <MessageSquare size={18} />
                Message
              </button>
              <button
                onClick={handleCreateQuote}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/20"
              >
                <FileText size={18} />
                Créer un devis
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="cli-section grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#10748E]/10 flex items-center justify-center text-[#10748E]">
              <FileText size={20} />
            </div>
            <div>
              <span className="font-montserrat text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Devis</span>
              <span className="font-nevan text-xl text-gray-900">{stats.totalQuotes}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
              <Send size={20} />
            </div>
            <div>
              <span className="font-montserrat text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Devis envoyés</span>
              <span className="font-nevan text-xl text-gray-900">{stats.sentQuotes}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#10748E]/10 flex items-center justify-center text-[#10748E]">
              <TrendingUp size={20} />
            </div>
            <div>
              <span className="font-montserrat text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Montant total</span>
              <span className="font-nevan text-xl text-gray-900">{formatCurrency(stats.totalAmount)} MAD</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="cli-section bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto scrollbar-hide">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: Building2 },
              { id: "history", label: "Relation & Historique", icon: ClipboardList },
              { id: "catalog", label: "Catalogue & Tarifs Pro", icon: Percent },
              { id: "quotes", label: "Devis", icon: FileText },
              { id: "documents", label: "Documents", icon: FolderOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-4 font-nevan text-xs tracking-wider uppercase border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-[#10748E] text-[#10748E] bg-[#10748E]/5"
                    : "border-transparent text-gray-400 hover:text-gray-700"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <h3 className="font-nevan text-sm text-gray-900 uppercase tracking-wider mb-4">Informations de contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Contact</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{client.contact}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">ICE</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{client.ice}</span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Email</span>
                    <a href={`mailto:${client.email}`} className="font-montserrat text-sm font-semibold text-[#10748E] block mt-1 flex items-center gap-1.5">
                      <Mail size={14} /> {client.email}
                    </a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Téléphone</span>
                    <a href={`tel:${client.phone}`} className="font-montserrat text-sm font-semibold text-gray-900 block mt-1 flex items-center gap-1.5">
                      <Phone size={14} /> {client.phone}
                    </a>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Ville</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1 flex items-center gap-1.5">
                      <MapPin size={14} /> {client.city}
                    </span>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="font-montserrat text-[10px] text-gray-400 uppercase font-bold block">Responsable</span>
                    <span className="font-montserrat text-sm font-semibold text-gray-900 block mt-1">{client.resp}</span>
                  </div>
                </div>

                {clientQuotes.length > 0 && (
                  <div className="mt-8">
                    <h3 className="font-nevan text-sm text-gray-900 uppercase tracking-wider mb-4">Dernier devis</h3>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                      <div>
                        <span className="font-nevan text-sm text-[#10748E]">{clientQuotes[0].id}</span>
                        <p className="font-montserrat text-xs text-gray-500 mt-0.5">{clientQuotes[0].projectType}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-nevan text-lg text-gray-900">{formatCurrency(clientQuotes[0].total)} MAD</span>
                        <span className={`ml-3 px-2 py-0.5 rounded-full text-[10px] font-bold font-montserrat ${clientQuotes[0].status === "Envoyé" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                          {clientQuotes[0].status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="relative border-l border-gray-200 ml-3 pl-6 space-y-6">
                  {(client.history || []).length === 0 && (
                    <p className="font-montserrat text-sm text-gray-400">Aucun événement enregistré.</p>
                  )}
                  {(client.history || []).map((log, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[29px] top-1 w-2.5 h-2.5 rounded-full bg-[#10748E] border border-white" />
                      <p className="font-montserrat text-sm text-gray-800 leading-relaxed">{log}</p>
                      <span className="font-montserrat text-[10px] text-gray-400 block mt-0.5">{client.resp} • Historique</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAddLog} className="flex gap-2 pt-4 border-t border-gray-100">
                  <input
                    type="text"
                    placeholder="Consigner une nouvelle interaction..."
                    value={newLogText}
                    onChange={(e) => setNewLogText(e.target.value)}
                    className="flex-grow px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  />
                  <button type="submit" className="px-5 py-2.5 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase hover:bg-[#0c5a6e] transition-colors shrink-0">
                    Enregistrer
                  </button>
                </form>
              </div>
            )}

            {/* Catalog Tab */}
            {activeTab === "catalog" && (
              <div className="space-y-6 max-w-2xl">
                <div>
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-2">1. Sélectionner la catégorie</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase">2. Produits autorisés</label>
                    <button
                      type="button"
                      onClick={handleToggleAllCategory}
                      className="text-xs text-[#10748E] font-semibold hover:underline"
                    >
                      {allCategorySelected ? "Tout décocher" : "Tout cocher"}
                    </button>
                  </div>
                  <div className="border border-gray-200 rounded-2xl overflow-hidden divide-y divide-gray-100 bg-gray-50 max-h-72 overflow-y-auto">
                    {categoryProducts.map((product) => {
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

                <div>
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-2">3. Pourcentage de remise globale (%)</label>
                  <div className="relative max-w-[150px]">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))}
                      className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] font-montserrat text-sm font-bold text-gray-900"
                    />
                    <Percent size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSaveCatalogConfig}
                  className="w-full py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Check size={16} /> Enregistrer la configuration du catalogue
                </button>
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-nevan text-sm text-gray-900 uppercase tracking-wider">Historique des devis</h3>
                  <button
                    onClick={handleCreateQuote}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors"
                  >
                    <Plus size={16} />
                    Nouveau devis
                  </button>
                </div>

                {clientQuotes.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                    <FileText size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="font-montserrat text-sm text-gray-500">Aucun devis n&apos;a encore été créé pour ce client.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    {clientQuotes.map((quote) => (
                      <div key={quote.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div>
                          <div className="font-nevan text-sm text-[#10748E]">{quote.id}</div>
                          <div className="font-montserrat text-xs text-gray-500">{quote.projectType} • {new Date(quote.createdAt).toLocaleDateString("fr-FR")}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-nevan text-lg text-gray-900">{formatCurrency(quote.total)} MAD</div>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-montserrat ${quote.status === "Envoyé" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                              {quote.status}
                            </span>
                          </div>
                          <button
                            onClick={() => router.push(`/b2b/dashboard/devis/${quote.requestId}`)}
                            className="p-2 text-gray-400 hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Voir le devis"
                          >
                            <ExternalLink size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Documents Tab */}
            {activeTab === "documents" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-nevan text-sm text-gray-900 uppercase tracking-wider">Documents du client</h3>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors cursor-pointer">
                    <Plus size={16} />
                    Ajouter un document
                    <input type="file" className="hidden" onChange={() => alert("Simulation : document ajouté.")} />
                  </label>
                </div>

                {documents.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-2xl border border-gray-100">
                    <FolderOpen size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="font-montserrat text-sm text-gray-500">Aucun document enregistré.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden bg-white">
                    {documents.map((doc) => (
                      <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <FolderOpen size={20} className="text-[#10748E]" />
                          <div>
                            <div className="font-montserrat text-sm font-semibold text-gray-900">{doc.name}</div>
                            <div className="font-montserrat text-xs text-gray-500">{doc.date} • {doc.size}</div>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors">
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
