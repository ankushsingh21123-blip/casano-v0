"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import OldMobileHome from "@/components/OldMobileHome";
import { Truck, Coins, Star, Handshake, Crown } from "lucide-react";

const BENEFITS = [
  {
    title: "Free Delivery Always",
    desc: "No minimum order value. Whether it's a pack of chips or monthly groceries, delivery is on us.",
    Icon: Truck,
  },
  {
    title: "2% Unlimited Cashback",
    desc: "Earn 2% back as Casano Coins on every single order. No caps, no hidden conditions.",
    Icon: Coins,
  },
  {
    title: "Priority VIP Support",
    desc: "Jump the queue. Get your queries resolved instantly by our top-tier support agents.",
    Icon: Star,
  },
  {
    title: "Exclusive Partner Deals",
    desc: "Access secret menus and special partner-funded discounts available only to Gold members.",
    Icon: Handshake,
  }
];

export default function CasanoGoldPage() {
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
    // Optionally redirect mobile users or show the mobile layout
    return <OldMobileHome />;
  }

  return (
    <div className="min-h-screen font-sans transition-colors duration-300 flex flex-col" style={{ background: "#1C1B19" }}>
      {/* We use the regular header, but maybe the Gold page has a specific dark header */}
      <Header />
      
      <main className="flex-1 pb-20 pt-10 overflow-hidden relative">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[#B8962E] opacity-10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[#C1492E] opacity-10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center mb-16 pt-10">
            <div className="inline-block relative mb-6">
              <span className="absolute inset-0 blur-md bg-[#B8962E] opacity-50 rounded-full" />
              <span className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#B8962E] to-[#8C7020] rounded-full shadow-xl border-4 border-[#1C1B19]">
                <Crown className="w-10 h-10 text-white" />
              </span>
            </div>
            <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl md:text-7xl mb-6 text-[#F1EFEA] font-bold tracking-tight">
              Casano <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA8015]">Gold</span>
            </h1>
            <p className="text-[#A09D96] text-xl max-w-2xl mx-auto font-medium">
              The ultimate membership for those who value time and premium service. Experience Casano like never before.
            </p>
          </div>

          {/* Pricing Card */}
          <div className="max-w-md mx-auto bg-gradient-to-b from-[#2A2B2A] to-[#1C1B19] rounded-3xl p-1 border border-[#B8962E44] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-20 transform transition-transform hover:scale-105">
            <div className="bg-[#1C1B19] rounded-[22px] p-8 text-center h-full">
              <h3 className="text-[#D4AF37] font-bold uppercase tracking-widest text-sm mb-4">Quarterly Plan</h3>
              <div className="flex justify-center items-end gap-1 mb-2">
                <span className="text-4xl font-bold text-[#F1EFEA]">₹149</span>
                <span className="text-[#A09D96] mb-1">/ 3 months</span>
              </div>
              <p className="text-[#A09D96] text-sm mb-8">Less than ₹50 a month for unlimited benefits.</p>
              
              <button className="w-full bg-gradient-to-r from-[#D4AF37] to-[#AA8015] hover:from-[#E5C048] hover:to-[#BB9126] text-[#1C1B19] font-black py-4 rounded-xl shadow-[0_8px_20px_#D4AF3744] transition-all transform active:scale-95">
                Get Casano Gold
              </button>
              <p className="text-xs text-[#A09D96] mt-4">Cancel anytime. Auto-renews every 3 months.</p>
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl font-bold text-[#F1EFEA]">
              Why Go Gold?
            </h2>
            <div className="h-1 w-16 bg-gradient-to-r from-[#D4AF37] to-transparent mx-auto mt-4 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {BENEFITS.map((benefit, idx) => (
              <div 
                key={idx} 
                className="bg-[#2A2B2A] bg-opacity-50 p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 rounded-2xl border border-[#3A3B3A] hover:border-[#D4AF37] transition-colors"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 bg-gradient-to-br from-[#1C1B19] to-[#2A2B2A] border border-[#3A3B3A] shadow-inner"
                >
                  <benefit.Icon className="w-7 h-7" style={{ color: "#D4AF37" }} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-['Playfair_Display'] font-bold text-xl mb-2 text-[#F1EFEA]">
                    {benefit.title}
                  </h3>
                  <p className="text-[#A09D96] text-sm leading-relaxed">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </main>

      {/* Overriding Footer styles for dark theme locally */}
      <div className="opacity-90">
        <Footer />
      </div>
    </div>
  );
}
