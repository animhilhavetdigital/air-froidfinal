
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  Clock,
  Settings,
  LogOut,
  FolderOpen,
  MessageSquare,
  Package,
  Users,
  Briefcase,
  Activity,
  UserCheck,
  Bell
} from "lucide-react";

const LINKS_SUPER_ADMIN = [
  { href: "/b2b/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/b2b/dashboard/demandes", label: "Demandes & Devis", icon: FileText },
  { href: "/b2b/dashboard/clients", label: "Comptes & Clients", icon: Briefcase },
  { href: "/b2b/dashboard/utilisateurs", label: "Utilisateurs", icon: Users },
  { href: "/b2b/dashboard/catalogue", label: "Catalogue Global", icon: Package },
  { href: "/b2b/dashboard/notifications", label: "Notifications", icon: Bell },
];

const LINKS_COMMERCIAL = [
  { href: "/b2b/dashboard", label: "Mon Tableau de bord", icon: LayoutDashboard },
  { href: "/b2b/dashboard/mes-demandes", label: "Mes Demandes", icon: FileText },
  { href: "/b2b/dashboard/mes-clients", label: "Mes Clients", icon: UserCheck },
  { href: "/b2b/dashboard/catalogue", label: "Catalogue", icon: Package },
  { href: "/b2b/dashboard/notifications", label: "Notifications", icon: Bell },
];

const LINKS_CLIENT_B2B = [
  { href: "/b2b/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/b2b/dashboard/catalogue", label: "Catalogue Pro", icon: Package },
  { href: "/b2b/dashboard/devis", label: "Demande de Devis", icon: FileText },
  { href: "/b2b/dashboard/suivi", label: "Suivi & Historique", icon: Clock },
  { href: "/b2b/dashboard/notifications", label: "Notifications", icon: Bell },
];

export default function B2BDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);
  const [pendingClientsCount, setPendingClientsCount] = useState(0);

  useEffect(() => {
    const savedRole = localStorage.getItem("afe_mock_role") || "client_b2b";
    setRole(savedRole);

    const updateCounts = () => {
      const activeRole = localStorage.getItem("afe_mock_role") || "client_b2b";
      // Update role if changed
      setRole(activeRole);

      // Notification count
      const savedNotifs = localStorage.getItem("afe_notifications");
      if (savedNotifs) {
        const notifs = JSON.parse(savedNotifs);
        const unread = notifs.filter((n: any) => n.role === activeRole && !n.read).length;
        setUnreadNotifsCount(unread);
      } else {
        setUnreadNotifsCount(3);
      }

      // Pending clients count
      const savedClients = localStorage.getItem("afe_clients");
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        const pending = clients.filter((c: any) => c.status === "En attente").length;
        setPendingClientsCount(pending);
      }
    };

    updateCounts();
    const interval = setInterval(updateCounts, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem("afe_mock_role");
    router.push("/b2b");
  };

  if (!role) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;

  let activeLinks = LINKS_CLIENT_B2B;
  let userName = "Maroc Entreprise";
  let userBadge = "Compte B2B Vérifié";
  let badgeColor = "text-green-600 bg-green-50";

  if (role === "super_admin") {
    activeLinks = LINKS_SUPER_ADMIN;
    userName = "Mada Admin";
    userBadge = "Super Administrateur";
    badgeColor = "text-[#AF1818] bg-[#AF1818]/10";
  } else if (role === "commercial") {
    activeLinks = LINKS_COMMERCIAL;
    userName = "Youssef (Commercial)";
    userBadge = "Équipe Commerciale";
    badgeColor = "text-[#32A5DE] bg-[#32A5DE]/10";
  } else if (role === "client_b2b") {
    if (typeof window !== "undefined") {
      const currentClientId = localStorage.getItem("afe_current_client_id") || "CLI-402";
      const savedClients = localStorage.getItem("afe_clients");
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        const client = clients.find((c: any) => c.id === currentClientId);
        if (client) {
          userName = client.company;
        }
      }
    }
  }

  const getBadge = (href: string) => {
    if (role === "super_admin") {
      if (href === "/b2b/dashboard/demandes") return { count: 2, className: "bg-[#AF1818] text-white" };
      if (href === "/b2b/dashboard/clients") return { count: pendingClientsCount, className: "bg-amber-500 text-white" };
      if (href === "/b2b/dashboard/messagerie") return { count: 3, className: "bg-[#32A5DE] text-white" };
      if (href === "/b2b/dashboard/notifications") return { count: unreadNotifsCount, className: "bg-[#AF1818] text-white animate-pulse" };
    } else if (role === "commercial") {
      if (href === "/b2b/dashboard/mes-demandes") return { count: 2, className: "bg-[#AF1818] text-white" };
      if (href === "/b2b/dashboard/messagerie") return { count: 4, className: "bg-[#32A5DE] text-white" };
      if (href === "/b2b/dashboard/notifications") return { count: unreadNotifsCount, className: "bg-[#AF1818] text-white animate-pulse" };
    } else if (role === "client_b2b") {
      if (href === "/b2b/dashboard/devis") return { count: 1, className: "bg-[#AF1818] text-white" };
      if (href === "/b2b/dashboard/suivi") return { count: "Actif", className: "bg-[#00883C] text-white text-[9px]" };
      if (href === "/b2b/dashboard/support") return { count: 1, className: "bg-[#32A5DE] text-white" };
      if (href === "/b2b/dashboard/notifications") return { count: unreadNotifsCount, className: "bg-[#AF1818] text-white animate-pulse" };
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 shrink-0 sticky top-0 md:h-screen flex flex-col overflow-y-auto z-20 shadow-sm">

        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#10748E] text-white flex items-center justify-center font-nevan text-xl shadow-md uppercase">
            {userName.charAt(0)}
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-gray-900 leading-tight">{userName}</h3>
            <span className={`font-montserrat text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wider ${badgeColor}`}>
              {userBadge}
            </span>
          </div>
        </div>

        {/* MOCK ROLE SWITCHER */}
        <div className="p-4 mx-4 my-3 bg-[#10748E]/5 border border-[#10748E]/10 rounded-2xl flex flex-col gap-1.5 shadow-sm">
          <label className="font-montserrat text-[9px] font-bold text-[#10748E]/80 uppercase tracking-widest block">Simuler le rôle :</label>
          <select
            value={role}
            onChange={(e) => {
              localStorage.setItem("afe_mock_role", e.target.value);
              window.location.reload();
            }}
            className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 font-montserrat text-xs text-gray-700 focus:outline-none focus:border-[#10748E] cursor-pointer shadow-sm"
          >
            <option value="client_b2b">Client B2B (Maroc Entreprise)</option>
            <option value="commercial">Commercial (Youssef)</option>
            <option value="super_admin">Super Admin (Mada Admin)</option>
          </select>
        </div>

        <nav className="p-4 flex flex-col gap-2 flex-grow">
          <span className="font-nevan text-xs tracking-widest text-gray-400 uppercase ml-3 mb-2 mt-4">Menu Principal</span>

          {activeLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            const badge = getBadge(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 font-montserrat font-medium text-sm ${isActive
                    ? "bg-[#10748E]/10 text-[#10748E]"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? "text-[#10748E]" : "text-gray-400"} />
                  {link.label}
                </div>
                {badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.className}`}>
                    {badge.count}
                  </span>
                )}
              </Link>
            );
          })}

          <span className="font-nevan text-xs tracking-widest text-gray-400 uppercase ml-3 mb-2 mt-8">Ressources</span>

          {role === "client_b2b" ? (
            <>
              <Link href="/b2b/dashboard/documents" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
                <div className="flex items-center gap-3">
                  <FolderOpen size={18} className="text-gray-400" /> Documents techniques
                </div>
              </Link>
              <Link href="/b2b/dashboard/support" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-gray-400" /> Support dédié
                </div>
                {getBadge("/b2b/dashboard/support") && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadge("/b2b/dashboard/support")!.className}`}>
                    {getBadge("/b2b/dashboard/support")!.count}
                  </span>
                )}
              </Link>
            </>
          ) : (
            <>
              <Link href="/b2b/dashboard/statistiques" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-gray-400" /> {role === "super_admin" ? "Statistiques" : "Ma Performance"}
                </div>
              </Link>
              <Link href="/b2b/dashboard/messagerie" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-gray-400" /> Messagerie interne
                </div>
                {getBadge("/b2b/dashboard/messagerie") && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBadge("/b2b/dashboard/messagerie")!.className}`}>
                    {getBadge("/b2b/dashboard/messagerie")!.count}
                  </span>
                )}
              </Link>
            </>
          )}

          <Link href="/b2b/dashboard/profil" className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
            <div className="flex items-center gap-3">
              <Settings size={18} className="text-gray-400" /> Paramètres Profil
            </div>
          </Link>

        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#AF1818] hover:bg-red-50 transition-all font-montserrat font-medium text-sm">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

    </div>
  );
}
