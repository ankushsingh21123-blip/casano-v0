"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, MapPin, ChevronDown, Tag, Crown, Store } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import LocationModal from "./LocationModal";
import LoginModal from "./LoginModal";
import CartPanel from "./CartPanel";
import SearchBar from "./SearchBar";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { cartCount, cartTotal } = useCart();
  const { isLoggedIn, user, deliveryLocation } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <>
      {/* ── Header: Jaisalmer Sand Beige surface over Pearl White page ── */}
      <header
        className="sticky top-0 z-40 w-full border-b transition-colors duration-300"
        style={{
          background: isDarkMode ? "#151210" : "#52201C",
          borderColor: isDarkMode ? "#2e2a2544" : "#6b2923",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="flex items-center h-[68px] w-full max-w-[1440px] mx-auto px-4 sm:px-6 gap-4 sm:gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-black tracking-tight">
              <span style={{ color: "#C1492E" }}>Casano</span>
              <span style={{ color: "#f5f0e8" }}>.in</span>
            </h1>
          </Link>

          {/* Offers Link */}
          <Link href="/offers" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--surface-border)]">
            <Tag className="w-4 h-4 text-[#C1492E]" />
            <span className="text-[14px] font-bold" style={{ color: "#f5f0e8" }}>Offers</span>
          </Link>

          {/* Gold Link */}
          <Link href="/gold" className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors hover:bg-[#B8962E22] group">
            <Crown className="w-4 h-4 text-[#B8962E] transition-transform group-hover:scale-110" />
            <span className="text-[14px] font-bold" style={{ color: "#B8962E" }}>Casano Gold</span>
          </Link>

          {/* Decorative vertical divider */}
          <div className="hidden sm:block h-8 w-px" style={{ background: "var(--surface-border)" }} />

          {/* Location Selector */}
          <button
            className="hidden sm:flex flex-col cursor-pointer group"
            onClick={() => setIsLocationOpen(true)}
          >
            <div
              className="text-[13px] font-black flex items-center gap-2 transition-colors"
              style={{ color: "#f5f0e8" }}
            >
              {/* Animated clock loader */}
              <div className="header-clock-loader">
                <span className="hour" />
                <span className="min" />
                <span className="circel" />
              </div>
              Delivery in 15 mins
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" style={{ color: "#214A36" }} />
              <span className="text-xs font-medium truncate max-w-[180px]" style={{ color: "#8a8580" }}>
                {user?.address ? user.address.slice(0, 30) + "..." : (deliveryLocation ? deliveryLocation.slice(0, 30) + (deliveryLocation.length > 30 ? "..." : "") : "Select Location")}
              </span>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9A9B9A" }} />
            </div>
          </button>

          <style dangerouslySetInnerHTML={{ __html: `
            .header-clock-loader {
              width: 22px;
              height: 22px;
              border: 2.5px solid #ee9b00a6;
              border-radius: 50px;
              position: relative;
              flex-shrink: 0;
            }
            .header-clock-loader span {
              display: block;
              background: #ee9b00;
            }
            .header-clock-loader .hour,
            .header-clock-loader .min {
              width: 2px;
              height: 7px;
              border-radius: 50px;
              position: absolute;
              top: 8px;
              left: 7px;
              animation: clock-spin-hour 1.2s linear infinite;
              transform-origin: top center;
            }
            .header-clock-loader .min {
              height: 5.5px;
              animation: clock-spin-min 4s linear infinite;
            }
            .header-clock-loader .circel {
              width: 3px;
              height: 3px;
              border-radius: 50px;
              position: absolute;
              top: 6.5px;
              left: 6.5px;
              background: #ee9b00;
            }
            @keyframes clock-spin-hour {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            @keyframes clock-spin-min {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />


          {/* Search Bar */}
          <div className="flex-1 min-w-0 max-w-[640px] mx-auto">
            <SearchBar placeholder='Search "milk", "medicines", "pens"...' />
          </div>

          {/* Right Actions */}
          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-5">
            {/* Add Your Store Link */}
            <div className="hidden lg:flex flex-col items-center">
              <Link
                href="https://form.typeform.com/to/lQOu4edG"
                target="_blank"
                className="flex items-center gap-2 text-[14px] font-bold transition-all hover:scale-105 hover:shadow-[0_4px_15px_#B8962E44] px-4 py-2 rounded-xl"
                style={{ background: "#B8962E", color: "#0f0d0a" }}
              >
                <Store className="w-4 h-4" />
                Add Your Store
              </Link>
            </div>

            <div className="hidden sm:block scale-75 origin-right">
              <ThemeToggle isDarkMode={isDarkMode} toggle={() => setIsDarkMode(!isDarkMode)} />
            </div>

            {/* Account */}
            <button
              className="flex items-center gap-1.5 text-[14px] font-bold transition-colors"
              style={{ color: "#f5f0e8" }}
              onClick={() => (isLoggedIn ? (window.location.href = "/account") : setIsLoginOpen(true))}
            >
              <div className="relative">
                <User className="w-5 h-5" />
                {isLoggedIn && (
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full border-2"
                    style={{ background: "#214A36", borderColor: "#EFEADD" }}
                  />
                )}
              </div>
              <span className="hidden md:block">
                {isLoggedIn && user?.name ? user.name.split(" ")[0] : "Account"}
              </span>
            </button>

            {/* Cart — Saffron CTA */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-[14px] text-white transition-all hover:shadow-lg"
              style={{ background: "#C1492E", boxShadow: "0 2px 8px #C1492E33" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
              onMouseLeave={e => (e.currentTarget.style.background = "#C1492E")}
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:block">
                {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? "s" : ""} • ₹${cartTotal}` : "My Cart"}
              </span>
              {cartCount > 0 && (
                <span
                  className="sm:hidden absolute -top-1.5 -right-1.5 w-5 h-5 text-white text-[10px] font-black rounded-full flex items-center justify-center"
                  style={{ background: "#214A36" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Gold shimmer bottom border */}
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #B8962E33, transparent)" }} />
      </header>

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
