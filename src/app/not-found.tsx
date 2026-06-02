import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#10748E]/5 z-0 pointer-events-none" />
      
      {/* Decorative circles */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#32A5DE]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#AF1818]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 text-center max-w-2xl mx-auto flex flex-col items-center">
        <div className="text-[120px] md:text-[200px] font-nevan text-[#10748E]/20 leading-none select-none mb-4 drop-shadow-sm">
          404
        </div>
        
        <h1 className="font-nevan text-3xl md:text-5xl text-gray-900 uppercase tracking-wide mb-6">
          Oups ! Il fait un peu trop <span className="text-[#32A5DE]">froid</span> par ici...
        </h1>
        
        <p className="font-montserrat text-gray-600 text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed">
          La page que vous recherchez semble avoir gelé ou n'existe plus. 
          Ne restez pas dans le froid, retournez à la chaleur de l'accueil !
        </p>
        
        <Link 
          href="/"
          className="group relative inline-flex items-center justify-center gap-3 bg-[#AF1818] text-white px-8 py-4 rounded-full font-nevan tracking-widest uppercase overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-[#AF1818]/30"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
          <Home size={20} className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
          <span className="relative z-10 mt-1">Retour à l'accueil</span>
        </Link>
      </div>
    </div>
  );
}
