"use client";

import { Search } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="w-full bg-casano-orange-light dark:bg-[#1a1a1a] transition-colors duration-300 py-8 px-4 sm:px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-casano-orange rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-casano-yellow rounded-full mix-blend-multiply filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/4"></div>

      <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center relative z-10">
        <span className="bg-casano-orange text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider inline-block">
          Fresh & Fast
        </span>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 dark:text-gray-100 tracking-tight leading-[1.1] max-w-4xl mx-auto mb-6 transition-colors duration-300">
          Stock up on Shop now cheap from <span className="text-casano-orange">Kirana</span>. <br className="hidden sm:block" />
          Get everything just search it.
        </h1>
        
        <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-8 font-medium transition-colors duration-300">
          Your neighborhood store, now 15 minutes away.
        </p>

        <button className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 flex items-center justify-center gap-3 w-full sm:w-auto">
          <Search className="w-5 h-5 text-casano-orange" />
          Shop Now
        </button>
      </div>
    </div>
  );
}
