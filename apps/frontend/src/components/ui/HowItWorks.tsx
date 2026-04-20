"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const STEPS = [
  {
    num: "01",
    icon: "📍",
    title: "Set Your Location",
    desc: "Tell us where you are. We'll show you products from your nearest Kirana partner.",
    color: "#C1492E",
    bg: "#FAE8E5",
  },
  {
    num: "02",
    icon: "🛒",
    title: "Pick Your Products",
    desc: "Browse thousands of items — groceries, medicines, stationery, and more.",
    color: "#214A36",
    bg: "#E6F2EC",
  },
  {
    num: "03",
    icon: "⚡",
    title: "Delivered in 15 Min",
    desc: "Your local store packs and dispatches. Our rider brings it straight to your door.",
    color: "#B8962E",
    bg: "#FBF5E1",
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
                <span className="hiw-icon">{step.icon}</span>
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
          padding: 80px 16px;
          position: relative;
          overflow: hidden;
          background: var(--surface-card);
          border-top: 1px solid var(--surface-border);
          border-bottom: 1px solid var(--surface-border);
        }
        .hiw-bg-deco {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse at 0% 100%, #C1492E07 0%, transparent 60%),
            radial-gradient(ellipse at 100% 0%, #214A3607 0%, transparent 60%);
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
          margin-bottom: 64px;
        }
        .hiw-badge {
          display: inline-block;
          background: #E6F2EC;
          color: #214A36;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .hiw-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(28px, 4vw, 48px);
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.15;
          margin: 0 0 12px;
        }
        .hiw-subtitle {
          font-size: 16px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .hiw-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 32px;
          position: relative;
        }
        .hiw-card {
          position: relative;
          text-align: center;
          padding: 0 16px;
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hiw-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
        .hiw-num {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 56px;
          font-weight: 900;
          line-height: 1;
          opacity: 0.12;
          margin-bottom: -12px;
          letter-spacing: -0.03em;
        }
        .hiw-icon-circle {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hiw-card:hover .hiw-icon-circle {
          transform: scale(1.1) rotate(-4deg);
        }
        .hiw-icon {
          font-size: 30px;
          display: block;
        }
        .hiw-card-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 20px;
          font-weight: 800;
          margin: 0 0 10px;
          line-height: 1.2;
        }
        .hiw-card-desc {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          max-width: 280px;
          margin: 0 auto;
        }
        .hiw-connector {
          position: absolute;
          top: 80px;
          right: -16px;
          width: 32px;
          height: 2px;
          background: linear-gradient(90deg, #E2DDD0, transparent);
          display: none;
        }
        @media (min-width: 768px) {
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
          color: var(--text-muted);
          font-weight: 500;
        }
      `}</style>
    </section>
  );
}
