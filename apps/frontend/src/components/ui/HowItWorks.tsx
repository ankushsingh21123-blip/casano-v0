"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { MapPin, ShoppingCart, Zap } from "lucide-react";

const STEPS = [
  {
    num: "01",
    Icon: MapPin,
    title: "Set Your Location",
    desc: "Tell us where you are. We'll show you products from your nearest Kirana partner.",
    color: "#C1492E",
    bg: "rgba(193,73,46,0.1)",
  },
  {
    num: "02",
    Icon: ShoppingCart,
    title: "Pick Your Products",
    desc: "Browse thousands of items — groceries, medicines, stationery, and more.",
    color: "#214A36",
    bg: "rgba(33,74,54,0.15)",
  },
  {
    num: "03",
    Icon: Zap,
    title: "Delivered in 15 Min",
    desc: "Your local store packs and dispatches. Our rider brings it straight to your door.",
    color: "#B8962E",
    bg: "rgba(184,150,46,0.1)",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="hiw-section">
      {/* Background decoration */}
      <div className="hiw-bg-deco" />

      <div className="hiw-inner">
        <div className="hiw-header">
          <span className="hiw-badge">Simple. Fast. Local.</span>
          <h2 className="hiw-title">
            How Casano Works
          </h2>
          <p className="hiw-subtitle">
            Three steps between you and your essentials
          </p>
        </div>

        <div className="hiw-grid">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`hiw-card ${visible ? "hiw-visible" : ""}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Step number */}
              <div className="hiw-num" style={{ color: step.color }}>{step.num}</div>

              {/* Icon circle */}
              <div className="hiw-icon-circle" style={{ background: step.bg }}>
                <step.Icon className="hiw-icon" style={{ color: step.color }} />
              </div>

              <h3 className="hiw-card-title" style={{ color: "var(--text-primary)" }}>
                {step.title}
              </h3>
              <p className="hiw-card-desc">{step.desc}</p>

              {/* Connector line (not on last) */}
              {i < STEPS.length - 1 && <div className="hiw-connector" />}
            </div>
          ))}
        </div>

        <div className="hiw-cta-row">
          <Link href="/products">
            <button className="hiw-cta-btn">
              Start Shopping
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </Link>
          <p className="hiw-cta-note">
            No account needed for browsing · Sign in only to checkout
          </p>
        </div>
      </div>

      <style jsx global>{`
        .hiw-section {
          padding: 60px 16px;
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, #EAE0CD 0%, #DBCAA9 100%);
          border-top: 1px solid var(--surface-border);
          border-bottom: 1px solid var(--surface-border);
        }
        .dark .hiw-section {
          background: linear-gradient(180deg, #2A2118 0%, #1A130C 100%);
        }
        .hiw-bg-deco {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 0% 100%, rgba(193,73,46,0.06) 0%, transparent 60%),
            radial-gradient(ellipse at 100% 0%, rgba(184,150,46,0.06) 0%, transparent 60%);
          pointer-events: none;
        }
        .hiw-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .hiw-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .hiw-badge {
          display: inline-block;
          background: rgba(184,150,46,0.1);
          color: #B8962E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 16px;
          border: 1px solid rgba(184,150,46,0.2);
        }
        .hiw-title {
          font-family: var(--font-heading);
          font-size: clamp(32px, 5vw, 56px);
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.15;
          margin: 0 0 16px;
        }
        .hiw-subtitle {
          font-size: 18px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          position: relative;
        }
        .hiw-card {
          position: relative;
          text-align: center;
          padding: 32px 24px;
          background: var(--surface-card);
          border-radius: 32px;
          border: 1px solid var(--surface-border);
          box-shadow: 0 20px 60px rgba(0,0,0,0.03);
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      box-shadow 0.3s ease;
        }
        .hiw-card:hover {
          box-shadow: 0 30px 80px rgba(0,0,0,0.06);
          transform: translateY(-8px) !important; /* overrides entrance animation translation after it completes */
        }
        .hiw-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .hiw-num {
          font-family: var(--font-heading);
          font-size: 24px;
          font-weight: 900;
          line-height: 1;
          opacity: 0.9;
          margin-bottom: 24px;
          letter-spacing: 0.05em;
        }
        .hiw-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 24px;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hiw-card:hover .hiw-icon-circle {
          transform: scale(1.15) rotate(-6deg);
        }
        .hiw-icon {
          width: 36px;
          height: 36px;
          display: block;
        }
        .hiw-card-title {
          font-family: var(--font-heading);
          font-size: 22px;
          font-weight: 800;
          margin: 0 0 12px;
          line-height: 1.2;
        }
        .hiw-card-desc {
          font-size: 15px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 280px;
          margin: 0 auto;
        }
        .hiw-connector {
          position: absolute;
          top: 50%;
          right: -16px;
          width: 32px;
          height: 2px;
          background: linear-gradient(90deg, var(--surface-border), transparent);
          display: none;
        }
        @media (min-width: 1024px) {
          .hiw-connector { display: block; }
        }
        .hiw-cta-row {
          text-align: center;
          margin-top: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .hiw-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #C1492E;
          color: white;
          font-weight: 700;
          font-size: 15px;
          padding: 14px 32px;
          border-radius: 14px;
          border: none;
          box-shadow: 0 8px 32px #C1492E44;
          transition: background 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }
        .hiw-cta-btn:hover {
          background: #A63C25;
          transform: translateY(-3px);
          box-shadow: 0 16px 40px #C1492E55;
        }
        .hiw-cta-note {
          font-size: 13px;
          color: #6b6560;
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}
