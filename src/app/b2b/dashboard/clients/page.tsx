"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Search, 
  Filter, 
  Building2, 
  Check, 
  X, 
  ShieldCheck, 
  ShieldAlert, 
  UserCheck, 
  MapPin, 
  Briefcase,
  ChevronRight,
  Plus
} from "lucide-react";

// Mock client data
const INITIAL_CLIENTS = [
  { id: "CLI-402", company: "Hôtel Royal Atlas", type: "B2B", ice: "001594823000084", contact: "Mohamed Alami", email: "alami@royalatlas.ma", phone: "+212 661-458921", city: "Marrakech", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)", history: ["Création du dossier B2B", "Validation de l'ICE", "Demande d'étude VRV reçue"] },
  { id: "CLI-401", company: "Supermarché Marjane", type: "B2B", ice: "000847291000072", contact: "Khadija Benjelloun", email: "k.benjelloun@marjane.ma", phone: "+212 662-784512", city: "Marrakech, Route de Casa", status: "Actif", resp: "Youssef", addedBy: "Portail (Client)", history: ["Première visite technique effectuée", "Prise de contact avec la direction"] },
  { id: "CLI-399", company: "Villa Palmeraie", type: "B2C", ice: "-", contact: "Jean Dupont", email: "j.dupont@gmail.com", phone: "+212 665-123456", city: "Marrakech", status: "Actif", resp: "Sara", addedBy: "Super Admin", history: [] },
  { id: "CLI-398", company: "Riad Dar Anika", type: "B2B", ice: "002485910000031", contact: "Omar Lahrizi", email: "info@daranika.com", phone: "+212 524-389150", city: "Marrakech", status: "Actif", resp: "Non assigné", addedBy: "Portail (Client)", history: [] },
  { id: "CLI-390", company: "Société Al Boustane", type: "B2B", ice: "003512948000095", contact: "Yassine Boustane", email: "y.boustane@alboustane.co.ma", phone: "+212 660-842915", city: "Marrakech", status: "En attente", resp: "Non assigné", addedBy: "Portail (Client)", history: [] },
];

const COMMERCIALS = ["Youssef", "Sara"];

export default function SuperAdminClientsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [clients, setClients] = useState<typeof INITIAL_CLIENTS>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Tous");
  
  // Assignment Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [pendingValidateId, setPendingValidateId] = useState<string | null>(null);
  const [selectedCommercial, setSelectedCommercial] = useState("Youssef");

  // Add Client Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [addError, setAddError] = useState("");
  const [generatedCredentials, setGeneratedCredentials] = useState<{ 
    email: string; 
    password: string; 
    company: string; 
    commercial: string;
    contact: string;
    phone: string;
  } | null>(null);
  const [newClient, setNewClient] = useState({
    company: "",
    contact: "",
    email: "",
    phone: "",
    city: "",
    ice: "",
    type: "B2B",
    commercial: "Youssef",
  });

  useEffect(() => {
    const saved = localStorage.getItem("afe_clients");
    if (saved) {
      const parsed = JSON.parse(saved);
      const repaired = parsed.map((c: any) => {
        let addedByVal = c.addedBy;
        if (!addedByVal) {
          if (c.history && c.history.some((h: string) => h.toLowerCase().includes("commercial"))) {
            addedByVal = "Commercial";
          } else if (c.status === "Actif") {
            addedByVal = "Super Admin";
          } else {
            addedByVal = "Portail (Client)";
          }
        } else if (addedByVal.startsWith("Commercial")) {
          addedByVal = "Commercial";
        }
        return { ...c, addedBy: addedByVal };
      });
      setClients(repaired);
      localStorage.setItem("afe_clients", JSON.stringify(repaired));
    } else {
      localStorage.setItem("afe_clients", JSON.stringify(INITIAL_CLIENTS));
      setClients(INITIAL_CLIENTS);
    }
  }, []);

  useGSAP(() => {
    if (clients.length > 0) {
      gsap.fromTo(".cli-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [clients]);

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.ice.includes(searchTerm);
    const matchesType = selectedType === "Tous" || c.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleValidateAccount = (id: string, action: "validate" | "reject") => {
    if (action === "reject") {
      const updated = clients.map(c => {
        if (c.id === id) {
          return { ...c, status: "Rejeté" };
        }
        return c;
      });
      setClients(updated);
      localStorage.setItem("afe_clients", JSON.stringify(updated));
    } else {
      setPendingValidateId(id);
      setShowAssignModal(true);
    }
  };

  const confirmAssign = () => {
    if (!pendingValidateId) return;

    const targetClient = clients.find(c => c.id === pendingValidateId);
    const updated = clients.map(c => {
      if (c.id === pendingValidateId) {
        return { 
          ...c, 
          status: "Actif",
          resp: selectedCommercial,
          addedBy: "Super Admin"
        };
      }
      return c;
    });

    setClients(updated);
    localStorage.setItem("afe_clients", JSON.stringify(updated));

    // Send Notification to Commercial
    const savedNotifs = localStorage.getItem("afe_notifications");
    let notificationsList = [];
    if (savedNotifs) {
      notificationsList = JSON.parse(savedNotifs);
    } else {
      // Default fallback
      notificationsList = [
        { id: 1, type: "Nouveau", title: "Nouveau dossier assigné", desc: "L'administrateur vous a assigné la demande REQ-102 (Hôtel Royal Atlas) pour l'étude thermique du projet VRV/DRV.", time: "Il y a 30 minutes", read: false, category: "demandes", href: "/b2b/dashboard/mes-demandes", role: "commercial" }
      ];
    }

    const newNotif = {
      id: Date.now(),
      type: "Nouveau",
      title: "Nouveau client assigné",
      desc: `Le Super Admin vous a assigné le client ${targetClient?.company || "inconnu"}.`,
      time: "Il y a quelques secondes",
      read: false,
      category: "clients",
      href: "/b2b/dashboard/mes-clients",
      role: "commercial"
    };

    notificationsList = [newNotif, ...notificationsList];
    localStorage.setItem("afe_notifications", JSON.stringify(notificationsList));

    setShowAssignModal(false);
    setPendingValidateId(null);
  };

  const handleAddClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");

    // Validation
    if (!newClient.company || !newClient.contact || !newClient.email || !newClient.phone || !newClient.city) {
      setAddError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    const exists = clients.some(
      (c) => c.email.toLowerCase() === newClient.email.toLowerCase() ||
             (newClient.ice && c.ice === newClient.ice)
    );
    if (exists) {
      setAddError("Un client avec cet email ou cet ICE existe déjà.");
      return;
    }

    const newId = `CLI-${Math.floor(400 + Math.random() * 100)}`;
    const tempPassword = Math.random().toString(36).slice(-8);
    const timestamp = new Date().toLocaleString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

    const createdClient = {
      id: newId,
      company: newClient.company,
      type: newClient.type,
      ice: newClient.ice || "-",
      contact: newClient.contact,
      email: newClient.email,
      phone: newClient.phone,
      city: newClient.city,
      status: "Actif",
      resp: newClient.commercial,
      addedBy: "Super Admin",
      history: [`[${timestamp}] Client créé et validé directement par le Super Admin.`],
    };

    const updated = [createdClient, ...clients];
    setClients(updated);
    localStorage.setItem("afe_clients", JSON.stringify(updated));

    // Notify assigned commercial
    const savedNotifs = localStorage.getItem("afe_notifications");
    let notificationsList = savedNotifs ? JSON.parse(savedNotifs) : [];
    const commercialNotif = {
      id: Date.now(),
      type: "Nouveau",
      title: "Nouveau client assigné",
      desc: `Le Super Admin vous a assigné le client ${newClient.company}.`,
      time: "Il y a quelques secondes",
      read: false,
      category: "clients",
      href: "/b2b/dashboard/mes-clients",
      role: "commercial",
    };
    notificationsList = [commercialNotif, ...notificationsList];
    localStorage.setItem("afe_notifications", JSON.stringify(notificationsList));

    // Show credentials to Super Admin (to share via WhatsApp/SMS)
    setGeneratedCredentials({
      email: newClient.email,
      password: tempPassword,
      company: newClient.company,
      commercial: newClient.commercial,
      contact: newClient.contact,
      phone: newClient.phone,
    });

    // Reset form
    setNewClient({
      company: "",
      contact: "",
      email: "",
      phone: "",
      city: "",
      ice: "",
      type: "B2B",
      commercial: "Youssef",
    });
  };

  const pendingB2B = clients.filter(c => c.status === "En attente");

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="cli-item flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Comptes & Clients</h1>
          <p className="font-montserrat text-gray-500">Gérez les fiches clients et validez les comptes professionnels B2B.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#10748E] text-white font-nevan text-xs tracking-wider uppercase rounded-xl hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
        >
          <Plus size={16} /> Ajouter Client
        </button>
      </div>

      {/* Validation Banner (if any accounts pending) */}
      {pendingB2B.length > 0 && (
        <div className="cli-item bg-orange-50 border border-orange-100 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
              <Building2 size={24} />
            </div>
            <div>
              <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide">Comptes B2B en Attente ({pendingB2B.length})</h3>
              <p className="font-montserrat text-sm text-gray-600 mt-1">
                De nouveaux professionnels se sont inscrits et attendent la validation de leur identifiant fiscal / ICE.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {pendingB2B.map((c) => (
              <div key={c.id} className="bg-white p-4 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm min-w-[320px]">
                <div>
                  <div className="font-montserrat text-xs font-bold text-[#10748E]">{c.id}</div>
                  <div className="font-montserrat font-bold text-gray-900 text-sm">{c.company}</div>
                  <div className="font-montserrat text-xs text-gray-500 mt-0.5">ICE: {c.ice} • {c.city}</div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleValidateAccount(c.id, "reject")}
                    className="px-3 py-1.5 bg-red-50 text-[#AF1818] border border-red-100 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1"
                  >
                    <X size={14} /> Refuser
                  </button>
                  <button 
                    onClick={() => handleValidateAccount(c.id, "validate")}
                    className="px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 text-xs font-bold rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                  >
                    <Check size={14} /> Valider
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters & Search */}
      <div className="cli-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher par Entreprise, Contact, ICE..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Filter Type */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="font-montserrat text-xs font-bold text-gray-400 uppercase shrink-0">Typologie:</span>
          <select 
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full md:w-48"
          >
            <option value="Tous">Tous les clients</option>
            <option value="B2B">Professionnels (B2B)</option>
            <option value="B2C">Particuliers (B2C)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="cli-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px] text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Client / Entreprise</th>
                <th className="px-6 py-4">Typologie</th>
                <th className="px-6 py-4"> ICE / Identifiant</th>
                <th className="px-6 py-4">Contact principal</th>
                <th className="px-6 py-4">Coordonnées</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Responsable</th>
                <th className="px-6 py-4 min-w-[180px]">Créé par</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredClients.length > 0 ? (
                filteredClients.map((c) => (
                  <tr 
                    key={c.id} 
                    onClick={() => router.push(`/b2b/dashboard/mes-clients/${c.id}`)}
                    className="hover:bg-[#10748E]/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-[#10748E] transition-colors">{c.company}</div>
                      <div className="text-gray-400 text-xs flex items-center gap-1 mt-0.5"><MapPin size={12} /> {c.city}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        c.type === 'B2B' ? 'bg-[#10748E]/10 text-[#10748E]' : 'bg-gray-100 text-gray-600'
                      }`}>{c.type}</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-600">{c.ice}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{c.contact}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">{c.email}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{c.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        c.status === 'Actif' ? 'bg-green-50 text-green-700' : 
                        c.status === 'En attente' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {c.status === 'Actif' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {c.resp === "Non assigné" ? (
                        <span className="text-gray-400 italic">Aucun</span>
                      ) : (
                        <span className="flex items-center gap-1 font-medium"><UserCheck size={14} className="text-[#10748E]" /> {c.resp}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 min-w-[180px]">
                      <span className={`px-2.5 py-1 rounded-full text-[8.5px] font-bold whitespace-nowrap inline-block border ${
                        c.addedBy?.includes("Commercial") 
                          ? "bg-blue-50 text-[#32A5DE] border-blue-100" 
                          : c.addedBy === "Super Admin"
                          ? "bg-red-50 text-[#AF1818] border-red-100"
                          : "bg-gray-50 text-gray-500 border-gray-150"
                      }`}>{c.addedBy || "Portail (Client)"}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ChevronRight size={18} className="inline-block text-gray-400 group-hover:text-[#10748E] transition-colors" />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-montserrat">
                    Aucun client ne correspond aux critères de recherche.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAssignModal(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200">
            <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide mb-4">Affectation du commercial</h3>
            <p className="font-montserrat text-sm text-gray-500 mb-6">
              Veuillez sélectionner le commercial en charge du suivi de ce client professionnel.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-2">Choisir le commercial</label>
                <select
                  value={selectedCommercial}
                  onChange={(e) => setSelectedCommercial(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                >
                  {COMMERCIALS.map(comm => (
                    <option key={comm} value={comm}>{comm}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={confirmAssign}
                className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
              >
                Confirmer & Valider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => {
            setShowAddModal(false);
            setGeneratedCredentials(null);
          }} />
          
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 shadow-2xl z-10 my-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => {
                setShowAddModal(false);
                setGeneratedCredentials(null);
              }}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {generatedCredentials ? (
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 mb-4">
                  <Check size={36} className="stroke-[3]" />
                </div>
                
                <h3 className="font-nevan text-xl md:text-2xl text-gray-900 uppercase tracking-wide mb-2">
                  Client créé avec succès !
                </h3>
                <p className="font-montserrat text-sm text-gray-500 mb-6">
                  Le client <strong className="text-gray-800">{generatedCredentials.company}</strong> a été ajouté et activé.
                </p>

                {/* Credentials Details */}
                <div className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100 text-left mb-6 font-montserrat">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Identifiants générés</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-gray-150">
                      <span className="text-gray-500">Email / Identifiant:</span>
                      <span className="font-bold text-gray-900 font-mono">{generatedCredentials.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-150">
                      <span className="text-gray-500">Mot de passe temporaire:</span>
                      <span className="font-bold text-[#10748E] font-mono bg-[#10748E]/10 px-2.5 py-0.5 rounded-lg">{generatedCredentials.password}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-500">Commercial assigné:</span>
                      <span className="font-bold text-gray-900 flex items-center gap-1">
                        <UserCheck size={14} className="text-[#10748E]" /> {generatedCredentials.commercial}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Simulated notifications */}
                <div className="w-full space-y-4 mb-6 text-left">
                  {/* Email simulation */}
                  <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span className="text-xs font-bold text-blue-700 uppercase">📧 Notification Email (Simulée)</span>
                    </div>
                    <p className="text-xs text-gray-650 font-montserrat leading-relaxed">
                      <strong>Destinataire :</strong> {generatedCredentials.email}<br />
                      <strong>Objet :</strong> Bienvenue chez Air Froid - Vos identifiants<br />
                      <strong>Message :</strong> Bonjour {generatedCredentials.contact}, votre compte client a été créé par l'administrateur. Vos identifiants sont : Email: {generatedCredentials.email} | Mot de passe: {generatedCredentials.password}. Votre commercial dédié est {generatedCredentials.commercial}.
                    </p>
                  </div>

                  {/* WhatsApp simulation */}
                  <div className="p-4 rounded-xl border border-green-100 bg-green-50/50">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 rounded-full bg-green-500"></span>
                      <span className="text-xs font-bold text-green-700 uppercase">💬 Notification WhatsApp (Simulée)</span>
                    </div>
                    <p className="text-xs text-gray-650 font-montserrat leading-relaxed">
                      <strong>Numéro :</strong> {generatedCredentials.phone}<br />
                      <strong>Message :</strong> ❄️ *Air Froid* ❄️ Bonjour {generatedCredentials.contact}, bienvenue sur notre portail. Vos identifiants de connexion : Email: {generatedCredentials.email} | MDP temporaire: {generatedCredentials.password}. Commercial assigné: {generatedCredentials.commercial}.
                    </p>
                  </div>
                </div>

                <div className="w-full flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(`Email: ${generatedCredentials.email}\nMot de passe: ${generatedCredentials.password}`);
                      alert("Identifiants copiés !");
                    }}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Copier les identifiants
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setGeneratedCredentials(null);
                    }}
                    className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
                  >
                    Terminer
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddClientSubmit} className="space-y-5">
                <div>
                  <h3 className="font-nevan text-xl text-gray-900 uppercase tracking-wide mb-1">
                    Ajouter un nouveau client
                  </h3>
                  <p className="font-montserrat text-xs text-gray-500">
                    Créez un compte client directement et assignez-lui un commercial.
                  </p>
                </div>

                {addError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-650 text-xs font-semibold font-montserrat">
                    {addError}
                  </div>
                )}

                {/* Tabs Type B2B / B2C */}
                <div>
                  <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-2">Typologie du client</label>
                  <div className="grid grid-cols-2 gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200/50">
                    <button
                      type="button"
                      onClick={() => setNewClient({ ...newClient, type: "B2B" })}
                      className={`py-2 rounded-lg text-xs font-bold font-montserrat transition-all ${
                        newClient.type === "B2B"
                          ? "bg-white text-[#10748E] shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Professionnel (B2B)
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewClient({ ...newClient, type: "B2C", ice: "" })}
                      className={`py-2 rounded-lg text-xs font-bold font-montserrat transition-all ${
                        newClient.type === "B2C"
                          ? "bg-white text-[#10748E] shadow-sm"
                          : "text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      Particulier (B2C)
                    </button>
                  </div>
                </div>

                {/* Row: Entreprise & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      {newClient.type === "B2B" ? "Nom de l'Entreprise *" : "Nom Complet *"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={newClient.type === "B2B" ? "Ex: Hôtel Royal" : "Ex: Jean Dupont"}
                      value={newClient.company}
                      onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      Contact Principal *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mohamed Alami"
                      value={newClient.contact}
                      onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                </div>

                {/* ICE (only if B2B) */}
                {newClient.type === "B2B" && (
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      ICE (Identifiant Commun de l'Entreprise)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 001594823000084"
                      value={newClient.ice}
                      onChange={(e) => setNewClient({ ...newClient, ice: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                )}

                {/* Row: Email & Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      Email de Connexion *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="client@domaine.ma"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      N° Téléphone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: +212 661-123456"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                </div>

                {/* Row: Ville & Commercial */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Marrakech"
                      value={newClient.city}
                      onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-montserrat text-xs font-bold text-gray-700 uppercase block mb-1.5">
                      Commercial Assigné *
                    </label>
                    <select
                      value={newClient.commercial}
                      onChange={(e) => setNewClient({ ...newClient, commercial: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm"
                    >
                      {COMMERCIALS.map(comm => (
                        <option key={comm} value={comm}>{comm}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setGeneratedCredentials(null);
                    }}
                    className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors shadow-md shadow-[#10748E]/10"
                  >
                    Valider & Créer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
