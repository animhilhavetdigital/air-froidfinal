"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Globe, Camera, Briefcase, ShoppingBag } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";
import { useCart } from "@/lib/CartContext";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Main Navbar */}
      <header className="fixed w-full z-50 transition-all duration-300 pt-4 md:pt-6 px-4 md:px-8 pointer-events-none">
        <div 
          className={`mx-auto max-w-[1600px] w-full transition-all duration-300 rounded-full px-6 flex justify-between items-center pointer-events-auto ${
            isScrolled || mobileMenuOpen
              ? "backdrop-blur-xl bg-white/90 border border-gray-200 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              : "bg-white py-4 border border-gray-100 shadow-sm"
          }`}
        >
          
          {/* Left side: Logo */}
          <Link href="/" className="relative z-50 flex items-center group">
            <div className="relative w-12 h-12 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image 
                src="/images/assets/logo.png" 
                alt="Air Froid Expert Logo" 
                fill 
                className="object-contain" 
              />
            </div>
          </Link>

          {/* Center side: Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <li key={link.href} className="relative">
                    <Link
                      href={link.href}
                      className={`font-montserrat font-semibold tracking-wide text-sm transition-all duration-300 uppercase py-2 relative overflow-hidden group ${
                        isActive ? "text-primary" : "text-gray-900 hover:text-primary"
                      }`}
                    >
                      {link.label}
                      <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transform origin-left transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right side: CTA and Cart */}
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/catalogue" className="relative text-gray-900 hover:text-primary transition-colors">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#92C5E8] text-gray-900 text-xs font-bold w-5 h-5 flex items-center justify-center rounded-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href="/contact"
              className="bg-[#AF1818] text-white px-8 py-3 rounded-full font-nevan tracking-widest text-sm transition-colors flex items-center gap-2 hover:bg-[#8A1212] shadow-md hover:shadow-lg uppercase"
            >
              Demander un devis <span className="text-xl leading-none font-light">↗</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden relative z-50 text-primary p-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={32} /> : <Menu size={32} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-white z-40 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.77,0,0.175,1)] ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex flex-col h-full pt-28 px-6 pb-12 overflow-y-auto">
            <ul className="flex flex-col gap-6 text-2xl font-nevan tracking-wide uppercase">
              {NAV_LINKS.map((link, index) => (
                <li 
                  key={link.href} 
                  className="border-b border-gray-100 pb-4 overflow-hidden"
                >
                  <Link
                    href={link.href}
                    className={`block transform transition-transform duration-500 delay-${index * 100} ${mobileMenuOpen ? "translate-y-0" : "translate-y-full"} ${pathname === link.href ? "text-primary" : "text-gray-900"}`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-12 flex flex-col gap-6">
              <Link
                href="/contact"
                className="w-full text-center bg-[#AF1818] text-white py-5 rounded-none font-nevan text-xl tracking-wide uppercase transition-colors"
              >
                DEMANDER UN DEVIS
              </Link>
              <div className="flex justify-center gap-6 py-4">
                <a href={SOCIAL_LINKS.facebook} className="text-gray-400 hover:text-primary transition-colors"><Globe size={28} /></a>
                <a href={SOCIAL_LINKS.instagram} className="text-gray-400 hover:text-primary transition-colors"><Camera size={28} /></a>
                <a href={SOCIAL_LINKS.linkedin} className="text-gray-400 hover:text-primary transition-colors"><Briefcase size={28} /></a>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
