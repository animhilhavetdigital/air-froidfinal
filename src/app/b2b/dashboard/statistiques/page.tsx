"use client";

import { useEffect, useState, useRef } from "react";
import { useGSAP, gsap } from "@/lib/gsap";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  Activity, 
  Smartphone, 
  Globe, 
  Briefcase 
} from "lucide-react";

export default function StatistiquesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("afe_mock_role") || "client_b2b");
  }, []);

  useGSAP(() => {
    if (role) {
      gsap.fromTo(".stat-card",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, { scope: containerRef, dependencies: [role] });

  if (!role) return <div className="p-10 text-gray-500 font-montserrat">Chargement des données analytiques...</div>;

  const isAdmin = role === "super_admin";

  return (
    <div ref={containerRef} className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
      {/* Header */}
      <div className="stat-card">
        <h1 className="font-nevan text-3xl md:text-4xl text-gray-900 uppercase tracking-wide mb-2">
          {isAdmin ? "Tableau de Bord Analytique" : "Ma Performance Commerciale"}
        </h1>
        <p className="font-montserrat text-gray-500">
          {isAdmin 
            ? "Indicateurs de performance commerciale globale et répartition des leads Air Froid Expert." 
            : "Suivi personnalisé de vos objectifs de vente, taux de signature et relances."}
        </p>
      </div>

      {isAdmin ? (
        // ================= SUPER ADMIN REPORTING =================
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">Volume d'Affaires</span>
                <DollarSign size={20} className="text-[#10748E]" />
              </div>
              <div className="font-nevan text-3xl text-gray-900">1 420 000 DH</div>
              <span className="font-montserrat text-xs text-green-600 font-semibold mt-1 inline-block">+14% ce mois-ci</span>
            </div>

            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">Taux de Conversion</span>
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div className="font-nevan text-3xl text-gray-900">45%</div>
              <span className="font-montserrat text-xs text-green-600 font-semibold mt-1 inline-block">+2.4% vs mois dernier</span>
            </div>

            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">Leads Qualifiés</span>
                <Briefcase size={20} className="text-orange-600" />
              </div>
              <div className="font-nevan text-3xl text-gray-900">184</div>
              <span className="font-montserrat text-xs text-orange-600 font-semibold mt-1 inline-block">5 en attente de qualif</span>
            </div>

            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">Satisfaction Client</span>
                <Award size={20} className="text-yellow-600" />
              </div>
              <div className="font-nevan text-3xl text-gray-900">92%</div>
              <span className="font-montserrat text-xs text-gray-400 font-semibold mt-1 inline-block">Basé sur 48 retours</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Lead channels */}
            <div className="stat-card lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-nevan text-lg text-gray-900 uppercase mb-6 flex items-center gap-2">
                <Activity size={18} className="text-[#10748E]" /> Canaux d'Acquisition
              </h2>
              <div className="space-y-4 font-montserrat">
                {[
                  { name: "Portail Client B2B", value: "60%", count: "110 leads", color: "bg-[#10748E]", icon: Globe },
                  { name: "Formulaire de contact", value: "25%", count: "46 leads", color: "bg-[#32A5DE]", icon: Globe },
                  { name: "WhatsApp direct", value: "15%", count: "28 leads", color: "bg-green-500", icon: Smartphone }
                ].map((channel, idx) => {
                  const Icon = channel.icon;
                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-semibold text-gray-900 flex items-center gap-1.5"><Icon size={14} className="text-gray-400" /> {channel.name}</span>
                        <span className="font-bold text-gray-900">{channel.value}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${channel.color}`} style={{ width: channel.value }} />
                      </div>
                      <span className="text-[10px] text-gray-400 block">{channel.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Commercial team leaderboard */}
            <div className="stat-card lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-nevan text-lg text-gray-900 uppercase mb-6 flex items-center gap-2">
                <Users size={18} className="text-[#10748E]" /> Performance des Commerciaux
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-montserrat text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs font-semibold">
                    <tr>
                      <th className="p-3">Commercial</th>
                      <th className="p-3">Devis Signés</th>
                      <th className="p-3">Taux de conversion</th>
                      <th className="p-3">Chiffre d'Affaires</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {[
                      { name: "Youssef El Alami", signed: "8 devis", rate: "58%", revenue: "540 000 DH" },
                      { name: "Sara Belghiti", signed: "6 devis", rate: "48%", revenue: "390 000 DH" },
                      { name: "Non assigné / En attente", signed: "0 devis", rate: "-", revenue: "-" }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/50">
                        <td className="p-3 font-bold text-gray-900">{row.name}</td>
                        <td className="p-3 text-gray-700">{row.signed}</td>
                        <td className="p-3 text-green-600 font-semibold">{row.rate}</td>
                        <td className="p-3 text-gray-900 font-semibold">{row.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </>
      ) : (
        // ================= COMMERCIAL PERFORMANCE =================
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">Devis Signés (Mois)</span>
                <Award size={20} className="text-[#10748E]" />
              </div>
              <div className="font-nevan text-3xl text-gray-900">8</div>
              <span className="font-montserrat text-xs text-green-600 font-semibold mt-1 inline-block">Objectif mensuel : 10</span>
            </div>

            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">Mon Taux de Signature</span>
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div className="font-nevan text-3xl text-gray-900">58%</div>
              <span className="font-montserrat text-xs text-green-600 font-semibold mt-1 inline-block">+5% vs moyenne équipe</span>
            </div>

            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">CA Généré</span>
                <DollarSign size={20} className="text-green-600" />
              </div>
              <div className="font-nevan text-3xl text-gray-900">540 000 DH</div>
              <span className="font-montserrat text-xs text-gray-400 font-semibold mt-1 inline-block">85% de mon quota annuel</span>
            </div>

            <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="font-montserrat text-xs text-gray-500 font-bold uppercase">Relances urgentes</span>
                <Smartphone size={20} className="text-[#AF1818]" />
              </div>
              <div className="font-nevan text-3xl text-[#AF1818]">3</div>
              <span className="font-montserrat text-xs text-[#AF1818] font-semibold mt-1 inline-block">À faire aujourd'hui</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Target progress card */}
            <div className="stat-card lg:col-span-1 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <h2 className="font-nevan text-lg text-gray-900 uppercase mb-4">Objectif de Vente</h2>
                <p className="font-montserrat text-sm text-gray-500 mb-6">Objectif commercial cumulé sur le trimestre en cours.</p>
              </div>
              <div className="space-y-4 font-montserrat">
                <div className="flex justify-between items-end">
                  <span className="text-xs text-gray-400 uppercase font-bold">Progression</span>
                  <span className="font-bold text-gray-900 text-lg">80%</span>
                </div>
                <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#10748E] to-[#32A5DE]" style={{ width: "80%" }} />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>800 000 DH</span>
                  <span>Cible : 1 000 000 DH</span>
                </div>
              </div>
            </div>

            {/* Conversion Details */}
            <div className="stat-card lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h2 className="font-nevan text-lg text-gray-900 uppercase mb-6">Activité Commerciale (Trimestre)</h2>
              <div className="space-y-4 font-montserrat text-sm">
                {[
                  { label: "1. Qualification Leads (Mingler)", value: 45, max: 50, color: "bg-[#10748E]" },
                  { label: "2. Visites Techniques planifiées", value: 28, max: 50, color: "bg-[#32A5DE]" },
                  { label: "3. Devis rédigés & envoyés", value: 14, max: 50, color: "bg-orange-500" },
                  { label: "4. Devis signés définitivement", value: 8, max: 50, color: "bg-green-500" }
                ].map((bar, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-gray-800">{bar.label}</span>
                      <span className="font-bold text-gray-900">{bar.value}</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${bar.color}`} style={{ width: `${(bar.value / bar.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
