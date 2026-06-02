"use client";

import React from 'react';
import Link from 'next/link';
import { Store, Heart, ArrowRight, Instagram } from 'lucide-react';

const AboutCarousel = () => {
  return (
    <div className="carousel-wrapper py-24 w-full overflow-hidden" style={{ background: '#FDFBF7' }}>
      <div className="max-w-[1200px] mx-auto text-center mb-16 px-4">
        <span className="inline-block bg-[#FAE8E5] text-[#C1492E] text-[11px] font-extrabold uppercase tracking-[0.1em] px-4 py-1.5 rounded-full mb-4">Our Ecosystem</span>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>
          The Heart of Casano
        </h2>
        <p className="text-base max-w-2xl mx-auto" style={{ color: '#5A5B5A' }}>
          Explore our ecosystem. Hover over any card to pause the rotation.
        </p>
      </div>

      <div className="card-3d-scene">
        <div className="card-3d-container">
          
          {/* Card 1: Local Shop */}
          <Link href="/products" className="card-item group">
            <div className="card-image bg-cover bg-center h-32 w-full" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1604719312566-8fa2065b70d5?q=80&w=500&auto=format&fit=crop')" }} />
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <Store className="w-6 h-6 mb-3" style={{ color: '#C1492E' }} />
                <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>Local Shopping</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#5A5B5A' }}>We sell everything local, close to your home.</p>
              </div>
              <div className="text-xs font-bold flex items-center gap-1 mt-4 transition-colors group-hover:text-[#C1492E]" style={{ color: '#214A36' }}>
                Start Shopping <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </Link>

          {/* Card 2: Mission */}
          <div className="card-item group" style={{ background: '#EFEADD' }}>
            <div className="p-6 flex flex-col flex-1 justify-center items-center text-center">
              <Heart className="w-10 h-10 mb-4" style={{ color: '#C1492E' }} />
              <h3 className="font-bold text-xl leading-tight mb-3" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>Casano Mission</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#5A5B5A' }}>
                Casano helps the local seller grow their business digitally without losing their neighborhood touch.
              </p>
            </div>
          </div>

          {/* Card 3: Register Store */}
          <a href="https://form.typeform.com/to/lQOu4edG#user_id=xxxxx&first_name=xxxxx&last_name=xxxxx&email=xxxxx&phone_number=xxxxx&product_id=xxxxx&auth_code=xxxxx" target="_blank" rel="noreferrer" className="card-item group">
            <div className="card-image bg-cover bg-center h-32 w-full" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=500&auto=format&fit=crop')" }} />
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <Store className="w-6 h-6 mb-3" style={{ color: '#214A36' }} />
                <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>Partner With Us</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#5A5B5A' }}>Register your store and instantly connect with online customers.</p>
              </div>
              <div className="text-xs font-bold flex items-center gap-1 mt-4 transition-colors group-hover:text-[#C1492E]" style={{ color: '#214A36' }}>
                Register Store <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </a>

          {/* Card 4: Founder */}
          <div className="card-item" style={{ overflow: 'visible', zIndex: 10 }}>
            <div className="card-image bg-cover bg-center h-40 w-full" style={{ backgroundImage: "url('/ankushh.JPG')", borderRadius: '1rem 1rem 0 0', overflow: 'hidden', flexShrink: 0 }} />
            <div className="p-5 flex flex-col flex-1 justify-between" style={{ overflow: 'visible' }}>
              <div>
                <h3 className="font-bold text-lg leading-tight mb-1" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>Ankush Singh</h3>
                <p className="text-xs font-semibold mb-2" style={{ color: '#C1492E' }}>Founder & CEO</p>
                <p className="text-xs leading-relaxed" style={{ color: '#5A5B5A' }}>Building the OS for local commerce.</p>
              </div>
              <div className="founder-tooltip-container">
                <div className="founder-tooltip">
                  <div className="founder-profile">
                    <div className="founder-user">
                      <div className="founder-img"><Instagram style={{ width: 20, height: 20, color: '#C1492E' }} /></div>
                      <div className="founder-details">
                        <div className="founder-name">Ankush Singh</div>
                        <div className="founder-username">@ankushsingh</div>
                      </div>
                    </div>
                    <div className="founder-about">Founder & CEO · Casano.in</div>
                  </div>
                </div>
                <a className="founder-icon" href="https://instagram.com/ankushsingh21123" target="_blank" rel="noreferrer">
                  <div className="founder-layer">
                    <span /><span /><span /><span />
                    <span className="founder-fab">
                      <svg viewBox="0 0 448 512" height="1em" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
                    </span>
                  </div>
                  <span className="founder-link-text">Connect on Instagram</span>
                </a>
              </div>
            </div>
          </div>

          {/* Cards 5-10 */}
          <Link href="/products" className="card-item group">
            <div className="card-image bg-cover bg-center h-32 w-full" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=500&auto=format&fit=crop')" }} />
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <Store className="w-6 h-6 mb-3" style={{ color: '#C1492E' }} />
                <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>Fresh Produce</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#5A5B5A' }}>Direct from local vendors to you.</p>
              </div>
            </div>
          </Link>

          <div className="card-item group" style={{ background: '#EFEADD' }}>
            <div className="p-6 flex flex-col flex-1 justify-center items-center text-center">
              <h3 className="font-bold text-3xl mb-2" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>15</h3>
              <p className="text-sm font-bold tracking-widest uppercase" style={{ color: '#C1492E' }}>Minutes Fast</p>
            </div>
          </div>

          <div className="card-item group">
            <div className="card-image bg-cover bg-center h-full w-full opacity-80" style={{ backgroundImage: "url('/city-coverage.jpg')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-5 flex flex-col justify-end">
              <h3 className="font-bold text-lg text-white mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>City Coverage</h3>
              <p className="text-xs text-white/80">Hyperlocal roots, global vision.</p>
            </div>
          </div>

          <div className="card-item group" style={{ background: '#214A36' }}>
            <div className="p-6 flex flex-col flex-1 justify-center items-center text-center">
              <h3 className="font-bold text-xl leading-tight mb-3" style={{ color: '#FDFBF7', fontFamily: "'Playfair Display', serif" }}>Join Request</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(253,251,247,0.7)' }}>
                Together, we are reinventing neighborhood retail.
              </p>
            </div>
          </div>

          <div className="card-item group">
            <div className="card-image bg-cover bg-center h-32 w-full" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1628102491629-77858ab215b2?q=80&w=500&auto=format&fit=crop')" }} />
            <div className="p-5 flex flex-col flex-1 justify-between">
              <div>
                <Store className="w-6 h-6 mb-3" style={{ color: '#214A36' }} />
                <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: '#2A2B2A', fontFamily: "'Playfair Display', serif" }}>Scale Locally</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#5A5B5A' }}>Give your physical store a powerful digital storefront.</p>
              </div>
            </div>
          </div>

          <div className="card-item group" style={{ background: '#C1492E' }}>
            <div className="p-6 flex flex-col flex-1 justify-center items-center text-center">
              <h3 className="font-bold text-xl leading-tight mb-3" style={{ color: '#FDFBF7', fontFamily: "'Playfair Display', serif" }}>Future Ready</h3>
              <p className="text-sm leading-relaxed text-white/80">
                Kiranas powered by leading technology.
              </p>
            </div>
          </div>

        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ── Founder Instagram Tooltip ── */
        .founder-tooltip-container { position: relative; cursor: pointer; font-size: 13px; }
        .founder-tooltip {
          position: absolute;
          bottom: 50px;
          left: 50%;
          transform: translateX(-50%);
          padding: 8px;
          opacity: 0;
          pointer-events: none;
          transition: all 0.3s;
          border-radius: 12px;
          white-space: nowrap;
          box-shadow: inset 5px 5px 5px rgba(0,0,0,0.2), inset -5px -5px 15px rgba(255,255,255,0.1), 5px 5px 15px rgba(0,0,0,0.3), -5px -5px 15px rgba(255,255,255,0.1);
          z-index: 100;
        }
        .founder-profile { background: #2a2b2f; border-radius: 10px 15px; padding: 8px 10px; border: 1px solid rgba(193,73,46,0.5); }
        .founder-tooltip-container:hover .founder-tooltip { opacity: 1; visibility: visible; pointer-events: auto; }
        .founder-icon { text-decoration: none; color: #C1492E; display: flex; align-items: center; gap: 6px; position: relative; font-size: 11px; font-weight: 700; }
        .founder-layer { width: 30px; height: 30px; transition: transform 0.3s; position: relative; flex-shrink: 0; }
        .founder-icon:hover .founder-layer { transform: rotate(-35deg) skew(20deg); }
        .founder-layer span { position: absolute; top: 0; left: 0; height: 100%; width: 100%; border: 1px solid #C1492E; border-radius: 5px; transition: all 0.3s; }
        .founder-icon:hover .founder-layer span:nth-child(1) { opacity: 0.2; }
        .founder-icon:hover .founder-layer span:nth-child(2) { opacity: 0.4; transform: translate(3px, -3px); }
        .founder-icon:hover .founder-layer span:nth-child(3) { opacity: 0.6; transform: translate(6px, -6px); }
        .founder-icon:hover .founder-layer span:nth-child(4) { opacity: 0.8; transform: translate(9px, -9px); }
        .founder-fab { font-size: 16px; line-height: 30px; text-align: center; fill: #C1492E; color: #C1492E; background: #FAE8E5; display: flex; align-items: center; justify-content: center; }
        .founder-link-text { color: #214A36; }
        .founder-user { display: flex; gap: 8px; align-items: center; }
        .founder-img { width: 32px; height: 32px; border: 1px solid #C1492E; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: #FAE8E5; flex-shrink: 0; }
        .founder-name { font-size: 12px; font-weight: 700; color: #C1492E; }
        .founder-username { font-size: 10px; color: #aaa; }
        .founder-details { display: flex; flex-direction: column; gap: 1px; color: #fff; }
        .founder-about { color: #ccc; padding-top: 4px; font-size: 10px; }

        /* ── 3D Carousel Scene ── */
        .card-3d-scene {
          position: relative;
          width: 100%;
          height: 520px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: visible;
          perspective: 1400px;
        }

        .card-3d-container {
          position: relative;
          width: 260px;
          height: 360px;
          transform-style: preserve-3d;
          animation: autoRun3d 50s linear infinite;
          will-change: transform;
        }

        /* Hover pauses the rotation smoothly */
        .card-3d-container:hover {
          animation-play-state: paused !important;
        }

        .card-item {
          position: absolute;
          width: 240px;
          height: 340px;
          background-color: #FDFBF7;
          border: solid 1px #E2DDD0;
          border-radius: 1rem;
          top: 50%;
          left: 50%;
          transform-origin: center center;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          will-change: transform;
          cursor: pointer;
          text-decoration: none;
          backface-visibility: hidden;
        }

        .card-item:hover {
          box-shadow: 0 20px 40px rgba(193, 73, 46, 0.15); 
          border-color: #C1492E;
        }

        .card-item:hover .card-image {
          transform: scale(1.05);
        }
        
        .card-image {
          transition: transform 0.5s ease;
        }

        @keyframes autoRun3d {
          from { transform: rotateY(0deg); }
          to { transform: rotateY(-360deg); }
        }

        /* Desktop: larger radius to prevent clipping */
        .card-item:nth-child(1) { transform: translate(-50%, -50%) rotateY(0deg) translateZ(480px); }
        .card-item:nth-child(2) { transform: translate(-50%, -50%) rotateY(36deg) translateZ(480px); }
        .card-item:nth-child(3) { transform: translate(-50%, -50%) rotateY(72deg) translateZ(480px); }
        .card-item:nth-child(4) { transform: translate(-50%, -50%) rotateY(108deg) translateZ(480px); }
        .card-item:nth-child(5) { transform: translate(-50%, -50%) rotateY(144deg) translateZ(480px); }
        .card-item:nth-child(6) { transform: translate(-50%, -50%) rotateY(180deg) translateZ(480px); }
        .card-item:nth-child(7) { transform: translate(-50%, -50%) rotateY(216deg) translateZ(480px); }
        .card-item:nth-child(8) { transform: translate(-50%, -50%) rotateY(252deg) translateZ(480px); }
        .card-item:nth-child(9) { transform: translate(-50%, -50%) rotateY(288deg) translateZ(480px); }
        .card-item:nth-child(10){ transform: translate(-50%, -50%) rotateY(324deg) translateZ(480px); }
        
        /* Mobile responsive: smaller cards, tighter radius */
        @media (max-width: 768px) {
          .card-3d-scene { perspective: 900px; height: 420px; overflow: visible; }
          .card-3d-container { width: 180px; height: 260px; animation-duration: 60s; }
          .card-item { width: 170px; height: 250px; }
          .card-item:nth-child(1) { transform: translate(-50%, -50%) rotateY(0deg) translateZ(300px); }
          .card-item:nth-child(2) { transform: translate(-50%, -50%) rotateY(36deg) translateZ(300px); }
          .card-item:nth-child(3) { transform: translate(-50%, -50%) rotateY(72deg) translateZ(300px); }
          .card-item:nth-child(4) { transform: translate(-50%, -50%) rotateY(108deg) translateZ(300px); }
          .card-item:nth-child(5) { transform: translate(-50%, -50%) rotateY(144deg) translateZ(300px); }
          .card-item:nth-child(6) { transform: translate(-50%, -50%) rotateY(180deg) translateZ(300px); }
          .card-item:nth-child(7) { transform: translate(-50%, -50%) rotateY(216deg) translateZ(300px); }
          .card-item:nth-child(8) { transform: translate(-50%, -50%) rotateY(252deg) translateZ(300px); }
          .card-item:nth-child(9) { transform: translate(-50%, -50%) rotateY(288deg) translateZ(300px); }
          .card-item:nth-child(10){ transform: translate(-50%, -50%) rotateY(324deg) translateZ(300px); }
        }

        /* Very small screens */
        @media (max-width: 480px) {
          .card-3d-scene { perspective: 700px; height: 380px; }
          .card-3d-container { width: 160px; height: 240px; animation-duration: 65s; }
          .card-item { width: 150px; height: 230px; }
          .card-item:nth-child(1) { transform: translate(-50%, -50%) rotateY(0deg) translateZ(240px); }
          .card-item:nth-child(2) { transform: translate(-50%, -50%) rotateY(36deg) translateZ(240px); }
          .card-item:nth-child(3) { transform: translate(-50%, -50%) rotateY(72deg) translateZ(240px); }
          .card-item:nth-child(4) { transform: translate(-50%, -50%) rotateY(108deg) translateZ(240px); }
          .card-item:nth-child(5) { transform: translate(-50%, -50%) rotateY(144deg) translateZ(240px); }
          .card-item:nth-child(6) { transform: translate(-50%, -50%) rotateY(180deg) translateZ(240px); }
          .card-item:nth-child(7) { transform: translate(-50%, -50%) rotateY(216deg) translateZ(240px); }
          .card-item:nth-child(8) { transform: translate(-50%, -50%) rotateY(252deg) translateZ(240px); }
          .card-item:nth-child(9) { transform: translate(-50%, -50%) rotateY(288deg) translateZ(240px); }
          .card-item:nth-child(10){ transform: translate(-50%, -50%) rotateY(324deg) translateZ(240px); }
        }
      `}} />
    </div>
  );
};

export default AboutCarousel;
