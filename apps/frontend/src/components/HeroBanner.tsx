"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CheckCircle, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

/* ── Lazy-load UnicornScene to avoid SSR issues ── */
const UnicornScene = dynamic(() => import("unicornstudio-react"), {
  ssr: false,
  loading: () => null,
});

/* ── Curated gradient palettes (with brand orange baked in) ── */
const GRADIENT_PRESETS = [
  // Default warm Rajputana
  { c1: [244, 239, 230], c2: [250, 232, 229], c3: [251, 245, 225] },
  // Saffron sunrise
  { c1: [193, 73, 46], c2: [184, 150, 46], c3: [250, 232, 229] },
  // Deep terracotta dusk
  { c1: [173, 69, 49], c2: [142, 52, 36], c3: [244, 239, 230] },
  // Forest gold
  { c1: [33, 74, 54], c2: [184, 150, 46], c3: [230, 242, 236] },
  // Pearl saffron
  { c1: [253, 251, 247], c2: [193, 73, 46], c3: [251, 245, 225] },
  // Royal amber
  { c1: [184, 150, 46], c2: [193, 73, 46], c3: [33, 74, 54] },
  // Midnight spice
  { c1: [42, 43, 42], c2: [193, 73, 46], c3: [184, 150, 46] },
  // Warm blush
  { c1: [250, 232, 229], c2: [244, 239, 230], c3: [193, 73, 46] },
];

function rgb(arr: number[]) {
  return `rgb(${arr[0]}, ${arr[1]}, ${arr[2]})`;
}

function lerpColor(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

export default function HeroBanner() {
  const [colors, setColors] = useState(GRADIENT_PRESETS[0]);
  const [displayColors, setDisplayColors] = useState(GRADIENT_PRESETS[0]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [presetIndex, setPresetIndex] = useState(0);

  /* ── Smooth color interpolation ── */
  useEffect(() => {
    if (
      colors.c1.join() === displayColors.c1.join() &&
      colors.c2.join() === displayColors.c2.join() &&
      colors.c3.join() === displayColors.c3.join()
    ) {
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    let frame: number;
    let progress = 0;
    const startC1 = [...displayColors.c1];
    const startC2 = [...displayColors.c2];
    const startC3 = [...displayColors.c3];
    const duration = 800; // ms
    let startTime: number | null = null;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      progress = Math.min((ts - startTime) / duration, 1);
      const ease = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2; // cubic ease-in-out

      setDisplayColors({
        c1: lerpColor(startC1, colors.c1, ease),
        c2: lerpColor(startC2, colors.c2, ease),
        c3: lerpColor(startC3, colors.c3, ease),
      });

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [colors]);

  /* ── Randomize with brand orange anchor ── */
  const randomize = useCallback(() => {
    const randInt = (max: number) => Math.floor(Math.random() * max);

    // 50% chance: pick a curated preset, 50% chance: fully random with orange
    if (Math.random() > 0.5) {
      const next = (presetIndex + 1 + randInt(GRADIENT_PRESETS.length - 1)) % GRADIENT_PRESETS.length;
      setPresetIndex(next);
      setColors(GRADIENT_PRESETS[next]);
    } else {
      // Always anchor one color to the brand orange family
      const orangeBase = [
        193 + randInt(30) - 15,
        73 + randInt(30) - 15,
        46 + randInt(20) - 10,
      ].map(v => Math.max(0, Math.min(255, v)));

      setColors({
        c1: orangeBase,
        c2: [randInt(255), randInt(255), randInt(255)],
        c3: [randInt(255), randInt(255), randInt(255)],
      });
    }
  }, [presetIndex]);

  /* ── Auto-cycle every 6 seconds ── */
  useEffect(() => {
    const interval = setInterval(randomize, 6000);
    return () => clearInterval(interval);
  }, [randomize]);

  const gradientBg = `
    radial-gradient(ellipse at 15% 50%, ${rgb(displayColors.c1)}33, transparent 55%),
    radial-gradient(ellipse at 85% 20%, ${rgb(displayColors.c2)}28, transparent 50%),
    radial-gradient(ellipse at 50% 90%, ${rgb(displayColors.c3)}22, transparent 60%),
    var(--bg-hero)
  `;

  /* ── Floating orbs overlay ── */
  const orbStyle = (color: number[], x: string, y: string, size: string, delay: number) => ({
    position: "absolute" as const,
    left: x,
    top: y,
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${rgb(color)}18, transparent 70%)`,
    filter: "blur(40px)",
    pointerEvents: "none" as const,
    animation: `float-orb ${8 + delay}s ease-in-out infinite alternate`,
    animationDelay: `${delay}s`,
  });

  return (
    <div className="w-full transition-colors duration-300 relative overflow-hidden" style={{ borderBottom: "1px solid var(--surface-border)" }}>

      {/* UnicornStudio animated background */}
      <div className="absolute inset-0 z-0">
        <UnicornScene
          projectId="18CBccbb02aYYChpjQtO"
          width="100%"
          height="100%"
          scale={1}
          dpi={1.5}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.11/dist/unicornStudio.umd.js"
        />
      </div>

      {/* Gradient overlay for readability on top of the scene */}
      <div
        className="absolute inset-0 transition-none z-[1]"
        style={{ background: gradientBg, opacity: 0.55 }}
      />

      {/* Floating orbs */}
      <div style={{ ...orbStyle(displayColors.c1, "10%", "20%", "300px", 0), zIndex: 1 }} />
      <div style={{ ...orbStyle(displayColors.c2, "70%", "10%", "250px", 2), zIndex: 1 }} />
      <div style={{ ...orbStyle(displayColors.c3, "40%", "60%", "200px", 4), zIndex: 1 }} />

      {/* Promo Strip — Gold Accent */}
      <div className="text-center py-2.5 text-xs font-bold tracking-widest uppercase transition-colors relative z-[2]" 
           style={{ background: "var(--surface-card)", color: "#B8962E", borderBottom: "1px solid var(--surface-border)" }}>
        Free delivery on your first 3 orders — Use code&nbsp;
        <span className="underline underline-offset-4 cursor-pointer hover:text-opacity-80">FIRST3</span>
      </div>

      {/* Hero Section */}
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12 sm:py-20 relative z-[2]">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">

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
              <motion.span
                key={rgb(displayColors.c1)}
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                style={{ color: rgb(displayColors.c1), fontStyle: "italic" }}
              >
                delivered in minutes.
              </motion.span>
            </h1>

            <p className="text-lg sm:text-xl max-w-lg mb-10 leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
              Groceries, medicines, and luxury essentials — curated and delivered to your door in <strong style={{ color: "#B8962E" }}>15 minutes</strong>.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl font-bold text-[15px] text-white transition-shadow"
                  style={{
                    background: `linear-gradient(135deg, ${rgb(displayColors.c1)}, ${rgb(lerpColor(displayColors.c1, [0, 0, 0], 0.25))})`,
                    boxShadow: `0 8px 30px ${rgb(displayColors.c1)}4D`,
                  }}
                >
                  Browse Products
                </motion.button>
              </Link>
              <Link href="/category/groceries">
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-8 py-4 rounded-xl font-bold text-[15px] transition-all"
                  style={{ border: "1px solid var(--surface-border)", color: "var(--text-primary)", background: "var(--surface-card)" }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = rgb(displayColors.c2);
                    e.currentTarget.style.color = rgb(displayColors.c2);
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = "var(--surface-border)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }}
                >
                  Shop Groceries
                </motion.button>
              </Link>

              {/* Randomize gradient button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 15 }}
                whileTap={{ scale: 0.9, rotate: -15 }}
                onClick={randomize}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer"
                style={{
                  background: `linear-gradient(135deg, ${rgb(displayColors.c1)}, ${rgb(displayColors.c2)}, ${rgb(displayColors.c3)})`,
                  boxShadow: `0 4px 15px ${rgb(displayColors.c1)}33`,
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
                title="Randomize colors"
                aria-label="Randomize gradient colors"
              >
                <Sparkles size={16} color="white" />
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-10 flex-wrap">
              {[
                { icon: <CheckCircle className="w-4 h-4" />, label: "100% Fresh", bg: "rgba(184,150,46,0.1)", color: "#B8962E" },
                { icon: <CheckCircle className="w-4 h-4" />, label: "Premium Quality", bg: "rgba(184,150,46,0.1)", color: "#B8962E" },
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
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-[20px] p-6 text-white col-span-2 relative overflow-hidden cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${rgb(displayColors.c1)}, ${rgb(lerpColor(displayColors.c1, [0, 0, 0], 0.2))})`,
                boxShadow: `0 12px 40px ${rgb(displayColors.c1)}33`,
              }}
            >
              <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(circle at top right, white, transparent 70%)" }} />
              {/* Decorative orb in card */}
              <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full" style={{ background: `${rgb(displayColors.c2)}30`, filter: "blur(20px)" }} />
              <p className="text-[10px] font-bold mb-2 uppercase tracking-wide relative z-10 opacity-80">Casano Gold Exclusive</p>
              <p className="text-2xl font-black leading-tight relative z-10" style={{ fontFamily: "var(--font-heading)" }}>Flat 30% off<br/>Premium Groceries</p>
              <p className="text-[13px] font-medium mt-2 relative z-10 border-l-2 border-white/20 pl-2 text-white/90">Min order ₹199</p>
              <Link href="/category/groceries">
                <button
                  className="mt-4 text-white text-[13px] font-bold px-5 py-2.5 rounded-lg transition-colors relative z-10 hover:bg-white/30 backdrop-blur-md"
                  style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  Shop Now
                </button>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-[20px] p-5 text-white cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${rgb(lerpColor(displayColors.c2, [0, 0, 0], 0.7))}, ${rgb(lerpColor(displayColors.c2, [0, 0, 0], 0.85))})`,
                boxShadow: `0 8px 25px ${rgb(displayColors.c2)}22`,
              }}
            >
              <p className="text-[10px] uppercase tracking-wider font-bold mb-1 text-white/60">Tech & Living</p>
              <p className="text-lg font-black leading-tight mb-3 mt-1 text-white" style={{ fontFamily: "var(--font-heading)" }}>Up to 20% off</p>
              <Link href="/category/gadgets">
                <p className="text-[13px] font-bold inline-flex items-center transition-opacity hover:opacity-80" style={{ color: rgb(displayColors.c2) }}>
                  Explore <span className="ml-1">→</span>
                </p>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              className="rounded-[20px] p-5 text-white cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${rgb(lerpColor(displayColors.c3, [0, 0, 0], 0.7))}, ${rgb(lerpColor(displayColors.c3, [0, 0, 0], 0.85))})`,
                boxShadow: `0 8px 25px ${rgb(displayColors.c3)}22`,
              }}
            >
              <p className="text-[10px] uppercase tracking-wider font-bold mb-1 text-white/60">Luxury Fashion</p>
              <p className="text-lg font-black leading-tight mb-3 mt-1 text-white" style={{ fontFamily: "var(--font-heading)" }}>New Arrivals</p>
              <Link href="/category/fashion">
                <p className="text-[13px] font-bold inline-flex items-center transition-opacity hover:opacity-80" style={{ color: rgb(displayColors.c3) }}>
                  View All <span className="ml-1">→</span>
                </p>
              </Link>
            </motion.div>
          </div>
          
        </div>
      </div>

      {/* Float orb animation keyframes */}
      <style jsx>{`
        @keyframes float-orb {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -20px) scale(1.05); }
          66% { transform: translate(-10px, 10px) scale(0.95); }
          100% { transform: translate(5px, -15px) scale(1.02); }
        }
      `}</style>
    </div>
  );
}
