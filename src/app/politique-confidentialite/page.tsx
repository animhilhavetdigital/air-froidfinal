import { ShieldCheck, Lock, Eye, Trash2, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Politique de confidentialité | Air Froid Expert",
  description: "Politique de confidentialité et protection des données personnelles.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="w-full max-w-4xl mx-auto px-4 md:px-12 xl:px-24">
        <div className="mb-8">
          <Link href="/mentions-legales" className="inline-flex items-center gap-2 font-montserrat text-sm text-gray-500 hover:text-primary transition-colors">
            <ChevronLeft size={16} />
            Retour aux mentions légales
          </Link>
        </div>

        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-green-50 border border-green-100 mb-8 shadow-sm">
            <ShieldCheck size={16} className="text-[#00883C]" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">Protection des données</span>
          </div>
          <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 tracking-wider uppercase mb-6">
            Politique de <span className="text-[#00883C]">confidentialité</span>
          </h1>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Nous accordons une importance capitale à la protection de vos données personnelles. Découvrez comment nous les collectons, utilisons et sécurisons.
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#00883C]">
                <Lock size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Collecte des données</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Nous collectons vos données personnelles (nom, adresse, email, téléphone) lorsque vous remplissez nos formulaires de contact, de demande de devis ou lors de toute autre interaction avec notre site. Ces données sont nécessaires au traitement de vos demandes et à la gestion de nos relations commerciales.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#00883C]">
                <Eye size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Utilisation des données</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Vos données sont utilisées exclusivement dans le cadre de nos services : réponse à vos demandes, établissement de devis, suivi de projet, et envoi d'informations relatives à nos services si vous avez donné votre consentement. Nous ne vendons ni ne louons vos données à des tiers.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#00883C]">
                <ShieldCheck size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Sécurité des données</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre la destruction accidentelle, la perte, l'altération, la divulgation non autorisée ou l'accès non autorisé.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#00883C]">
                <Trash2 size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Vos droits</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed mb-4">
              Conformément à la loi n° 09-08 relative à la protection des données personnelles au Maroc, vous disposez des droits suivants :
            </p>
            <ul className="font-montserrat text-gray-600 space-y-2 list-disc list-inside">
              <li>Droit d'accès à vos données</li>
              <li>Droit de rectification des données inexactes</li>
              <li>Droit à l'effacement de vos données</li>
              <li>Droit d'opposition au traitement</li>
              <li>Droit à la portabilité de vos données</li>
            </ul>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="font-montserrat text-gray-500 mb-4">Pour exercer vos droits ou pour toute question :</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#00883C] text-white rounded-full font-nevan text-sm uppercase tracking-widest hover:bg-[#006b2f] transition-colors">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
