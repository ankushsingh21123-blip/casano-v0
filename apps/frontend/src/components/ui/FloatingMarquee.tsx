"use client";

import { Zap, ShoppingBag, Store, BadgeCheck, Rocket, PartyPopper, Package, Lock, Heart, Star } from "lucide-react";
import { ReactNode } from "react";

interface MarqueeItem {
  icon: ReactNode;
  text: string;
}

const ITEMS: MarqueeItem[] = [
  { icon: <Zap className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "Delivered in 15 mins" },
  { icon: <ShoppingBag className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "50,000+ Products" },
  { icon: <Store className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "Local Kirana Partners" },
  { icon: <BadgeCheck className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "100% Fresh Guaranteed" },
  { icon: <Rocket className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "Casano.in — India's Last-Minute App" },
  { icon: <PartyPopper className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "Free Delivery on First 3 Orders · Code: FIRST3" },
  { icon: <Package className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "Track Your Order Live" },
  { icon: <Lock className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "100% Secure Checkout" },
  { icon: <Heart className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "Support Local Businesses" },
  { icon: <Star className="w-3 h-3 inline-block mr-1 text-amber-400" />, text: "Rated 4.9 by 10,000+ Customers" },
];

export default function FloatingMarquee() {
  return (
    <div
      className="casano-marquee-root"
      aria-hidden="true"
      style={{
        background: "linear-gradient(90deg, #1a0a06, #2A2B2A, #1a0a06)",
        borderTop: "1px solid #C1492E33",
        borderBottom: "1px solid #C1492E33",
        overflow: "hidden",
        position: "relative",
        height: "36px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Fade masks */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: "80px",
          background: "linear-gradient(90deg, #1a0a06, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "80px",
          background: "linear-gradient(-90deg, #1a0a06, transparent)",
          zIndex: 2,
          pointerEvents: "none",
        }}
      />

      <div className="casano-marquee-track">
        {/* Triple the items for seamless loop */}
        {[...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="casano-marquee-item">
            {item.icon}{item.text}
            <span className="casano-marquee-sep">✦</span>
          </span>
        ))}
      </div>

      <style jsx global>{`
        .casano-marquee-track {
          display: flex;
          gap: 0;
          white-space: nowrap;
          animation: casano-scroll 55s linear infinite;
          will-change: transform;
        }
        .casano-marquee-track:hover {
          animation-play-state: paused;
        }
        .casano-marquee-item {
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          font-size: 12px;
          font-weight: 600;
          color: #EFEADD;
          padding: 0 6px;
          letter-spacing: 0.02em;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
        }
        .casano-marquee-sep {
          color: #C1492E;
          margin: 0 12px;
          font-size: 10px;
        }
        @keyframes casano-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
