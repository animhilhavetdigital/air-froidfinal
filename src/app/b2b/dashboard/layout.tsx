"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  FileText, 
  Clock, 
  Settings, 
  LogOut,
  FolderOpen,
  MessageSquare,
  Package
} from "lucide-react";

const SIDEBAR_LINKS = [
  { href: "/b2b/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/b2b/dashboard/catalogue", label: "Catalogue Pro", icon: Package },
  { href: "/b2b/dashboard/devis", label: "Demande de Devis", icon: FileText },
  { href: "/b2b/dashboard/suivi", label: "Suivi & Historique", icon: Clock },
];

export default function B2BDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full md:w-72 bg-white border-r border-gray-200 shrink-0 sticky top-0 md:h-screen flex flex-col overflow-y-auto z-20 shadow-sm">
        
        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-[#10748E] text-white flex items-center justify-center font-nevan text-xl shadow-md">
            M
          </div>
          <div>
            <h3 className="font-montserrat font-bold text-gray-900 leading-tight">Maroc Entreprise</h3>
            <span className="font-montserrat text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1 inline-block">Compte B2B Vérifié</span>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-2 flex-grow">
          <span className="font-nevan text-xs tracking-widest text-gray-400 uppercase ml-3 mb-2 mt-4">Menu Principal</span>
          
          {SIDEBAR_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-montserrat font-medium text-sm ${
                  isActive 
                    ? "bg-[#10748E]/10 text-[#10748E]" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={18} className={isActive ? "text-[#10748E]" : "text-gray-400"} />
                {link.label}
              </Link>
            );
          })}
          
          <span className="font-nevan text-xs tracking-widest text-gray-400 uppercase ml-3 mb-2 mt-8">Ressources</span>
          
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
            <FolderOpen size={18} className="text-gray-400" /> Documents techniques
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
            <MessageSquare size={18} className="text-gray-400" /> Support dédié
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all font-montserrat font-medium text-sm">
            <Settings size={18} className="text-gray-400" /> Mon profil pro
          </Link>

        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <Link href="/b2b" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#AF1818] hover:bg-red-50 transition-all font-montserrat font-medium text-sm">
            <LogOut size={18} /> Déconnexion
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 w-full relative">
        {children}
      </main>

    </div>
  );
}
