"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import CategorySlider from "@/components/CategorySlider";
import HowItWorks from "@/components/ui/HowItWorks";
import Testimonials from "@/components/ui/Testimonials";
import AppDownload from "@/components/ui/AppDownload";
import CounterSection from "@/components/ui/CounterSection";
import OldMobileHome from "@/components/OldMobileHome";
import Footer from "@/components/Footer";

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
    <div className="min-h-screen font-sans transition-colors duration-300" style={{ background: "var(--bg-main)" }}>
      <Header />
      <HeroBanner />
      <main className="pb-0">
        <CategoryGrid />
        <CategorySlider />
        <div className="raj-divider" />
        <HowItWorks />
        <div className="raj-divider" />
        <CounterSection />
        <div className="raj-divider" />
        <AppDownload />
        <div className="raj-divider" />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
