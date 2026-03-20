"use client";

import Link from "next/link";

export default function HeroBanner() {
  return (
    <div className="w-full border-b transition-colors duration-300" style={{ background: "#FDFBF7", borderColor: "#E2DDD0" }}>

      {/* Promo Strip — Forest Green */}
      <div className="text-white text-center py-2.5 text-xs font-bold tracking-wide" style={{ background: "#214A36" }}>
        🎉 Free delivery on your first 3 orders — Use code&nbsp;
        <span className="underline underline-offset-2 cursor-pointer">FIRST3</span>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">

          {/* Left: Copy */}
          <div className="flex-1 max-w-2xl">
            {/* Trusted badge */}
            <div
              className="inline-flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-full mb-5"
              style={{ background: "#E6F2EC", color: "#214A36" }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: "#214A36" }} />
              Delivered from your local Kirana store
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-5"
              style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Everything you need,<br />
              <span style={{ color: "#C1492E" }}>delivered in minutes.</span>
            </h1>

            <p className="text-base sm:text-lg max-w-xl mb-8 leading-relaxed" style={{ color: "#5A5B5A" }}>
              Groceries, medicines, stationery and more — from your local Kirana store to your door in 15 minutes.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/products">
                <button
                  className="px-6 py-3.5 rounded-xl font-bold text-base text-white transition-all hover:shadow-lg"
                  style={{ background: "#C1492E" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
                  onMouseLeave={e => (e.currentTarget.style.background = "#C1492E")}
                >
                  Browse Products
                </button>
              </Link>
              <Link href="/category/groceries">
                <button
                  className="px-6 py-3.5 rounded-xl font-bold text-base transition-all"
                  style={{ border: "2px solid #E2DDD0", color: "#2A2B2A", background: "transparent" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = "#214A36";
                    e.currentTarget.style.color = "#214A36";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "#E2DDD0";
                    e.currentTarget.style.color = "#2A2B2A";
                  }}
                >
                  Shop Groceries
                </button>
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-8 flex-wrap">
              {[
                { icon: "✓", label: "100% Fresh", bg: "#E6F2EC", color: "#214A36" },
                { icon: "🛡", label: "Safe & Hygienic", bg: "#FAE8E5", color: "#C1492E" },
                { icon: "⚡", label: "15 min delivery", bg: "#FBF5E1", color: "#B8962E" },
              ].map(b => (
                <div key={b.label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm" style={{ background: b.bg, color: b.color }}>
                    {b.icon}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "#5A5B5A" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Promo Cards */}
          <div className="flex-shrink-0 grid grid-cols-2 gap-3 w-full md:w-auto md:max-w-[360px]">
            <div
              className="rounded-2xl p-5 text-white col-span-2"
              style={{ background: "linear-gradient(135deg, #C1492E, #8B2A18)" }}
            >
              <p className="text-xs font-bold opacity-80 mb-1 uppercase tracking-wider">Featured Offer</p>
              <p className="text-xl font-black leading-tight">Flat 30% off on Groceries</p>
              <p className="text-sm opacity-90 mt-1">Min order ₹199</p>
              <Link href="/category/groceries">
                <button
                  className="mt-3 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  Shop Now
                </button>
              </Link>
            </div>
            <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #214A36, #0F2C1F)" }}>
              <p className="text-xs font-bold opacity-70 mb-1">Gadgets</p>
              <p className="text-base font-black leading-tight">Up to 20% off</p>
              <Link href="/category/gadgets">
                <p className="text-xs mt-2 font-semibold" style={{ color: "#A8D5B8" }}>Explore →</p>
              </Link>
            </div>
            <div className="rounded-2xl p-4 text-white" style={{ background: "linear-gradient(135deg, #B8962E, #7D6219)" }}>
              <p className="text-xs font-bold opacity-70 mb-1">Fashion</p>
              <p className="text-base font-black leading-tight">New Arrivals</p>
              <Link href="/category/fashion">
                <p className="text-xs mt-2 font-semibold" style={{ color: "#FBF5E1" }}>View All →</p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
