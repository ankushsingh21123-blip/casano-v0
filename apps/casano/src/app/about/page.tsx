"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import AboutCarousel from "@/components/AboutCarousel";
import { Store, Zap, Heart, Smartphone, ShoppingBag, Bike } from "lucide-react";
import { ReactNode } from "react";

const stats = [
  { value: "15 min", label: "Average Delivery Time" },
  { value: "500+", label: "Local Partner Stores" },
  { value: "50K+", label: "Happy Customers" },
  { value: "100%", label: "Local, Neighbourhood Sourced" },
];

interface ValueItem {
  icon: ReactNode;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

const values: ValueItem[] = [
  {
    icon: <Store className="w-6 h-6" />,
    title: "Empowering Local Shopkeepers",
    desc: "We believe every Kirana owner deserves digital tools. Our vendor app lets any local store go online in minutes — no tech skills needed.",
    color: "#214A36",
    bg: "#E6F2EC",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Speed Without Warehouses",
    desc: "We don\u0027t use dark warehouses or fulfilment centres. Orders go directly from your local shop to your door — faster, fresher, and more personal.",
    color: "#B8962E",
    bg: "#FBF5E1",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Community First",
    desc: "Every Casano order directly benefits a shopkeeper in your neighbourhood, not a distant corporation. Spend local, grow local.",
    color: "#C1492E",
    bg: "#FAE8E5",
  },
  {
    icon: <Smartphone className="w-6 h-6" />,
    title: "Technology for Bharat",
    desc: "Built specifically for Indian hyperlocal commerce — GST-ready, UPI-native, and designed around the real workflow of street-level retail.",
    color: "#214A36",
    bg: "#E6F2EC",
  },
];

interface StepItem {
  step: string;
  icon: ReactNode;
  title: string;
  desc: string;
  color: string;
  bg: string;
}

const steps: StepItem[] = [
  {
    step: "01",
    icon: <Smartphone className="w-7 h-7" />,
    title: "Customer Orders",
    desc: "You browse and order on Casano in seconds — groceries, medicines, stationery, anything from local shops.",
    color: "#C1492E",
    bg: "#FAE8E5",
  },
  {
    step: "02",
    icon: <Store className="w-7 h-7" />,
    title: "Kirana Partner Accepts",
    desc: "The order pings the nearby partner store via our Vendor App. The shopkeeper accepts and packs within minutes.",
    color: "#214A36",
    bg: "#E6F2EC",
  },
  {
    step: "03",
    icon: <Bike className="w-7 h-7" />,
    title: "Rider Delivers",
    desc: "A delivery partner picks up from the store and brings it straight to your door — typically in under 15 minutes.",
    color: "#B8962E",
    bg: "#FBF5E1",
  },
];

const team = [
  { name: "Ankush Singh", role: "Founder & CEO", initial: "A", color: "#C1492E" },
  { name: "Vendor Partners", role: "Local Kirana Stores", initial: "VP", color: "#214A36" },
  { name: "Delivery Partners", role: "Neighbourhood Riders", initial: "DP", color: "#B8962E" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#FDFBF7" }}>
      <Header />

      {/* ── 3D Carousel Hero ── */}
      <AboutCarousel />

      {/* Gold shimmer */}
      <div style={{ height: "3px", background: "linear-gradient(90deg, transparent, #B8962E, transparent)" }} />

      {/* ── Stats ── */}
      <section className="w-full py-14 px-4" style={{ background: "#EFEADD" }}>
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(s => (
            <div
              key={s.label}
              className="text-center py-8 px-4 rounded-2xl transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "#FDFBF7", border: "1px solid #E2DDD0" }}
            >
              <div
                className="text-3xl sm:text-4xl font-bold mb-2"
                style={{ fontFamily: "'Playfair Display', serif", color: "#C1492E" }}
              >
                {s.value}
              </div>
              <div className="text-sm font-medium" style={{ color: "#5A5B5A" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Story ── */}
      <section className="max-w-[900px] mx-auto px-4 py-16">
        <div className="flex items-center gap-4 mb-8">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', serif" }}
          >
            Our Story
          </h2>
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, #E2DDD0, transparent)" }} />
        </div>
        <div className="space-y-5 text-base leading-relaxed" style={{ color: "#5A5B5A" }}>
          <p>
            Casano was born from a simple observation: India has <strong style={{ color: "#2A2B2A" }}>15 million Kirana stores</strong> — the world&apos;s densest retail network — yet most of them were invisible to modern e-commerce. Meanwhile, customers were waiting days for deliveries from distant warehouses, even when the product they needed was sitting on a shelf 200 metres away.
          </p>
          <p>
            We built Casano to close that gap. Our platform connects customers directly to the shops they already trust, with a <strong style={{ color: "#2A2B2A" }}>vendor app</strong> that lets any shopkeeper accept and manage orders digitally, and a <strong style={{ color: "#2A2B2A" }}>rider network</strong> that picks up and delivers within minutes.
          </p>
          <p>
            The result is a system that is faster than any warehouse model, cheaper to operate, and deeply rooted in the communities it serves. Every order you place on Casano puts money directly in a local shopkeeper&apos;s pocket.
          </p>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="w-full py-16 px-4" style={{ background: "#EFEADD" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', serif" }}
          >
            How Casano Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map(s => (
              <div
                key={s.step}
                className="rounded-2xl p-6 relative overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-lg"
                style={{ background: "#FDFBF7", border: "1px solid #E2DDD0" }}
              >
                <div
                  className="absolute top-4 right-4 text-5xl font-black opacity-10"
                  style={{ color: s.color, fontFamily: "'Playfair Display', serif" }}
                >
                  {s.step}
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.icon}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5A5B5A" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="max-w-[1100px] mx-auto px-4 py-16">
        <h2
          className="text-3xl font-bold mb-10"
          style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', serif" }}
        >
          What We Stand For
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {values.map(v => (
            <div
              key={v.title}
              className="flex gap-4 p-6 rounded-2xl transition-transform hover:-translate-y-1 hover:shadow-lg"
              style={{ background: "#EFEADD", border: "1px solid #E2DDD0" }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: v.bg, color: v.color }}
              >
                {v.icon}
              </div>
              <div>
                <h3
                  className="text-base font-bold mb-1.5"
                  style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', serif", fontSize: "18px" }}
                >
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#5A5B5A" }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="w-full py-16 px-4" style={{ background: "#EFEADD" }}>
        <div className="max-w-[1100px] mx-auto">
          <h2
            className="text-3xl font-bold text-center mb-10"
            style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', serif" }}
          >
            The People Behind Casano
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {team.map(t => (
              <div
                key={t.name}
                className="rounded-2xl p-8 text-center transition-transform hover:-translate-y-2 hover:shadow-xl"
                style={{ background: "#FDFBF7", border: "1px solid #E2DDD0" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-lg font-black"
                  style={{ background: t.color }}
                >
                  {t.initial}
                </div>
                <h3
                  className="text-lg font-bold mb-1"
                  style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', serif" }}
                >
                  {t.name}
                </h3>
                <p className="text-sm" style={{ color: "#5A5B5A" }}>{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="w-full px-4 py-16">
        <div
          className="max-w-[1100px] mx-auto rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #C1492E, #8B2A18)" }}
        >
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <h2
            className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shop Local. Support Local.
          </h2>
          <p className="text-white/80 text-base mb-8 max-w-lg mx-auto relative z-10">
            Browse thousands of products from trusted Kirana stores in your neighbourhood. Delivered in 15 minutes.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap relative z-10">
            <Link href="/products">
              <button
                className="px-8 py-3.5 rounded-xl font-semibold text-base transition-all hover:-translate-y-0.5"
                style={{ background: "#FDFBF7", color: "#C1492E" }}
              >
                Browse Products
              </button>
            </Link>
            <Link href="/partner">
              <button
                className="px-8 py-3.5 rounded-xl font-semibold text-base border-2 text-white transition-all hover:-translate-y-0.5"
                style={{ borderColor: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.1)" }}
              >
                Partner Your Store
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
