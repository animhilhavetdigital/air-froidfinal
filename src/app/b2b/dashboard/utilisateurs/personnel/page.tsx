"use client";

import { useRef, useState, useEffect } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  ShieldAlert, 
  Mail, 
  UserCheck, 
  X, 
  Check,
  ChevronDown,
  Settings
} from "lucide-react";

// Mock staff list (Super Admin + Commercial)
const INITIAL_STAFF = [
  { id: 1, name: "Mada Admin", email: "admin@airfroidexpert.ma", role: "Super Admin", status: "Actif", lastConn: "Il y a 5 min", scope: "Global" },
  { id: 2, name: "Youssef El Alami", email: "y.alami@airfroidexpert.ma", role: "Commercial", status: "Actif", lastConn: "Aujourd'hui, 09:24", scope: "Marrakech & Régions" },
  { id: 3, name: "Sara Belghiti", email: "s.belghiti@airfroidexpert.ma", role: "Commercial / Bureau d'études", status: "Actif", lastConn: "Hier, 17:40", scope: "Études & Devis" },
];

export default function PersonnelPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [staff, setStaff] = useState(INITIAL_STAFF);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tous");
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});

  // Permissions State
  interface CommercialPermissions {
    b2b: boolean;
    b2bAdd: boolean;
    b2c: boolean;
    b2cAdd: boolean;
    editCatalog: boolean;
    editClient: boolean;
  }
  const DEFAULT_PERMISSIONS: CommercialPermissions = {
    b2b: true,
    b2bAdd: true,
    b2c: true,
    b2cAdd: true,
    editCatalog: true,
    editClient: true
  };
  const [commercialPermissions, setCommercialPermissions] = useState<Record<number, CommercialPermissions>>({});
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const [editingPermissions, setEditingPermissions] = useState<CommercialPermissions>({ ...DEFAULT_PERMISSIONS });

  useEffect(() => {
    const saved = localStorage.getItem("afe_commercial_permissions");
    if (saved) {
      setCommercialPermissions(JSON.parse(saved));
    } else {
      const initialPerms = {
        2: { ...DEFAULT_PERMISSIONS },
        3: { ...DEFAULT_PERMISSIONS }
      };
      localStorage.setItem("afe_commercial_permissions", JSON.stringify(initialPerms));
      setCommercialPermissions(initialPerms);
    }
  }, []);

  const openPermissionsFor = (id: number) => {
    setSelectedStaffId(id);
    const current = commercialPermissions[id] || { ...DEFAULT_PERMISSIONS };
    setEditingPermissions(current);
    setShowPermissionsModal(true);
  };

  // Invitation Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserRole, setNewUserRole] = useState("Commercial");
  const [newUserScope, setNewUserScope] = useState("Marrakech & Régions");

  useGSAP(() => {
    gsap.fromTo(".usr-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
    );
  }, { scope: containerRef });

  const filteredStaff = staff.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "Tous" || 
                        (selectedRole === "Bureau d'études" ? u.role.includes("Bureau d'études") : u.role.includes(selectedRole));
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (id: number) => {
    setStaff(prev => prev.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === "Actif" ? "Suspendu" : "Actif" };
      }
      return u;
    }));
  };

  const handleInviteUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) return;

    const newUser = {
      id: staff.length + 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      status: "Actif",
      lastConn: "Jamais connecté",
      scope: newUserScope
    };

    setStaff(prev => [newUser, ...prev]);
    
    // Reset Form
    setNewUserName("");
    setNewUserEmail("");
    setShowInviteModal(false);
  };

  return (
    <div ref={containerRef} className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="usr-item flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Gestion du Personnel</h1>
          <p className="font-montserrat text-gray-500">Gérez les comptes Super Admin et commerciaux, leurs rôles et permissions.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="w-full md:w-auto justify-center flex items-center gap-2 px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase hover:bg-[#0c5a6e] transition-colors shadow-lg shadow-[#10748E]/20"
        >
          <UserPlus size={18} /> Inviter un collaborateur
        </button>
      </div>

      {/* Stats Cards */}
      <div className="usr-item grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4 col-span-2 md:col-span-1">
          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-[#10748E]/10 rounded-xl flex items-center justify-center text-[#10748E] shrink-0">
            <Users className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Total Collaborateurs</div>
            <div className="font-nevan text-xl sm:text-2xl text-gray-900 mt-1">{staff.length}</div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0">
            <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Utilisateurs Actifs</div>
            <div className="font-nevan text-xl sm:text-2xl text-gray-900 mt-1">{staff.filter(u => u.status === "Actif").length}</div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 sm:gap-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 shrink-0">
            <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">En Attente d'activation</div>
            <div className="font-nevan text-xl sm:text-2xl text-gray-900 mt-1">{staff.filter(u => u.status === "En attente").length}</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="usr-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder="Rechercher par nom, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] font-montserrat text-sm"
          />
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="font-montserrat text-xs font-bold text-gray-400 uppercase shrink-0">Rôle:</span>
          <select 
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#10748E] font-montserrat text-sm w-full md:w-48"
          >
            <option value="Tous">Tous les rôles</option>
            <option value="Admin">Super Admin</option>
            <option value="Commercial">Commerciaux</option>
            <option value="Bureau d'études">Bureau d'études</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="usr-item bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8">
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[900px] text-left font-montserrat text-sm">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold uppercase text-xs tracking-wider">
              <tr>
                <th className="px-6 py-4">Nom complet</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Périmètre d'affectation</th>
                <th className="px-6 py-4">Dernière connexion</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Permissions</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.length > 0 ? (
                filteredStaff.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#10748E]/10 text-[#10748E] font-nevan text-sm flex items-center justify-center">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{u.name}</div>
                          <div className="text-gray-400 text-xs">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{u.role}</td>
                    <td className="px-6 py-4 text-gray-500">{u.scope}</td>
                    <td className="px-6 py-4 text-gray-500">{u.lastConn}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit ${
                        u.status === 'Actif' ? 'bg-green-50 text-green-700' : 
                        u.status === 'En attente' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                      }`}>
                        {u.status === 'Actif' ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.role.includes("Commercial") ? (
                        <button
                          onClick={() => openPermissionsFor(u.id)}
                          className="px-3 py-1.5 text-xs font-bold font-montserrat text-[#10748E] bg-[#10748E]/10 border border-[#10748E]/25 hover:bg-[#10748E]/20 rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Settings size={14} /> Gérer
                        </button>
                      ) : (
                        <span className="text-gray-300 text-xs">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== 1 && (
                        <button 
                          onClick={() => toggleUserStatus(u.id)}
                          className={`text-xs font-bold font-montserrat px-3 py-1.5 rounded-lg border transition-colors ${
                            u.status === "Actif"
                              ? "bg-red-50 text-[#AF1818] border-red-100 hover:bg-red-100"
                              : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                          }`}
                        >
                          {u.status === "Actif" ? "Suspendre" : "Réactiver"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500 font-montserrat">
                    Aucun membre du personnel trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Accordion View */}
        <div className="block md:hidden divide-y divide-gray-100 font-montserrat">
          {filteredStaff.length > 0 ? (
            filteredStaff.map((u) => {
              const isExpanded = !!expandedRows[u.id];
              return (
                <div key={u.id} className="p-4 flex flex-col transition-all">
                  {/* Item Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedRows(prev => ({ ...prev, [u.id]: !prev[u.id] }))}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors shrink-0 ${
                        isExpanded ? 'bg-[#10748E] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        <ChevronDown size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="font-bold text-gray-900 text-sm truncate max-w-[150px] sm:max-w-[250px]">{u.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase shrink-0">({u.role})</span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit shrink-0 ${
                      u.status === 'Actif' ? 'bg-green-50 text-green-700' : 
                      u.status === 'En attente' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {u.status}
                    </span>
                  </div>

                  {/* Expanded Item Details */}
                  {isExpanded && (
                    <div className="mt-4 pl-10 pr-2 space-y-3.5 border-l-2 border-gray-100/80 animate-in fade-in duration-200">
                      <div className="grid grid-cols-3 gap-y-3 py-1 font-montserrat text-xs">
                        <span className="text-gray-400 font-bold uppercase">Email</span>
                        <span className="col-span-2 text-gray-900 font-semibold break-all">{u.email}</span>

                        <span className="text-gray-400 font-bold uppercase">Rôle</span>
                        <span className="col-span-2 text-gray-900 font-semibold">{u.role}</span>

                        <span className="text-gray-400 font-bold uppercase">Périmètre</span>
                        <span className="col-span-2 text-gray-900 font-semibold">{u.scope}</span>

                        <span className="text-gray-400 font-bold uppercase">Dernière co.</span>
                        <span className="col-span-2 text-gray-500 font-semibold">{u.lastConn}</span>

                        <span className="text-gray-400 font-bold uppercase">Status</span>
                        <span className="col-span-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 w-fit ${
                            u.status === 'Actif' ? 'bg-green-50 text-green-700' : 
                            u.status === 'En attente' ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {u.status === 'Actif' ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
                            {u.status}
                          </span>
                        </span>

                        <span className="text-gray-400 font-bold uppercase self-center">Permissions</span>
                        <span className="col-span-2">
                          {u.role.includes("Commercial") ? (
                            <button
                              onClick={() => openPermissionsFor(u.id)}
                              className="px-3 py-1.5 text-[10px] font-bold font-montserrat text-[#10748E] bg-[#10748E]/10 border border-[#10748E]/25 hover:bg-[#10748E]/20 rounded-lg transition-colors flex items-center gap-1.5 w-fit"
                            >
                              <Settings size={12} /> Gérer
                            </button>
                          ) : (
                            <span className="text-gray-300 text-xs">-</span>
                          )}
                        </span>

                        {u.id !== 1 && (
                          <>
                            <span className="text-gray-400 font-bold uppercase self-center">Action</span>
                            <div className="col-span-2 flex gap-2">
                              <button 
                                onClick={() => toggleUserStatus(u.id)}
                                className={`text-[10px] font-bold font-montserrat px-3 py-1.5 rounded-lg border transition-colors ${
                                  u.status === "Actif"
                                    ? "bg-red-50 text-[#AF1818] border-red-100 hover:bg-red-100"
                                    : "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                                }`}
                              >
                                {u.status === "Actif" ? "Suspendre" : "Réactiver"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 font-montserrat text-sm">
              Aucun membre du personnel trouvé.
            </div>
          )}
        </div>

      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowInviteModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <h2 className="font-nevan text-lg text-gray-900 uppercase">Inviter un collaborateur</h2>
              <button onClick={() => setShowInviteModal(false)} className="p-2 text-gray-400 hover:text-gray-955 rounded-xl transition-colors shrink-0">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleInviteUser} className="p-6 space-y-4">
              <div>
                <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Nom complet</label>
                <input 
                  type="text" 
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ex: Sara Benjelloun"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Adresse email pro</label>
                <input 
                  type="email" 
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="Ex: s.benjelloun@airfroidexpert.ma"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat text-sm"
                />
              </div>

              <div>
                <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Rôle</label>
                <select 
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat text-sm"
                >
                  <option value="Commercial">Commercial</option>
                  <option value="Commercial / Bureau d'études">Bureau d'études</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block font-montserrat text-xs font-bold text-gray-500 uppercase mb-1.5">Périmètre d'affectation</label>
                <input 
                  type="text" 
                  required
                  value={newUserScope}
                  onChange={(e) => setNewUserScope(e.target.value)}
                  placeholder="Ex: Marrakech & Régions Nord"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#10748E] focus:ring-1 focus:ring-[#10748E] transition-all font-montserrat text-sm"
                />
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Check size={16} /> Envoyer l'invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {showPermissionsModal && selectedStaffId && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowPermissionsModal(false)} />
          
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative z-10 animate-in zoom-in-95 duration-200 font-montserrat">
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">
              <div>
                <h2 className="font-nevan text-lg text-gray-900 uppercase">Gérer les Permissions</h2>
                <p className="text-xs text-gray-400 mt-1">Configurez les accès pour <strong className="text-gray-700">{staff.find(s => s.id === selectedStaffId)?.name}</strong></p>
              </div>
              <button onClick={() => setShowPermissionsModal(false)} className="p-2 text-gray-400 hover:text-gray-955 rounded-xl transition-colors shrink-0">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                
                {/* Permission B2B Group */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingPermissions.b2b}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditingPermissions(prev => ({
                          ...prev,
                          b2b: checked,
                          b2bAdd: checked ? prev.b2bAdd : false
                        }));
                      }}
                      className="w-4.5 h-4.5 text-[#10748E] focus:ring-[#10748E] border-gray-300 rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-sm text-gray-900 block">Accès Clients & Demandes B2B</span>
                      <span className="text-xs text-gray-500 block mt-0.5">Permet de voir le portefeuille clients et demandes B2B</span>
                    </div>
                  </label>
                  
                  <div className={`pl-7 border-l-2 border-gray-200/60 ml-2 space-y-2 transition-opacity duration-200 ${editingPermissions.b2b ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        disabled={!editingPermissions.b2b}
                        checked={editingPermissions.b2bAdd}
                        onChange={(e) => setEditingPermissions(prev => ({ ...prev, b2bAdd: e.target.checked }))}
                        className="w-4 h-4 text-[#10748E] focus:ring-[#10748E] border-gray-300 rounded mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-xs text-gray-800 block">Ajouter des clients B2B</span>
                        <span className="text-[10px] text-gray-400 block">Permet d'inscrire de nouveaux comptes pro</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Permission B2C Group */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingPermissions.b2c}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setEditingPermissions(prev => ({
                          ...prev,
                          b2c: checked,
                          b2cAdd: checked ? prev.b2cAdd : false
                        }));
                      }}
                      className="w-4.5 h-4.5 text-[#10748E] focus:ring-[#10748E] border-gray-300 rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-sm text-gray-900 block">Accès Demandes B2C</span>
                      <span className="text-xs text-gray-500 block mt-0.5">Permet d'accéder aux dossiers de devis particuliers B2C</span>
                    </div>
                  </label>
                  
                  <div className={`pl-7 border-l-2 border-gray-200/60 ml-2 space-y-2 transition-opacity duration-200 ${editingPermissions.b2c ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input 
                        type="checkbox"
                        disabled={!editingPermissions.b2c}
                        checked={editingPermissions.b2cAdd}
                        onChange={(e) => setEditingPermissions(prev => ({ ...prev, b2cAdd: e.target.checked }))}
                        className="w-4 h-4 text-[#10748E] focus:ring-[#10748E] border-gray-300 rounded mt-0.5"
                      />
                      <div>
                        <span className="font-semibold text-xs text-gray-800 block">Ajouter devis rapide (B2C)</span>
                        <span className="text-[10px] text-gray-400 block">Permet de créer manuellement un prospect B2C</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Catalog Edit Permission */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingPermissions.editCatalog}
                      onChange={(e) => setEditingPermissions(prev => ({ ...prev, editCatalog: e.target.checked }))}
                      className="w-4.5 h-4.5 text-[#10748E] focus:ring-[#10748E] border-gray-300 rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-sm text-gray-900 block">Modifier le Catalogue</span>
                      <span className="text-xs text-gray-500 block mt-0.5">Ajout de produits, modification des tarifs, exports avancés</span>
                    </div>
                  </label>
                </div>

                {/* Client Edit Permission */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input 
                      type="checkbox"
                      checked={editingPermissions.editClient}
                      onChange={(e) => setEditingPermissions(prev => ({ ...prev, editClient: e.target.checked }))}
                      className="w-4.5 h-4.5 text-[#10748E] focus:ring-[#10748E] border-gray-300 rounded mt-0.5"
                    />
                    <div>
                      <span className="font-bold text-sm text-gray-900 block">Modifier les Fiches Clients</span>
                      <span className="text-xs text-gray-500 block mt-0.5">Modifier la vue d'ensemble (le Responsable reste verrouillé)</span>
                    </div>
                  </label>
                </div>

              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowPermissionsModal(false)}
                  className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    if (selectedStaffId) {
                      const newPerms = { ...commercialPermissions, [selectedStaffId]: editingPermissions };
                      setCommercialPermissions(newPerms);
                      localStorage.setItem("afe_commercial_permissions", JSON.stringify(newPerms));
                      
                      // Also update catalogPermissions for backward compatibility/active triggers
                      const savedCatalog = localStorage.getItem("afe_commercial_catalog_permissions");
                      const catalogMap = savedCatalog ? JSON.parse(savedCatalog) : {};
                      catalogMap[selectedStaffId] = editingPermissions.editCatalog;
                      localStorage.setItem("afe_commercial_catalog_permissions", JSON.stringify(catalogMap));
                    }
                    setShowPermissionsModal(false);
                  }}
                  className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-2 shadow-md"
                >
                  <Check size={16} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
