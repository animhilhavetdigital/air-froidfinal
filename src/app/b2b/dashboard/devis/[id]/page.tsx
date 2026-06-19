"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PRODUCTS, Product } from "@/lib/products";
import { findRequestById, Request } from "@/lib/requests-data";
import { addClientHistoryEvent, findClientEmail } from "@/lib/client-history";
import {
  Quote,
  QuoteItem,
  QuoteLibraryItem,
  calculateQuoteTotals,
  createEmptyQuoteItem,
  deleteQuoteLibraryItem,
  generateQuoteId,
  getQuoteByRequestId,
  getQuoteLibraryItems,
  getSuggestedProducts,
  libraryItemToQuoteItem,
  productToQuoteItem,
  saveQuote,
  saveQuoteLibraryItem,
} from "@/lib/quotes";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Send,
  Printer,
  FileText,
  User,
  MapPin,
  Briefcase,
  ChevronDown,
  Search,
  X,
  CheckCircle2,
  Check,
} from "lucide-react";
import { useGSAP, gsap } from "@/lib/gsap";

function formatNumberInput(value: number): string {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getAuthorName(): string {
  if (typeof window === "undefined") return "Commercial";
  const role = localStorage.getItem("afe_mock_role");
  if (role === "super_admin") return "Mada Admin";
  if (role === "commercial") return "Youssef";
  return "Commercial";
}

function getAuthorLabel(): string {
  if (typeof window === "undefined") return "Commercial";
  const role = localStorage.getItem("afe_mock_role");
  if (role === "super_admin") return "Super Admin";
  if (role === "commercial") return "Commercial";
  return "Commercial";
}

function getClientByIdForQuote(clientId: string): { company: string; city: string; id: string } | null {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("afe_clients");
  if (!saved) return null;
  try {
    const clients = JSON.parse(saved);
    const client = clients.find((c: any) => c.id === clientId);
    return client ? { company: client.company, city: client.city, id: client.id } : null;
  } catch {
    return null;
  }
}

export default function QuoteEditorPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = typeof params.id === "string" ? params.id : "";

  const containerRef = useRef<HTMLDivElement>(null);
  const [request, setRequest] = useState<Request | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [productSearch, setProductSearch] = useState<Record<string, string>>({});
  const [showProductDropdown, setShowProductDropdown] = useState<string | null>(null);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showLibraryModal, setShowLibraryModal] = useState(false);
  const [libraryItems, setLibraryItems] = useState<QuoteLibraryItem[]>([]);
  const [selectedLibraryItems, setSelectedLibraryItems] = useState<Set<string>>(new Set());
  const [newLibraryItem, setNewLibraryItem] = useState({ title: "", reference: "", unitPrice: "", category: "" });
  const [libraryMessage, setLibraryMessage] = useState("");
  const [librarySearchTerm, setLibrarySearchTerm] = useState("");

  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [showFinalReview, setShowFinalReview] = useState(false);

  const isSuperAdmin = currentRole === "super_admin";
  const isClientB2B = currentRole === "client_b2b";
  const canEdit = !isClientB2B && quote?.status !== "Envoyé";

  useGSAP(() => {
    gsap.fromTo(
      ".quote-section",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  useEffect(() => {
    const role = localStorage.getItem("afe_mock_role");
    setCurrentRole(role);

    // Load products from localStorage or fallback
    if (typeof window !== "undefined") {
      const savedProducts = localStorage.getItem("afe_catalog_products");
      if (savedProducts) {
        setProductsList(JSON.parse(savedProducts));
      } else {
        setProductsList(PRODUCTS);
      }
    }

    const isClientDirect = requestId.startsWith("client-");

    if (isClientDirect) {
      const clientId = requestId.replace("client-", "");
      const client = getClientByIdForQuote(clientId);
      if (!client) {
        router.push("/b2b/dashboard/mes-clients");
        return;
      }
      setRequest({
        id: requestId,
        client: client.company,
        service: "Devis direct",
        status: "Nouveau",
        date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
        desc: "Devis créé directement depuis la fiche client.",
        location: client.city,
        budget: "",
      });

      const existing = getQuoteByRequestId(requestId);
      if (existing) {
        setQuote(existing);
        return;
      }

      if (role === "client_b2b") return;

      const newQuote: Quote = {
        id: generateQuoteId(),
        requestId,
        client: client.company,
        projectType: "Devis direct",
        location: client.city,
        budget: "",
        description: "Devis créé directement depuis la fiche client.",
        items: [],
        subtotal: 0,
        discountTotal: 0,
        globalDiscount: 0,
        vatRate: 20,
        vatAmount: 0,
        total: 0,
        status: "Brouillon",
        author: getAuthorName(),
        createdAt: new Date().toISOString(),
        notes: "",
      };
      setQuote(newQuote);
      return;
    }

    let req = null;
    if (typeof window !== "undefined") {
      const savedReqs = localStorage.getItem("afe_requests");
      if (savedReqs) {
        const reqs = JSON.parse(savedReqs);
        req = reqs.find((r: any) => r.id === requestId);
      }
    }
    if (!req) {
      req = findRequestById(requestId);
    }
    if (!req) {
      router.push("/b2b/dashboard/demandes");
      return;
    }
    setRequest(req);

    const existing = getQuoteByRequestId(requestId);
    if (existing) {
      setQuote(existing);
      return;
    }

    // Client B2B should not create an empty quote
    if (role === "client_b2b") {
      return;
    }

    const initialItems = getSuggestedProducts(req.service, 3).map(productToQuoteItem);
    const initialTotals = calculateQuoteTotals(initialItems, 20, 0);
    const newQuote: Quote = {
      id: generateQuoteId(),
      requestId: req.id,
      client: req.client,
      projectType: req.service,
      location: req.location,
      budget: req.budget,
      description: req.desc,
      items: initialItems,
      subtotal: initialTotals.subtotal,
      discountTotal: initialTotals.discountTotal,
      globalDiscount: 0,
      vatRate: 20,
      vatAmount: initialTotals.vatAmount,
      total: initialTotals.total,
      status: "Brouillon",
      author: getAuthorName(),
      createdAt: new Date().toISOString(),
      notes: "",
    };
    setQuote(newQuote);
  }, [requestId, router]);

  useEffect(() => {
    setLibraryItems(getQuoteLibraryItems());
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const term = (productSearch[showProductDropdown || ""] || "").toLowerCase();
      if (!term) return true;
      return (
        p.title.toLowerCase().includes(term) ||
        (p.reference && p.reference.toLowerCase().includes(term)) ||
        p.category.toLowerCase().includes(term)
      );
    });
  }, [productSearch, showProductDropdown, productsList]);

  const recalculateTotals = (items: QuoteItem[]): QuoteItem[] => {
    const updatedItems = items.map((item) => {
      const base = item.quantity * item.unitPrice;
      const discount = item.discount || 0;
      const total = Math.round(base * (1 - discount / 100) * 100) / 100;
      return { ...item, total };
    });
    return updatedItems;
  };

  const updateQuote = (updates: Partial<Quote>) => {
    setQuote((prev) => {
      if (!prev) return null;
      const next = { ...prev, ...updates };
      const recalculatedItems = recalculateTotals(next.items);
      const totals = calculateQuoteTotals(recalculatedItems, next.vatRate, next.globalDiscount ?? 0);
      return {
        ...next,
        items: recalculatedItems,
        subtotal: totals.subtotal,
        discountTotal: totals.discountTotal,
        vatAmount: totals.vatAmount,
        total: totals.total,
      };
    });
  };

  const handleAddItem = () => {
    if (!quote) return;
    updateQuote({ items: [...quote.items, createEmptyQuoteItem()] });
  };

  const handleRemoveItem = (itemId: string) => {
    if (!quote) return;
    updateQuote({ items: quote.items.filter((i) => i.id !== itemId) });
  };

  const handleItemChange = (itemId: string, field: keyof QuoteItem, value: string | number) => {
    if (!quote) return;
    const items = quote.items.map((item) => {
      if (item.id !== itemId) return item;
      if (field === "quantity" || field === "unitPrice" || field === "discount") {
        return { ...item, [field]: typeof value === "string" ? parseFloat(value) || 0 : value };
      }
      return { ...item, [field]: value };
    });
    updateQuote({ items });
  };

  const handleSelectProduct = (itemId: string, product: Product) => {
    if (!quote) return;
    const items = quote.items.map((item) => {
      if (item.id !== itemId) return item;
      const converted = productToQuoteItem(product);
      return { ...converted, id: item.id };
    });
    updateQuote({ items });
    setShowProductDropdown(null);
    setProductSearch((prev) => ({ ...prev, [itemId]: "" }));
  };

  const handleSaveDraft = () => {
    if (!quote) return;
    setIsSaving(true);
    setTimeout(() => {
      saveQuote({ ...quote, status: "Brouillon" });
      setIsSaving(false);
      setSaveMessage("Devis enregistré en brouillon.");
      setTimeout(() => setSaveMessage(""), 3000);
    }, 400);
  };

  const createNotification = (
    title: string,
    desc: string,
    role: string,
    category: string,
    href?: string
  ) => {
    if (typeof window === "undefined") return;
    const savedNotifs = localStorage.getItem("afe_notifications");
    const allNotifs: any[] = savedNotifs ? JSON.parse(savedNotifs) : [];
    allNotifs.unshift({
      id: Date.now() + Math.random(),
      type: "Devis",
      title,
      desc,
      time: "À l'instant",
      read: false,
      category,
      href,
      role,
    });
    localStorage.setItem("afe_notifications", JSON.stringify(allNotifs));
  };

  const handleSendQuote = () => {
    if (!quote) return;
    setShowFinalReview(true);
  };

  const handleConfirmSendQuote = () => {
    if (!quote) return;
    setIsSaving(true);
    setTimeout(() => {
      const sentQuote = { ...quote, status: "Envoyé" as const };
      saveQuote(sentQuote);
      setQuote(sentQuote);

      const clientEmail = findClientEmail(quote.client);
      const emailInfo = clientEmail ? ` (${clientEmail})` : "";
      
      const isB2c = request?.source === "B2C" || quote.client.toLowerCase().includes("particulier") || quote.requestId.startsWith("REQ-B2C");

      if (isB2c) {
        // Notification for B2C (simulate email & WhatsApp)
        // Add client history event
        addClientHistoryEvent(quote.client, `Devis ${quote.id} envoyé par E-mail & WhatsApp — ${formatNumberInput(quote.total)} MAD TTC`);
        
        setIsSaving(false);
        setShowFinalReview(false);
        setSaveMessage(`Devis envoyé au client par e-mail et sur WhatsApp !`);
        setTimeout(() => setSaveMessage(""), 4000);
      } else {
        // Notification client
        createNotification(
          `Nouveau devis disponible — ${quote.id}`,
          `Votre devis pour ${quote.projectType} est disponible. Montant TTC : ${formatNumberInput(quote.total)} MAD. Un email a été envoyé${emailInfo}.`,
          "client_b2b",
          "devis",
          `/b2b/dashboard/devis/${quote.requestId}`
        );

        // Notification Super Admin si c'est un Commercial qui envoie
        if (quote.author !== "Mada Admin") {
          createNotification(
            `Devis envoyé par ${quote.author}`,
            `${quote.author} a envoyé le devis ${quote.id} (${formatNumberInput(quote.total)} MAD TTC) au client ${quote.client}.`,
            "super_admin",
            "devis",
            `/b2b/dashboard/devis/${quote.requestId}`
          );
        }

        // Historique client
        addClientHistoryEvent(quote.client, `Devis ${quote.id} envoyé — ${formatNumberInput(quote.total)} MAD TTC`);

        setIsSaving(false);
        setShowFinalReview(false);
        setSaveMessage(`Devis envoyé. Email de confirmation envoyé${emailInfo}.`);
        setTimeout(() => setSaveMessage(""), 4000);
      }
    }, 400);
  };

  const handlePrint = () => {
    setShowPrintPreview(true);
    setTimeout(() => window.print(), 300);
  };

  const handleAddFromLibrary = () => {
    if (!quote) return;
    const selected = libraryItems.filter((item) => selectedLibraryItems.has(item.id));
    if (selected.length === 0) return;
    const newItems = selected.map(libraryItemToQuoteItem);
    updateQuote({ items: [...quote.items, ...newItems] });
    setSelectedLibraryItems(new Set());
    setShowLibraryModal(false);
  };

  const handleCreateLibraryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLibraryItem.title.trim() || !newLibraryItem.unitPrice.trim()) return;
    const item: QuoteLibraryItem = {
      id: crypto.randomUUID(),
      title: newLibraryItem.title.trim(),
      reference: newLibraryItem.reference.trim(),
      unitPrice: parseFloat(newLibraryItem.unitPrice.replace(/\s/g, "").replace(",", ".")) || 0,
      category: newLibraryItem.category.trim() || undefined,
      createdBy: getAuthorLabel(),
      createdAt: new Date().toISOString(),
    };
    saveQuoteLibraryItem(item);
    setLibraryItems(getQuoteLibraryItems());
    setNewLibraryItem({ title: "", reference: "", unitPrice: "", category: "" });
    setLibraryMessage("Article enregistré dans la bibliothèque.");
    setTimeout(() => setLibraryMessage(""), 3000);
  };

  const handleDeleteLibraryItem = (id: string) => {
    deleteQuoteLibraryItem(id);
    setLibraryItems(getQuoteLibraryItems());
  };

  const filteredLibraryItems = useMemo(() => {
    const term = librarySearchTerm.toLowerCase().trim();
    if (!term) return libraryItems;
    return libraryItems.filter(item =>
      item.title.toLowerCase().includes(term) ||
      (item.reference && item.reference.toLowerCase().includes(term)) ||
      (item.category && item.category.toLowerCase().includes(term))
    );
  }, [libraryItems, librarySearchTerm]);

  const toggleLibrarySelection = (id: string) => {
    setSelectedLibraryItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!request) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="font-montserrat text-gray-500">Chargement du devis...</div>
      </div>
    );
  }

  if (!quote && isClientB2B) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 p-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="font-nevan text-xl text-gray-900 uppercase mb-2">Aucun devis disponible</h2>
          <p className="font-montserrat text-sm text-gray-500">
            Votre demande {request.id} est en cours d&apos;étude. Vous serez notifié dès qu&apos;un devis sera disponible.
          </p>
          <button
            onClick={() => router.push("/b2b/dashboard/suivi")}
            className="mt-6 px-5 py-2.5 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors"
          >
            Voir le suivi
          </button>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="font-montserrat text-gray-500">Chargement du devis...</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50/50 pb-20 print:bg-white print:pb-0">
      {/* Top Navigation Bar */}
      <div className="quote-section bg-white border-b border-gray-100 sticky top-0 z-30 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (requestId.startsWith("client-")) {
                const clientId = requestId.replace("client-", "");
                router.push(`/b2b/dashboard/mes-clients/${clientId}`);
              } else {
                router.back();
              }
            }}
            className="flex items-center gap-2 text-gray-600 hover:text-[#10748E] font-montserrat text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Retour
          </button>
          <div className="flex items-center gap-3">
            <span className="font-montserrat text-xs text-gray-400 uppercase tracking-wider hidden sm:inline">
              {getAuthorLabel()}
            </span>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <h1 className="font-nevan text-lg sm:text-xl text-gray-900 uppercase tracking-wide">
              {quote.status === "Envoyé" || isClientB2B ? "Devis" : "Rédiger Devis"}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-6">
        {/* Header Info */}
        <div className="quote-section bg-white rounded-2xl border border-gray-100 shadow-sm p-6 print:shadow-none print:border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div>
              <span className="font-montserrat text-xs text-[#10748E] font-bold uppercase tracking-wider block mb-1">
                {quote.id}
              </span>
              <h2 className="font-nevan text-2xl md:text-3xl text-gray-900 uppercase tracking-wide">
                Devis — {request.client}
              </h2>
              <p className="font-montserrat text-sm text-gray-500 mt-2 max-w-xl">
                {request.desc}
              </p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className="font-montserrat text-sm text-gray-500">
                Date : {new Date(quote.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-montserrat ${
                  quote.status === "Envoyé"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {quote.status}
              </span>
            </div>
          </div>
        </div>

        {/* Client & Project Info */}
        <div className="quote-section grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 print:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-[#10748E]/10 flex items-center justify-center text-[#10748E] shrink-0">
              <User size={20} />
            </div>
            <div>
              <span className="font-montserrat text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Client</span>
              <span className="font-montserrat text-sm font-semibold text-gray-900">{request.client}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 print:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-[#10748E]/10 flex items-center justify-center text-[#10748E] shrink-0">
              <Briefcase size={20} />
            </div>
            <div>
              <span className="font-montserrat text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Projet</span>
              <span className="font-montserrat text-sm font-semibold text-gray-900">{request.service}</span>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4 print:shadow-none">
            <div className="w-10 h-10 rounded-xl bg-[#10748E]/10 flex items-center justify-center text-[#10748E] shrink-0">
              <MapPin size={20} />
            </div>
            <div>
              <span className="font-montserrat text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Localisation</span>
              <span className="font-montserrat text-sm font-semibold text-gray-900">{request.location}</span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="quote-section bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden print:shadow-none">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide flex items-center gap-2">
              <FileText size={20} className="text-[#10748E]" />
              Lignes de devis
            </h3>
            {canEdit && (
              <div className="flex flex-wrap items-center gap-2 print:hidden">
                <button
                  onClick={() => setShowLibraryModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#10748E] text-[#10748E] rounded-xl font-nevan text-xs uppercase tracking-wider hover:bg-[#10748E]/5 transition-colors"
                >
                  <FileText size={16} />
                  Bibliothèque
                </button>
                <button
                  onClick={handleAddItem}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors"
                >
                  <Plus size={16} />
                  Ajouter une ligne
                </button>
              </div>
            )}
          </div>

          <div className="overflow-x-auto min-h-[380px]">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 font-montserrat text-xs font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 w-[40%]">Produit / Service</th>
                  <th className="px-6 py-4">Référence</th>
                  <th className="px-6 py-4 text-right">Qté</th>
                  <th className="px-6 py-4 text-right">P.U. HT</th>
                  <th className="px-6 py-4 text-right">Remise %</th>
                  <th className="px-6 py-4 text-right">Total HT</th>
                  <th className="px-6 py-4 w-16 print:hidden" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-montserrat text-sm">
                {quote.items.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      Aucune ligne. Cliquez sur "Ajouter une ligne" pour commencer.
                    </td>
                  </tr>
                )}
                {quote.items.map((item) => (
                  <tr key={item.id} className="group">
                    <td className="px-6 py-4 align-top">
                      <div className="relative">
                        <div className="flex items-center gap-2">
                          <Search size={14} className="text-gray-400 print:hidden" />
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleItemChange(item.id, "title", e.target.value)}
                            placeholder="Nom du produit ou service"
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:border-[#10748E] focus:outline-none font-montserrat text-sm text-gray-900 print:bg-transparent print:border-none print:p-0"
                            readOnly={!canEdit}
                          />
                          {canEdit && (
                            <button
                              onClick={() => setShowProductDropdown(showProductDropdown === item.id ? null : item.id)}
                              className="print:hidden p-1.5 text-gray-400 hover:text-[#10748E] hover:bg-blue-50 rounded-lg transition-colors"
                              title="Choisir dans le catalogue"
                            >
                              <ChevronDown size={16} />
                            </button>
                          )}
                        </div>
                        {showProductDropdown === item.id && canEdit && (
                          <div className="absolute z-20 top-full left-0 mt-2 w-full min-w-[320px] bg-white rounded-xl border border-gray-100 shadow-xl p-3 print:hidden">
                            <div className="relative mb-2">
                              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input
                                autoFocus
                                type="text"
                                placeholder="Rechercher un produit..."
                                value={productSearch[item.id] || ""}
                                onChange={(e) => setProductSearch((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#10748E]"
                              />
                            </div>
                            <div className="max-h-60 overflow-y-auto space-y-1">
                              {filteredProducts.length === 0 && (
                                <div className="text-xs text-gray-400 py-2 px-1">Aucun produit trouvé.</div>
                              )}
                              {filteredProducts.map((product) => (
                                <button
                                  key={product.id}
                                  onClick={() => handleSelectProduct(item.id, product)}
                                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                  <div className="font-montserrat text-sm font-semibold text-gray-900">{product.title}</div>
                                  <div className="font-montserrat text-[10px] text-gray-400">
                                    {product.reference} — {product.price} MAD
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <input
                        type="text"
                        value={item.reference}
                        onChange={(e) => handleItemChange(item.id, "reference", e.target.value)}
                        placeholder="Réf."
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:border-[#10748E] focus:outline-none font-montserrat text-sm text-gray-600 print:bg-transparent print:border-none print:p-0"
                        readOnly={!canEdit}
                      />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, "quantity", e.target.value)}
                        className="w-20 text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#10748E] font-montserrat text-sm print:bg-transparent print:border-none print:p-0"
                        readOnly={!canEdit}
                      />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(item.id, "unitPrice", e.target.value)}
                        className="w-28 text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#10748E] font-montserrat text-sm print:bg-transparent print:border-none print:p-0"
                        readOnly={!canEdit}
                      />
                    </td>
                    <td className="px-6 py-4 align-top">
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.01}
                        value={item.discount || 0}
                        onChange={(e) => handleItemChange(item.id, "discount", e.target.value)}
                        className="w-24 text-right bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:border-[#10748E] font-montserrat text-sm print:bg-transparent print:border-none print:p-0"
                        readOnly={!canEdit}
                      />
                    </td>
                    <td className="px-6 py-4 align-top text-right font-nevan text-sm text-gray-900">
                      {formatNumberInput(item.total)}
                    </td>
                    <td className="px-6 py-4 align-top print:hidden">
                      {canEdit && (
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-gray-400 hover:text-[#AF1818] hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="bg-gray-50/50 border-t border-gray-100 p-6 flex flex-col items-end gap-3">
            <div className="flex items-center justify-between w-full max-w-sm">
              <span className="font-montserrat text-sm text-gray-500">Sous-total HT</span>
              <span className="font-nevan text-lg text-gray-900">{formatNumberInput(quote.subtotal + quote.discountTotal)} MAD</span>
            </div>
            {quote.discountTotal > 0 && (
              <div className="flex items-center justify-between w-full max-w-sm">
                <span className="font-montserrat text-sm text-red-500">Remise totale</span>
                <span className="font-nevan text-lg text-red-500">-{formatNumberInput(quote.discountTotal)} MAD</span>
              </div>
            )}
            <div className="flex items-center justify-between w-full max-w-sm">
              <span className="font-montserrat text-sm text-gray-900 font-semibold">Total HT</span>
              <span className="font-nevan text-lg text-gray-900">{formatNumberInput(quote.subtotal)} MAD</span>
            </div>
            <div className="flex items-center justify-between w-full max-w-sm gap-4">
              <div className="flex items-center gap-2">
                <span className="font-montserrat text-sm text-gray-500">Remise globale</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={quote.globalDiscount ?? 0}
                  onChange={(e) => updateQuote({ globalDiscount: parseFloat(e.target.value) || 0 })}
                  className="w-16 text-center bg-white border border-gray-200 rounded-lg px-2 py-1 font-montserrat text-sm focus:outline-none focus:border-[#10748E] print:bg-transparent print:border-none"
                  readOnly={!canEdit}
                />
                <span className="font-montserrat text-sm text-gray-500">%</span>
                {canEdit && (
                  <button
                    onClick={() => updateQuote({ globalDiscount: 0 })}
                    className="ml-2 px-2 py-1 text-[10px] font-montserrat font-bold text-[#10748E] bg-[#10748E]/10 rounded-lg hover:bg-[#10748E]/20 transition-colors"
                    title="Réinitialiser la remise globale"
                  >
                    0%
                  </button>
                )}
              </div>
              <span className="font-nevan text-lg text-red-500">
                -{formatNumberInput(Math.round(quote.subtotal * ((quote.globalDiscount ?? 0) / 100) * 100) / 100)} MAD
              </span>
            </div>
            <div className="flex items-center justify-between w-full max-w-sm">
              <span className="font-montserrat text-sm text-gray-900 font-semibold">Net HT</span>
              <span className="font-nevan text-lg text-gray-900">
                {formatNumberInput(Math.round(quote.subtotal * (1 - (quote.globalDiscount ?? 0) / 100) * 100) / 100)} MAD
              </span>
            </div>
            <div className="flex items-center justify-between w-full max-w-sm gap-4">
              <div className="flex items-center gap-2">
                <span className="font-montserrat text-sm text-gray-500">TVA</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={quote.vatRate}
                  onChange={(e) => updateQuote({ vatRate: parseFloat(e.target.value) || 0 })}
                  className="w-16 text-center bg-white border border-gray-200 rounded-lg px-2 py-1 font-montserrat text-sm focus:outline-none focus:border-[#10748E] print:bg-transparent print:border-none"
                  readOnly={!canEdit}
                />
                <span className="font-montserrat text-sm text-gray-500">%</span>
                {canEdit && (
                  <button
                    onClick={() => updateQuote({ vatRate: 20 })}
                    className="ml-2 px-2 py-1 text-[10px] font-montserrat font-bold text-[#10748E] bg-[#10748E]/10 rounded-lg hover:bg-[#10748E]/20 transition-colors"
                    title="Réinitialiser à 20%"
                  >
                    20%
                  </button>
                )}
              </div>
              <span className="font-nevan text-lg text-gray-900">{formatNumberInput(quote.vatAmount)} MAD</span>
            </div>
            <div className="flex items-center justify-between w-full max-w-sm border-t border-gray-200 pt-3">
              <span className="font-montserrat text-base font-bold text-gray-900">Total TTC</span>
              <span className="font-nevan text-2xl text-[#10748E]">{formatNumberInput(quote.total)} MAD</span>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="quote-section bg-white rounded-2xl border border-gray-100 shadow-sm p-6 print:shadow-none">
          <label className="font-nevan text-sm text-gray-900 uppercase tracking-wider block mb-3">
            Notes complémentaires
          </label>
          <textarea
            value={quote.notes || ""}
            onChange={(e) => updateQuote({ notes: e.target.value })}
            placeholder="Conditions particulières, délais de livraison, validité du devis..."
            rows={4}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-montserrat text-sm text-gray-700 focus:outline-none focus:border-[#10748E] resize-none print:bg-transparent print:border-none print:p-0"
            readOnly={!canEdit}
          />
        </div>

        {/* Actions */}
        <div className="quote-section flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          {saveMessage && (
            <div className="flex items-center gap-2 text-green-600 font-montserrat text-sm font-semibold bg-green-50 px-4 py-2 rounded-xl">
              <CheckCircle2 size={16} />
              {saveMessage}
            </div>
          )}
          {!saveMessage && <div />}
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Printer size={18} />
              Aperçu / Imprimer
            </button>
            {!isClientB2B && (
              <button
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-3 border border-[#10748E] text-[#10748E] rounded-xl font-montserrat text-sm font-bold hover:bg-[#10748E]/5 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                Enregistrer brouillon
              </button>
            )}
            <button
              onClick={isClientB2B ? handlePrint : handleSendQuote}
              disabled={isSaving || quote.items.length === 0}
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors disabled:opacity-50 shadow-md shadow-[#10748E]/20"
            >
              {isClientB2B ? <Printer size={18} /> : <Send size={18} />}
              {isClientB2B ? "Imprimer le devis" : quote.status === "Envoyé" ? "Devis déjà envoyé" : "Envoyer le devis"}
            </button>
          </div>
        </div>
      </div>

      {/* Library Modal */}
      {showLibraryModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 print:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowLibraryModal(false)} />
          <div className="relative w-full max-w-2xl bg-white rounded-3xl max-h-[90vh] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-nevan text-xl text-gray-950 uppercase">Bibliothèque d&apos;articles</h2>
                <p className="font-montserrat text-xs text-gray-400 mt-1">
                  {isSuperAdmin
                    ? "Gérez les articles disponibles pour tous les devis."
                    : "Choisissez les articles ajoutés par le Super Admin."}
                </p>
              </div>
              <button
                onClick={() => setShowLibraryModal(false)}
                className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {libraryMessage && (
                <div className="flex items-center gap-2 text-green-600 font-montserrat text-sm font-semibold bg-green-50 px-4 py-2 rounded-xl">
                  <CheckCircle2 size={16} />
                  {libraryMessage}
                </div>
              )}

              {/* Search library */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Rechercher un article (nom, référence, catégorie)..."
                  value={librarySearchTerm}
                  onChange={(e) => setLibrarySearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
                />
              </div>

              {/* Items list */}
              <div className="space-y-2">
                {filteredLibraryItems.length === 0 ? (
                  <p className="text-center text-gray-400 font-montserrat text-sm py-6">
                    Aucun article dans la bibliothèque.
                  </p>
                ) : (
                  filteredLibraryItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => toggleLibrarySelection(item.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedLibraryItems.has(item.id)
                          ? "border-[#10748E] bg-[#10748E]/5"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center ${
                            selectedLibraryItems.has(item.id)
                              ? "bg-[#10748E] border-[#10748E]"
                              : "border-gray-300 bg-white"
                          }`}
                        >
                          {selectedLibraryItems.has(item.id) && <Check size={14} className="text-white" />}
                        </div>
                        <div>
                          <div className="font-montserrat text-sm font-semibold text-gray-900">{item.title}</div>
                          <div className="font-montserrat text-[10px] text-gray-400">
                            {item.reference} {item.category && `• ${item.category}`}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-nevan text-sm text-gray-900">{formatNumberInput(item.unitPrice)} MAD</span>
                        {isSuperAdmin && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteLibraryItem(item.id);
                            }}
                            className="p-1.5 text-gray-400 hover:text-[#AF1818] hover:bg-red-50 rounded-lg transition-colors"
                            title="Supprimer de la bibliothèque"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Add new item form — Super Admin only */}
              {isSuperAdmin && (
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-nevan text-sm text-gray-900 uppercase tracking-wider mb-4">
                    Ajouter un article à la bibliothèque
                  </h3>
                  <form onSubmit={handleCreateLibraryItem} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nom de l'article *"
                      value={newLibraryItem.title}
                      onChange={(e) => setNewLibraryItem((prev) => ({ ...prev, title: e.target.value }))}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-montserrat text-sm focus:outline-none focus:border-[#10748E]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Référence"
                      value={newLibraryItem.reference}
                      onChange={(e) => setNewLibraryItem((prev) => ({ ...prev, reference: e.target.value }))}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-montserrat text-sm focus:outline-none focus:border-[#10748E]"
                    />
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      placeholder="Prix unitaire HT *"
                      value={newLibraryItem.unitPrice}
                      onChange={(e) => setNewLibraryItem((prev) => ({ ...prev, unitPrice: e.target.value }))}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-montserrat text-sm focus:outline-none focus:border-[#10748E]"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Catégorie (optionnel)"
                      value={newLibraryItem.category}
                      onChange={(e) => setNewLibraryItem((prev) => ({ ...prev, category: e.target.value }))}
                      className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl font-montserrat text-sm focus:outline-none focus:border-[#10748E]"
                    />
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#10748E] text-white rounded-xl font-nevan text-xs uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors"
                      >
                        <Plus size={16} />
                        Enregistrer l&apos;article
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-4">
              <button
                onClick={() => setShowLibraryModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              <button
                onClick={handleAddFromLibrary}
                disabled={selectedLibraryItems.size === 0}
                className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors disabled:opacity-50"
              >
                Ajouter {selectedLibraryItems.size > 0 ? `(${selectedLibraryItems.size})` : ""} au devis
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Final Review Layer */}
      {showFinalReview && quote && (
        <div className="fixed inset-0 z-40 bg-gray-50/95 overflow-auto print:hidden">
          <div className="max-w-5xl mx-auto p-4 sm:p-8 pb-32">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide">Vérification finale du devis</h2>
                <p className="font-montserrat text-sm text-gray-500 mt-1">Vérifiez les informations avant de valider l&apos;envoi.</p>
              </div>
              <button
                onClick={() => setShowFinalReview(false)}
                className="p-2 text-gray-400 hover:text-gray-950 hover:bg-gray-200 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 shadow-sm mb-8">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h1 className="font-nevan text-3xl text-[#10748E] uppercase tracking-wide">Air Froid Expert</h1>
                  <p className="font-montserrat text-sm text-gray-500 mt-1">Excellence climatique au Maroc</p>
                </div>
                <div className="text-right">
                  <div className="font-nevan text-xl text-gray-900 uppercase">Devis</div>
                  <div className="font-montserrat text-sm text-gray-500">{quote.id}</div>
                  <div className="font-montserrat text-sm text-gray-500">
                    {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-montserrat text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Client</h3>
                  <p className="font-montserrat text-base font-semibold text-gray-900">{quote.client}</p>
                  <p className="font-montserrat text-sm text-gray-500">{quote.location}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-montserrat text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Projet</h3>
                  <p className="font-montserrat text-base font-semibold text-gray-900">{quote.projectType}</p>
                  {quote.budget && <p className="font-montserrat text-sm text-gray-500">Budget estimé : {quote.budget}</p>}
                </div>
              </div>

              <table className="w-full text-left mb-8">
                <thead className="border-b border-gray-200">
                  <tr className="font-montserrat text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3">Désignation</th>
                    <th className="py-3">Réf.</th>
                    <th className="py-3 text-right">Qté</th>
                    <th className="py-3 text-right">P.U. HT</th>
                    <th className="py-3 text-right">Remise %</th>
                    <th className="py-3 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="font-montserrat text-sm">
                  {quote.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3">{item.title}</td>
                      <td className="py-3 text-gray-500">{item.reference}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">{formatNumberInput(item.unitPrice)}</td>
                      <td className="py-3 text-right">{item.discount || 0}%</td>
                      <td className="py-3 text-right">{formatNumberInput(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-8">
                <div className="w-72 space-y-2">
                  <div className="flex justify-between font-montserrat text-sm text-gray-600">
                    <span>Sous-total HT</span>
                    <span>{formatNumberInput(quote.subtotal + quote.discountTotal)} MAD</span>
                  </div>
                  {quote.discountTotal > 0 && (
                    <div className="flex justify-between font-montserrat text-sm text-red-500">
                      <span>Remise totale</span>
                      <span>-{formatNumberInput(quote.discountTotal)} MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between font-montserrat text-sm text-gray-900 font-semibold">
                    <span>Total HT</span>
                    <span>{formatNumberInput(quote.subtotal)} MAD</span>
                  </div>
                  <div className="flex justify-between font-montserrat text-sm text-red-500">
                    <span>Remise globale ({quote.globalDiscount ?? 0}%)</span>
                    <span>-{formatNumberInput(Math.round(quote.subtotal * ((quote.globalDiscount ?? 0) / 100) * 100) / 100)} MAD</span>
                  </div>
                  <div className="flex justify-between font-montserrat text-sm text-gray-900 font-semibold">
                    <span>Net HT</span>
                    <span>{formatNumberInput(Math.round(quote.subtotal * (1 - (quote.globalDiscount ?? 0) / 100) * 100) / 100)} MAD</span>
                  </div>
                  <div className="flex justify-between font-montserrat text-sm text-gray-600">
                    <span>TVA ({quote.vatRate}%)</span>
                    <span>{formatNumberInput(quote.vatAmount)} MAD</span>
                  </div>
                  <div className="flex justify-between font-nevan text-lg text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total TTC</span>
                    <span>{formatNumberInput(quote.total)} MAD</span>
                  </div>
                </div>
              </div>

              {quote.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-montserrat text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
                  <p className="font-montserrat text-sm text-gray-600 whitespace-pre-line">{quote.notes}</p>
                </div>
              )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 sm:p-6 z-50">
              <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="font-montserrat text-sm text-gray-500">
                    Total TTC : <span className="font-nevan text-lg text-[#10748E]">{formatNumberInput(quote.total)} MAD</span>
                  </p>
                  <p className="font-montserrat text-xs text-gray-400">{quote.items.length} ligne(s)</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => setShowFinalReview(false)}
                    className="flex-1 sm:flex-none px-6 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Retour pour modifier
                  </button>
                  <button
                    onClick={handleConfirmSendQuote}
                    disabled={isSaving}
                    className="flex-1 sm:flex-none px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase tracking-wider hover:bg-[#0c5a6e] transition-colors disabled:opacity-50 shadow-md shadow-[#10748E]/20 flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    {isSaving ? "Envoi en cours..." : "Valider et envoyer"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Preview Layer */}
      {showPrintPreview && (
        <div className="fixed inset-0 z-50 bg-white p-8 overflow-auto print:hidden">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowPrintPreview(false)}
                className="p-2 text-gray-500 hover:text-gray-900"
              >
                <X size={24} />
              </button>
            </div>
            <div className="border border-gray-200 rounded-2xl p-10">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h1 className="font-nevan text-3xl text-[#10748E] uppercase tracking-wide">Air Froid Expert</h1>
                  <p className="font-montserrat text-sm text-gray-500 mt-1">Excellence climatique au Maroc</p>
                </div>
                <div className="text-right">
                  <div className="font-nevan text-xl text-gray-900 uppercase">Devis</div>
                  <div className="font-montserrat text-sm text-gray-500">{quote.id}</div>
                  <div className="font-montserrat text-sm text-gray-500">
                    {new Date(quote.createdAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <h3 className="font-montserrat text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Client</h3>
                  <p className="font-montserrat text-sm font-semibold text-gray-900">{request.client}</p>
                  <p className="font-montserrat text-sm text-gray-500">{request.location}</p>
                </div>
                <div>
                  <h3 className="font-montserrat text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Projet</h3>
                  <p className="font-montserrat text-sm font-semibold text-gray-900">{request.service}</p>
                  <p className="font-montserrat text-sm text-gray-500">Budget estimé : {request.budget}</p>
                </div>
              </div>

              <table className="w-full text-left mb-8">
                <thead className="border-b border-gray-200">
                  <tr className="font-montserrat text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <th className="py-3">Désignation</th>
                    <th className="py-3">Réf.</th>
                    <th className="py-3 text-right">Qté</th>
                    <th className="py-3 text-right">P.U. HT</th>
                    <th className="py-3 text-right">Total HT</th>
                  </tr>
                </thead>
                <tbody className="font-montserrat text-sm">
                  {quote.items.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100">
                      <td className="py-3">{item.title}</td>
                      <td className="py-3 text-gray-500">{item.reference}</td>
                      <td className="py-3 text-right">{item.quantity}</td>
                      <td className="py-3 text-right">{formatNumberInput(item.unitPrice)}</td>
                      <td className="py-3 text-right">{formatNumberInput(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mb-10">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between font-montserrat text-sm text-gray-600">
                    <span>Sous-total HT</span>
                    <span>{formatNumberInput(quote.subtotal + quote.discountTotal)} MAD</span>
                  </div>
                  {quote.discountTotal > 0 && (
                    <div className="flex justify-between font-montserrat text-sm text-red-500">
                      <span>Remise totale</span>
                      <span>-{formatNumberInput(quote.discountTotal)} MAD</span>
                    </div>
                  )}
                  <div className="flex justify-between font-montserrat text-sm text-gray-900 font-semibold">
                    <span>Total HT</span>
                    <span>{formatNumberInput(quote.subtotal)} MAD</span>
                  </div>
                  <div className="flex justify-between font-montserrat text-sm text-red-500">
                    <span>Remise globale ({quote.globalDiscount ?? 0}%)</span>
                    <span>-{formatNumberInput(Math.round(quote.subtotal * ((quote.globalDiscount ?? 0) / 100) * 100) / 100)} MAD</span>
                  </div>
                  <div className="flex justify-between font-montserrat text-sm text-gray-900 font-semibold">
                    <span>Net HT</span>
                    <span>{formatNumberInput(Math.round(quote.subtotal * (1 - (quote.globalDiscount ?? 0) / 100) * 100) / 100)} MAD</span>
                  </div>
                  <div className="flex justify-between font-montserrat text-sm text-gray-600">
                    <span>TVA ({quote.vatRate}%)</span>
                    <span>{formatNumberInput(quote.vatAmount)} MAD</span>
                  </div>
                  <div className="flex justify-between font-nevan text-lg text-gray-900 border-t border-gray-200 pt-2">
                    <span>Total TTC</span>
                    <span>{formatNumberInput(quote.total)} MAD</span>
                  </div>
                </div>
              </div>

              {quote.notes && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-montserrat text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Notes</h3>
                  <p className="font-montserrat text-sm text-gray-600 whitespace-pre-line">{quote.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
