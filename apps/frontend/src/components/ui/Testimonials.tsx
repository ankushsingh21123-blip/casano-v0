"use client";

import { useRef, useEffect, useState } from "react";

const TESTIMONIALS = [
  {
    name: "Priya S.",
    city: "Jaipur",
    avatar: "🧕",
    rating: 5,
    text: "Got my medicines within 12 minutes! This is unreal. My local medical store is now just a tap away.",
    tag: "Pharmacy",
  },
  {
    name: "Rohan M.",
    city: "Delhi",
    avatar: "👨‍💼",
    rating: 5,
    text: "Casano saved my hostel life. Late-night Maggi, stationery for deadlines — all here in minutes.",
    tag: "Stationery",
  },
  {
    name: "Ananya K.",
    city: "Bengaluru",
    avatar: "👩",
    rating: 5,
    text: "The app is so clean compared to big players, and the prices from local stores are actually cheaper!",
    tag: "Groceries",
  },
  {
    name: "Arjun T.",
    city: "Mumbai",
    avatar: "🧑",
    rating: 5,
    text: "15 minutes is not a joke — they actually do it. Placed order at 11pm, rider was at door by 11:14.",
    tag: "Groceries",
  },
  {
    name: "Sneha R.",
    city: "Pune",
    avatar: "👩‍🎓",
    rating: 5,
    text: "Love that I'm supporting my neighbourhood kirana uncle. Modern app, local heart.",
    tag: "Pharmacy",
  },
];

function StarRow({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "10px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#B8962E", fontSize: "14px" }}>★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - trackRef.current.offsetLeft;
    scrollLeft.current = trackRef.current.scrollLeft;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !trackRef.current) return;
    const x = e.pageX - trackRef.current.offsetLeft;
    trackRef.current.scrollLeft = scrollLeft.current - (x - startX.current);
  };
  const onMouseUp = () => setIsDragging(false);

  return (
    <section className="testi-section">
      <div className="testi-inner">
        <div className="testi-header">
          <span className="testi-badge">Customer Love ❤️</span>
          <h2 className="testi-title">
            Thousands of Happy<br />
            <span style={{ color: "#C1492E" }}>Neighbours</span>
          </h2>
          <div style={{ height: "3px", width: "60px", background: "linear-gradient(90deg, #C1492E, #B8962E)", borderRadius: "2px", margin: "16px auto 0" }} />
        </div>

        {/* Drag-scrollable card row */}
        <div
          ref={trackRef}
          className="testi-track"
          style={{ cursor: isDragging ? "grabbing" : "grab" }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="testi-card">
              <StarRow count={t.rating} />
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-footer">
                <div className="testi-avatar">{t.avatar}</div>
                <div>
                  <div className="testi-name">{t.name}</div>
                  <div className="testi-meta">{t.city} · {t.tag}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="testi-drag-hint">← Drag to explore →</p>
      </div>

      <style jsx global>{`
        .testi-section {
          padding: 80px 0 60px;
          background: var(--bg-main);
          overflow: hidden;
          position: relative;
        }
        .testi-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 100%, #B8962E0A 0%, transparent 60%);
          pointer-events: none;
        }
        .testi-inner {
          position: relative;
          z-index: 1;
        }
        .testi-header {
          text-align: center;
          padding: 0 16px;
          margin-bottom: 48px;
        }
        .testi-badge {
          display: inline-block;
          background: #FAE8E5;
          color: #C1492E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 14px;
        }
        .testi-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 4vw, 44px);
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.2;
          margin: 0;
        }
        .testi-track {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 8px 24px 24px;
          scrollbar-width: none;
          -ms-overflow-style: none;
          user-select: none;
          -webkit-overflow-scrolling: touch;
        }
        .testi-track::-webkit-scrollbar { display: none; }
        .testi-card {
          flex-shrink: 0;
          width: 300px;
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: 20px;
          padding: 24px;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      box-shadow 0.3s ease,
                      border-color 0.3s;
        }
        .testi-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.08);
          border-color: #C1492E44;
        }
        .testi-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--text-secondary);
          margin-bottom: 20px;
          font-style: italic;
        }
        .testi-footer {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .testi-avatar {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #FAE8E5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          flex-shrink: 0;
        }
        .testi-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--text-primary);
        }
        .testi-meta {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .testi-drag-hint {
          text-align: center;
          font-size: 12px;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 8px;
          letter-spacing: 0.05em;
        }
        @media (min-width: 1024px) {
          .testi-drag-hint { display: none; }
        }
      `}</style>
    </section>
  );
}
