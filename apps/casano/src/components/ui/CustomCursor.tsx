"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom Cursor — 2026 Awwwards-style
 * • Dot: snappy, follows instantly
 * • Ring: lagging magnetic ring (lerp)
 * • Hover states: expand on links/buttons, glow on CTA
 * • Hidden on mobile/touch devices
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [cursorType, setCursorType] = useState<"default" | "link" | "cta" | "text">("default");
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch, setIsTouch] = useState(true); // Start true to prevent flash

  useEffect(() => {
    // Detect touch capability
    const touch = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 1024;
    setIsTouch(touch);
    if (touch) return;

    let ringX = 0, ringY = 0;
    let dotX = 0, dotY = 0;
    let raf: number;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      dotX = e.clientX;
      dotY = e.clientY;
      setIsVisible(true);

      const el = e.target as HTMLElement;
      const closest = el.closest("a, button, [data-cursor]");

      if (closest) {
        const dc = (closest as HTMLElement).dataset.cursor;
        if (dc === "cta") setCursorType("cta");
        else if (dc === "text") setCursorType("text");
        else setCursorType("link");
      } else {
        setCursorType("default");
      }
    };

    const onLeave = () => setIsVisible(false);
    const onEnter = () => setIsVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    const tick = () => {
      const speed = 0.12;
      ringX = lerp(ringX, dotX, speed);
      ringY = lerp(ringY, dotY, speed);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dotX - 4}px, ${dotY - 4}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX - 20}px, ${ringY - 20}px)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Don't render on touch/mobile
  if (isTouch) return null;

  const ringSize = cursorType === "link" ? 52 : cursorType === "cta" ? 64 : cursorType === "text" ? 3 : 40;
  const ringOpacity = cursorType === "text" ? 0 : 1;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{
          opacity: isVisible ? 1 : 0,
          background: cursorType === "cta" ? "#C1492E" : cursorType === "link" ? "#B8962E" : "#2A2B2A",
          width: cursorType === "cta" ? 10 : 8,
          height: cursorType === "cta" ? 10 : 8,
        }}
      />
      {/* Lagging ring */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          opacity: isVisible ? ringOpacity : 0,
          width: ringSize,
          height: ringSize,
          borderColor: cursorType === "cta"
            ? "#C1492E"
            : cursorType === "link"
            ? "#B8962E"
            : "#2A2B2A",
          transform: `translate(-20px, -20px)`,
          boxShadow: cursorType === "cta"
            ? "0 0 20px #C1492E55"
            : cursorType === "link"
            ? "0 0 16px #B8962E44"
            : "none",
        }}
      />

      <style jsx global>{`
        @media (min-width: 1024px) {
          * { cursor: none !important; }
        }

        .cursor-dot {
          position: fixed;
          top: 0; left: 0;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          mix-blend-mode: multiply;
          transition: background 0.2s, width 0.15s, height 0.15s;
          will-change: transform;
        }

        .cursor-ring {
          position: fixed;
          top: 0; left: 0;
          border-radius: 50%;
          border: 1.5px solid #2A2B2A;
          pointer-events: none;
          z-index: 99998;
          transition: width 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      height 0.3s cubic-bezier(0.34, 1.56, 0.64, 1),
                      border-color 0.2s,
                      box-shadow 0.2s;
          will-change: transform;
        }

        @media (max-width: 1023px) {
          * { cursor: auto !important; }
          .cursor-dot, .cursor-ring { display: none !important; }
        }
      `}</style>
    </>
  );
}
