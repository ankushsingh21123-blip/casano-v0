"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";

const categories = [
  {
    id: "stationary",
    title: "Stationery",
    subtitle: "Pens, Paper & More",
    image: "/category_stationery.png",
    link: "/category/stationary",
    accent: "#B8962E",
    bg: "linear-gradient(135deg, #FBF5E1, #EFEADD)",
    emoji: "✏️",
    tag: "School & Office",
  },
  {
    id: "pharmacy",
    title: "Pharmacy",
    subtitle: "Medicines & Health",
    image: "/category_pharmacy.png",
    link: "/category/pharmacy",
    accent: "#214A36",
    bg: "linear-gradient(135deg, #E6F2EC, #D0EAD9)",
    emoji: "💊",
    tag: "Health & Wellness",
  },
  {
    id: "groceries",
    title: "Groceries",
    subtitle: "Daily Essentials",
    image: "/category_groceries.png",
    link: "/category/groceries",
    accent: "#C1492E",
    bg: "linear-gradient(135deg, #FAE8E5, #F5D0C8)",
    emoji: "🛒",
    tag: "Most Popular",
  },
];

function LiquidCategoryCard({ category, index }: { category: typeof categories[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const turbRef = useRef<SVGFETurbulenceElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);
  const rafRef = useRef<number>();
  const turbValRef = useRef(0);
  const turbTargetRef = useRef(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const filterId = `liq-${category.id}`;

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    if (cardRef.current) obs.observe(cardRef.current);
    return () => obs.disconnect();
  }, []);

  const animateTurb = React.useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = () => {
      turbValRef.current += (turbTargetRef.current - turbValRef.current) * 0.06;
      if (turbRef.current) turbRef.current.setAttribute("baseFrequency", `${turbValRef.current.toFixed(5)}`);
      if (dispRef.current) dispRef.current.setAttribute("scale", `${(turbValRef.current * 700).toFixed(1)}`);
      if (Math.abs(turbValRef.current - turbTargetRef.current) > 0.0003)
        rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  const handleMouseEnter = React.useCallback(() => {
    turbTargetRef.current = 0.035;
    animateTurb();
  }, [animateTurb]);

  const handleMouseLeave = React.useCallback(() => {
    turbTargetRef.current = 0;
    animateTurb();
    setTilt({ x: 0, y: 0 });
  }, [animateTurb]);

  const handleMouseMove = React.useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const r = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * -10, y: x * 12 });
  }, []);

  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-15%" y="-15%" width="130%" height="130%">
            <feTurbulence ref={turbRef} type="fractalNoise" baseFrequency="0" numOctaves="3" seed={index + 5} result="noise" />
            <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <Link href={category.link} className="block">
        <div
          ref={cardRef}
          className="casano-cat-card"
          style={{
            transitionDelay: `${index * 100}ms`,
            opacity: visible ? 1 : 0,
            transform: visible
              ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(0)`
              : "translateY(40px)",
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          data-cursor="link"
        >
          {/* Image area with liquid filter */}
          <div
            className="casano-cat-img-area"
            style={{ background: category.bg, filter: `url(#${filterId})` }}
          >
            <img
              src={category.image}
              alt={category.title}
              className="casano-cat-img"
              onError={(e: any) => { e.target.style.display = "none"; }}
            />
            <div className="casano-cat-gradient" />
            <div className="casano-cat-label-over">
              <span className="casano-cat-emoji">{category.emoji}</span>
              <h3 className="casano-cat-title-over">{category.title}</h3>
              <p className="casano-cat-sub-over">{category.subtitle}</p>
            </div>
            {/* Tag pill */}
            <div className="casano-cat-pill" style={{ background: category.accent }}>
              {category.tag}
            </div>
          </div>

          {/* Bottom row */}
          <div className="casano-cat-footer">
            <span className="casano-cat-eta">⚡ 15 min delivery</span>
            <button
              className="casano-cat-order-btn"
              style={{
                background: category.accent,
                boxShadow: `0 4px 16px ${category.accent}44`,
              }}
            >
              Order Now
            </button>
          </div>

          {/* Shimmer border */}
          <div className="casano-cat-shimmer" style={{ background: `linear-gradient(90deg, transparent, ${category.accent}44, transparent)` }} />
        </div>
      </Link>

      <style jsx global>{`
        .casano-cat-card {
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid var(--surface-border);
          background: var(--surface-card);
          position: relative;
          transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                      transform 0.15s cubic-bezier(0.23, 1, 0.32, 1),
                      box-shadow 0.3s ease,
                      border-color 0.3s;
          transform-style: preserve-3d;
          will-change: transform;
          cursor: pointer;
        }
        .casano-cat-card:hover {
          box-shadow: 0 24px 60px rgba(0,0,0,0.12);
        }
        .casano-cat-img-area {
          position: relative;
          height: 200px;
          overflow: hidden;
          transition: filter 0.4s;
        }
        .casano-cat-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          display: block;
        }
        .casano-cat-card:hover .casano-cat-img {
          transform: scale(1.08);
        }
        .casano-cat-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 50%, transparent 100%);
        }
        .casano-cat-label-over {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 16px;
        }
        .casano-cat-emoji {
          font-size: 24px;
          display: block;
          margin-bottom: 4px;
        }
        .casano-cat-title-over {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 22px;
          font-weight: 900;
          color: white;
          line-height: 1.1;
          margin: 0;
        }
        .casano-cat-sub-over {
          font-size: 13px;
          color: rgba(255,255,255,0.82);
          font-weight: 500;
          margin: 4px 0 0;
        }
        .casano-cat-pill {
          position: absolute;
          top: 12px; right: 12px;
          color: white;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
        }
        .casano-cat-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
        }
        .casano-cat-eta {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .casano-cat-order-btn {
          color: white;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 18px;
          border-radius: 10px;
          border: none;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
        }
        .casano-cat-order-btn:hover {
          transform: scale(1.06);
        }
        .casano-cat-shimmer {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          transform: scaleX(0);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 0 0 20px 20px;
        }
        .casano-cat-card:hover .casano-cat-shimmer {
          transform: scaleX(1);
        }
      `}</style>
    </>
  );
}

export default function CategoryGrid() {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-8">
        <div>
          <span
            style={{
              display: "inline-block",
              background: "#FAE8E5",
              color: "#C1492E",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "5px 14px",
              borderRadius: "999px",
              marginBottom: "10px",
            }}
          >
            Top Categories
          </span>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{ color: "var(--text-primary)", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Shop by Category
          </h2>
          <p className="text-sm mt-1.5" style={{ color: "#9A9B9A" }}>
            From your local Kirana partner — hover to feel the magic
          </p>
        </div>
        <Link
          href="/products"
          className="hidden md:flex items-center gap-2 text-sm font-bold transition-colors"
          style={{ color: "#C1492E" }}
          data-cursor="link"
        >
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((category, i) => (
          <LiquidCategoryCard key={category.id} category={category} index={i} />
        ))}
      </div>
    </div>
  );
}
