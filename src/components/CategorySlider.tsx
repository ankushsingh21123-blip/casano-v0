"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Shirt, Smartphone, Pencil, Dumbbell } from "lucide-react";
import styles from "./CategorySlider.module.css";

const categories = [
  {
    id: "groceries",
    label: "Groceries",
    Icon: ShoppingCart,
    image: "/category_groceries.png",
    gradient: "linear-gradient(135deg, #56ab2f, #a8e063)",
    path: "/category/groceries",
  },
  {
    id: "fashion",
    label: "Fashion",
    Icon: Shirt,
    image: "/category_fashion.png",
    gradient: "linear-gradient(135deg, #f953c6, #b91d73)",
    path: "/category/fashion",
  },
  {
    id: "gadgets",
    label: "Gadgets",
    Icon: Smartphone,
    image: "/category_gadgets.png",
    gradient: "linear-gradient(135deg, #1a1a2e, #16213e)",
    path: "/category/gadgets",
  },
  {
    id: "stationery",
    label: "Stationery",
    Icon: Pencil,
    image: "/category_stationery.png",
    gradient: "linear-gradient(135deg, #f7971e, #ffd200)",
    path: "/category/stationery",
  },
  {
    id: "gym",
    label: "Gym & Fitness",
    Icon: Dumbbell,
    image: "/category_gym.png",
    gradient: "linear-gradient(135deg, #fc4a1a, #f7b733)",
    path: "/category/gym",
  },
];

// Duplicate for infinite scroll
const allItems = [...categories, ...categories, ...categories];

export default function CategorySlider() {
  const router = useRouter();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setPaused] = useState(false);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll-triggered start
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const handleCardClick = (path: string) => {
    // Single click = pause, double click = navigate
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
      router.push(path);
    } else {
      setPaused(true);
      clickTimerRef.current = setTimeout(() => {
        clickTimerRef.current = null;
        // single click: stays paused until mouse leaves
      }, 300);
    }
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.heading}>
        <h2 className={styles.title}>Shop by Category</h2>
        <p className={styles.subtitle}>
          Click to pause · Double-click to explore
        </p>
      </div>

      <div
        className={styles.sliderTrack}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className={styles.fadeLeft} />
        <div className={styles.fadeRight} />

        <div
          className={`${styles.sliderList} ${isVisible && !isPaused ? styles.animating : ""}`}
        >
          {allItems.map((cat, i) => (
            <div
              key={`${cat.id}-${i}`}
              className={styles.sliderItem}
              onClick={() => handleCardClick(cat.path)}
              title={`Double-click to explore ${cat.label}`}
            >
              <div className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className={styles.cardImage}
                    sizes="220px"
                  />
                  <div
                    className={styles.cardOverlay}
                    style={{ background: cat.gradient }}
                  />
                </div>
                <div className={styles.cardLabel}>
                  <span className={styles.cardEmoji}>
                    <cat.Icon className="w-4 h-4" />
                  </span>
                  <span className={styles.cardText}>{cat.label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
