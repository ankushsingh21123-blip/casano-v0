"use client";

import { useRef, useEffect, useState, ReactNode } from "react";
import { Package, Zap, Store, Star, Users } from "lucide-react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
  icon: ReactNode;
  color: string;
}

const STATS: Stat[] = [
  { value: 50000, suffix: "+", label: "Products Listed", icon: <Package className="w-6 h-6" />, color: "#C1492E", prefix: "" },
  { value: 15, suffix: " min", label: "Avg. Delivery Time", icon: <Zap className="w-6 h-6" />, color: "#214A36", prefix: "" },
  { value: 500, suffix: "+", label: "Partner Stores", icon: <Store className="w-6 h-6" />, color: "#B8962E", prefix: "" },
  { value: 4.9, suffix: "★", label: "Customer Rating", icon: <Star className="w-6 h-6" />, color: "#C1492E", prefix: "" },
  { value: 10000, suffix: "+", label: "Happy Customers", icon: <Users className="w-6 h-6" />, color: "#214A36", prefix: "" },
];

function useCountUp(target: number, isVisible: boolean, duration = 1800) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    const isDecimal = target % 1 !== 0;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isDecimal
        ? parseFloat((eased * target).toFixed(1))
        : Math.round(eased * target);
      setCount(current);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

function StatCard({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountUp(stat.value, isVisible);

  return (
    <div
      className="casano-stat-card"
      style={{ borderTop: `3px solid ${stat.color}` }}
    >
      <div className="casano-stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
      <div className="casano-stat-number" style={{ color: stat.color }}>
        {stat.prefix}
        {stat.value % 1 !== 0
          ? count.toFixed(1)
          : count >= 1000
          ? (count / 1000).toFixed(0) + "K"
          : count}
        {stat.suffix}
      </div>
      <div className="casano-stat-label">{stat.label}</div>
    </div>
  );
}

export default function CounterSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="casano-counter-section">
      <div className="casano-counter-inner">
        <div className="casano-counter-header">
          <span className="casano-counter-badge">Why Casano?</span>
          <h2 className="casano-counter-title">
            India's Most Trusted<br />
            <span style={{ color: "#C1492E" }}>Hyperlocal Delivery</span>
          </h2>
          <div className="raj-divider" style={{ width: "80px", margin: "16px auto" }} />
        </div>

        <div className="casano-counter-grid">
          {STATS.map((stat) => (
            <StatCard key={stat.label} stat={stat} isVisible={isVisible} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .casano-counter-section {
          padding: 80px 16px;
          background: var(--bg-main);
          overflow: hidden;
          position: relative;
          border-top: 1px solid var(--surface-border);
        }
        .casano-counter-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(193,73,46,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .casano-counter-inner {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .casano-counter-header {
          text-align: center;
          margin-bottom: 56px;
        }
        .casano-counter-badge {
          display: inline-block;
          background: rgba(193,73,46,0.08);
          border: 1px solid rgba(193,73,46,0.15);
          color: #C1492E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 20px;
        }
        .casano-counter-title {
          font-family: var(--font-heading);
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.1;
          letter-spacing: -0.01em;
        }
        .casano-counter-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 24px;
        }
        .casano-stat-card {
          background: var(--surface-card);
          border-radius: 20px;
          border: 1px solid var(--surface-border);
          padding: 32px 20px 24px;
          text-align: center;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
          cursor: default;
          box-shadow: 0 4px 15px rgba(0,0,0,0.02);
        }
        .casano-stat-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.08);
        }
        .dark .casano-stat-card:hover {
          box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        }
        .casano-stat-icon {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          width: 48px; height: 48px;
          border-radius: 12px;
          margin-left: auto; margin-right: auto;
        }
        .casano-stat-number {
          font-family: var(--font-heading);
          font-size: 40px;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 12px;
          transition: color 0.3s;
        }
        .casano-stat-label {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-secondary);
        }
      `}</style>
    </section>
  );
}
