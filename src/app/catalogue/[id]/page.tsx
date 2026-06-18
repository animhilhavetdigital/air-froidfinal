"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = PRODUCTS.find((p) => p.id === parseInt(resolvedParams.id));
  const [activeTab, setActiveTab] = useState<"caracteristiques" | "description">("caracteristiques");

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        {/* Back Link */}
        <Link
          href="/catalogue"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#10748E] transition-colors font-montserrat font-semibold text-sm mb-10"
        >
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>

        {/* Main Product Card */}
        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 lg:gap-16 mb-12">
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-8">
              {product.badge && (
                <span
                  className={`absolute top-6 left-6 z-10 px-4 py-2 text-xs font-nevan tracking-widest uppercase rounded-lg text-white shadow-sm ${
                    product.badge === "Promo" ? "bg-[#AF1818]" : "bg-[#32A5DE]"
                  }`}
                >
                  {product.badge}
                </span>
              )}
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain mix-blend-multiply hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="font-nevan text-sm tracking-widest text-[#10748E] uppercase mb-3 block">
              {product.category}
            </span>
            <h1 className="font-nevan text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-4 leading-tight uppercase tracking-wide">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex flex-col gap-1 mb-6 pb-6 border-b border-gray-100">
              <span className="font-montserrat text-sm text-gray-400 font-medium">Prix à partir de</span>
              <div className="flex items-end gap-4">
                <span className="font-nevan text-4xl text-[#AF1818] tracking-wide">
                  {product.price} <span className="text-xl">MAD</span>
                </span>
                {product.oldPrice && (
                  <span className="font-montserrat text-lg text-gray-400 line-through mb-1">
                    {product.oldPrice} MAD
                  </span>
                )}
              </div>
              <span className="font-montserrat text-xs text-gray-400">
                (hors service d&apos;installation)
              </span>
            </div>

            {/* Short description */}
            <p className="font-montserrat font-semibold text-gray-800 text-lg mb-4">
              {product.description}
            </p>

            {/* Long description */}
            <p className="font-montserrat text-gray-600 leading-relaxed mb-8">
              {product.longDescription || product.description}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-4 text-sm font-montserrat text-gray-500 mb-6">
              {product.reference && (
                <span className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  Réf : <span className="font-semibold text-gray-700">{product.reference}</span>
                </span>
              )}
              {product.brand && (
                <span className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  Marque : <span className="font-semibold text-gray-700">{product.brand}</span>
                </span>
              )}
              {product.warranty && (
                <span className="px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-100">
                  Garantie : <span className="font-semibold text-gray-700">{product.warranty}</span>
                </span>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 bg-[#10748E] text-white px-8 py-4 rounded-full font-nevan text-lg tracking-widest uppercase hover:bg-[#0c5a6e] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              CTA
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab("caracteristiques")}
              className={`px-8 py-4 font-nevan text-sm tracking-widest uppercase transition-colors ${
                activeTab === "caracteristiques"
                  ? "bg-[#AF1818] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Caractéristiques
            </button>
            <button
              onClick={() => setActiveTab("description")}
              className={`px-8 py-4 font-nevan text-sm tracking-widest uppercase transition-colors ${
                activeTab === "description"
                  ? "bg-[#AF1818] text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              Description
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8 md:p-12">
            {activeTab === "caracteristiques" && (
              <div>
                {product.specSections && product.specSections.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    {product.specSections.map((section, sIdx) => (
                      <div key={sIdx}>
                        <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wider mb-5">
                          {section.title}
                        </h3>
                        <div className="divide-y divide-gray-100 border-t border-gray-100">
                          {Object.entries(section.items).map(([key, value]) => (
                            <div key={key} className="flex items-start justify-between py-3 gap-4">
                              <span className="font-montserrat text-gray-500 text-sm">{key}</span>
                              <span className="font-montserrat font-semibold text-gray-900 text-sm text-right">
                                {value}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="font-montserrat text-gray-500">
                    Aucune fiche technique disponible pour ce produit.
                  </p>
                )}
              </div>
            )}

            {activeTab === "description" && (
              <div className="max-w-3xl">
                <p className="font-montserrat text-gray-700 leading-relaxed text-lg mb-8">
                  {product.longDescription || product.description}
                </p>
                {product.features && product.features.length > 0 && (
                  <div>
                    <h3 className="font-nevan text-lg text-gray-900 uppercase tracking-wider mb-5">
                      Points forts
                    </h3>
                    <ul className="space-y-3">
                      {product.features.map((feature, idx) => (
                        <li key={idx} className="font-montserrat text-gray-600 leading-relaxed">
                          — {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
