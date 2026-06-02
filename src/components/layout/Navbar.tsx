"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Globe, Camera, Briefcase, ChevronDown } from "lucide-react";
import { NAV_LINKS, SOCIAL_LINKS } from "@/lib/constants";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [activeLang, setActiveLang] = useState("FR");
  const langRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  const LANGS = [
    { code: "FR", label: "Français" },
    { code: "AR", label: "عربية" },
    { code: "EN", label: "English" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
              ? "backdrop-blur-xl bg-white/90 dark:bg-[#0B1120]/90 border border-gray-200 dark:border-gray-800 py-3 shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
              : "bg-white dark:bg-[#0B1120] py-4 border border-gray-100 dark:border-gray-800 shadow-sm"
          }`}
        >
          
          {/* Left side: Logo */}
          <Link href="/" className="relative z-50 flex items-center group">
            <div className="relative w-40 h-14 flex-shrink-0 transition-transform group-hover:scale-105">
              <Image 
                src="/images/assets/logo-clean.png" 
                alt="Air Froid Expert Logo" 
                fill 
                className="object-contain object-left mix-blend-multiply dark:mix-blend-screen" 
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
                      className={`font-montserrat text-sm font-semibold tracking-wider uppercase transition-colors relative group ${
                        isActive ? "text-[#AF1818]" : "text-gray-900 dark:text-gray-200 hover:text-[#00883C]"
                      }`}
                    >
                      {link.label}
                      <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-[#00883C] transform origin-left transition-transform duration-300 ${isActive ? "scale-x-100 bg-[#AF1818]" : "scale-x-0 group-hover:scale-x-100"}`} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right side: Language Switcher + CTA */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-6">

            {/* Language Switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 font-montserrat text-sm font-bold tracking-widest uppercase text-gray-900 dark:text-gray-200 hover:text-primary transition-colors px-2 py-1"
              >
                <Globe size={16} className="text-primary" />
                {activeLang}
                <ChevronDown size={14} className={`transition-transform duration-200 ${langOpen ? "rotate-180" : ""}`} />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#0B1120] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl overflow-hidden z-50">
                  {LANGS.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setActiveLang(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-montserrat font-semibold transition-colors ${
                        activeLang === lang.code
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      } ${lang.code === "AR" ? "font-arabic" : ""}`}
                    >
                      <span className="font-bold text-xs w-6 text-center tracking-widest">{lang.code}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{lang.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/devis"
              className="group relative bg-[#AF1818] text-white px-8 py-3 rounded-full font-nevan text-sm tracking-widest uppercase transition-all duration-300 shadow-lg hover:shadow-[#AF1818]/40 hover:-translate-y-0.5 flex items-center gap-2 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative z-10 mt-0.5">Demander un devis</span> 
              <span className="relative z-10 text-xl leading-none font-light group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
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
                href="/devis"
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
