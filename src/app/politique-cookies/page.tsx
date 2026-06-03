import { Cookie, Settings, Info, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Politique de cookies | Air Froid Expert",
  description: "Politique de gestion des cookies et traceurs.",
};

export default function PolitiqueCookiesPage() {
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
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-sky-50 border border-sky-100 mb-8 shadow-sm">
            <Cookie size={16} className="text-[#32A5DE]" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">Gestion des traceurs</span>
          </div>
          <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 tracking-wider uppercase mb-6">
            Politique de <span className="text-[#32A5DE]">cookies</span>
          </h1>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Nous utilisons des cookies pour améliorer votre expérience sur notre site. Découvrez quels cookies sont utilisés et comment les contrôler.
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#32A5DE]">
                <Info size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Qu'est-ce qu'un cookie ?</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Un cookie est un petit fichier texte déposé sur votre terminal (ordinateur, tablette, smartphone) lors de la visite d'un site web. Il permet au site de mémoriser des informations sur votre visite, comme votre langue préférée et d'autres paramètres, afin de faciliter votre navigation lors de votre prochaine visite.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#32A5DE]">
                <Cookie size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Cookies utilisés</h2>
            </div>
            <div className="font-montserrat text-gray-600 space-y-4 leading-relaxed">
              <p><strong className="text-gray-900">Cookies essentiels :</strong> Nécessaires au fonctionnement du site. Ils permettent la navigation et l'utilisation des fonctionnalités de base.</p>
              <p><strong className="text-gray-900">Cookies de performance :</strong> Nous aident à comprendre comment les visiteurs interagissent avec notre site en collectant des informations de manière anonyme.</p>
              <p><strong className="text-gray-900">Cookies de fonctionnalité :</strong> Permettent de mémoriser vos choix (langue, région) et de personnaliser votre expérience.</p>
              <p><strong className="text-gray-900">Cookies de ciblage :</strong> Utilisés pour vous proposer des publicités pertinentes. Nous n'utilisons actuellement pas ce type de cookies.</p>
            </div>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#32A5DE]">
                <Settings size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Gestion des cookies</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed mb-4">
              Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres de votre navigateur. Vous pouvez choisir d'accepter ou de refuser les cookies, ou d'être averti lorsqu'un cookie est déposé.
            </p>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Attention : le refus des cookies essentiels peut affecter le fonctionnement du site et limiter l'accès à certaines fonctionnalités.
            </p>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="font-montserrat text-gray-500 mb-4">Pour toute question sur notre politique de cookies :</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#32A5DE] text-white rounded-full font-nevan text-sm uppercase tracking-widest hover:bg-[#2589bd] transition-colors">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
