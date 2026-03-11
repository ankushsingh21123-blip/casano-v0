"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import OldMobileHome from "@/components/OldMobileHome";

export default function Home() {
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
    return <OldMobileHome />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#121212] font-sans transition-colors duration-300">
      <Header />
      <HeroBanner />
      <main className="pb-20">
        <CategoryGrid />
      </main>
    </div>
  );
}
