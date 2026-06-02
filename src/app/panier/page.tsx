"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Trash2, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function PanierPage() {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  // Helper to parse price string to number for calculation
  const parsePrice = (priceStr: string) => {
    return parseInt(priceStr.replace(/\s/g, ""), 10);
  };

  const total = cartItems.reduce((acc, item) => {
    return acc + parsePrice(item.product.price) * item.quantity;
  }, 0);

  // Format number back to string with spaces
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-32 pb-24">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        
        <div className="mb-12">
          <Link href="/catalogue" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#10748E] transition-colors font-montserrat font-semibold text-sm mb-6">
            <ArrowLeft size={16} /> Continuer les achats
          </Link>
          <h1 className="font-nevan text-4xl md:text-5xl text-gray-900 uppercase tracking-wider">
            Votre <span className="text-[#32A5DE]">Panier</span>
          </h1>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={48} className="text-gray-300" />
            </div>
            <h2 className="font-nevan text-2xl text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="font-montserrat text-gray-500 mb-8 max-w-md">
              Découvrez nos produits de climatisation et ventilation dans notre catalogue.
            </p>
            <Link href="/catalogue" className="bg-[#10748E] text-white px-8 py-3 rounded-full font-nevan tracking-widest uppercase hover:bg-[#0c5a6e] transition-colors shadow-lg">
              Voir le catalogue
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            
            {/* Cart Items List */}
            <div className="w-full lg:w-2/3 space-y-6">
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6 relative group">
                  
                  {/* Delete Button */}
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#AF1818] transition-colors p-2"
                  >
                    <Trash2 size={20} />
                  </button>

                  <div className="relative w-full sm:w-32 h-32 bg-[#F8FAFC] rounded-xl overflow-hidden shrink-0 flex items-center justify-center">
                    <Image
                      src={item.product.image}
                      alt={item.product.title}
                      fill
                      className="object-cover mix-blend-multiply"
                    />
                  </div>

                  <div className="flex flex-col flex-grow justify-between py-1">
                    <div>
                      <span className="font-nevan text-[10px] tracking-widest text-[#10748E] uppercase mb-1 block">
                        {item.product.category}
                      </span>
                      <Link href={`/catalogue/${item.product.id}`} className="font-nevan text-xl text-gray-900 hover:text-[#32A5DE] transition-colors line-clamp-2 pr-8 mb-2">
                        {item.product.title}
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                      {/* Quantity */}
                      <div className="flex items-center border border-gray-200 rounded-full px-3 py-1 bg-gray-50">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-[#10748E] p-1"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="font-montserrat font-semibold text-sm w-8 text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-[#10748E] p-1"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="font-nevan text-xl text-gray-900">
                          {formatPrice(parsePrice(item.product.price) * item.quantity)} <span className="text-sm">MAD</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-1/3">
              <div className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 sticky top-32">
                <h3 className="font-nevan text-2xl text-gray-900 mb-6 border-b border-gray-100 pb-4">
                  Récapitulatif
                </h3>
                
                <div className="space-y-4 font-montserrat text-gray-600 mb-8 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center">
                    <span>Sous-total</span>
                    <span className="font-semibold text-gray-900">{formatPrice(total)} MAD</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Frais d'installation</span>
                    <span className="text-[#10748E] text-sm">Sur devis</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Livraison</span>
                    <span className="text-[#10748E] text-sm">Calculée ultérieurement</span>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-8">
                  <span className="font-nevan text-gray-900">Total estimé</span>
                  <span className="font-nevan text-3xl text-[#AF1818]">{formatPrice(total)} <span className="text-sm">MAD</span></span>
                </div>

                <Link 
                  href="/devis"
                  className="w-full bg-[#AF1818] text-white py-4 rounded-xl font-nevan tracking-widest uppercase hover:bg-[#8A1212] transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Demander un devis
                </Link>
                <p className="font-montserrat text-xs text-gray-400 text-center mt-4">
                  Les prix sont affichés à titre indicatif et peuvent varier selon les conditions d'installation.
                </p>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
