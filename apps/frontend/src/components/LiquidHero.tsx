"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import Link from "next/link";
import MagneticButton from "./ui/MagneticButton";

/**
 * LiquidHero — 2026 Awwwards-grade desktop hero with:
 * • SVG feTurbulence liquid distortion on promo cards (no external libs)
 * • CSS 3D perspective tilt following mouse (Spiderverse-style depth)
 * • Staggered text reveal on mount
 * • Floating animated orbs (ambient depth)
 * • Noise texture overlay for premium feel
 */
export default function LiquidHero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const rafRef = useRef<number>();
  const turbValRef = useRef(0);
  const turbTargetRef = useRef(0);

  // Mount stagger
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(t);
  }, []);

  // Mouse parallax + turbulence on move over card
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  }, []);

  // SVG turbulence liquid animation on card hover
  const handleCardEnter = useCallback(() => {
    turbTargetRef.current = 0.04;
    animateTurb();
  }, []);

  const handleCardLeave = useCallback(() => {
    turbTargetRef.current = 0;
  }, []);

  function animateTurb() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = () => {
      turbValRef.current += (turbTargetRef.current - turbValRef.current) * 0.07;
      if (turbRef.current) {
        turbRef.current.setAttribute("baseFrequency", `${turbValRef.current}`);
      }
      if (dispRef.current) {
        dispRef.current.setAttribute("scale", `${turbValRef.current * 600}`);
      }
      if (Math.abs(turbValRef.current - turbTargetRef.current) > 0.0005) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }

  // 3D card tilt
  const tiltX = (mousePos.y - 0.5) * -12;
  const tiltY = (mousePos.x - 0.5) * 14;

  return (
    <div
      ref={heroRef}
      className="casano-liquid-hero"
      onMouseMove={handleMouseMove}
    >
      {/* SVG Liquid distortion filter — zero bundle cost */}
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id="liquid-distort" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              ref={turbRef}
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="4"
              seed="8"
              result="noise"
            />
            <feDisplacementMap
              ref={dispRef}
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Ambient floating orbs */}
      <div className="casano-orb casano-orb-1" />
      <div className="casano-orb casano-orb-2" />
      <div className="casano-orb casano-orb-3" />

      {/* Noise overlay */}
      <div className="casano-noise" />

      <div className="casano-hero-inner">
        {/* ── LEFT: Copy ── */}
        <div className="casano-hero-copy">
          {/* Delivery badge — pill */}
          <div
            className={`casano-hero-badge ${mounted ? "casano-reveal" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="casano-badge-dot" />
            <span>Delivered from your local Kirana store</span>
          </div>

          {/* Headline */}
          <h1
            className={`casano-hero-h1 ${mounted ? "casano-reveal" : ""}`}
            style={{ transitionDelay: "80ms" }}
          >
            Everything you
            <br />
            <span className="casano-hero-accent">need, delivered</span>
            <br />
            <span className="casano-hero-sub">in minutes.</span>
          </h1>

          {/* Body */}
          <p
            className={`casano-hero-body ${mounted ? "casano-reveal" : ""}`}
            style={{ transitionDelay: "160ms" }}
          >
            Groceries, medicines, stationery and more — straight from your
            local Kirana store to your door in{" "}
            <strong style={{ color: "#214A36" }}>15 minutes</strong>.
          </p>

          {/* CTAs */}
          <div
            className={`casano-hero-ctas ${mounted ? "casano-reveal" : ""}`}
            style={{ transitionDelay: "240ms" }}
          >
            <Link href="/products">
              <MagneticButton
                className="casano-btn-primary"
                data-cursor="cta"
              >
                <span>Browse Products</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </MagneticButton>
            </Link>
            <Link href="/category/groceries" data-cursor="link">
              <button className="casano-btn-outline">
                Shop Groceries
              </button>
            </Link>
          </div>

          {/* Trust badges */}
          <div
            className={`casano-trust-row ${mounted ? "casano-reveal" : ""}`}
            style={{ transitionDelay: "320ms" }}
          >
            {[
              { icon: "✓", label: "100% Fresh", bg: "#E6F2EC", color: "#214A36" },
              { icon: "🛡", label: "Safe & Hygienic", bg: "#FAE8E5", color: "#C1492E" },
              { icon: "⚡", label: "15 min delivery", bg: "#FBF5E1", color: "#B8962E" },
            ].map((b) => (
              <div key={b.label} className="casano-trust-badge">
                <div className="casano-trust-icon" style={{ background: b.bg, color: b.color }}>
                  {b.icon}
                </div>
                <span style={{ color: "#5A5B5A", fontSize: "12px", fontWeight: 600 }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT: 3D Promo Cards ── */}
        <div
          ref={cardRef}
          className={`casano-hero-cards ${mounted ? "casano-reveal" : ""}`}
          style={{
            transitionDelay: "200ms",
            transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
            transition: "transform 0.1s linear",
          }}
          onMouseEnter={handleCardEnter}
          onMouseLeave={handleCardLeave}
        >
          {/* Featured offer — liquid filter applied on hover */}
          <div
            className="casano-promo-featured"
            style={{ filter: "url(#liquid-distort)" }}
          >
            <div className="casano-promo-tag">Featured Offer</div>
            <p className="casano-promo-title">Flat 30% off on Groceries</p>
            <p className="casano-promo-sub">Min order ₹199</p>
            <Link href="/category/groceries">
              <button className="casano-promo-cta">Shop Now →</button>
            </Link>
            {/* Inner floating badge */}
            <div className="casano-promo-float-badge">🔥 HOT</div>
          </div>

          {/* Two smaller cards */}
          <div className="casano-promo-small-row">
            <div
              className="casano-promo-small casano-promo-green"
              style={{ filter: "url(#liquid-distort)" }}
            >
              <p className="casano-promo-small-tag">Gadgets</p>
              <p className="casano-promo-small-title">Up to 20% off</p>
              <Link href="/category/gadgets">
                <p className="casano-promo-small-link">Explore →</p>
              </Link>
            </div>
            <div
              className="casano-promo-small casano-promo-gold"
              style={{ filter: "url(#liquid-distort)" }}
            >
              <p className="casano-promo-small-tag">Fashion</p>
              <p className="casano-promo-small-title">New Arrivals</p>
              <Link href="/category/fashion">
                <p className="casano-promo-small-link">View All →</p>
              </Link>
            </div>
          </div>

          {/* Delivery ETA card */}
          <div className="casano-promo-eta">
            <div className="casano-eta-dot" />
            <div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "#214A36" }}>
                ⚡ Lightning Fast
              </p>
              <p style={{ fontSize: "11px", color: "#5A5B5A", marginTop: "2px" }}>
                Average delivery: 12–15 min
              </p>
            </div>
            <div className="casano-promo-eta-live">LIVE</div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* ─── Hero wrapper ─── */
        .casano-liquid-hero {
          width: 100%;
          background: var(--bg-main);
          border-bottom: 1px solid var(--surface-border);
          position: relative;
          overflow: hidden;
          padding-bottom: 24px;
        }

        /* ─── Ambient orbs ─── */
        .casano-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          animation: casano-float 8s ease-in-out infinite alternate;
        }
        .casano-orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #C1492E18, transparent);
          top: -120px; right: -80px;
          animation-duration: 9s;
        }
        .casano-orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #214A3618, transparent);
          bottom: -80px; left: -60px;
          animation-duration: 12s;
          animation-delay: -4s;
        }
        .casano-orb-3 {
          width: 200px; height: 200px;
          background: radial-gradient(circle, #B8962E18, transparent);
          top: 60%; right: 30%;
          animation-duration: 7s;
          animation-delay: -2s;
        }
        @keyframes casano-float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.1); }
        }

        /* ─── Noise texture ─── */
        .casano-noise {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.025;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          mix-blend-mode: overlay;
        }

        /* ─── Inner layout ─── */
        .casano-hero-inner {
          max-width: 1440px;
          margin: 0 auto;
          padding: 56px 24px 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1023px) {
          .casano-hero-inner {
            flex-direction: column;
            padding: 32px 16px;
          }
        }

        /* ─── Copy ─── */
        .casano-hero-copy {
          flex: 1;
          max-width: 640px;
        }
        .casano-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #E6F2EC;
          color: #214A36;
          font-size: 12px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: 999px;
          margin-bottom: 24px;
          letter-spacing: 0.01em;
          border: 1px solid #214A3622;
        }
        .casano-badge-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #214A36;
          display: inline-block;
          animation: casano-pulse 2s ease-in-out infinite;
        }
        @keyframes casano-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        .casano-hero-h1 {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(36px, 5vw, 68px);
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.05;
          letter-spacing: -0.02em;
          margin-bottom: 20px;
        }
        .casano-hero-accent {
          color: #C1492E;
          font-style: italic;
        }
        .casano-hero-sub {
          color: #B8962E;
        }
        .casano-hero-body {
          font-size: 17px;
          color: var(--text-secondary);
          line-height: 1.65;
          max-width: 480px;
          margin-bottom: 32px;
        }
        .casano-hero-ctas {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 32px;
        }

        /* ─── Buttons ─── */
        .casano-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #C1492E;
          color: #fff;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 28px;
          border-radius: 14px;
          border: none;
          box-shadow: 0 8px 32px #C1492E44, 0 2px 8px #C1492E33;
        }
        .casano-btn-primary:hover {
          background: #A63C25;
          box-shadow: 0 12px 40px #C1492E55;
        }
        .casano-btn-outline {
          display: inline-flex;
          align-items: center;
          background: transparent;
          color: var(--text-primary);
          font-weight: 700;
          font-size: 15px;
          padding: 13px 24px;
          border-radius: 14px;
          border: 2px solid var(--surface-border);
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }
        .casano-btn-outline:hover {
          border-color: #214A36;
          color: #214A36;
          background: #E6F2EC;
        }

        /* ─── Trust badges ─── */
        .casano-trust-row {
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .casano-trust-badge {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .casano-trust-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
          flex-shrink: 0;
        }

        /* ─── Promo card stack ─── */
        .casano-hero-cards {
          flex-shrink: 0;
          width: clamp(300px, 35vw, 420px);
          display: flex;
          flex-direction: column;
          gap: 12px;
          transform-style: preserve-3d;
          will-change: transform;
        }
        .casano-promo-featured {
          border-radius: 20px;
          padding: 28px;
          background: linear-gradient(135deg, #C1492E 0%, #8B2A18 100%);
          color: white;
          position: relative;
          overflow: hidden;
          transition: filter 0.3s;
        }
        .casano-promo-featured::before {
          content: '';
          position: absolute;
          top: -40%;
          right: -20%;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: rgba(255,255,255,0.08);
          pointer-events: none;
        }
        .casano-promo-tag {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.8;
          margin-bottom: 8px;
        }
        .casano-promo-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 24px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 6px;
        }
        .casano-promo-sub {
          font-size: 13px;
          opacity: 0.85;
          margin-bottom: 16px;
        }
        .casano-promo-cta {
          background: rgba(255,255,255,0.2);
          color: white;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 16px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.3);
          backdrop-filter: blur(4px);
          transition: background 0.2s;
        }
        .casano-promo-cta:hover {
          background: rgba(255,255,255,0.32);
        }
        .casano-promo-float-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: rgba(255,255,255,0.25);
          color: white;
          font-size: 10px;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 999px;
          letter-spacing: 0.08em;
          animation: casano-hotpulse 1.8s ease-in-out infinite alternate;
        }
        @keyframes casano-hotpulse {
          0% { opacity: 0.7; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1.05); }
        }

        /* ─── Small promo cards ─── */
        .casano-promo-small-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }
        .casano-promo-small {
          border-radius: 16px;
          padding: 20px 16px;
          color: white;
          transition: filter 0.3s, transform 0.3s;
          cursor: pointer;
        }
        .casano-promo-small:hover {
          transform: translateY(-3px);
        }
        .casano-promo-green {
          background: linear-gradient(135deg, #214A36, #0F2C1F);
        }
        .casano-promo-gold {
          background: linear-gradient(135deg, #B8962E, #7D6219);
        }
        .casano-promo-small-tag {
          font-size: 10px;
          font-weight: 700;
          opacity: 0.7;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 4px;
        }
        .casano-promo-small-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 16px;
          font-weight: 900;
          line-height: 1.2;
          margin-bottom: 8px;
        }
        .casano-promo-small-link {
          font-size: 12px;
          font-weight: 700;
          opacity: 0.9;
        }

        /* ─── ETA card ─── */
        .casano-promo-eta {
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
        }
        .casano-eta-dot {
          width: 10px; height: 10px;
          border-radius: 50%;
          background: #214A36;
          flex-shrink: 0;
          box-shadow: 0 0 0 4px #214A3622;
          animation: casano-pulse 2s infinite;
        }
        .casano-promo-eta-live {
          margin-left: auto;
          background: #E6F2EC;
          color: #214A36;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          padding: 3px 8px;
          border-radius: 999px;
        }

        /* ─── Reveal animations ─── */
        .casano-hero-badge,
        .casano-hero-h1,
        .casano-hero-body,
        .casano-hero-ctas,
        .casano-trust-row,
        .casano-hero-cards {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .casano-reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* ─── Promo strip ─── */
        .casano-promo-strip {
          background: #214A36;
          color: white;
          text-align: center;
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.02em;
        }
        .casano-promo-strip span {
          text-decoration: underline;
          text-underline-offset: 3px;
          cursor: pointer;
          margin-left: 4px;
        }
      `}</style>
    </div>
  );
}
