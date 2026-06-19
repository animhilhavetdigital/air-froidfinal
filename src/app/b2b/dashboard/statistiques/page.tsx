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
  Briefcase,
  Target
} from "lucide-react";
import { INITIAL_REQUESTS, Request } from "@/lib/requests-data";
import { Quote, getQuotes } from "@/lib/quotes";

function formatCurrency(amount: number): string {
  return amount.toLocaleString("fr-FR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

export default function StatistiquesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [role, setRole] = useState<string | null>(null);
  const [commercialName, setCommercialName] = useState<string>("Youssef");
  const [requests, setRequests] = useState<Request[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedRole = localStorage.getItem("afe_mock_role") || "client_b2b";
    setRole(savedRole);

    // Commercial name based on role simulation
    if (savedRole === "commercial") {
      setCommercialName("Youssef");
    }

    // Load requests
    const savedReqs = localStorage.getItem("afe_requests");
    if (savedReqs) {
      setRequests(JSON.parse(savedReqs));
    } else {
      localStorage.setItem("afe_requests", JSON.stringify(INITIAL_REQUESTS));
      setRequests(INITIAL_REQUESTS);
    }

    // Load quotes
    setQuotes(getQuotes());
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

  // Commercial calculations
  const myRequests = requests.filter(r => r.resp === commercialName);
  const signedRequests = myRequests.filter(r => r.status === "Signé" || r.status === "Accepté");
  const sentRequests = myRequests.filter(r => r.status === "Devis Envoyé");
  const signedCount = signedRequests.length;
  const sentCount = sentRequests.length;
  const signatureRate = signedCount + sentCount > 0 
    ? Math.round((signedCount / (signedCount + sentCount)) * 100) 
    : 0;
  const myQuotes = quotes.filter(q => q.author === commercialName);
  const caGenerated = myQuotes.reduce((sum, q) => sum + q.total, 0);
  const urgentRelances = sentCount;

  // Sales target (fixed quarterly target)
  const quarterlyTarget = 1000000;
  const progressPercent = Math.min(100, Math.round((caGenerated / quarterlyTarget) * 100));

  return (
    <div ref={containerRef} className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto flex flex-col gap-8">
      
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Volume d'Affaires</span>
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-[#10748E] shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-gray-900">1 420 000 DH</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-green-600 font-semibold mt-1 inline-block">+14% ce mois-ci</span>
            </div>

            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Taux de Conversion</span>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-gray-900">45%</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-green-600 font-semibold mt-1 inline-block">+2.4% vs mois dernier</span>
            </div>

            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Leads Qualifiés</span>
                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-gray-900">184</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-orange-600 font-semibold mt-1 inline-block">5 en attente de qualif</span>
            </div>

            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Satisfaction Client</span>
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-gray-900">92%</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-gray-400 font-semibold mt-1 inline-block">Basé sur 48 retours</span>
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
                <table className="w-full min-w-[600px] text-left font-montserrat text-sm">
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Devis Signés</span>
                <Award className="w-4 h-4 sm:w-5 sm:h-5 text-[#10748E] shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-gray-900">{signedCount}</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-green-600 font-semibold mt-1 inline-block">Demandes signées / acceptées</span>
            </div>

            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Mon Taux de Signature</span>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-gray-900">{signatureRate}%</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-green-600 font-semibold mt-1 inline-block">Sur devis envoyés</span>
            </div>

            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">CA Généré</span>
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-gray-900">{formatCurrency(caGenerated)} DH</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-gray-400 font-semibold mt-1 inline-block">Total devis émis</span>
            </div>

            <div className="stat-card bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="font-montserrat text-[10px] sm:text-xs text-gray-500 font-bold uppercase">Relances urgentes</span>
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-[#AF1818] shrink-0" />
              </div>
              <div className="font-nevan text-xl sm:text-3xl text-[#AF1818]">{urgentRelances}</div>
              <span className="font-montserrat text-[10px] sm:text-xs text-[#AF1818] font-semibold mt-1 inline-block">Devis en attente de réponse</span>
            </div>
          </div>

          {/* Target progress card */}
          <div className="stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#10748E]/10 flex items-center justify-center text-[#10748E]">
                <Target size={20} />
              </div>
              <div>
                <h2 className="font-nevan text-lg text-gray-900 uppercase">Objectif de Vente</h2>
                <p className="font-montserrat text-sm text-gray-500">Objectif commercial cumulé sur le trimestre en cours.</p>
              </div>
            </div>
            <div className="space-y-4 font-montserrat">
              <div className="flex justify-between items-end">
                <span className="text-xs text-gray-400 uppercase font-bold">Progression</span>
                <span className="font-bold text-gray-900 text-lg">{progressPercent}%</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-[#10748E] to-[#32A5DE]" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatCurrency(caGenerated)} DH</span>
                <span>Cible : {formatCurrency(quarterlyTarget)} DH</span>
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
