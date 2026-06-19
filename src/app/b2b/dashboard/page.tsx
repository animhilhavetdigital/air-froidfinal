"use client";

import { useEffect, useState, useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  Users,
  Briefcase,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

// ----------------------------------------------------
// MOCK DATA
// ----------------------------------------------------
const B2B_STATS = [
  { label: "Chantiers en cours", value: "3", icon: Clock, color: "text-[#10748E]", bg: "bg-[#10748E]/10" },
  { label: "Devis validés", value: "12", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  { label: "Interventions SAV", value: "1", icon: AlertCircle, color: "text-[#AF1818]", bg: "bg-[#AF1818]/10" },
  { label: "Économies d'énergie", value: "32%", icon: TrendingUp, color: "text-[#32A5DE]", bg: "bg-[#32A5DE]/10" },
];

const RECENT_PROJECTS = [
  { id: "PRJ-2026-042", name: "Installation VRV Siège Casablanca", status: "En cours", date: "12 Mai 2026", progress: 65 },
  { id: "PRJ-2026-038", name: "Maintenance Annuelle Entrepôt Tanger", status: "Planifié", date: "28 Mai 2026", progress: 0 },
  { id: "PRJ-2025-189", name: "Parc Solaire Usine Kénitra", status: "Terminé", date: "15 Fév 2026", progress: 100 },
];

const ADMIN_STATS = [
  { label: "Nouvelles Demandes", value: "24", icon: FileText, color: "text-[#10748E]", bg: "bg-[#10748E]/10" },
  { label: "Devis en Attente", value: "8", icon: Clock, color: "text-orange-600", bg: "bg-orange-100" },
  { label: "Comptes à Valider", value: "5", icon: Users, color: "text-[#AF1818]", bg: "bg-[#AF1818]/10" },
  { label: "Taux de Conversion", value: "45%", icon: TrendingUp, color: "text-green-600", bg: "bg-green-100" },
];

const ADMIN_RECENT_REQUESTS = [
  { id: "REQ-102", client: "Hôtel Royal Atlas", source: "B2B", status: "Nouveau", resp: "Non assigné" },
  { id: "REQ-101", client: "Supermarché Marjane", source: "Formulaire", status: "Analyse", resp: "Youssef" },
  { id: "REQ-100", client: "Client Particulier (Villa)", source: "WhatsApp", status: "Devis Envoyé", resp: "Sara" },
];

const COMMERCIAL_STATS = [
  { label: "Mes Demandes", value: "12", icon: Briefcase, color: "text-[#10748E]", bg: "bg-[#10748E]/10" },
  { label: "Devis à Rédiger", value: "3", icon: FileText, color: "text-orange-600", bg: "bg-orange-100" },
  { label: "Relances du jour", value: "5", icon: AlertCircle, color: "text-[#AF1818]", bg: "bg-[#AF1818]/10" },
  { label: "Devis Signés (Mois)", value: "8", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
];

const COMMERCIAL_TASKS = [
  { title: "Relancer Hôtel Royal (Devis VRV)", type: "Relance", time: "Aujourd'hui, 14:00" },
  { title: "Préparer chiffrage chambre froide", type: "Devis", time: "Demain, 10:00" },
  { title: "Appeler lead WhatsApp #458", type: "Qualification", time: "En retard" },
];

// ----------------------------------------------------
// COMPONENTS
// ----------------------------------------------------

function B2BDashboard() {
  return (
    <>
      <div className="dash-item mb-10">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Vue d'ensemble</h1>
        <p className="font-montserrat text-gray-500">Bienvenue sur votre espace professionnel. Voici un résumé de vos activités.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {B2B_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="dash-item bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <span className="font-montserrat text-xs sm:text-sm font-semibold text-gray-500 leading-tight">{stat.label}</span>
              </div>
              <div className="font-nevan text-2xl sm:text-4xl text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="dash-item lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Projets récents</h2>
            <Link href="/b2b/dashboard/suivi" className="font-montserrat text-sm font-semibold text-[#10748E] hover:underline">Voir tout</Link>
          </div>
          <div className="p-0">
            {RECENT_PROJECTS.map((project, idx) => (
              <div key={idx} className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 last:border-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-nevan text-sm text-gray-400">{project.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-montserrat ${
                      project.status === 'Terminé' ? 'bg-green-100 text-green-700' :
                      project.status === 'En cours' ? 'bg-blue-100 text-[#10748E]' : 'bg-orange-100 text-orange-700'
                    }`}>{project.status}</span>
                  </div>
                  <h3 className="font-montserrat font-bold text-gray-900">{project.name}</h3>
                </div>
                <div className="w-full md:w-48">
                  <div className="flex justify-between text-xs font-montserrat mb-1">
                    <span className="text-gray-500">Progression</span>
                    <span className="font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-[#10748E]'}`} style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dash-item flex flex-col gap-6">
          <div className="bg-[#1A2634] rounded-2xl p-6 text-white shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#AF1818] rounded-full blur-[50px] opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-40 transition-opacity" />
            <FileText size={32} className="text-[#32A5DE] mb-4 relative z-10" />
            <h3 className="font-nevan text-xl uppercase tracking-wide mb-2 relative z-10">Nouveau Devis</h3>
            <p className="font-montserrat text-sm text-gray-300 mb-6 relative z-10">Configurez rapidement un système sur-mesure.</p>
            <Link href="/b2b/dashboard/devis" className="inline-flex items-center justify-center w-full py-3 bg-white text-gray-900 rounded-xl font-nevan text-sm uppercase hover:bg-gray-100 transition-colors relative z-10">Créer une demande</Link>
          </div>
        </div>
      </div>
    </>
  );
}

function SuperAdminDashboard() {
  return (
    <>
      <div className="dash-item mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Tour de contrôle</h1>
          <p className="font-montserrat text-gray-500">Vue globale sur l'activité d'Air Froid Expert.</p>
        </div>
        <Link href="/b2b/dashboard/demandes" className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-[#10748E] text-white rounded-xl font-nevan text-sm uppercase hover:bg-[#0c5a6e] transition-colors shrink-0">
          Nouvelle Demande
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {ADMIN_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="dash-item bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <span className="font-montserrat text-xs sm:text-sm font-semibold text-gray-500 leading-tight">{stat.label}</span>
              </div>
              <div className="font-nevan text-2xl sm:text-4xl text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="dash-item lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Dernières Demandes Globales</h2>
            <Link href="#" className="font-montserrat text-sm font-semibold text-[#10748E] hover:underline">Toutes les demandes</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left font-montserrat">
              <thead className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">ID / Client</th>
                  <th className="p-4 font-semibold">Source</th>
                  <th className="p-4 font-semibold">Statut</th>
                  <th className="p-4 font-semibold">Responsable</th>
                  <th className="p-4 font-semibold"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {ADMIN_RECENT_REQUESTS.map((req, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div className="font-nevan text-xs text-gray-400">{req.id}</div>
                      <div className="font-bold text-gray-900">{req.client}</div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${
                        req.source === 'WhatsApp' ? 'bg-green-100 text-green-700' : 
                        req.source === 'B2B' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                      }`}>{req.source}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Nouveau' ? 'bg-purple-100 text-purple-700' : 
                        req.status === 'Analyse' ? 'bg-orange-100 text-orange-700' : 'bg-[#10748E]/10 text-[#10748E]'
                      }`}>{req.status}</span>
                    </td>
                    <td className="p-4 text-gray-600">{req.resp}</td>
                    <td className="p-4 text-right">
                      <button className="text-[#10748E] hover:text-[#0c5a6e]"><ChevronRight size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="dash-item flex flex-col gap-6">
           <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide mb-4">Comptes à Valider</h3>
            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl flex items-start gap-4 mb-4">
              <AlertCircle size={20} className="text-orange-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-montserrat text-sm font-bold text-gray-900">Société Al Boustane</h4>
                <p className="font-montserrat text-xs text-gray-600 mt-1">Inscription B2B en attente de vérification du RC.</p>
                <div className="flex gap-2 mt-3">
                  <button className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-bold rounded-lg hover:bg-gray-50">Refuser</button>
                  <button className="px-3 py-1.5 bg-[#10748E] text-white text-xs font-bold rounded-lg hover:bg-[#0c5a6e]">Vérifier</button>
                </div>
              </div>
            </div>
           </div>
        </div>
      </div>
    </>
  );
}

function CommercialDashboard() {
  return (
    <>
      <div className="dash-item mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">Mon Espace</h1>
          <p className="font-montserrat text-gray-500">Bonjour Youssef, voici vos dossiers en cours.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10">
        {COMMERCIAL_STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="dash-item bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <span className="font-montserrat text-xs sm:text-sm font-semibold text-gray-500 leading-tight">{stat.label}</span>
              </div>
              <div className="font-nevan text-2xl sm:text-4xl text-gray-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="dash-item lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Mes Demandes Actives</h2>
          </div>
          <div className="p-0">
             {ADMIN_RECENT_REQUESTS.filter(r => r.resp === "Youssef" || r.resp === "Non assigné").map((req, idx) => (
               <div key={idx} className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                 <div>
                   <div className="font-nevan text-xs text-gray-400 mb-1">{req.id}</div>
                   <h3 className="font-montserrat font-bold text-gray-900">{req.client}</h3>
                 </div>
                 <div className="flex flex-col items-end gap-2">
                   <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">{req.status}</span>
                   <button className="text-xs font-bold text-[#10748E] hover:underline">Ouvrir le dossier</button>
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="dash-item flex flex-col gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide mb-4">À Faire Aujourd'hui</h3>
            <div className="space-y-4">
              {COMMERCIAL_TASKS.map((task, idx) => (
                <div key={idx} className="flex gap-3 items-start">
                  <div className="mt-1"><div className={`w-2 h-2 rounded-full ${task.time === 'En retard' ? 'bg-red-500' : 'bg-green-500'}`} /></div>
                  <div>
                    <h4 className="font-montserrat text-sm font-bold text-gray-900 leading-tight">{task.title}</h4>
                    <span className="font-montserrat text-xs text-gray-500">{task.time}</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 border border-gray-200 rounded-xl font-montserrat text-sm font-bold text-gray-700 hover:bg-gray-50">Toutes mes tâches</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function DashboardOverview() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("afe_mock_role") || "client_b2b");
  }, []);

  useGSAP(() => {
    if (role) {
      gsap.fromTo(".dash-item",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, { scope: containerRef, dependencies: [role] });

  if (!role) return <div className="p-10">Chargement...</div>;

  return (
    <div ref={containerRef} className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto">
      {role === "super_admin" && <SuperAdminDashboard />}
      {role === "commercial" && <CommercialDashboard />}
      {role === "client_b2b" && <B2BDashboard />}
    </div>
  );
}
