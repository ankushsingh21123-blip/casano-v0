"use client";

import Link from "next/link";
import { CheckCircle, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// ── Palette ──────────────────────────────────────────────────────────────────
// Background  : #6B2A1A  (deep reddish-brown / sienna)
// Headline    : #FFF4E8  (warm cream)
// Italic span : #F5C9A0  (peachy sand — softer than cream)
// Body text   : #EECBA8  (warm peach-tan)
// Accent      : #E8A56A  (amber-gold — replaces green for link / badge glow)
// Badge bg    : rgba(232,165,106, 0.15)
// Badge border: rgba(232,165,106, 0.35)
// Cards (dark): deeper sienna shades so they contrast on the warm bg
// ─────────────────────────────────────────────────────────────────────────────

export default function HeroBanner() {
  return (
    <div
      className="w-full relative overflow-hidden"
      style={{
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "linear-gradient(135deg, #6B2A1A 0%, #7D3320 50%, #5C2015 100%)",
      }}
    >


      {/* Amber glow — top left */}
      <div
        className="absolute -top-20 -left-20 w-[400px] h-[400px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(232,165,106,0.18), transparent 70%)",
          filter: "blur(50px)",
        }}
      />

      {/* Subtle light leak — bottom right */}
      <div
        className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full pointer-events-none z-0"
        style={{
          background: "radial-gradient(circle, rgba(255,200,120,0.10), transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Hero Section */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-14 sm:py-20 relative z-[2]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

          {/* Left: Copy */}
          <div className="flex-1 max-w-2xl">

            {/* Trusted badge */}
            <div
              className="inline-flex items-center gap-2 text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider"
              style={{
                background: "rgba(232,165,106,0.15)",
                color: "#E8A56A",
                border: "1px solid rgba(232,165,106,0.35)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#E8A56A", boxShadow: "0 0 8px #E8A56A" }}
              />
              Delivered from your premium Kirana
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-[56px] font-black tracking-tight leading-[1.05] mb-6"
              style={{ color: "#FFF4E8", fontFamily: "var(--font-heading)" }}
            >
              Everything you need,
              <br />
              <span
                className="italic"
                style={{ color: "#F5C9A0", opacity: 0.85 }}
              >
                delivered in minutes.
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-medium"
              style={{ color: "#EECBA8" }}
            >
              Groceries, medicines, and luxury essentials — curated and delivered to your door in{" "}
              <strong style={{ color: "#E8A56A" }}>15 minutes</strong>.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl font-bold text-[15px] transition-shadow flex items-center gap-2"
                  style={{
                    background: "#E8A56A",
                    color: "#3A1008",
                    boxShadow: "0 8px 30px rgba(232,165,106,0.4)",
                  }}
                >
                  Browse Products
                  <ArrowRight size={16} />
                </motion.button>
              </Link>

              <Link href="/category/groceries">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl font-bold text-[15px] transition-all"
                  style={{
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#FFF4E8",
                    background: "rgba(255,255,255,0.08)",
                  }}
                >
                  Shop Groceries
                </motion.button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 flex-wrap">
              {[
                { label: "100% Fresh" },
                { label: "Premium Quality" },
                { label: "15 min VIP Delivery" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "rgba(232,165,106,0.2)", color: "#E8A56A" }}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span
                    className="text-[13px] font-bold"
                    style={{ color: "#EECBA8" }}
                  >
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Promo Cards */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-4 w-full md:w-auto md:max-w-[380px]">

            {/* Main card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-[20px] p-6 text-white col-span-2 relative overflow-hidden cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3A1008, #5A1E10)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.35)",
              }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: "radial-gradient(circle at top right, rgba(232,165,106,0.5), transparent 70%)",
                }}
              />
              <p className="text-[10px] font-bold mb-2 uppercase tracking-wide relative z-10 opacity-60">
                Casano Gold Exclusive
              </p>
              <p
                className="text-2xl font-black leading-tight relative z-10"
                style={{ fontFamily: "var(--font-heading)", color: "#FFF4E8" }}
              >
                Flat 30% off
                <br />
                Premium Groceries
              </p>
              <p className="text-[13px] font-medium mt-2 relative z-10 border-l-2 border-white/20 pl-2 text-white/70">
                Min order ₹199
              </p>
              <Link href="/category/groceries">
                <button
                  className="mt-4 text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors relative z-10"
                  style={{
                    background: "rgba(232,165,106,0.2)",
                    border: "1px solid rgba(232,165,106,0.4)",
                    color: "#E8A56A",
                  }}
                >
                  Shop Now
                </button>
              </Link>
            </motion.div>

            {/* Bottom left card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-[20px] p-5 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3A1008, #4A1810)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              }}
            >
              <p className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(255,244,232,0.5)" }}>
                Tech &amp; Living
              </p>
              <p
                className="text-lg font-black leading-tight mb-3 mt-1"
                style={{ fontFamily: "var(--font-heading)", color: "#FFF4E8" }}
              >
                Up to 20% off
              </p>
              <Link href="/category/gadgets">
                <p className="text-[13px] font-bold inline-flex items-center transition-opacity hover:opacity-80" style={{ color: "#E8A56A" }}>
                  Explore <span className="ml-1">→</span>
                </p>
              </Link>
            </motion.div>

            {/* Bottom right card */}
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-[20px] p-5 cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #3A1008, #4A1810)",
                boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
              }}
            >
              <p className="text-[10px] uppercase tracking-wider font-bold mb-1" style={{ color: "rgba(255,244,232,0.5)" }}>
                Luxury Fashion
              </p>
              <p
                className="text-lg font-black leading-tight mb-3 mt-1"
                style={{ fontFamily: "var(--font-heading)", color: "#FFF4E8" }}
              >
                New Arrivals
              </p>
              <Link href="/category/fashion">
                <p className="text-[13px] font-bold inline-flex items-center transition-opacity hover:opacity-80" style={{ color: "#E8A56A" }}>
                  View All <span className="ml-1">→</span>
                </p>
              </Link>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
