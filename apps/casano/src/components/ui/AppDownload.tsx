"use client";

import { Zap, Bell, CreditCard, Gift, ShoppingCart, Store, Smartphone, Search, MapPin, ChevronDown } from "lucide-react";
import { ReactNode, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface Feature { icon: ReactNode; text: string; }

const FEATURES: Feature[] = [
  { icon: <Zap className="w-5 h-5" style={{ color: "#B8962E" }} />, text: "Faster checkout with saved addresses" },
  { icon: <Bell className="w-5 h-5" style={{ color: "#C1492E" }} />, text: "Real-time order tracking alerts" },
  { icon: <CreditCard className="w-5 h-5" style={{ color: "#214A36" }} />, text: "1-tap orders with quick payments" },
  { icon: <Gift className="w-5 h-5" style={{ color: "#B8962E" }} />, text: "App-exclusive VIP offers & Gold" },
];

export default function AppDownload() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const phoneY = useTransform(scrollYProgress, [0, 1], [30, -50]);
  const badge1Y = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const badge2Y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section className="app-section" ref={containerRef}>
      <div className="app-inner">
        {/* Left: Copy */}
        <div className="app-copy">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="app-badge"
          >
            <Smartphone className="w-3.5 h-3.5 inline-block mr-1.5" />
            Casano Mobile App
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="app-title"
          >
            Luxury In Your Pocket —<br />
            <span className="app-title-accent">Always Ready.</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="app-desc"
          >
            Order the finest groceries and essentials on the go. Enjoy live tracking, seamless payments, and our signature Casano Gold experience, directly from your iPhone.
          </motion.p>

          <div className="app-features">
            {FEATURES.map((f, i) => (
              <motion.div 
                key={f.text} 
                initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + (i * 0.1) }}
                className="app-feature group"
              >
                <span className="app-feature-icon transition-transform group-hover:scale-110">{f.icon}</span>
                <span className="app-feature-text">{f.text}</span>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}
            className="app-stores"
          >
            <a href="#" className="app-store-btn">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                style={{ height: "46px", width: "auto" }}
              />
            </a>
            <a href="#" className="app-store-btn">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                style={{ height: "46px", width: "auto" }}
              />
            </a>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.9 }}
            className="app-rating"
          >
            <span style={{ color: "#B8962E", letterSpacing: "2px" }}>★★★★★</span>
            <span style={{ marginLeft: "8px" }}>Rated 4.9 by 25,000+ Patrons</span>
          </motion.p>
        </div>

        {/* Right: Phone mockup */}
        <div className="app-phone-wrap">
          <motion.div className="app-phone" style={{ y: phoneY }}>
            {/* iPhone 17 Pro Dynamic Island */}
            <div className="app-phone-island">
              <div className="island-camera"></div>
              <div className="island-sensor"></div>
            </div>
            
            <div className="app-phone-screen">
              {/* Pinned Top Bar */}
              <div className="app-mock-top-bar">
                <div className="app-mock-header">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-1 text-[9px] font-bold" style={{ color: "var(--action-primary)" }}>
                      <MapPin className="w-2.5 h-2.5" /> Home <ChevronDown className="w-2.5 h-2.5" />
                    </span>
                    <span className="font-extrabold text-[15px] font-['Playfair_Display']">Casano.</span>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-[#1A1816] flex items-center justify-center shadow-lg">
                    <span className="text-[#B8962E] font-bold text-[10px]">C</span>
                  </div>
                </div>

                <div className="app-mock-search">
                  <Search className="w-3 h-3 text-gray-400" />
                  <span className="text-[11px] text-gray-400 font-medium">Search essentials...</span>
                </div>
              </div>

              {/* Dynamic scrollable interior */}
              <div className="app-mock-scroll-area">
                <div className="app-mock-inner-scroll">
                  {/* Banner */}
                  <div className="w-full h-24 rounded-xl mb-4 overflow-hidden relative flex-shrink-0" style={{ background: "linear-gradient(135deg, #1A1816, #2E2D2A)" }}>
                    <div className="absolute inset-x-0 bottom-0 top-0 p-3 flex flex-col justify-center">
                      <span className="text-[#B8962E] text-[8px] font-bold uppercase tracking-wider mb-0.5">Casano Gold</span>
                      <span className="text-white text-[13px] font-bold leading-tight font-['Playfair_Display']">Free Delivery on<br/>all orders.</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3 flex-shrink-0">
                    <span className="font-bold text-[12px]">Trending Now</span>
                    <span className="text-[9px] text-[#C1492E] font-bold">See All</span>
                  </div>

                  {/* Items */}
                  {[
                    { name: "Avocado Hass", price: "₹185", img: "/category_groceries.png" },
                    { name: "Almond Milk", price: "₹240", img: "/category_groceries.png" },
                    { name: "Organic Honey", price: "₹350", img: "/category_groceries.png" },
                    { name: "Sourdough Bread", price: "₹110", img: "/category_groceries.png" },
                    { name: "Fresh Strawberries", price: "₹150", img: "/category_groceries.png" },
                  ].map((item, i) => (
                    <div key={item.name} className="app-mock-item flex-shrink-0">
                      <div className="app-mock-item-img">
                        <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="app-mock-item-name">{item.name}</div>
                        <div className="app-mock-item-price">{item.price}</div>
                      </div>
                      <div className="app-mock-add">+</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Home Indicator */}
              <div className="app-home-indicator" />
            </div>
          </motion.div>

          {/* Floating badges */}
          <motion.div className="app-float-badge app-float-1" style={{ y: badge1Y }}>
            <Zap className="w-4 h-4 mb-0.5" style={{ color: "#B8962E" }} />
            Delivered in<br />
            <strong style={{ color: '#C1492E' }}>12 mins or less</strong>
          </motion.div>
          
          <motion.div className="app-float-badge app-float-2" style={{ y: badge2Y }}>
            <Store className="w-4 h-4 mb-0.5" style={{ color: "#214A36" }} />
            1000+ Premium<br />
            <strong>Partner Stores</strong>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .app-section {
          padding: 100px 16px;
          background: var(--surface-card);
          overflow: hidden;
          position: relative;
          border-top: 1px solid var(--surface-border);
        }
        .app-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 80% 50%, rgba(193,73,46,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .app-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 180px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1023px) {
          .app-inner { flex-direction: column; gap: 60px; }
        }
        .app-copy { flex: 1; max-width: 540px; }
        
        .app-badge {
          display: inline-flex;
          align-items: center;
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
        
        .app-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(32px, 4vw, 52px);
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.1;
          margin: 0 0 20px;
          letter-spacing: -0.01em;
        }
        .app-title-accent { color: #C1492E; font-style: italic; }
        
        .app-desc {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.7;
          margin-bottom: 36px;
          font-weight: 500;
        }
        
        .app-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .app-feature {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .app-feature-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: var(--bg-main);
          border: 1px solid var(--surface-border);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
        .app-feature-text {
          font-size: 14px;
          color: var(--text-primary);
          font-weight: 600;
          line-height: 1.3;
        }
        
        .app-stores {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        .app-store-btn {
          display: block;
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        }
        .app-store-btn:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 8px 25px rgba(0,0,0,0.1); }
        
        .app-rating {
          font-size: 13px;
          color: var(--text-secondary);
          font-weight: 600;
        }

        /* iPhone 17 Pro Mockup */
        .app-phone-wrap {
          flex-shrink: 0;
          position: relative;
          width: 280px;
          perspective: 1000px;
        }
        .app-phone {
          width: 280px;
          height: 590px;
          border-radius: 52px; /* Smoother curve */
          background: #000000; /* iPhone physical border */
          padding: 8px; /* Bezel width */
          box-shadow: 
            0 50px 80px rgba(0,0,0,0.15), 
            inset 0 0 0 2px #444, 
            inset 0 0 20px rgba(255,255,255,0.2);
          position: relative;
          transform-style: preserve-3d;
          rotate: x 2deg;
          rotate: y -5deg;
        }
        .dark .app-phone {
          box-shadow: 
            0 50px 80px rgba(0,0,0,0.4), 
            inset 0 0 0 1px #333,
            inset 0 0 10px rgba(255,255,255,0.05);
        }
        
        .app-phone-island {
          width: 95px; height: 28px;
          background: #000000;
          border-radius: 20px;
          position: absolute;
          top: 16px; /* Offset for bezel */
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          box-shadow: inset 0 0 2px rgba(255,255,255,0.1);
        }
        .island-camera {
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #111;
          box-shadow: inset -1px -1px 3px rgba(255,255,255,0.15);
        }
        .island-sensor {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #111;
        }
        
        .app-phone-screen {
          background: #FFFFFF;
          border-radius: 44px;
          height: 100%;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .dark .app-phone-screen { background: #151210; }
        
        .app-mock-top-bar {
          padding: 54px 16px 0;
          background: transparent;
          position: relative;
          z-index: 10;
        }

        .app-mock-scroll-area {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          position: relative;
          mask-image: linear-gradient(to bottom, transparent, black 15px, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 15px, black 90%, transparent);
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
        }
        .app-mock-scroll-area::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        .app-mock-inner-scroll {
          padding: 0 16px 20px;
          display: flex;
          flex-direction: column;
        }
        
        .app-home-indicator {
          position: absolute;
          bottom: 8px;
          left: 50%;
          transform: translateX(-50%);
          width: 90px;
          height: 4px;
          background: rgba(0,0,0,0.2);
          border-radius: 10px;
          z-index: 20;
        }
        .dark .app-home-indicator { background: rgba(255,255,255,0.3); }

        .app-mock-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 20px;
        }
        .dark .app-mock-header span.font-extrabold { color: #f5f0e8; }
        
        .app-mock-search {
          height: 40px;
          background: #F5F0E8;
          border-radius: 12px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          padding: 0 14px;
          gap: 8px;
          border: 1px solid #E8DDCD;
        }
        .dark .app-mock-search {
          background: #1C1B19;
          border-color: #2E2D2A;
        }
        
        .app-mock-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        .dark .app-mock-item { border-bottom-color: rgba(255,255,255,0.05); }
        
        .app-mock-item-img {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: #F5F0E8;
          flex-shrink: 0;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .dark .app-mock-item-img { background: #1C1B19; border-color: rgba(255,255,255,0.05); }
        
        .app-mock-item-name {
          font-size: 13px;
          font-weight: 700;
          color: #1A1816;
          margin-bottom: 2px;
        }
        .dark .app-mock-item-name { color: #F5F0E8; }
        
        .app-mock-item-price {
          font-size: 12px;
          color: var(--action-primary);
          font-weight: 800;
        }
        
        .app-mock-add {
          width: 30px; height: 30px;
          border-radius: 10px;
          background: rgba(193,73,46,0.1);
          color: var(--action-primary);
          font-weight: 800;
          font-size: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        /* Floating badges */
        .app-float-badge {
          position: absolute;
          background: var(--surface-card);
          border: 1px solid var(--surface-border);
          border-radius: 16px;
          padding: 14px 20px;
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.4;
          box-shadow: 0 16px 40px rgba(0,0,0,0.08); /* Stronger shadow */
          white-space: nowrap;
          z-index: 10;
        }
        .dark .app-float-badge { box-shadow: 0 16px 40px rgba(0,0,0,0.4); }
        
        .app-float-badge strong { color: #214A36; }
        .dark .app-float-badge strong { color: #3BB173; }
        
        .app-float-1 {
          top: 80px;
          left: calc(100% + 40px); /* Approx 1.5 cm gap from the right side of phone */
        }
        .app-float-2 {
          bottom: 120px;
          right: calc(100% + 40px); /* Approx 1.5 cm gap from the left side of phone */
        }
        @media (max-width: 1023px) {
          .app-float-1, .app-float-2 { display: none; }
        }
      `}</style>
    </section>
  );
}
