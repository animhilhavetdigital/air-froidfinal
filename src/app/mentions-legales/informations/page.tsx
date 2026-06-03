import { ShieldCheck, Scale, FileText, Server, Copyright, Mail, ChevronLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Mentions Légales | Air Froid Expert",
  description: "Informations juridiques sur la société AIR FROID EXPERT.",
};

export default function MentionsLegalesDetailPage() {
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
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-50 border border-gray-100 mb-8 shadow-sm">
            <Scale size={16} className="text-[#10748E]" />
            <span className="font-nevan text-sm tracking-[0.2em] text-gray-900 uppercase">Informations juridiques</span>
          </div>
          <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 tracking-wider uppercase mb-6">
            Mentions <span className="text-[#10748E]">Légales</span>
          </h1>
          <p className="font-montserrat text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Conformément aux dispositions des articles 6-III et 19 de la Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l'économie numérique (LCEN).
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#10748E]">
                <ShieldCheck size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Éditeur du site</h2>
            </div>
            <div className="font-montserrat text-gray-600 space-y-3 leading-relaxed">
              <p><strong className="text-gray-900">Raison sociale :</strong> AIR FROID EXPERT</p>
              <p><strong className="text-gray-900">Forme juridique :</strong> Société à responsabilité limitée (SARL)</p>
              <p><strong className="text-gray-900">Capital social :</strong> 100 000,00 MAD</p>
              <p><strong className="text-gray-900">Siège social :</strong> Marrakech, Maroc</p>
              <p><strong className="text-gray-900">Registre de commerce :</strong> RC Marrakech — en cours d'immatriculation</p>
              <p><strong className="text-gray-900">ICE :</strong> en cours d'attribution</p>
              <p><strong className="text-gray-900">Numéro de taxe professionnelle :</strong> en cours d'attribution</p>
              <p><strong className="text-gray-900">CNSS :</strong> en cours d'attribution</p>
            </div>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#10748E]">
                <FileText size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Directeur de la publication</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              Le directeur de la publication est le représentant légal de la société AIR FROID EXPERT.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#10748E]">
                <Server size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Hébergeur du site</h2>
            </div>
            <div className="font-montserrat text-gray-600 space-y-3 leading-relaxed">
              <p><strong className="text-gray-900">Hébergeur :</strong> Vercel Inc.</p>
              <p><strong className="text-gray-900">Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
              <p><strong className="text-gray-900">Site web :</strong> <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#10748E] hover:underline">vercel.com</a></p>
            </div>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#10748E]">
                <Copyright size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Propriété intellectuelle</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed">
              L'ensemble des éléments constituant le site web d'AIR FROID EXPERT (textes, graphismes, logiciels, photographies, images, vidéos, sons, plans, logos, marques, etc.) est la propriété exclusive d'AIR FROID EXPERT ou de ses partenaires. Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite, sauf autorisation écrite préalable.
            </p>
          </section>

          <section className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#10748E]">
                <Mail size={20} />
              </div>
              <h2 className="font-nevan text-xl text-gray-900 uppercase tracking-wide">Données personnelles</h2>
            </div>
            <p className="font-montserrat text-gray-600 leading-relaxed mb-4">
              Les informations recueillies sur ce site sont enregistrées dans un fichier informatisé par AIR FROID EXPERT pour la gestion de nos relations commerciales et la réponse à vos demandes.
            </p>
            <p className="font-montserrat text-gray-600 leading-relaxed mb-4">
              Conformément à la loi n° 09-08 relative à la protection des données personnelles, vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant.
            </p>
            <div className="flex flex-wrap gap-4 mt-6">
              <Link href="/politique-confidentialite" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#10748E] text-[#10748E] font-montserrat text-sm font-semibold hover:bg-[#10748E] hover:text-white transition-colors">
                Politique de confidentialité
              </Link>
              <Link href="/politique-cookies" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-700 font-montserrat text-sm font-semibold hover:bg-gray-100 transition-colors">
                Politique de cookies
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-16 text-center">
          <p className="font-montserrat text-gray-500 mb-4">Pour toute question relative aux mentions légales, contactez-nous :</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-[#10748E] text-white rounded-full font-nevan text-sm uppercase tracking-widest hover:bg-[#0c5a6e] transition-colors">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
