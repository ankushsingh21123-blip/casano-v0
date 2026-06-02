"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import OldMobileHome from "@/components/OldMobileHome";
import { Crown, Sunrise, Moon, Gift, Sparkles } from "lucide-react";

const OFFERS = [
  {
    id: 1,
    title: "Rajputana Special",
    desc: "Get 20% off on all imported groceries. Minimum order ₹999.",
    code: "ROYAL20",
    color: "#C1492E",
    bg: "rgba(193,73,46,0.1)",
    border: "rgba(193,73,46,0.2)",
    Icon: Crown,
  },
  {
    id: 2,
    title: "Fresh Morning",
    desc: "Flat ₹50 off on dairy and bakery items before 10 AM.",
    code: "FRESHSTART",
    color: "#B8962E",
    bg: "rgba(184,150,46,0.1)",
    border: "rgba(184,150,46,0.2)",
    Icon: Sunrise,
  },
  {
    id: 3,
    title: "Midnight Cravings",
    desc: "Free delivery on orders above ₹199 between 11 PM and 3 AM.",
    code: "NIGHTOWL",
    color: "#8B6FD4",
    bg: "rgba(139,111,212,0.1)",
    border: "rgba(139,111,212,0.2)",
    Icon: Moon,
  },
  {
    id: 4,
    title: "First Order Premium",
    desc: "Enjoy a flat 30% discount on your first order. Welcome to Casano.",
    code: "WELCOME30",
    color: "#B8962E",
    bg: "rgba(184,150,46,0.1)",
    border: "rgba(184,150,46,0.2)",
    Icon: Gift,
  },
];

export default function OffersPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    return <OldMobileHome />;
  }

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ background: "linear-gradient(180deg, #0f0d0a 0%, #1a1714 50%, #0f0d0a 100%)" }}>
      <Header />
      
      <main className="flex-1 pb-20 pt-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full mb-4"
              style={{ background: "rgba(193,73,46,0.1)", color: "#C1492E", border: "1px solid rgba(193,73,46,0.2)" }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Exclusive Deals
            </span>
            <h1
              className="text-4xl sm:text-5xl md:text-6xl mb-6 font-black"
              style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#f5f0e8" }}
            >
              Today's <span style={{ color: "#C1492E" }}>Offers</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: "#8a8580" }}>
              Treat yourself with our handpicked daily specials. From fresh groceries to midnight cravings, we have an offer for every moment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {OFFERS.map((offer) => (
              <div 
                key={offer.id} 
                className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden group rounded-2xl transition-all"
                style={{ background: "#1a1714", border: "1px solid #2e2a25" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = offer.color + "55";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = `0 12px 40px ${offer.color}15`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#2e2a25";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Decorative background glow */}
                <div 
                  className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-10 transition-transform duration-500 group-hover:scale-150"
                  style={{ background: `radial-gradient(circle, ${offer.color}, transparent)` }}
                />

                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{ background: offer.bg, border: `1px solid ${offer.border}` }}
                >
                  <offer.Icon className="w-7 h-7" style={{ color: offer.color }} />
                </div>
                
                <div className="flex-1 relative z-10">
                  <h3
                    className="font-bold text-2xl mb-2"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#f5f0e8" }}
                  >
                    {offer.title}
                  </h3>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: "#8a8580" }}>
                    {offer.desc}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#6b6560" }}>Use Code</span>
                      <span 
                        className="font-bold text-lg px-3 py-1 rounded-md border-2 border-dashed"
                        style={{ color: offer.color, borderColor: offer.color + "55", background: offer.bg }}
                      >
                        {offer.code}
                      </span>
                    </div>
                    
                    <Link href="/products">
                      <button
                        className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:scale-105"
                        style={{ background: "linear-gradient(135deg, #C1492E, #a03a22)", color: "#fff", boxShadow: "0 4px 20px rgba(193,73,46,0.3)" }}
                      >
                        Shop Now
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center rounded-2xl p-10 relative overflow-hidden" style={{ background: "#1a1714", border: "1px solid #2e2a25" }}>
             {/* Royal gold decorations */}
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#B8962E] to-[#C1492E]" />
             <div className="absolute inset-0 opacity-5" style={{ background: "radial-gradient(ellipse at 50% 0%, #B8962E, transparent 70%)" }} />
             <div className="relative z-10">
               <div className="flex items-center justify-center gap-2 mb-4">
                 <Crown className="w-7 h-7" style={{ color: "#B8962E" }} />
                 <h2
                   className="text-3xl font-bold"
                   style={{ fontFamily: "'Playfair Display', Georgia, serif", color: "#f5f0e8" }}
                 >
                   Join Casano Gold
                 </h2>
               </div>
               <p className="max-w-lg mx-auto mb-8" style={{ color: "#8a8580" }}>
                 Unlock free deliveries, 2% cashback unconditionally, and priority VIP support.
               </p>
               <button className="bg-gradient-to-r from-[#B8962E] to-[#C1492E] text-white font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_4px_20px_#B8962E44]">
                 Discover Gold
               </button>
             </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
