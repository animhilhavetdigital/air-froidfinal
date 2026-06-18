import { Product, PRODUCTS } from "./products";

export interface QuoteItem {
  id: string;
  productId: number;
  title: string;
  reference?: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Quote {
  id: string;
  requestId: string;
  client: string;
  projectType: string;
  location: string;
  budget?: string;
  description?: string;
  items: QuoteItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  status: "Brouillon" | "Envoyé";
  author: string;
  createdAt: string;
  notes?: string;
}

const QUOTES_STORAGE_KEY = "afe_quotes";
const LIBRARY_STORAGE_KEY = "afe_quote_library_items";

export interface QuoteLibraryItem {
  id: string;
  title: string;
  reference?: string;
  unitPrice: number;
  category?: string;
  createdBy: string;
  createdAt: string;
}

export function getQuoteLibraryItems(): QuoteLibraryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LIBRARY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultLibraryItems();
  } catch {
    return getDefaultLibraryItems();
  }
}

export function saveQuoteLibraryItem(item: QuoteLibraryItem): void {
  if (typeof window === "undefined") return;
  const items = getQuoteLibraryItems().filter((i) => i.id !== item.id);
  items.push(item);
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
}

export function deleteQuoteLibraryItem(id: string): void {
  if (typeof window === "undefined") return;
  const items = getQuoteLibraryItems().filter((i) => i.id !== id);
  localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(items));
}

export function getDefaultLibraryItems(): QuoteLibraryItem[] {
  return [
    {
      id: "lib-main-oeuvre",
      title: "Main d'œuvre installation",
      reference: "MO-INSTALL",
      unitPrice: 2500,
      category: "Main d'œuvre",
      createdBy: "Super Admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "lib-fourniture",
      title: "Fournitures et consommables",
      reference: "FOURN-STD",
      unitPrice: 850,
      category: "Fournitures",
      createdBy: "Super Admin",
      createdAt: new Date().toISOString(),
    },
    {
      id: "lib-transport",
      title: "Transport et mise en place",
      reference: "TRANSPORT",
      unitPrice: 1200,
      category: "Logistique",
      createdBy: "Super Admin",
      createdAt: new Date().toISOString(),
    },
  ];
}

export function libraryItemToQuoteItem(item: QuoteLibraryItem): QuoteItem {
  return {
    id: crypto.randomUUID(),
    productId: 0,
    title: item.title,
    reference: item.reference || "",
    quantity: 1,
    unitPrice: item.unitPrice,
    total: item.unitPrice,
  };
}

export function generateQuoteId(): string {
  const year = new Date().getFullYear();
  const quotes = getQuotes();
  const nextIndex = quotes.length + 1;
  return `DEV-${year}-${String(nextIndex).padStart(3, "0")}`;
}

export function getQuotes(): Quote[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUOTES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveQuote(quote: Quote): void {
  if (typeof window === "undefined") return;
  const quotes = getQuotes();
  const existingIndex = quotes.findIndex((q) => q.id === quote.id);
  if (existingIndex >= 0) {
    quotes[existingIndex] = quote;
  } else {
    quotes.push(quote);
  }
  localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(quotes));
}

export function getQuoteByRequestId(requestId: string): Quote | null {
  const quotes = getQuotes();
  return quotes.find((q) => q.requestId === requestId) || null;
}

export function createEmptyQuoteItem(): QuoteItem {
  return {
    id: crypto.randomUUID(),
    productId: 0,
    title: "",
    reference: "",
    quantity: 1,
    unitPrice: 0,
    total: 0,
  };
}

export function calculateQuoteTotals(
  items: QuoteItem[],
  vatRate: number
): { subtotal: number; vatAmount: number; total: number } {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const vatAmount = subtotal * (vatRate / 100);
  const total = subtotal + vatAmount;
  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}

export function formatCurrency(amount: number): string {
  return amount.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function productToQuoteItem(product: Product): QuoteItem {
  const price = parseFloat(product.price.replace(/\s/g, "").replace(",", ".")) || 0;
  return {
    id: crypto.randomUUID(),
    productId: product.id,
    title: product.title,
    reference: product.reference || "",
    quantity: 1,
    unitPrice: price,
    total: price,
  };
}

export function getSuggestedProducts(service: string, count = 3): Product[] {
  const normalized = service.toLowerCase();

  let categories: string[] = [];

  if (normalized.includes("climatisation") || normalized.includes("froid")) {
    categories = ["Systèmes de climatisation"];
  } else if (normalized.includes("ventilation")) {
    categories = ["Équipements de ventilation"];
  } else if (normalized.includes("solaire") || normalized.includes("chauffe-eau")) {
    categories = ["Produits solaires"];
  } else if (normalized.includes("filtre")) {
    categories = ["Filtres & accessoires"];
  } else {
    categories = ["Systèmes de climatisation", "Équipements de ventilation", "Produits solaires"];
  }

  const matches = PRODUCTS.filter((p) => categories.includes(p.category));
  return matches.slice(0, Math.max(1, count));
}
