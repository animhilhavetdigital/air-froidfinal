"use client";

import { useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  MessageSquare
} from "lucide-react";
import Link from "next/link";

const STATS = [
  { label: "Chantiers en cours", value: "3", icon: Clock, color: "text-[#10748E]", bg: "bg-[#10748E]/10" },
  { label: "Devis validés", value: "12", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" },
  { label: "Interventions SAV", value: "1", icon: AlertCircle, color: "text-[#AF1818]", bg: "bg-[#AF1818]/10" },
  { label: "Économies d'énergie estimées", value: "32%", icon: TrendingUp, color: "text-[#32A5DE]", bg: "bg-[#32A5DE]/10" },
];

const RECENT_PROJECTS = [
  { id: "PRJ-2026-042", name: "Installation VRV Siège Casablanca", status: "En cours", date: "12 Mai 2026", progress: 65 },
  { id: "PRJ-2026-038", name: "Maintenance Annuelle Entrepôt Tanger", status: "Planifié", date: "28 Mai 2026", progress: 0 },
  { id: "PRJ-2025-189", name: "Parc Solaire Usine Kénitra", status: "Terminé", date: "15 Fév 2026", progress: 100 },
];

export default function DashboardOverview() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.fromTo(".dash-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="dash-item mb-10">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
          Vue d'ensemble
        </h1>
        <p className="font-montserrat text-gray-500">
          Bienvenue sur votre espace professionnel. Voici un résumé de vos activités.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="dash-item bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg}`}>
                  <Icon size={24} className={stat.color} />
                </div>
                <span className="font-montserrat text-sm font-semibold text-gray-500 leading-tight">
                  {stat.label}
                </span>
              </div>
              <div className="font-nevan text-4xl text-gray-900">
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Projects List */}
        <div className="dash-item lg:col-span-2 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Projets récents</h2>
            <Link href="/b2b/dashboard/suivi" className="font-montserrat text-sm font-semibold text-[#10748E] hover:underline">
              Voir tout
            </Link>
          </div>
          <div className="p-0">
            {RECENT_PROJECTS.map((project, idx) => (
              <div key={idx} className="p-6 border-b border-gray-50 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 last:border-0">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-nevan text-sm text-gray-400">{project.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold font-montserrat ${
                      project.status === 'Terminé' ? 'bg-green-100 text-green-700' :
                      project.status === 'En cours' ? 'bg-blue-100 text-[#10748E]' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <h3 className="font-montserrat font-bold text-gray-900">{project.name}</h3>
                </div>
                
                <div className="w-full md:w-48">
                  <div className="flex justify-between text-xs font-montserrat mb-1">
                    <span className="text-gray-500">Progression</span>
                    <span className="font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-[#10748E]'}`}
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dash-item flex flex-col gap-6">
          <div className="bg-[#1A2634] rounded-2xl p-6 text-white shadow-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#AF1818] rounded-full blur-[50px] opacity-20 -translate-y-1/2 translate-x-1/3 group-hover:opacity-40 transition-opacity" />
            <FileText size={32} className="text-[#32A5DE] mb-4 relative z-10" />
            <h3 className="font-nevan text-xl uppercase tracking-wide mb-2 relative z-10">Nouveau Devis</h3>
            <p className="font-montserrat text-sm text-gray-300 mb-6 relative z-10">Configurez rapidement un système sur-mesure et obtenez une estimation.</p>
            <Link href="/b2b/dashboard/devis" className="inline-flex items-center justify-center w-full py-3 bg-white text-gray-900 rounded-xl font-nevan text-sm uppercase hover:bg-gray-100 transition-colors relative z-10">
              Créer une demande
            </Link>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wide mb-4">Messages récents</h3>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <MessageSquare size={18} className="text-gray-500" />
              </div>
              <div>
                <h4 className="font-montserrat text-sm font-bold text-gray-900">Support Technique</h4>
                <p className="font-montserrat text-xs text-gray-500 line-clamp-2 mt-1">Le plan d'implantation pour le projet de Casablanca a été mis à jour.</p>
              </div>
            </div>
            <Link href="#" className="text-xs font-montserrat font-bold text-[#10748E] hover:underline">Ouvrir la messagerie →</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
