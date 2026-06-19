"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  UserCheck, 
  Search, 
  MapPin, 
  Phone, 
  Plus, 
  ChevronRight,
  X
} from "lucide-react";

// Mock clients fallback
const FALLBACK_CLIENTS = [
  { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", ice: "001594823000084", status: "Actif", resp: "Youssef", history: ["Création du dossier B2B", "Validation de l'ICE", "Demande d'étude VRV reçue"] },
  { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Casablanca", ice: "000847291000072", status: "Actif", resp: "Youssef", history: ["Première visite technique effectuée", "Prise de contact avec la direction"] },
  { id: "CLI-403", company: "Riad Dar Anika", type: "B2B", contact: "Fatima Zahra El Amrani", email: "contact@dar-anika.ma", phone: "+212 663-124578", city: "Marrakech", ice: "001928374000123", status: "Actif", resp: "Youssef", history: ["Demande de devis climatisation", "Visite technique planifiée"] },
  { id: "CLI-404", company: "Clinique Al Kaoutar", type: "B2B", contact: "Dr. Omar Benali", email: "o.benali@alkaoutar.ma", phone: "+212 664-332211", city: "Rabat", ice: "002345678901234", status: "Actif", resp: "Youssef", history: ["Étude VMC double flux", "Soumission en cours"] },
  { id: "CLI-405", company: "Restaurant La Table du Marché", type: "B2B", contact: "Karim El Fassi", email: "k.elfassi@latablemarche.ma", phone: "+212 665-998877", city: "Marrakech", ice: "003456789012345", status: "Actif", resp: "Youssef", history: ["Installation climatisation salle", "Devis accepté"] },
  { id: "CLI-406", company: "Cyber Parc Technologie", type: "B2B", contact: "Nadia Idrissi", email: "n.idrissi@cyberparc.ma", phone: "+212 666-112233", city: "Fès", ice: "004567890123456", status: "Actif", resp: "Youssef", history: ["Rafraîchissement datacenter", "Audit thermique réalisé"] },
  { id: "CLI-407", company: "Complexe Touristique L'Océan", type: "B2B", contact: "Hassan Ouchrif", email: "h.ouchrif@oceanresort.ma", phone: "+212 667-445566", city: "Agadir", ice: "005678901234567", status: "Actif", resp: "Youssef", history: ["Maintenance piscines chauffées", "Contrat annuel signé"] },
  { id: "CLI-408", company: "Boulangerie Pâtisserie Amoud", type: "B2B", contact: "Samira Tazi", email: "s.tazi@amoud.ma", phone: "+212 668-778899", city: "Tanger", ice: "006789012345678", status: "Actif", resp: "Youssef", history: ["Chambre froide boulangerie", "Installation terminée"] },
  { id: "CLI-409", company: "Centre Commercial Anfa Place", type: "B2B", contact: "Youssef Lahlou", email: "y.lahlou@anfaplace.ma", phone: "+212 669-223344", city: "Casablanca", ice: "007890123456789", status: "Actif", resp: "Youssef", history: ["Gros projet VRV", "Négociation en cours"] },
  { id: "CLI-410", company: "Hôtel Sofitel Casablanca", type: "B2B", contact: "Amal Bennani", email: "a.bennani@sofitel-casa.ma", phone: "+212 670-556677", city: "Casablanca", ice: "008901234567890", status: "Actif", resp: "Youssef", history: ["Rénovation système climatisation", "Devis en attente"] },
  { id: "CLI-411", company: "Société Générale des Travaux", type: "B2B", contact: "Mehdi Chraibi", email: "m.chraibi@sgt.ma", phone: "+212 671-889900", city: "Rabat", ice: "009012345678901", status: "Actif", resp: "Youssef", history: ["Partenariat chantiers neufs", "Premier contact établi"] },
  { id: "CLI-412", company: "Espace Vert Jardins du Riad", type: "B2B", contact: "Laila Ouazzani", email: "l.ouazzani@jardinsriad.ma", phone: "+212 672-334455", city: "Marrakech", ice: "010123456789012", status: "Actif", resp: "Youssef", history: ["Arrosage automatique villa", "Étude en cours"] },
];

const CATEGORIES = [
  "Systèmes de climatisation",
  "Équipements de ventilation",
  "Produits solaires",
  "Filtres & accessoires"
];

export default function CommercialClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [clients, setClients] = useState<typeof FALLBACK_CLIENTS>([]);
  const [searchTerm, setSearchTerm] = useState("");

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
      try {
        const existing = JSON.parse(saved);
        // Merge fallback clients that are missing (by id)
        const existingIds = new Set(existing.map((c: any) => c.id));
        const missing = FALLBACK_CLIENTS.filter((c) => !existingIds.has(c.id));
        if (missing.length > 0) {
          const merged = [...missing, ...existing];
          localStorage.setItem("afe_clients", JSON.stringify(merged));
          setClients(merged);
          return;
        }
        setClients(existing);
      } catch {
        localStorage.setItem("afe_clients", JSON.stringify(FALLBACK_CLIENTS));
        setClients(FALLBACK_CLIENTS);
      }
    } else {
      localStorage.setItem("afe_clients", JSON.stringify(FALLBACK_CLIENTS));
      setClients(FALLBACK_CLIENTS);
    }
  };

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
    const timestamp = new Date().toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
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
      addedBy: "Commercial",
      history: [`[${timestamp}] Client créé directement par le commercial Youssef.`]
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

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="com-cli-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-nevan text-2xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Mes Clients & Comptes</h1>
          <p className="font-montserrat text-gray-500">Suivez et pilotez votre portefeuille de clients professionnels.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-[#10748E] text-white font-nevan text-xs tracking-wider uppercase rounded-xl hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
        >
          <Plus size={16} /> Ajouter Client
        </button>
      </div>

      {/* KPI Info */}
      <div className="com-cli-item bg-white p-4 md:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 w-fit">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-[#10748E]/10 rounded-xl flex items-center justify-center text-[#10748E]">
          <UserCheck size={20} />
        </div>
        <div>
          <div className="font-montserrat text-[10px] md:text-xs text-gray-500 font-bold uppercase">Clients Portefeuille</div>
          <div className="font-nevan text-xl md:text-2xl text-gray-900 mt-1">{myClients.length}</div>
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
      <div className="com-cli-item bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {filteredClients.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 font-montserrat text-[10px] font-bold text-gray-500 uppercase tracking-wider">ID / Entreprise</th>
                    <th className="px-6 py-3 font-montserrat text-[10px] font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 font-montserrat text-[10px] font-bold text-gray-500 uppercase tracking-wider">Ville</th>
                    <th className="px-6 py-3 font-montserrat text-[10px] font-bold text-gray-500 uppercase tracking-wider">Téléphone</th>
                    <th className="px-6 py-3 font-montserrat text-[10px] font-bold text-gray-500 uppercase tracking-wider">ICE</th>
                    <th className="px-6 py-3 font-montserrat text-[10px] font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredClients.map((c) => (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/b2b/dashboard/mes-clients/${c.id}`)}
                      className="hover:bg-[#10748E]/5 transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-4">
                        <div className="font-montserrat text-xs text-gray-400 font-bold uppercase">{c.id}</div>
                        <div className="font-montserrat font-bold text-gray-900 text-sm">{c.company}</div>
                      </td>
                      <td className="px-6 py-4 font-montserrat text-sm text-gray-700">{c.contact}</td>
                      <td className="px-6 py-4 font-montserrat text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} className="text-gray-400 shrink-0" /> {c.city}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-montserrat text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <Phone size={14} className="text-gray-400 shrink-0" /> {c.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-montserrat text-sm text-gray-600">{c.ice}</td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight size={18} className="inline-block text-gray-400 group-hover:text-[#10748E] transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {filteredClients.map((c) => (
                <div
                  key={c.id}
                  onClick={() => router.push(`/b2b/dashboard/mes-clients/${c.id}`)}
                  className="p-4 hover:bg-[#10748E]/5 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="font-montserrat text-[10px] text-gray-400 font-bold uppercase">{c.id}</div>
                      <div className="font-montserrat font-bold text-gray-900 text-sm">{c.company}</div>
                    </div>
                    <ChevronRight size={18} className="shrink-0 text-gray-400 group-hover:text-[#10748E] transition-colors mt-0.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 font-montserrat text-xs text-gray-600">
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">Contact</span>
                      {c.contact}
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">Ville</span>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400 shrink-0" /> {c.city}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">Téléphone</span>
                      <div className="flex items-center gap-1">
                        <Phone size={12} className="text-gray-400 shrink-0" /> {c.phone}
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] text-gray-400 uppercase font-bold block mb-0.5">ICE</span>
                      {c.ice}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 py-12 font-montserrat">
            Aucun client ne correspond à votre recherche.
          </div>
        )}
      </div>

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
