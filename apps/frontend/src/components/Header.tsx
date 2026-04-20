"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, MapPin, ChevronDown } from "lucide-react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { cartCount, cartTotal } = useCart();
  const { isLoggedIn, user } = useAuth();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* ── Header: Jaisalmer Sand Beige surface over Pearl White page ── */}
      <header
        id="main-header"
        className={`sticky top-0 z-40 w-full border-b transition-all duration-300 ${isScrolled ? "header-frosted shadow-sm" : "glass"}`}
        style={{ borderColor: "var(--surface-border)" }}
      >
        <div className="flex items-center h-[68px] w-full max-w-[1440px] mx-auto px-4 sm:px-6 gap-4 sm:gap-6">

          {/* Logo */}
          <Link href="/" id="header-logo" className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-black tracking-tight">
              <span style={{ color: "#C1492E" }}>Casano</span>
              <span style={{ color: "var(--text-primary)" }}>.in</span>
            </h1>
          </Link>

          {/* Decorative vertical divider */}
          <div className="hidden sm:block h-8 w-px" style={{ background: "var(--surface-border)" }} />

          {/* Location Selector */}
          <button
            id="btn-location-selector"
            className="hidden sm:flex flex-col cursor-pointer group"
            onClick={() => setIsLocationOpen(true)}
          >
            <div
              className="text-[13px] font-black flex items-center gap-2 transition-colors"
              style={{ color: "var(--text-primary)" }}
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
              <span className="text-xs font-medium truncate max-w-[180px]" style={{ color: "var(--text-secondary)" }}>
                {user?.address ? user.address.slice(0, 30) + "..." : "Select Location"}
              </span>
              <ChevronDown className="w-3.5 h-3.5" style={{ color: "#9A9B9A" }} />
            </div>
          </button>
          {/* Search Bar */}
          <div className="flex-1 min-w-0 max-w-[640px] mx-auto">
            <SearchBar placeholder='Search "milk", "medicines", "pens"...' />
          </div>

          {/* Right Actions */}
          <div className="flex flex-shrink-0 items-center gap-3 sm:gap-5">
            {/* Add Your Store Link */}
            <div className="hidden lg:flex items-center">
              <Link
                href="https://form.typeform.com/to/lQOu4edG#user_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&product_id=xxxxx&auth_code=xxxxx"
                id="link-add-store"
                target="_blank"
                className="flex items-center gap-2 text-[13px] font-bold transition-transform hover:scale-105 px-3 py-1.5 rounded-full border shadow-sm"
                style={{ color: "var(--accent-trust)", borderColor: "var(--surface-border)", background: "var(--background)" }}
              >
                {/* REPLACE src WITH YOUR UPLOADED SHOP IMAGE PATH */}
                <img src="https://images.unsplash.com/photo-1604719312566-8fa2065b70d5?q=80&w=100&auto=format&fit=crop" alt="Store" className="w-5 h-5 rounded-full object-cover border" style={{ borderColor: "#E2DDD0" }} />
                Add Your Store
                <span className="text-xs">→</span>
              </Link>
            </div>

            <div className="hidden sm:block scale-75 origin-right">
              <ThemeToggle isDarkMode={isDarkMode} toggle={() => setIsDarkMode(!isDarkMode)} />
            </div>

            {/* Account */}
            <button
              id="btn-account"
              className="flex items-center gap-1.5 text-[14px] font-bold transition-colors"
              style={{ color: "var(--text-primary)" }}
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
              id="btn-cart-toggle"
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
        <div style={{ height: "2px", background: "linear-gradient(90deg, transparent, #B8962E55, transparent)" }} />
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
