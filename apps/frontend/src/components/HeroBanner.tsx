"use client";

import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function HeroBanner() {
  return (
    <div className="w-full transition-colors duration-300" style={{ background: "var(--bg-hero)", borderBottom: "1px solid var(--surface-border)" }}>

      {/* Promo Strip — Gold Accent */}
      <div className="text-center py-2.5 text-xs font-bold tracking-widest uppercase transition-colors" 
           style={{ background: "var(--surface-card)", color: "#B8962E", borderBottom: "1px solid var(--surface-border)" }}>
        Free delivery on your first 3 orders — Use code&nbsp;
        <span className="underline underline-offset-4 cursor-pointer hover:text-opacity-80">FIRST3</span>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
        {/* Subtle ambient luxury glow */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(193,73,46,0.06), transparent 60%), radial-gradient(ellipse at 80% 30%, rgba(184,150,46,0.05), transparent 50%)" }} />

        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">

          {/* Left: Copy */}
          <div className="flex-1 max-w-2xl">
            {/* Trusted badge */}
            <div
              className="inline-flex items-center gap-2 text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider transition-all hover:bg-opacity-80 cursor-default"
              style={{ background: "rgba(184,150,46,0.1)", color: "#B8962E", border: "1px solid rgba(184,150,46,0.2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#B8962E", boxShadow: "0 0 8px #B8962E" }} />
              Delivered from your premium Kirana
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.05] mb-6"
              style={{ color: "var(--text-primary)", fontFamily: "var(--font-heading)" }}
            >
              Everything you need,<br />
              <span style={{ color: "#AD4531", fontStyle: "italic" }}>delivered in minutes.</span>
            </h1>

            <p className="text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
              Groceries, medicines, and luxury essentials — curated and delivered to your door in <strong style={{ color: "#B8962E" }}>15 minutes</strong>.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/products">
                <button
                  className="px-8 py-4 rounded-xl font-bold text-[15px] text-white transition-all hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #AD4531, #8E3424)", boxShadow: "0 8px 30px rgba(173,69,49,0.3)" }}
                >
                  Browse Products
                </button>
              </Link>
              <Link href="/category/groceries">
                <button
                  className="px-8 py-4 rounded-xl font-bold text-[15px] transition-all hover:-translate-y-0.5"
                  style={{ border: "1px solid var(--surface-border)", color: "var(--text-primary)", background: "var(--surface-card)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#B8962E";
                    e.currentTarget.style.color = "#B8962E";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--surface-border)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                >
                  Shop Groceries
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 flex-wrap">
              {[
                { icon: <CheckCircle className="w-4 h-4" />, label: "100% Fresh", bg: "rgba(184,150,46,0.1)", color: "#B8962E" },
                { icon: <CheckCircle className="w-4 h-4" />, label: "Premium Quality", bg: "rgba(193,73,46,0.1)", color: "#C1492E" },
                { icon: <CheckCircle className="w-4 h-4" />, label: "15 min VIP Delivery", bg: "rgba(33,74,54,0.1)", color: "#214A36" },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold" style={{ background: b.bg, color: b.color }}>
                    {b.icon}
                  </div>
                  <span className="text-[13px] font-bold" style={{ color: "var(--text-muted)" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Promo Cards */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-4 w-full md:w-auto md:max-w-[380px]">
            <div
              className="rounded-[20px] p-6 text-white col-span-2 relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#9C412C]/30"
              style={{ background: "#9C412C" }}
            >
              <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(circle at top right, white, transparent 70%)" }} />
              <p className="text-[10px] font-bold mb-2 uppercase tracking-wide relative z-10 text-[#EDD0BF] opacity-90">Casano Gold Exclusive</p>
              <p className="text-2xl font-black leading-tight relative z-10 font-['Playfair_Display']">Flat 30% off<br/>Premium Groceries</p>
              <p className="text-[13px] font-medium mt-2 relative z-10 border-l-2 border-white/20 pl-2 text-white/90">Min order ₹199</p>
              <Link href="/category/groceries">
                <button
                  className="mt-4 text-white text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors relative z-10 hover:bg-white/30 backdrop-blur-md"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Shop Now
                </button>
              </Link>
            </div>
            
            <div 
              className="rounded-[20px] p-5 text-white transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#33211A]/30 dark:hover:shadow-[#0F2C1F]/30 bg-[#33211A] dark:bg-gradient-to-br dark:from-[#1A2520] dark:to-[#0F2C1F]" 
            >
              <p className="text-[10px] uppercase tracking-wider font-bold mb-1 text-[#C4B7B1]">Tech & Living</p>
              <p className="text-lg font-black leading-tight font-['Playfair_Display'] mb-3 mt-1 text-white">Up to 20% off</p>
              <Link href="/category/gadgets">
                <p className="text-[13px] font-bold inline-flex items-center transition-opacity hover:opacity-80" style={{ color: "#5D8056" }}>
                  Explore <span className="ml-1">→</span>
                </p>
              </Link>
            </div>
            
            <div 
              className="rounded-[20px] p-5 text-white transition-transform hover:-translate-y-1 hover:shadow-xl hover:shadow-[#291411]/20 dark:hover:shadow-[#B8962E]/20 bg-[#291411] dark:bg-gradient-to-br dark:from-[#2A2015] dark:to-[#1A1510]" 
            >
              <p className="text-[10px] uppercase tracking-wider font-bold mb-1 text-[#C4B7B1]">Luxury Fashion</p>
              <p className="text-lg font-black leading-tight font-['Playfair_Display'] mb-3 mt-1 text-white">New Arrivals</p>
              <Link href="/category/fashion">
                <p className="text-[13px] font-bold inline-flex items-center transition-opacity hover:opacity-80" style={{ color: "#B38E36" }}>
                  View All <span className="ml-1">→</span>
                </p>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
