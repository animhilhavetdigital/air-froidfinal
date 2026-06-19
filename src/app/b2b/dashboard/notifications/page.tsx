"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import Link from "next/link";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  AlertCircle, 
  MessageSquare, 
  FileText, 
  Briefcase, 
  Wrench,
  Clock,
  X,
  ArrowRight,
  Info
} from "lucide-react";

interface Notification {
  id: number;
  type: string;
  title: string;
  desc: string;
  time: string;
  read: boolean;
  category: string;
  href?: string;
}

const NOTIFS_SUPER_ADMIN: Notification[] = [
  { id: 1, type: "Urgent", title: "Nouveau client B2B en attente de validation", desc: "La société 'Société Al Boustane' s'est inscrite avec l'ICE 001928374000123 et attend sa validation pour accéder aux tarifs professionnels.", time: "Il y a 10 minutes", read: false, category: "clients", href: "/b2b/dashboard/clients" },
  { id: 2, type: "Nouveau", title: "Nouvelle demande de devis reçue", desc: "L'Hôtel Royal Atlas a soumis une demande de devis REQ-102 pour un système de climatisation VRV/DRV.", time: "Il y a 1 heure", read: false, category: "demandes", href: "/b2b/dashboard/demandes" },
  { id: 3, type: "Message", title: "Messages non lus dans la messagerie", desc: "Le commercial Youssef vous a envoyé 3 messages concernant le dossier de la Clinique Al Kaoutar.", time: "Il y a 3 heures", read: false, category: "messagerie", href: "/b2b/dashboard/messagerie" },
  { id: 4, type: "Système", title: "Mise à jour système réussie", desc: "La plateforme Air Froid Expert a été mise à jour avec succès en version 2.4.1 (optimisation du moteur de recherche du catalogue).", time: "Hier, à 18:00", read: true, category: "system" }
];

const NOTIFS_COMMERCIAL: Notification[] = [
  { id: 1, type: "Nouveau", title: "Nouveau dossier assigné", desc: "L'administrateur vous a assigné la demande REQ-102 (Hôtel Royal Atlas) pour l'étude thermique du projet VRV/DRV.", time: "Il y a 30 minutes", read: false, category: "demandes", href: "/b2b/dashboard/mes-demandes" },
  { id: 2, type: "Message", title: "Nouveaux messages clients", desc: "Maroc Entreprise a envoyé 4 messages dans le fil de discussion au sujet de la livraison de Nouaceur.", time: "Il y a 1 heure", read: false, category: "messagerie", href: "/b2b/dashboard/messagerie" },
  { id: 3, type: "Rappel", title: "Devis en attente de rédaction", desc: "Rappel : Le devis pour le projet Riad Dar Anika doit être rédigé et envoyé avant demain soir.", time: "Il y a 4 heures", read: false, category: "demandes", href: "/b2b/dashboard/mes-demandes" }
];

const NOTIFS_CLIENT_B2B: Notification[] = [
  { id: 1, type: "Chantier", title: "Pose des unités intérieures validée", desc: "L'étape 'Pose des unités intérieures' a été marquée comme terminée par l'équipe technique pour le projet de Nouaceur.", time: "Il y a 15 minutes", read: false, category: "suivi", href: "/b2b/dashboard/suivi" },
  { id: 2, type: "Devis", title: "Nouveau devis disponible pour signature", desc: "Sara a partagé la cotation finale pour le système VMC Double Flux. Vous pouvez la consulter et la valider.", time: "Il y a 2 heures", read: false, category: "devis", href: "/b2b/dashboard/devis" },
  { id: 3, type: "Message", title: "Nouveau message de l'expert technique", desc: "Notre expert technique a répondu à votre question concernant la compatibilité du thermostat intelligent.", time: "Il y a 5 heures", read: false, category: "messagerie", href: "/b2b/dashboard/messagerie" }
];

export default function NotificationsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"toutes" | "non-lues" | "urgentes">("toutes");
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  useEffect(() => {
    const savedRole = localStorage.getItem("afe_mock_role") || "client_b2b";
    setRole(savedRole);

    const savedNotifs = localStorage.getItem("afe_notifications");
    let allNotifs: Notification[] = [];
    if (savedNotifs) {
      allNotifs = JSON.parse(savedNotifs);
    } else {
      // Merge initial ones with roles
      allNotifs = [
        ...NOTIFS_SUPER_ADMIN.map(n => ({ ...n, role: "super_admin" })),
        ...NOTIFS_COMMERCIAL.map(n => ({ ...n, role: "commercial" })),
        ...NOTIFS_CLIENT_B2B.map(n => ({ ...n, role: "client_b2b" }))
      ] as any;
      localStorage.setItem("afe_notifications", JSON.stringify(allNotifs));
    }

    // Merge client_b2b local demands if needed
    if (savedRole === "client_b2b") {
      const localDemands = JSON.parse(localStorage.getItem("afe_my_demandes") || "[]");
      if (localDemands.length > 0) {
        const addedNotifs = localDemands.map((d: any, idx: number) => ({
          id: 100 + idx,
          type: "Demande B2B",
          title: `Votre demande pour ${d.product} est en cours`,
          desc: `La demande de cotation ${d.id} a bien été enregistrée et transmise au bureau d'études.`,
          time: "Il y a quelques secondes",
          read: false,
          category: "devis",
          href: "/b2b/dashboard/suivi",
          role: "client_b2b"
        }));
        // filter duplicates
        const filteredAdded = addedNotifs.filter((an: any) => !allNotifs.some((n: any) => n.id === an.id));
        allNotifs = [...filteredAdded, ...allNotifs];
      }
    }

    // Filter only those matching the current role
    setNotifications(allNotifs.filter((n: any) => n.role === savedRole));
  }, []);

  useGSAP(() => {
    if (notifications.length >= 0) {
      gsap.fromTo(".notif-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [role, notifications.length]);

  const filteredNotifs = useMemo(() => {
    return notifications.filter(n => {
      if (filter === "non-lues") return !n.read;
      if (filter === "urgentes") return n.type === "Urgent" || n.type === "Rappel";
      return true;
    });
  }, [notifications, filter]);

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    
    // Update in global list
    const savedNotifs = localStorage.getItem("afe_notifications");
    if (savedNotifs) {
      const all = JSON.parse(savedNotifs);
      const updatedAll = all.map((n: any) => n.role === role ? { ...n, read: true } : n);
      localStorage.setItem("afe_notifications", JSON.stringify(updatedAll));
    }
  };

  const handleClearAll = () => {
    setNotifications([]);
    
    // Clear in global list
    const savedNotifs = localStorage.getItem("afe_notifications");
    if (savedNotifs) {
      const all = JSON.parse(savedNotifs);
      const updatedAll = all.filter((n: any) => n.role !== role);
      localStorage.setItem("afe_notifications", JSON.stringify(updatedAll));
    }
  };

  const handleToggleRead = (id: number) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: !n.read } : n);
    setNotifications(updated);

    const savedNotifs = localStorage.getItem("afe_notifications");
    if (savedNotifs) {
      const all = JSON.parse(savedNotifs);
      const updatedAll = all.map((n: any) => n.id === id ? { ...n, read: !n.read } : n);
      localStorage.setItem("afe_notifications", JSON.stringify(updatedAll));
    }
  };

  const handleOpenNotif = (notif: Notification) => {
    setSelectedNotif(notif);
    
    const updated = notifications.map(n => n.id === notif.id ? { ...n, read: true } : n);
    setNotifications(updated);

    const savedNotifs = localStorage.getItem("afe_notifications");
    if (savedNotifs) {
      const all = JSON.parse(savedNotifs);
      const updatedAll = all.map((n: any) => n.id === notif.id ? { ...n, read: true } : n);
      localStorage.setItem("afe_notifications", JSON.stringify(updatedAll));
    }
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "clients": return <Briefcase size={20} className="text-amber-500" />;
      case "demandes": return <FileText size={20} className="text-[#AF1818]" />;
      case "messagerie": return <MessageSquare size={20} className="text-[#32A5DE]" />;
      case "devis": return <FileText size={20} className="text-green-600" />;
      case "suivi": return <Wrench size={20} className="text-blue-600" />;
      case "support": return <MessageSquare size={20} className="text-[#32A5DE]" />;
      default: return <Info size={20} className="text-gray-400" />;
    }
  };

  return (
    <div ref={containerRef} className="p-4 sm:p-6 md:p-10 max-w-4xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="notif-item flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-3">
            <Bell className="text-[#10748E]" /> Centre de Notifications
          </h1>
          <p className="font-montserrat text-gray-500 text-sm">
            Retrouvez tous vos messages, rappels, alertes et statuts de chantiers en temps réel.
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex gap-2">
            <button 
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl font-montserrat text-xs font-bold text-gray-600 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              <CheckCheck size={14} /> Tout lire
            </button>
            <button 
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-4 py-2 border border-red-100 rounded-xl font-montserrat text-xs font-bold text-[#AF1818] bg-red-50 hover:bg-red-100/50 transition-colors"
            >
              <Trash2 size={14} /> Tout effacer
            </button>
          </div>
        )}
      </div>

      {/* Tabs / Filters */}
      <div className="notif-item flex gap-2 border-b border-gray-100 pb-4">
        {[
          { id: "toutes", label: "Toutes les alertes" },
          { id: "non-lues", label: "Non lues" },
          { id: "urgentes", label: "Prioritaires" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-montserrat text-xs font-bold transition-all ${
              filter === tab.id
                ? "bg-[#10748E] text-white shadow-sm shadow-[#10748E]/10"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {tab.label} {tab.id === "non-lues" && notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-[#AF1818] text-white text-[9px]">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => handleOpenNotif(notif)}
              className={`notif-item bg-white p-5 rounded-2xl border transition-all duration-300 flex gap-4 items-start cursor-pointer hover:shadow-md hover:border-gray-200 ${
                !notif.read ? "border-l-4 border-l-[#10748E] border-gray-100 bg-white" : "border-gray-100 opacity-75"
              }`}
            >
              {/* Category Icon */}
              <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                {getIcon(notif.category)}
              </div>

              {/* Text content */}
              <div className="flex-grow">
                <div className="flex justify-between items-start gap-4 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-montserrat font-bold text-gray-900 text-sm md:text-base leading-tight">
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#10748E] shrink-0" />
                    )}
                  </div>
                  <span className="font-montserrat text-[10px] text-gray-400 whitespace-nowrap pt-0.5">
                    {notif.time}
                  </span>
                </div>
                
                <p className="font-montserrat text-xs md:text-sm text-gray-500 line-clamp-1 leading-relaxed">
                  {notif.desc}
                </p>

                <div className="flex items-center gap-3 mt-3">
                  <span className={`text-[10px] font-bold font-montserrat px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    notif.type === "Urgent" || notif.type === "Rappel"
                      ? "bg-red-50 text-[#AF1818]"
                      : notif.type === "Message"
                      ? "bg-blue-50 text-[#32A5DE]"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {notif.type}
                  </span>
                  <span className="text-[10px] font-semibold font-montserrat text-[#10748E] group-hover:underline flex items-center gap-0.5">
                    Consulter <ArrowRight size={10} />
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="notif-item bg-white border border-gray-100 rounded-3xl py-16 text-center shadow-sm">
            <Bell className="text-gray-300 mx-auto mb-4" size={48} />
            <h3 className="font-nevan text-xl text-gray-900 uppercase mb-2">Aucune notification</h3>
            <p className="font-montserrat text-gray-500 text-sm max-w-md mx-auto">
              Vous êtes à jour ! Aucun nouveau message ou alerte n'a été détecté pour le moment.
            </p>
          </div>
        )}
      </div>

      {/* Center Modal - Notification Details */}
      {selectedNotif && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedNotif(null)} />
          
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 animate-in zoom-in-95 duration-200 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                  {getIcon(selectedNotif.category)}
                </div>
                <div>
                  <span className="font-montserrat text-[10px] text-gray-400">{selectedNotif.time}</span>
                  <h3 className="font-nevan text-sm text-[#10748E] tracking-widest uppercase">{selectedNotif.type}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedNotif(null)}
                className="p-1.5 text-gray-400 hover:text-gray-950 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 my-2">
              <h2 className="font-montserrat font-bold text-gray-900 text-base md:text-lg leading-tight">
                {selectedNotif.title}
              </h2>
              <p className="font-montserrat text-sm text-gray-600 bg-gray-50 p-4 rounded-2xl leading-relaxed">
                {selectedNotif.desc}
              </p>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-gray-100 flex gap-3 mt-4">
              <button 
                onClick={() => setSelectedNotif(null)}
                className="flex-1 py-3 border border-gray-200 rounded-xl font-montserrat text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Fermer
              </button>
              {selectedNotif.href && (
                <Link 
                  href={selectedNotif.href}
                  onClick={() => setSelectedNotif(null)}
                  className="flex-1 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-xs tracking-wider uppercase hover:bg-[#0c5a6e] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Y accéder <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
