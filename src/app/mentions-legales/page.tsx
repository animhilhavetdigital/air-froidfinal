import { ShieldCheck, Scale, FileText, Cookie } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Mentions Légales & Conformité | Air Froid Expert",
  description: "Informations juridiques, politique de confidentialité, CGV/CGU et gestion des cookies.",
};

const LEGAL_CARDS = [
  {
    title: "Mentions Légales",
    desc: "Informations juridiques sur la société AIR FROID EXPERT : éditeur, directeur de publication, hébergeur et propriété intellectuelle.",
    icon: Scale,
    href: "/mentions-legales/informations",
    color: "#10748E",
    bgColor: "bg-blue-50",
  },
  {
    title: "Politique de confidentialité",
    desc: "Protection de vos données personnelles. Découvrez comment nous collectons, utilisons et sécurisons vos informations.",
    icon: ShieldCheck,
    href: "/politique-confidentialite",
    color: "#00883C",
    bgColor: "bg-green-50",
  },
  {
    title: "Conditions générales",
    desc: "CGV et CGU : conditions de vente, d'utilisation du site, devis, facturation et garanties de nos services.",
    icon: FileText,
    href: "/conditions-generales",
    color: "#AF1818",
    bgColor: "bg-red-50",
  },
  {
    title: "Politique de cookies",
    desc: "Gestion des traceurs et cookies. Comprenez quels cookies sont utilisés et comment les contrôler.",
    icon: Cookie,
    href: "/politique-cookies",
    color: "#32A5DE",
    bgColor: "bg-sky-50",
  },
];

export default function MentionsLegalesHubPage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-12 xl:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8 shadow-sm">
            <ShieldCheck size={16} className="text-[#10748E]" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">
              Transparence & Conformité
            </span>
          </div>
          <h1 className="font-nevan text-5xl md:text-6xl text-gray-900 tracking-wider uppercase mb-6">
            Mentions Légales <span className="text-[#10748E]">& Conformité</span>
          </h1>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Nous nous engageons à assurer la transparence et le respect de vos données personnelles. Retrouvez ci-dessous l'ensemble de nos documents juridiques.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {LEGAL_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group relative flex flex-col gap-6 p-10 rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                {/* Decorative gradient blob */}
                <div
                  className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                  style={{ backgroundColor: card.color }}
                />

                <div className="flex items-start gap-6">
                  <div
                    className={`w-16 h-16 rounded-2xl ${card.bgColor} flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110`}
                  >
                    <Icon size={32} style={{ color: card.color }} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-3 group-hover:text-[#10748E] transition-colors">
                      {card.title}
                    </h2>
                    <p className="font-montserrat text-gray-600 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="font-montserrat text-sm font-semibold transition-colors"
                    style={{ color: card.color }}
                  >
                    Consulter le document
                  </span>
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white transition-transform duration-300 group-hover:translate-x-1"
                    style={{ backgroundColor: card.color }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-20 text-center bg-gray-50 rounded-3xl p-12 border border-gray-100">
          <h3 className="font-nevan text-2xl text-gray-900 uppercase tracking-wide mb-4">
            Une question juridique ?
          </h3>
          <p className="font-montserrat text-gray-600 mb-8 max-w-lg mx-auto">
            Notre équipe est à votre disposition pour toute question relative à nos mentions légales ou à la protection de vos données.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-nevan text-sm uppercase tracking-widest text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-[#10748E]"
          >
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
