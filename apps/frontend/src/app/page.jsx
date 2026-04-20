"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// ── Existing components (unchanged) ──
import Header from "@/components/Header";
import CategorySlider from "@/components/CategorySlider";
import Footer from "@/components/Footer";
import OldMobileHome from "@/components/OldMobileHome";

// ── New enhanced desktop components (Now lazily loaded for optimization) ──
const LiquidHero   = dynamic(() => import("@/components/LiquidHero"),   { ssr: true });
const CategoryGrid = dynamic(() => import("@/components/CategoryGrid"), { ssr: true });

// ── Heavy new sections (dynamic import keeps mobile bundle light) ──
const FloatingMarquee = dynamic(() => import("@/components/ui/FloatingMarquee"), { ssr: false });
const CounterSection  = dynamic(() => import("@/components/ui/CounterSection"),  { ssr: false });
const HowItWorks      = dynamic(() => import("@/components/ui/HowItWorks"),      { ssr: false });
const Testimonials    = dynamic(() => import("@/components/ui/Testimonials"),    { ssr: false });
const AppDownload     = dynamic(() => import("@/components/ui/AppDownload"),     { ssr: false });

export default function Home() {
  const [isMobile, setIsMobile] = useState(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // While hydrating — show nothing (avoids flash and mismatch)
  if (isMobile === null) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--bg-main)" }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "28px",
              fontWeight: 900,
              color: "#C1492E",
              marginBottom: "8px",
            }}
          >
            Casano<span style={{ color: "var(--text-primary)" }}>.in</span>
          </h1>
          <div
            style={{
              width: "40px",
              height: "3px",
              background: "linear-gradient(90deg, #C1492E, #B8962E)",
              borderRadius: "2px",
              margin: "0 auto",
              animation: "shimmer-move 1s ease-in-out infinite alternate",
            }}
          />
        </div>
      </div>
    );
  }

  // ── Mobile: Blinkit/Zepto-style (unchanged OldMobileHome) ──
  if (isMobile) {
    return <OldMobileHome />;
  }

  // ── Desktop: Full Awwwards experience ──
  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: "var(--bg-main)" }}
    >
      <Header />

      {/* Promo announcement strip */}
      <div
        className="text-white text-center py-2.5 text-xs font-bold tracking-wide"
        style={{ background: "#214A36" }}
      >
        🎉 Free delivery on your first 3 orders — Use code&nbsp;
        <span className="underline underline-offset-2 cursor-pointer">FIRST3</span>
      </div>

      {/* ① Scrolling marquee — infinite promo strip */}
      <FloatingMarquee />

      {/* ② 3D Liquid distortion hero */}
      <LiquidHero />

      <main>
        {/* ③ How it works — 3-step animated section */}
        <HowItWorks />

        {/* ④ Category grid with per-card liquid distortion */}
        <CategoryGrid />

        {/* ⑤ Animated stats counter */}
        <CounterSection />

        {/* ⑥ Infinite auto-scrolling category chip slider */}
        <CategorySlider />

        {/* ⑦ Draggable testimonials carousel */}
        <Testimonials />

        {/* ⑧ App download with floating phone mockup */}
        <AppDownload />
      </main>

      <Footer />
    </div>
  );
}
