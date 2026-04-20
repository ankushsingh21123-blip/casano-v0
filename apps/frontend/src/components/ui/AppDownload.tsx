"use client";

export default function AppDownload() {
  return (
    <section className="app-section">
      <div className="app-inner">
        {/* Left: Copy */}
        <div className="app-copy">
          <span className="app-badge">📲 Mobile App</span>
          <h2 className="app-title">
            Casano in Your Pocket —<br />
            <span className="app-title-accent">Always Ready</span>
          </h2>
          <p className="app-desc">
            Order on the go. Live tracking, instant notifications, and your
            favourite stores — all in one app.
          </p>

          <div className="app-features">
            {[
              { icon: "⚡", text: "Faster checkout with saved addresses" },
              { icon: "🔔", text: "Real-time order tracking notifications" },
              { icon: "💳", text: "Saved payment methods for 1-tap orders" },
              { icon: "🎁", text: "App-exclusive deals and offers" },
            ].map((f) => (
              <div key={f.text} className="app-feature">
                <span className="app-feature-icon">{f.icon}</span>
                <span className="app-feature-text">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="app-stores">
            <a href="#" className="app-store-btn">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                style={{ height: "44px", width: "auto" }}
              />
            </a>
            <a href="#" className="app-store-btn">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                style={{ height: "44px", width: "auto" }}
              />
            </a>
          </div>

          <p className="app-rating">
            <span style={{ color: "#B8962E" }}>★★★★★</span>
            &nbsp; Rated 4.9 · 10,000+ reviews
          </p>
        </div>

        {/* Right: Phone mockup */}
        <div className="app-phone-wrap">
          <div className="app-phone">
            <div className="app-phone-notch" />
            <div className="app-phone-screen">
              {/* Mini app UI */}
              <div className="app-mock-header">
                <span style={{ fontWeight: 800, fontSize: "13px", color: "#C1492E" }}>Casano</span>
                <span style={{ fontSize: "10px", color: "#214A36", fontWeight: 700 }}>⚡ 12 min</span>
              </div>
              <div className="app-mock-search" />
              {["🥑 Avocado", "💊 Paracetamol", "📓 Notebook"].map((item, i) => (
                <div key={item} className="app-mock-item" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="app-mock-item-img" />
                  <div style={{ flex: 1 }}>
                    <div className="app-mock-item-name">{item}</div>
                    <div className="app-mock-item-price">₹{[45, 12, 35][i]}</div>
                  </div>
                  <div className="app-mock-add">+</div>
                </div>
              ))}
              <div className="app-mock-cart">
                🛒 &nbsp; View Cart · 3 items · ₹92
              </div>
            </div>
          </div>
          {/* Floating badges */}
          <div className="app-float-badge app-float-1">
            <span>⚡</span> Delivered in<br />
            <strong>12 mins</strong>
          </div>
          <div className="app-float-badge app-float-2">
            <span>🏪</span> 500+<br />
            <strong>Stores</strong>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .app-section {
          padding: 80px 16px;
          background: var(--surface-card);
          border-top: 1px solid var(--surface-border);
          overflow: hidden;
          position: relative;
        }
        .app-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 100% 50%, #C1492E08 0%, transparent 60%);
          pointer-events: none;
        }
        .app-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 80px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 1023px) {
          .app-inner { flex-direction: column; gap: 40px; }
        }
        .app-copy { flex: 1; max-width: 520px; }
        .app-badge {
          display: inline-block;
          background: #FAE8E5;
          color: #C1492E;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 14px;
          border-radius: 999px;
          margin-bottom: 16px;
        }
        .app-title {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: clamp(26px, 3.5vw, 44px);
          font-weight: 900;
          color: var(--text-primary);
          line-height: 1.15;
          margin: 0 0 16px;
        }
        .app-title-accent { color: #C1492E; font-style: italic; }
        .app-desc {
          font-size: 16px;
          color: var(--text-secondary);
          line-height: 1.65;
          margin-bottom: 28px;
        }
        .app-features {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }
        .app-feature {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .app-feature-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: var(--bg-main);
          border: 1px solid var(--surface-border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
        }
        .app-feature-text {
          font-size: 14px;
          color: var(--text-secondary);
          font-weight: 500;
        }
        .app-stores {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }
        .app-store-btn {
          display: block;
          transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s;
        }
        .app-store-btn:hover { transform: scale(1.05); opacity: 0.9; }
        .app-rating {
          font-size: 13px;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* ── Phone mockup ── */
        .app-phone-wrap {
          flex-shrink: 0;
          position: relative;
          width: 240px;
        }
        .app-phone {
          width: 240px;
          height: 480px;
          border-radius: 36px;
          background: linear-gradient(160deg, #1C1B19, #2A2B2A);
          border: 6px solid #3A3936;
          box-shadow: 0 40px 80px rgba(0,0,0,0.3), inset 0 0 0 1px #ffffff10;
          overflow: hidden;
          position: relative;
          animation: app-float 5s ease-in-out infinite alternate;
        }
        @keyframes app-float {
          0% { transform: translateY(0) rotate(-1deg); }
          100% { transform: translateY(-14px) rotate(1deg); }
        }
        .app-phone-notch {
          width: 80px; height: 20px;
          background: #1C1B19;
          border-radius: 0 0 12px 12px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        .app-phone-screen {
          padding: 8px 12px;
          background: #FDFBF7;
          height: calc(100% - 20px);
          overflow: hidden;
        }
        .app-mock-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 4px 0 8px;
        }
        .app-mock-search {
          height: 28px;
          background: #EFEADD;
          border-radius: 8px;
          margin-bottom: 12px;
          border: 1px solid #E2DDD0;
        }
        .app-mock-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          border-bottom: 1px solid #E2DDD0;
          animation: app-item-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        @keyframes app-item-in {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .app-mock-item-img {
          width: 36px; height: 36px;
          border-radius: 8px;
          background: #EFEADD;
          flex-shrink: 0;
        }
        .app-mock-item-name {
          font-size: 11px;
          font-weight: 600;
          color: #2A2B2A;
        }
        .app-mock-item-price {
          font-size: 10px;
          color: #214A36;
          font-weight: 700;
        }
        .app-mock-add {
          width: 24px; height: 24px;
          border-radius: 6px;
          background: #C1492E;
          color: white;
          font-weight: 800;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .app-mock-cart {
          position: absolute;
          bottom: 16px;
          left: 12px;
          right: 12px;
          background: #C1492E;
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 10px;
          border-radius: 10px;
          text-align: center;
        }

        /* ── Floating badges ── */
        .app-float-badge {
          position: absolute;
          background: white;
          border: 1px solid #E2DDD0;
          border-radius: 14px;
          padding: 10px 14px;
          font-size: 11px;
          font-weight: 600;
          color: #2A2B2A;
          line-height: 1.4;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
          white-space: nowrap;
        }
        .app-float-badge span { font-size: 16px; display: block; margin-bottom: 2px; }
        .app-float-badge strong { color: #214A36; }
        .app-float-1 {
          top: 60px;
          right: -60px;
          animation: app-float 6s ease-in-out infinite alternate;
        }
        .app-float-2 {
          bottom: 100px;
          left: -60px;
          animation: app-float 7s ease-in-out infinite alternate-reverse;
        }
        @media (max-width: 1023px) {
          .app-float-1, .app-float-2 { display: none; }
        }
      `}</style>
    </section>
  );
}
