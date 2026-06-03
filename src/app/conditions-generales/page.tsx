import { FileText, ClipboardCheck, CreditCard, RotateCcw, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Conditions générales | Air Froid Expert",
  description: "Conditions générales de vente et d'utilisation des services Air Froid Expert.",
};

export default function ConditionsGeneralesPage() {
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
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-red-50 border border-red-100 mb-8 shadow-sm">
            <FileText size={16} className="text-[#AF1818]" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">Conditions de service</span>
          </div>
          <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 tracking-wider uppercase mb-6">
            Conditions <span className="text-[#AF1818]">générales</span>
          </h1>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Retrouvez ci-dessous nos conditions générales de vente et d'utilisation. En utilisant nos services, vous acceptez ces conditions.
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#AF1818]">
                <ClipboardCheck size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Objet et champ d'application</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Les présentes conditions générales de vente régissent l'ensemble des relations entre la société AIR FROID EXPERT et ses clients. Elles s'appliquent à tous les services proposés : climatisation, ventilation, énergie solaire et services associés. Toute commande implique l'acceptation pleine et entière des présentes conditions.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#AF1818]">
                <FileText size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Devis et commandes</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Les devis sont établis sur mesure et sont valables pour une durée de 30 jours à compter de leur date d'émission. Toute commande fait l'objet d'un bon de commande signé par le client et d'un acompte selon les conditions définies au devis. Les délais de réalisation sont indicatifs et communiqués lors de la commande.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#AF1818]">
                <CreditCard size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Prix et paiement</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Les prix sont indiqués en Dirhams marocains (MAD), hors taxes. Le paiement s'effectue selon les modalités définies au bon de commande : acompte à la commande, puis solde selon l'avancement du chantier ou à la livraison. Les factures sont payables à réception. Tout retard de paiement entraîne des pénalités de retard.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#AF1818]">
                <RotateCcw size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Garanties et SAV</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Nos installations sont couvertes par une garantie pièces et main-d'œuvre d'une durée de 12 à 24 mois selon les équipements. Un contrat de maintenance peut être souscrit pour bénéficier d'un suivi régulier et d'une extension de garantie. Les interventions sous garantie sont réalisées dans les plus brefs délais.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="font-montserrat text-gray-500 mb-4">Pour toute question sur nos conditions :</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#AF1818] text-white rounded-full font-nevan text-sm uppercase tracking-widest hover:bg-[#8A1212] transition-colors">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
