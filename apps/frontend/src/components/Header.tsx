"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, MapPin, ChevronDown } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LocationModal from "./LocationModal";
import LoginModal from "./LoginModal";
import CartPanel from "./CartPanel";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { cartCount, cartTotal } = useCart();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#1a1a1a] shadow-sm border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-[80px] w-full max-w-[1400px] mx-auto px-4 py-3 sm:py-0 gap-3 sm:gap-6">
          
          {/* Logo & Location Group */}
          <div className="flex items-center w-full sm:w-auto justify-between sm:justify-start gap-4 sm:gap-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tighter text-casano-orange">
                Casano<span className="text-gray-900 dark:text-white transition-colors duration-300">.in</span>
              </h1>
            </Link>

            {/* Location Selector */}
            <div 
              className="group flex flex-col cursor-pointer sm:pl-8 sm:border-l sm:border-gray-100 dark:border-gray-800 transition-colors duration-300"
              onClick={() => setIsLocationOpen(true)}
            >
              <div className="text-sm font-black text-gray-900 dark:text-white flex items-center group-hover:text-casano-orange dark:group-hover:text-casano-orange transition-colors">
                Delivery in 15 mins
              </div>
              <div className="flex items-center text-xs text-gray-500 font-medium mt-0.5">
                <MapPin className="w-3.5 h-3.5 mr-1 text-casano-green" />
                <span className="truncate max-w-[120px] sm:max-w-[200px] dark:text-gray-400">Select Location</span>
                <ChevronDown className="w-4 h-4 ml-0.5 group-hover:-translate-y-0.5 transition-transform dark:text-gray-400" />
              </div>
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 w-full max-w-[600px] xl:max-w-[800px] mx-auto order-3 sm:order-2">
            <div className="relative group/search">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400 group-focus-within/search:text-casano-orange transition-colors" />
              </div>
              <input
                type="text"
                className="block w-full p-3.5 pl-12 text-[15px] font-medium text-gray-900 dark:text-gray-200 bg-gray-50 dark:bg-[#2a2a2a] rounded-2xl outline-none focus:bg-white dark:focus:bg-[#333] focus:ring-2 focus:ring-casano-orange/20 border border-transparent focus:border-casano-orange transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 placeholder:font-normal"
                placeholder='Search "milk", "medicines", "pens"...'
              />
              <div className="absolute inset-y-0 right-2 flex items-center">
                 <button className="bg-white dark:bg-[#444] border border-gray-200 dark:border-[#555] px-3 py-1.5 rounded-xl text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm hidden sm:block transition-colors duration-300">Search</button>
              </div>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex flex-shrink-0 items-center gap-4 sm:gap-6 order-2 sm:order-3">
            <div className="hidden sm:block scale-75 origin-right">
                <ThemeToggle isDarkMode={isDarkMode} toggle={() => setIsDarkMode(!isDarkMode)} />
            </div>
            
            <button 
              className="flex items-center gap-2 text-[15px] text-gray-700 dark:text-gray-300 hover:text-casano-orange dark:hover:text-casano-orange font-bold transition-colors"
              onClick={() => setIsLoginOpen(true)}
            >
              <User className="w-5 h-5" />
              <span className="hidden md:block">Account</span>
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 bg-casano-green hover:bg-[#158233] text-white px-5 py-3 rounded-2xl font-bold text-[15px] transition-transform hover:scale-105 shadow-md shadow-casano-green/20"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block">
                {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''} • ₹${cartTotal}` : 'My Cart'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Shared Modals */}
      <LocationModal isOpen={isLocationOpen} onClose={() => setIsLocationOpen(false)} />
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      <CartPanel 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onLoginClick={() => { setIsCartOpen(false); setIsLoginOpen(true); }}
      />
    </>
  );
}
