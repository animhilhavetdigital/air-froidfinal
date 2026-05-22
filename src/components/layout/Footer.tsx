import Link from "next/link";
import { Globe, Camera, Briefcase, Video, MapPin, Phone, Mail } from "lucide-react";
import { FOOTER_LINKS, CONTACT_INFO, SOCIAL_LINKS, SITE_NAME } from "@/lib/constants";
import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-8 relative overflow-hidden">
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12 xl:px-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 md:gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="inline-block group">
              <div className="relative w-48 h-16">
                <Image 
                  src="/images/assets/logo-clean.png" 
                  alt="Air Froid Expert Logo" 
                  fill 
                  className="object-contain object-left mix-blend-multiply opacity-90 hover:opacity-100 transition-opacity" 
                />
              </div>
            </Link>
            <p className="text-gray-500 font-montserrat text-sm leading-relaxed max-w-xs">
              L'excellence climatique au Maroc. Ingénierie, conception et réalisation pour les projets résidentiels, commerciaux et industriels de prestige.
            </p>
            <div className="flex gap-4 pt-2">
              <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Globe size={20} />
              </a>
              <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Camera size={20} />
              </a>
              <a href={SOCIAL_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Briefcase size={20} />
              </a>
              <a href={SOCIAL_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Video size={20} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-nevan text-lg text-gray-900 tracking-wide mb-8">NAVIGATION</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-primary font-montserrat text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Corporate Column */}
          <div>
            <h3 className="font-nevan text-lg text-gray-900 tracking-wide mb-8">L'ENTREPRISE</h3>
            <ul className="space-y-4">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-gray-500 hover:text-primary font-montserrat text-sm transition-colors flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-primary/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-8">
            <h3 className="font-nevan text-lg text-gray-900 tracking-wide mb-8">CONTACT</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 text-gray-500 font-montserrat text-sm">
                <MapPin size={20} className="text-primary shrink-0" />
                <span>{CONTACT_INFO.address}</span>
              </li>
              <li className="flex items-center gap-4 text-gray-500 font-montserrat text-sm">
                <Phone size={20} className="text-primary shrink-0" />
                <span>{CONTACT_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-4 text-gray-500 font-montserrat text-sm">
                <Mail size={20} className="text-primary shrink-0" />
                <span>{CONTACT_INFO.email}</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link href="/contact" className="inline-block px-8 py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-white transition-all font-nevan tracking-wide text-sm uppercase">
                Réserver une consultation
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400 font-montserrat text-xs">
            © {currentYear} {SITE_NAME}. Tous droits réservés.
          </p>
          <div className="flex flex-wrap gap-6 justify-center">
            {FOOTER_LINKS.legal.map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-400 hover:text-gray-900 transition-colors font-montserrat text-xs font-medium uppercase tracking-wider">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
