"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PRODUCTS } from "@/lib/products";
import { notFound } from "next/navigation";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  const product = PRODUCTS.find((p) => p.id === parseInt(resolvedParams.id));

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <Link href="/catalogue" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#10748E] transition-colors font-montserrat font-semibold text-sm mb-12">
          <ArrowLeft size={16} /> Retour au catalogue
        </Link>

        <div className="bg-white rounded-3xl p-6 md:p-12 shadow-sm border border-gray-100 flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Image Section */}
          <div className="w-full lg:w-1/2">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[#F8FAFC] flex items-center justify-center p-8">
              {product.badge && (
                <span className={`absolute top-6 left-6 z-10 px-4 py-2 text-xs font-nevan tracking-widest uppercase rounded-lg text-white shadow-sm ${product.badge === 'Promo' ? 'bg-[#AF1818]' : 'bg-[#32A5DE]'}`}>
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
            <span className="font-nevan text-sm tracking-widest text-[#10748E] uppercase mb-4 block">
              {product.category}
            </span>
            <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 mb-6 leading-tight">
              {product.title}
            </h1>
            
            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-100">
              <span className="font-nevan text-4xl text-[#AF1818] tracking-wide">
                {product.price} <span className="text-xl">MAD</span>
              </span>
              {product.oldPrice && (
                <span className="font-montserrat text-lg text-gray-400 line-through mb-1">
                  {product.oldPrice} MAD
                </span>
              )}
            </div>

            <div className="font-montserrat text-gray-600 text-lg leading-relaxed mb-10">
              <p className="mb-4 font-semibold text-gray-800">{product.description}</p>
              <p>{product.longDescription || product.description}</p>
            </div>

            {/* CTA */}
            <div className="mt-auto">
              <Link 
                href="/devis"
                className="inline-flex items-center justify-center gap-3 bg-[#10748E] text-white px-8 py-4 rounded-full font-nevan text-lg tracking-widest uppercase hover:bg-[#0c5a6e] transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Demander un devis
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
