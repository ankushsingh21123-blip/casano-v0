"use client";
import { useState } from "react";

const tabs = ["🗺️ System Flow", "👤 Customer App", "🏪 Shopkeeper App", "🧠 Algorithms", "⚙️ Backend APIs", "🤖 LLM Prompts", "📦 Full Stack Code"];

const colors = {
  bg: "#0a0a0f",
  card: "#12121a",
  border: "#1e1e2e",
  accent: "#00e5ff",
  accent2: "#ff6b35",
  accent3: "#a855f7",
  green: "#22c55e",
  yellow: "#fbbf24",
  text: "#e2e8f0",
  muted: "#64748b",
};

const Tag = ({ color, children }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}>
    {children}
  </span>
);

const Card = ({ children, style = {} }) => (
  <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, ...style }}>
    {children}
  </div>
);

const CodeBlock = ({ code, lang = "js" }) => (
  <pre style={{
    background: "#070710", border: `1px solid ${colors.border}`, borderRadius: 12,
    padding: 20, overflowX: "auto", fontSize: 12, lineHeight: 1.7,
    color: "#a8d8ff", fontFamily: "'Fira Code', 'Courier New', monospace", margin: "12px 0"
  }}>
    <code>{code}</code>
  </pre>
);

const SectionTitle = ({ children, color = colors.accent }) => (
  <h2 style={{ color, fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 16px", letterSpacing: -0.5 }}>
    {children}
  </h2>
);

// ─────────────────────────── TAB 1: SYSTEM FLOW ───────────────────────────
function SystemFlow() {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: "🚪", title: "Entry Point", color: colors.accent, desc: "User opens app → Role selection screen: CUSTOMER or SHOPKEEPER", detail: "Single landing page with two portals. JWT-based auth with phone OTP verification for both roles." },
    { icon: "🔍", title: "Customer Searches", color: "#60a5fa", desc: "Customer types 'Toothpaste' → Smart search triggers", detail: "Elasticsearch fuzzy search + NLP normalization. Synonyms ('paste' → 'toothpaste'), brand matching, category inference." },
    { icon: "📍", title: "Geo-Location Engine", color: colors.green, desc: "System captures GPS coords → Haversine algorithm finds nearby shops", detail: "PostGIS geospatial queries. Shops within configurable radius (default 5km). Returns distance, ETA, delivery cost." },
    { icon: "🏪", title: "Shop Inventory Match", color: colors.yellow, desc: "Matches search term to shopkeeper inventory → Stock availability check", detail: "Real-time inventory via Redis. Shop registers items with quantity. Algorithm scores: distance + availability + rating + price." },
    { icon: "💰", title: "Price + Distance Calc", color: colors.accent2, desc: "Shows user: nearest shop, price breakdown, delivery charge", detail: "Dynamic pricing: base fee + per-km charge. If distance > threshold → warning shown. Platform fee = 5-15% of order value." },
    { icon: "📦", title: "Order Placement", color: "#e879f9", desc: "Customer confirms → Order sent to shopkeeper", detail: "Order queued in Redis. Shopkeeper notified via WebSocket + push notification. 60-second acceptance window." },
    { icon: "✅", title: "3-Layer Verification", color: colors.green, desc: "1) Shopkeeper confirms → 2) Delivery partner accepts → 3) Customer receives + confirms", detail: "Each step has timeout fallback. OTP at delivery. All states tracked in real-time. Blockchain hash for audit trail (optional)." },
    { icon: "🛵", title: "Delivery + Tracking", color: colors.accent, desc: "Live GPS tracking, ETA updates, status pings", detail: "Google Maps Directions API / OSRM for routing. Delivery partner app sends location every 5 seconds via WebSocket." },
  ];

  return (
    <div>
      <SectionTitle>Complete Platform Architecture — End to End</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 24 }}>
        {steps.map((s, i) => (
          <div key={i} onClick={() => setStep(i)} style={{
            background: step === i ? s.color + "22" : colors.card,
            border: `2px solid ${step === i ? s.color : colors.border}`,
            borderRadius: 14, padding: 14, cursor: "pointer", transition: "all 0.2s"
          }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ color: s.color, fontWeight: 700, fontSize: 13, margin: "6px 0 4px" }}>{s.title}</div>
            <div style={{ color: colors.muted, fontSize: 11 }}>{s.desc}</div>
          </div>
        ))}
      </div>

      <Card style={{ border: `2px solid ${steps[step].color}44`, background: steps[step].color + "08" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <span style={{ fontSize: 36 }}>{steps[step].icon}</span>
          <div>
            <div style={{ color: steps[step].color, fontWeight: 800, fontSize: 20 }}>Step {step + 1}: {steps[step].title}</div>
            <div style={{ color: colors.text, marginTop: 4 }}>{steps[step].desc}</div>
          </div>
        </div>
        <div style={{ background: "#00000040", borderRadius: 10, padding: 14, color: colors.muted, fontSize: 14, lineHeight: 1.8 }}>
          🔧 <strong style={{ color: colors.text }}>Technical Detail:</strong> {steps[step].detail}
        </div>
      </Card>

      <div style={{ marginTop: 24 }}>
        <SectionTitle color={colors.accent2}>Database Architecture</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          {[
            { db: "PostgreSQL + PostGIS", use: "Users, Orders, Shops, Products, Transactions", color: "#3b82f6" },
            { db: "Redis", use: "Sessions, Inventory Cache, Order Queue, Real-time state", color: "#ef4444" },
            { db: "Elasticsearch", use: "Product search, fuzzy matching, autocomplete", color: "#f59e0b" },
            { db: "MongoDB", use: "Logs, Analytics events, flexible product metadata", color: "#22c55e" },
            { db: "Firebase / Supabase Realtime", use: "Live order tracking, WebSocket messages", color: "#8b5cf6" },
            { db: "S3 / Cloudinary", use: "Product images, shop documents, ID proofs", color: "#06b6d4" },
          ].map((d, i) => (
            <Card key={i} style={{ borderColor: d.color + "44" }}>
              <Tag color={d.color}>{d.db}</Tag>
              <div style={{ color: colors.muted, fontSize: 12, marginTop: 8 }}>{d.use}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── TAB 2: CUSTOMER APP ───────────────────────────
function CustomerApp() {
  const [screen, setScreen] = useState("home");
  const screens = {
    home: {
      title: "🏠 Customer Home Feed",
      content: (
        <div>
          <div style={{ background: "linear-gradient(135deg, #00e5ff22, #a855f722)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
            <div style={{ color: colors.accent, fontWeight: 700, fontSize: 18 }}>📍 Bengaluru, HSR Layout</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              {["🛒 Groceries", "💊 Medicine", "🧴 Personal Care", "🥤 Drinks", "🍔 Snacks"].map(c => (
                <span key={c} style={{ background: "#ffffff15", borderRadius: 20, padding: "6px 14px", fontSize: 13, cursor: "pointer", color: colors.text }}>{c}</span>
              ))}
            </div>
          </div>
          <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 14, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🔍</span>
            <span style={{ color: colors.muted }}>Search for toothpaste, milk, medicines...</span>
          </div>
          <div style={{ color: colors.yellow, fontWeight: 700, marginBottom: 10 }}>⚡ Nearby Shops Open Now</div>
          {[
            { name: "Krishna General Store", dist: "0.4 km", eta: "8 min", rating: 4.8 },
            { name: "Sharma Medical", dist: "0.9 km", eta: "12 min", rating: 4.6 },
            { name: "Daily Fresh Mart", dist: "1.2 km", eta: "15 min", rating: 4.9 },
          ].map(s => (
            <Card key={s.name} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: colors.text, fontWeight: 600 }}>{s.name}</div>
                <div style={{ color: colors.muted, fontSize: 12 }}>📍 {s.dist} · ⏱ {s.eta}</div>
              </div>
              <Tag color={colors.green}>⭐ {s.rating}</Tag>
            </Card>
          ))}
        </div>
      )
    },
    search: {
      title: "🔍 Search Results: 'Toothpaste'",
      content: (
        <div>
          <div style={{ background: colors.accent + "15", border: `1px solid ${colors.accent}44`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ color: colors.accent, fontWeight: 700, fontSize: 14 }}>🧠 AI Found 3 nearby shops with toothpaste in stock</div>
            <div style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>Algorithm scored by: distance + price + availability + delivery time</div>
          </div>
          {[
            { shop: "Krishna General Store", product: "Colgate StrongTeeth 200g", price: 89, dist: 0.4, delivery: 15, total: 104, tag: "BEST VALUE", color: colors.green },
            { shop: "Daily Fresh Mart", product: "Colgate StrongTeeth 200g", price: 92, dist: 1.2, delivery: 30, total: 122, tag: "POPULAR", color: colors.yellow },
            { shop: "City Supermart", product: "Colgate StrongTeeth 200g", price: 85, dist: 4.8, delivery: 65, total: 150, tag: "⚠️ FAR", color: colors.accent2 },
          ].map(r => (
            <Card key={r.shop} style={{ marginBottom: 10, borderColor: r.tag === "BEST VALUE" ? colors.green + "66" : colors.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>
                  <div style={{ color: colors.text, fontWeight: 700 }}>{r.shop}</div>
                  <div style={{ color: colors.muted, fontSize: 12 }}>{r.product}</div>
                </div>
                <Tag color={r.color}>{r.tag}</Tag>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, fontSize: 12 }}>
                <div><span style={{ color: colors.muted }}>Price</span><br /><span style={{ color: colors.text, fontWeight: 700 }}>₹{r.price}</span></div>
                <div><span style={{ color: colors.muted }}>Distance</span><br /><span style={{ color: colors.text, fontWeight: 700 }}>{r.dist} km</span></div>
                <div><span style={{ color: colors.muted }}>Delivery</span><br /><span style={{ color: r.delivery > 40 ? colors.accent2 : colors.green, fontWeight: 700 }}>₹{r.delivery}</span></div>
                <div><span style={{ color: colors.muted }}>Total</span><br /><span style={{ color: colors.accent, fontWeight: 700 }}>₹{r.total}</span></div>
              </div>
              {r.dist > 4 && <div style={{ marginTop: 10, background: colors.accent2 + "22", borderRadius: 8, padding: "8px 12px", color: colors.accent2, fontSize: 12 }}>⚠️ This shop is far from you — delivery will cost more than closer options!</div>}
            </Card>
          ))}
        </div>
      )
    },
    track: {
      title: "📦 Order Tracking — 3-Layer Verification",
      content: (
        <div>
          {[
            { step: 1, label: "Shopkeeper Verified", sublabel: "Krishna Store confirmed your order", status: "done", icon: "🏪" },
            { step: 2, label: "Delivery Partner Assigned", sublabel: "Ravi Kumar accepted — on the way to shop", status: "active", icon: "🛵" },
            { step: 3, label: "Customer Confirmation", sublabel: "You'll receive OTP on delivery", status: "pending", icon: "✅" },
          ].map((v) => (
            <div key={v.step} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                background: v.status === "done" ? colors.green + "33" : v.status === "active" ? colors.accent + "33" : "#ffffff11",
                border: `2px solid ${v.status === "done" ? colors.green : v.status === "active" ? colors.accent : colors.border}`,
                fontSize: 22, flexShrink: 0
              }}>
                {v.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ color: colors.text, fontWeight: 700 }}>{v.label}</span>
                  <Tag color={v.status === "done" ? colors.green : v.status === "active" ? colors.accent : colors.muted}>
                    {v.status === "done" ? "✓ DONE" : v.status === "active" ? "● LIVE" : "PENDING"}
                  </Tag>
                </div>
                <div style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{v.sublabel}</div>
                {v.status === "active" && (
                  <div style={{ background: colors.accent + "11", borderRadius: 10, padding: 12, marginTop: 10 }}>
                    <div style={{ color: colors.accent, fontSize: 13, fontWeight: 700 }}>📍 Live Location</div>
                    <div style={{ height: 80, background: "#00000040", borderRadius: 8, marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", color: colors.muted, fontSize: 13 }}>
                      [Map: 0.8km away · ETA 6 min]
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )
    }
  };
  return (
    <div>
      <SectionTitle>Customer Interface Flow</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {Object.entries(screens).map(([k, v]) => (
          <button key={k} onClick={() => setScreen(k)} style={{
            background: screen === k ? colors.accent : "transparent", color: screen === k ? "#000" : colors.muted,
            border: `1px solid ${screen === k ? colors.accent : colors.border}`, borderRadius: 20, padding: "8px 16px",
            cursor: "pointer", fontWeight: 700, fontSize: 13
          }}>{v.title}</button>
        ))}
      </div>
      {screens[screen].content}
    </div>
  );
}

// ─────────────────────────── TAB 3: SHOPKEEPER APP ───────────────────────────
function ShopkeeperApp() {
  const [screen, setScreen] = useState("register");
  return (
    <div>
      <SectionTitle color={colors.accent2}>Shopkeeper Interface</SectionTitle>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {["register", "dashboard", "inventory", "orders"].map(s => (
          <button key={s} onClick={() => setScreen(s)} style={{
            background: screen === s ? colors.accent2 : "transparent", color: screen === s ? "#fff" : colors.muted,
            border: `1px solid ${screen === s ? colors.accent2 : colors.border}`, borderRadius: 20, padding: "8px 16px",
            cursor: "pointer", fontWeight: 700, fontSize: 13
          }}>
            {s === "register" ? "📝 Register" : s === "dashboard" ? "📊 Dashboard" : s === "inventory" ? "📦 Inventory" : "📋 Orders"}
          </button>
        ))}
      </div>

      {screen === "register" && (
        <div>
          <Card style={{ marginBottom: 12 }}>
            <div style={{ color: colors.accent2, fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Shop Registration Flow</div>
            {["Phone OTP Verification", "Shop Name & Type", "GSTIN / FSSAI License Upload", "Shop GPS Location (Auto-detect or Manual Pin)", "Operating Hours", "Delivery Radius Preference (1-10km)", "Bank Account for Payouts", "Admin Approval (24-48hrs)"].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "center" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: colors.accent2 + "33", border: `1px solid ${colors.accent2}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: colors.accent2, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ color: colors.text, fontSize: 14 }}>{step}</div>
              </div>
            ))}
          </Card>
          <CodeBlock code={`// Shopkeeper Registration API
POST /api/shopkeeper/register
{
  "phone": "+91XXXXXXXXXX",
  "shop_name": "Krishna General Store",
  "shop_type": "grocery", // grocery|medical|electronics|general
  "gstin": "29ABCDE1234F1Z5",
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "address": "HSR Layout, Bengaluru",
  "radius_km": 3,
  "hours": { "open": "07:00", "close": "22:00" },
  "bank_account": { "ifsc": "HDFC0001234", "account": "XXXXXX" }
}

Response:
{
  "shop_id": "SHP_2024_001",
  "status": "pending_verification",
  "message": "We'll verify your docs within 24 hours"
}`} />
        </div>
      )}

      {screen === "dashboard" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "Today's Orders", value: "24", color: colors.accent },
              { label: "Revenue Today", value: "₹4,820", color: colors.green },
              { label: "Pending Requests", value: "3", color: colors.yellow },
              { label: "Out of Stock Items", value: "7", color: colors.accent2 },
            ].map(m => (
              <Card key={m.label} style={{ textAlign: "center", borderColor: m.color + "44" }}>
                <div style={{ color: m.color, fontSize: 26, fontWeight: 800 }}>{m.value}</div>
                <div style={{ color: colors.muted, fontSize: 12, marginTop: 4 }}>{m.label}</div>
              </Card>
            ))}
          </div>
          <Card>
            <div style={{ color: colors.yellow, fontWeight: 700, marginBottom: 12 }}>⚡ New Order Request (60s to accept)</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: colors.text }}>Colgate 200g × 2 + Dove Soap × 1</div>
                <div style={{ color: colors.muted, fontSize: 12 }}>Customer: 0.6km away · Total: ₹267</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ background: colors.green + "33", color: colors.green, border: `1px solid ${colors.green}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700 }}>✓ Accept</button>
                <button style={{ background: colors.accent2 + "22", color: colors.accent2, border: `1px solid ${colors.accent2}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700 }}>✗ Reject</button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {screen === "inventory" && (
        <div>
          <div style={{ background: colors.accent3 + "15", border: `1px solid ${colors.accent3}33`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ color: colors.accent3, fontWeight: 700 }}>📦 Inventory Management</div>
            <div style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>Shopkeepers register products + set quantity. When stock runs low, auto-alert sent. Extra inventory flag boosts visibility in search!</div>
          </div>
          {[
            { name: "Colgate StrongTeeth 200g", qty: 45, price: 89, status: "high", extra: true },
            { name: "Dove Soap 75g", qty: 12, price: 44, status: "medium", extra: false },
            { name: "Parachute Coconut Oil 500ml", qty: 3, price: 125, status: "low", extra: false },
            { name: "Amul Milk 500ml", qty: 0, price: 27, status: "out", extra: false },
          ].map((item) => (
            <Card key={item.name} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <Tag color={item.status === "high" ? colors.green : item.status === "medium" ? colors.yellow : item.status === "low" ? colors.accent2 : colors.muted}>
                    {item.status === "out" ? "OUT OF STOCK" : `Qty: ${item.qty}`}
                  </Tag>
                  {item.extra && <Tag color={colors.accent}>⚡ EXTRA STOCK</Tag>}
                </div>
              </div>
              <div style={{ color: colors.text, fontWeight: 700 }}>₹{item.price}</div>
            </Card>
          ))}
          <CodeBlock code={`// Inventory Update API
PUT /api/shopkeeper/inventory
{
  "shop_id": "SHP_2024_001",
  "product_id": "PROD_COL_001",
  "quantity": 45,
  "price": 89,
  "has_extra_stock": true  // boosts ranking in search
}`} />
        </div>
      )}

      {screen === "orders" && (
        <div>
          {[
            { id: "#ORD_8821", item: "Toothpaste + Soap", status: "new", customer: "0.4km", amount: 133 },
            { id: "#ORD_8820", item: "Milk × 3 + Bread", status: "packing", customer: "0.9km", amount: 156 },
            { id: "#ORD_8819", item: "Sanitizer × 2", status: "picked", customer: "1.1km", amount: 198 },
          ].map(o => (
            <Card key={o.id} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ color: colors.accent, fontWeight: 700 }}>{o.id}</span>
                    <Tag color={o.status === "new" ? colors.yellow : o.status === "packing" ? colors.accent : colors.green}>
                      {o.status.toUpperCase()}
                    </Tag>
                  </div>
                  <div style={{ color: colors.muted, fontSize: 13, marginTop: 4 }}>{o.item} · Customer {o.customer} away</div>
                </div>
                <div style={{ color: colors.text, fontWeight: 700 }}>₹{o.amount}</div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────── TAB 4: ALGORITHMS ───────────────────────────
function Algorithms() {
  return (
    <div>
      <SectionTitle color={colors.green}>Core Algorithms</SectionTitle>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: colors.green, fontWeight: 700, marginBottom: 8 }}>1. Haversine Distance Algorithm</div>
        <div style={{ color: colors.muted, fontSize: 13, marginBottom: 8 }}>Calculates real-world distance between two GPS coordinates</div>
        <CodeBlock code={`// haversine.js
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // distance in km
}

// Example: User at (12.9716, 77.5946), Shop at (12.9780, 77.5900)
const dist = haversineDistance(12.9716, 77.5946, 12.9780, 77.5900);
// → 0.84 km`} />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: colors.yellow, fontWeight: 700, marginBottom: 8 }}>2. Shop Ranking Score Algorithm</div>
        <div style={{ color: colors.muted, fontSize: 13, marginBottom: 8 }}>Composite score to rank shops for a user&apos;s search</div>
        <CodeBlock code={`// shopRanking.js
function calculateShopScore(shop, user, product) {
  const distance = haversineDistance(
    user.lat, user.lng, shop.lat, shop.lng
  );

  // Score Components (weights tunable)
  const distanceScore   = Math.max(0, 10 - distance * 2);   // closer = higher
  const priceScore      = Math.max(0, 10 - (product.price / 20)); // cheaper = higher
  const availableScore  = product.quantity > 10 ? 10 :
                          product.quantity > 0  ?  5 : 0;   // in stock bonus
  const ratingScore     = shop.rating * 2;                  // 0–10
  const extraStockBonus = product.has_extra_stock ? 3 : 0;  // boost extra stock
  const openBonus       = isShopOpen(shop.hours) ? 5 : -20; // must be open!

  const totalScore = (
    distanceScore   * 0.35 +  // 35% weight
    priceScore      * 0.20 +  // 20% weight
    availableScore  * 0.20 +  // 20% weight
    ratingScore     * 0.15 +  // 15% weight
    extraStockBonus * 0.05 +
    openBonus       * 0.05
  );

  return { shop, distance, totalScore };
}

// Sort and return top N shops
function getTopShops(shops, user, product, topN = 5) {
  return shops
    .map(s => calculateShopScore(s, user, product))
    .filter(s => s.distance <= user.maxRadius) // within radius
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, topN);
}`} />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: colors.accent, fontWeight: 700, marginBottom: 8 }}>3. Dynamic Delivery Pricing</div>
        <CodeBlock code={`// deliveryPricing.js
function calculateDeliveryCharge(distanceKm, orderValue, timeOfDay) {
  const BASE_FEE       = 15;   // ₹ base
  const PER_KM_RATE    = 8;    // ₹ per km
  const PLATFORM_FEE   = 0.05; // 5% of order value
  const PEAK_MULTIPLIER = isPeakHour(timeOfDay) ? 1.3 : 1.0;

  const deliveryCharge = (BASE_FEE + (distanceKm * PER_KM_RATE))
                         * PEAK_MULTIPLIER;
  const platformFee    = orderValue * PLATFORM_FEE;

  const WARNING_DISTANCE = 3; // km threshold for "too far" warning
  const isFarWarning    = distanceKm > WARNING_DISTANCE;

  return {
    deliveryCharge: Math.round(deliveryCharge),
    platformFee:    Math.round(platformFee),
    total:          Math.round(deliveryCharge + platformFee),
    isFarWarning,
    warningMsg: isFarWarning
      ? \`⚠️ This shop is \${distanceKm}km away — delivery will be ₹\${Math.round(deliveryCharge)}. A closer shop could save you ₹\${Math.round(deliveryCharge - BASE_FEE)}!\`
      : null
  };
}

function isPeakHour(timeOfDay) {
  const hour = new Date(timeOfDay).getHours();
  return (hour >= 8 && hour <= 10) || (hour >= 18 && hour <= 21);
}`} />
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ color: colors.accent3, fontWeight: 700, marginBottom: 8 }}>4. Real-Time Inventory Matching (Redis)</div>
        <CodeBlock code={`// inventoryMatch.js (Node.js + Redis)
const redis = require('redis');
const client = redis.createClient();

// When shopkeeper updates stock
async function updateInventory(shopId, productId, quantity) {
  const key = \`inventory:\${shopId}:\${productId}\`;
  await client.set(key, quantity);
  await client.expire(key, 3600); // TTL 1 hour, refresh on activity

  // Also update sorted set for fast range queries
  await client.zadd(\`shop_stock:\${productId}\`, quantity, shopId);
}

// When customer searches - get shops with stock
async function getShopsWithStock(productId, minQuantity = 1) {
  // Returns shop IDs with stock >= minQuantity, sorted by stock level
  const shops = await client.zrangebyscore(
    \`shop_stock:\${productId}\`,
    minQuantity, '+inf',
    'WITHSCORES'
  );
  return shops; // fast, ~1ms lookup
}

// Check single shop stock
async function checkStock(shopId, productId) {
  const qty = await client.get(\`inventory:\${shopId}:\${productId}\`);
  return parseInt(qty) || 0;
}`} />
      </Card>

      <Card>
        <div style={{ color: colors.accent2, fontWeight: 700, marginBottom: 8 }}>5. PostGIS Geospatial Query (PostgreSQL)</div>
        <CodeBlock code={`-- Find all shops within 5km of user location
SELECT
  s.shop_id,
  s.shop_name,
  s.rating,
  ST_Distance(
    s.location::geography,
    ST_MakePoint(77.5946, 12.9716)::geography  -- user lng, lat
  ) / 1000.0 AS distance_km,
  ST_AsGeoJSON(s.location) AS coords
FROM shops s
WHERE
  s.is_active = true AND
  s.is_verified = true AND
  ST_DWithin(
    s.location::geography,
    ST_MakePoint(77.5946, 12.9716)::geography,
    5000  -- 5km in meters
  )
ORDER BY distance_km ASC;

-- Index required for performance
CREATE INDEX shops_location_idx ON shops USING GIST(location);`} />
      </Card>
    </div>
  );
}

// ─────────────────────────── TAB 5: BACKEND APIS ───────────────────────────
function BackendAPIs() {
  return (
    <div>
      <SectionTitle color={colors.accent3}>Backend API Reference (Node.js + Express)</SectionTitle>
      <CodeBlock code={`// server.js — Main Express App
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json());
app.use('/api/auth',        require('./routes/auth'));
app.use('/api/customer',    require('./routes/customer'));
app.use('/api/shopkeeper',  require('./routes/shopkeeper'));
app.use('/api/orders',      require('./routes/orders'));
app.use('/api/delivery',    require('./routes/delivery'));
app.use('/api/search',      require('./routes/search'));

// WebSocket — Real-time order tracking
io.on('connection', (socket) => {
  socket.on('join_order', (orderId) => socket.join(\`order_\${orderId}\`));
  socket.on('location_update', ({ orderId, lat, lng }) => {
    io.to(\`order_\${orderId}\`).emit('driver_location', { lat, lng });
  });
});

http.listen(3000);`} />

      <CodeBlock code={`// routes/search.js
const router = require('express').Router();
const { getTopShops } = require('../algorithms/shopRanking');
const { getShopsWithStock } = require('../algorithms/inventoryMatch');
const elasticClient = require('../config/elasticsearch');

router.post('/products', async (req, res) => {
  const { query, userLat, userLng, maxRadius = 5 } = req.body;

  // 1. Elasticsearch fuzzy search for product
  const esResult = await elasticClient.search({
    index: 'products',
    body: {
      query: {
        multi_match: {
          query,
          fields: ['name^3', 'brand^2', 'category', 'tags'],
          fuzziness: 'AUTO'
        }
      }
    }
  });

  const productIds = esResult.hits.hits.map(h => h._id);

  // 2. Get shops with stock for these products
  const shopIdsWithStock = await getShopsWithStock(productIds[0]);

  // 3. Get shops within radius using PostGIS
  const nearbyShops = await db.query(\`
    SELECT s.*, p.price, p.quantity
    FROM shops s
    JOIN inventory i ON s.shop_id = i.shop_id
    JOIN products p ON i.product_id = p.product_id
    WHERE p.product_id = $1
    AND s.shop_id = ANY($2)
    AND ST_DWithin(s.location::geography,
        ST_MakePoint($3, $4)::geography, $5 * 1000)
  \`, [productIds[0], shopIdsWithStock, userLng, userLat, maxRadius]);

  // 4. Rank shops
  const rankedShops = getTopShops(
    nearbyShops.rows,
    { lat: userLat, lng: userLng, maxRadius },
    nearbyShops.rows[0],
    5
  );

  res.json({ products: productIds, shops: rankedShops });
});`} />

      <CodeBlock code={`// routes/orders.js
router.post('/create', authenticate, async (req, res) => {
  const { shopId, items, userLat, userLng } = req.body;

  const order = await db.query(\`
    INSERT INTO orders (customer_id, shop_id, items, status, created_at)
    VALUES ($1, $2, $3, 'pending', NOW())
    RETURNING order_id
  \`, [req.user.id, shopId, JSON.stringify(items)]);

  const orderId = order.rows[0].order_id;

  // Notify shopkeeper via WebSocket + Push Notification
  io.to(\`shop_\${shopId}\`).emit('new_order', { orderId, items });
  await sendPushNotification(shopId, 'New Order!', \`Order #\${orderId} received\`);

  // Set 60s timeout for auto-reject if shop doesn't respond
  setTimeout(async () => {
    const current = await getOrderStatus(orderId);
    if (current === 'pending') {
      await updateOrderStatus(orderId, 'auto_rejected');
      io.to(\`order_\${orderId}\`).emit('order_rejected', { reason: 'Shop timeout' });
      // Try next best shop automatically
      await reassignToNextShop(orderId);
    }
  }, 60000);

  res.json({ orderId, status: 'pending' });
});

// 3-layer verification
router.post('/:orderId/verify', authenticate, async (req, res) => {
  const { role, otp } = req.body; // role: shopkeeper | delivery | customer

  const verificationMap = {
    shopkeeper: 'shop_verified',
    delivery:   'delivery_verified',
    customer:   'customer_verified'
  };

  await db.query(
    \`UPDATE orders SET \${verificationMap[role]} = true WHERE order_id = $1\`,
    [req.params.orderId]
  );

  // Check if all 3 verified
  const order = await getOrder(req.params.orderId);
  if (order.shop_verified && order.delivery_verified && order.customer_verified) {
    await updateOrderStatus(req.params.orderId, 'completed');
    io.to(\`order_\${req.params.orderId}\`).emit('order_complete');
  }

  res.json({ success: true });
});`} />

      <CodeBlock code={`// Full PostgreSQL Schema
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE users (
  user_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         VARCHAR(15) UNIQUE NOT NULL,
  role          VARCHAR(20) NOT NULL, -- customer | shopkeeper | delivery
  name          VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE shops (
  shop_id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      UUID REFERENCES users(user_id),
  shop_name     VARCHAR(200) NOT NULL,
  shop_type     VARCHAR(50),
  location      GEOMETRY(POINT, 4326),  -- PostGIS point
  address       TEXT,
  radius_km     FLOAT DEFAULT 3,
  rating        FLOAT DEFAULT 5.0,
  is_active     BOOLEAN DEFAULT false,
  is_verified   BOOLEAN DEFAULT false,
  hours_open    TIME, hours_close TIME,
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE TABLE products (
  product_id    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(200) NOT NULL,
  brand         VARCHAR(100),
  category      VARCHAR(100),
  barcode       VARCHAR(50),
  image_url     TEXT
);

CREATE TABLE inventory (
  shop_id       UUID REFERENCES shops(shop_id),
  product_id    UUID REFERENCES products(product_id),
  quantity      INT DEFAULT 0,
  price         DECIMAL(10,2),
  has_extra_stock BOOLEAN DEFAULT false,
  updated_at    TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (shop_id, product_id)
);

CREATE TABLE orders (
  order_id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id   UUID REFERENCES users(user_id),
  shop_id       UUID REFERENCES shops(shop_id),
  delivery_id   UUID REFERENCES users(user_id),
  items         JSONB,
  status        VARCHAR(30) DEFAULT 'pending',
  shop_verified     BOOLEAN DEFAULT false,
  delivery_verified BOOLEAN DEFAULT false,
  customer_verified BOOLEAN DEFAULT false,
  delivery_otp  VARCHAR(6),
  total_amount  DECIMAL(10,2),
  delivery_charge DECIMAL(10,2),
  created_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX shops_location_idx ON shops USING GIST(location);
CREATE INDEX orders_customer_idx ON orders(customer_id);
CREATE INDEX orders_shop_idx     ON orders(shop_id);`} />
    </div>
  );
}

// ─────────────────────────── TAB 6: LLM PROMPTS ───────────────────────────
function LLMPrompts() {
  const prompts = [
    {
      title: "System Prompt — Product Search Intelligence",
      color: colors.accent,
      prompt: `You are the search intelligence engine for Antigravity, a hyperlocal delivery platform.

ROLE: Parse user search queries and return structured product search data.

TASK: When a user searches for something, you must:
1. Identify the exact product (normalize names, handle typos)
2. Detect brand preferences if mentioned
3. Suggest alternative products if out of stock
4. Understand quantity hints ("get me some milk" = 1L or 500ml)
5. Detect urgency ("urgent", "emergency" = prioritize nearest)

OUTPUT FORMAT (JSON only):
{
  "normalized_query": "colgate toothpaste",
  "category": "personal_care",
  "brand": "Colgate",
  "alternatives": ["Pepsodent", "Sensodyne"],
  "quantity_hint": 1,
  "is_urgent": false,
  "search_tags": ["toothpaste", "dental care", "paste"]
}

Always return valid JSON. Never add explanations outside JSON.`
    },
    {
      title: "Delivery Cost Explanation Prompt",
      color: colors.yellow,
      prompt: `You are the pricing assistant for Antigravity delivery app.

When given delivery data, explain the cost breakdown to the customer in a friendly, conversational way.

INPUT: { distance_km, delivery_charge, platform_fee, total, nearest_shop_distance }

RULES:
- Be honest if this shop is far (> 3km) — suggest closer option
- Always explain WHY the price is what it is
- Use friendly tone, no jargon
- If there's a closer shop, clearly say how much they'd save
- Keep response under 3 sentences

Example output:
"The delivery charge is ₹42 because this shop is 4.2km away. The closest shop is only 0.8km and would cost just ₹18 to deliver — saving you ₹24! Want to switch?"`
    },
    {
      title: "Shopkeeper Notification Generator",
      color: colors.accent2,
      prompt: `You are the notification engine for Antigravity shopkeeper app.

Generate push notification messages for shopkeepers based on events.

EVENTS and their message style:
- new_order: Urgent, action-required tone. Include order value and item count.
- low_stock: Helpful warning tone. Include item name and quantity.
- payment_received: Celebratory. Include amount.
- rating_received: Appreciative if positive, constructive if negative.
- order_cancelled: Neutral, informative.

OUTPUT FORMAT:
{
  "title": "short title (max 40 chars)",
  "body": "notification body (max 100 chars)",
  "action": "accept_order | update_stock | view_payment | null"
}

Always in JSON. Be concise — these are mobile notifications.`
    },
    {
      title: "Smart Reorder Suggestion Prompt",
      color: colors.green,
      prompt: `You are the inventory intelligence for Antigravity.

Analyze a shopkeeper's sales history and current inventory to suggest restocking.

INPUT: { sales_last_7_days: [...], current_inventory: [...], day_of_week }

TASK:
1. Identify items selling faster than average
2. Predict items that will run out in < 2 days
3. Suggest optimal reorder quantities based on sales velocity
4. Flag items that haven't sold in 7 days (consider removing)
5. Suggest trending items in the area (if data available)

OUTPUT FORMAT:
{
  "urgent_restock": [{ "product": "", "current_qty": 0, "suggested_order": 0 }],
  "upcoming_shortage": [...],
  "slow_movers": [...],
  "trending_suggestions": [...]
}

JSON only. Be data-driven and specific with quantities.`
    },
    {
      title: "Antigravity — Master System Prompt",
      color: colors.accent3,
      prompt: `You are the AI brain of Antigravity — India's fastest hyperlocal delivery platform.

PLATFORM CONTEXT:
- Connects customers with nearby shopkeepers for 10-30 min delivery
- Operates in Tier 1 and Tier 2 Indian cities
- Three roles: Customer, Shopkeeper, Delivery Partner
- Real-time inventory, geolocation-based matching

YOUR CAPABILITIES:
1. Product search & normalization (handle Hindi/English, brand names, generics)
2. Explain delivery pricing transparently
3. Guide customers to best value options
4. Help shopkeepers manage inventory and orders
5. Resolve order disputes with empathy and fairness
6. Generate reports and insights for shop owners

TONE: Helpful, fast, no-nonsense. Like a smart local store assistant who knows everything.

CONSTRAINTS:
- Never reveal internal pricing algorithms
- Always prioritize user safety and satisfaction
- For medical products, always suggest consulting a doctor
- Never confirm delivery times — always say "estimated"
- If a product isn't available nearby, suggest the next best alternative

You have access to: user location, nearby shops, real-time inventory, order history, and pricing engine.`
    }
  ];

  return (
    <div>
      <SectionTitle color={colors.accent3}>🤖 LLM Prompts for Antigravity</SectionTitle>
      {prompts.map((p, i) => (
        <Card key={i} style={{ marginBottom: 16, borderColor: p.color + "44" }}>
          <div style={{ color: p.color, fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{p.title}</div>
          <pre style={{
            background: "#050508", border: `1px solid ${p.color}33`, borderRadius: 10,
            padding: 16, fontSize: 12, lineHeight: 1.8, color: "#c8d8f0",
            fontFamily: "'Fira Code', monospace", whiteSpace: "pre-wrap", margin: 0
          }}>{p.prompt}</pre>
        </Card>
      ))}
    </div>
  );
}

// ─────────────────────────── TAB 7: FULL STACK CODE ───────────────────────────
function FullStackCode() {
  return (
    <div>
      <SectionTitle color={colors.accent2}>📦 Full Stack Setup — Copy & Deploy</SectionTitle>

      <Card style={{ marginBottom: 16, borderColor: colors.green + "44" }}>
        <div style={{ color: colors.green, fontWeight: 700, marginBottom: 10 }}>Tech Stack for Antigravity</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {[
            { layer: "Frontend (Customer)", tech: "React Native / Next.js", color: "#60a5fa" },
            { layer: "Frontend (Shopkeeper)", tech: "React Native / React PWA", color: "#34d399" },
            { layer: "Backend API", tech: "Node.js + Express", color: colors.yellow },
            { layer: "Real-time", tech: "Socket.io / Supabase Realtime", color: colors.accent },
            { layer: "Primary DB", tech: "PostgreSQL + PostGIS", color: "#818cf8" },
            { layer: "Cache / Queue", tech: "Redis", color: "#f87171" },
            { layer: "Search", tech: "Elasticsearch / Typesense", color: colors.accent2 },
            { layer: "Maps", tech: "Google Maps API / Mapbox", color: colors.green },
            { layer: "Auth", tech: "Firebase Auth / Twilio OTP", color: "#e879f9" },
            { layer: "Payments", tech: "Razorpay / Stripe India", color: "#fbbf24" },
            { layer: "Push Notifications", tech: "Firebase Cloud Messaging", color: "#f97316" },
            { layer: "AI/LLM", tech: "Claude API / OpenAI GPT-4o", color: colors.accent3 },
          ].map(s => (
            <div key={s.layer} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff08", borderRadius: 8, padding: "8px 12px" }}>
              <span style={{ color: colors.muted, fontSize: 13 }}>{s.layer}</span>
              <Tag color={s.color}>{s.tech}</Tag>
            </div>
          ))}
        </div>
      </Card>

      <CodeBlock code={`# Project Structure
antigravity/
├── backend/
│   ├── server.js
│   ├── config/
│   │   ├── database.js      # PostgreSQL + PostGIS
│   │   ├── redis.js         # Redis client
│   │   └── elasticsearch.js # Search engine
│   ├── routes/
│   │   ├── auth.js          # OTP login
│   │   ├── customer.js      # Customer endpoints
│   │   ├── shopkeeper.js    # Shop management
│   │   ├── orders.js        # Order lifecycle
│   │   ├── search.js        # Product search
│   │   └── delivery.js      # Delivery partner
│   ├── algorithms/
│   │   ├── haversine.js     # Distance calc
│   │   ├── shopRanking.js   # Shop scoring
│   │   ├── deliveryPricing.js
│   │   └── inventoryMatch.js
│   ├── middleware/
│   │   ├── authenticate.js  # JWT middleware
│   │   └── rateLimiter.js
│   └── models/
│       ├── User.js
│       ├── Shop.js
│       ├── Order.js
│       └── Inventory.js
├── frontend-customer/       # Next.js / React Native
├── frontend-shopkeeper/     # React PWA
├── frontend-delivery/       # React Native
└── docker-compose.yml`} />

      <CodeBlock code={`# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgis/postgis:15-3.3
    environment:
      POSTGRES_DB: antigravity
      POSTGRES_PASSWORD: secret
    ports: ["5432:5432"]
    volumes: ["postgres_data:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]

  elasticsearch:
    image: elasticsearch:8.8.0
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
    ports: ["9200:9200"]

  backend:
    build: ./backend
    ports: ["3000:3000"]
    environment:
      DATABASE_URL: postgres://postgres:secret@postgres:5432/antigravity
      REDIS_URL: redis://redis:6379
      ELASTICSEARCH_URL: http://elasticsearch:9200
      JWT_SECRET: your_jwt_secret_here
      GOOGLE_MAPS_KEY: your_google_maps_key
      RAZORPAY_KEY: your_razorpay_key
      CLAUDE_API_KEY: your_claude_api_key
    depends_on: [postgres, redis, elasticsearch]

volumes:
  postgres_data:`} />

      <CodeBlock code={`# package.json (backend)
{
  "name": "antigravity-backend",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "socket.io": "^4.6.1",
    "pg": "^8.11.0",
    "redis": "^4.6.7",
    "@elastic/elasticsearch": "^8.8.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "twilio": "^4.14.0",
    "razorpay": "^2.9.0",
    "firebase-admin": "^11.10.1",
    "@anthropic-ai/sdk": "^0.24.0",
    "axios": "^1.4.0",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.0"
  }
}`} />

      <div style={{ background: colors.accent + "15", border: `1px solid ${colors.accent}44`, borderRadius: 14, padding: 20, marginTop: 16 }}>
        <div style={{ color: colors.accent, fontWeight: 800, fontSize: 18, marginBottom: 12 }}>🚀 Deploy to Production</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          {[
            { step: "1", title: "Infrastructure", items: ["AWS EC2 / Railway.app", "RDS for PostgreSQL", "ElastiCache for Redis", "Elastic Cloud for ES"] },
            { step: "2", title: "APIs to Get", items: ["Google Maps Platform", "Twilio (OTP SMS)", "Razorpay (Payments)", "Firebase (Auth + Push)", "Claude / OpenAI (LLM)"] },
            { step: "3", title: "Go Live Checklist", items: ["SSL certificate", "Load balancer", "Rate limiting", "Error monitoring (Sentry)", "Analytics (Mixpanel)"] }
          ].map(s => (
            <Card key={s.step} style={{ borderColor: colors.accent + "33" }}>
              <div style={{ color: colors.accent, fontWeight: 700, marginBottom: 8 }}>Step {s.step}: {s.title}</div>
              {s.items.map(item => <div key={item} style={{ color: colors.muted, fontSize: 12, padding: "2px 0" }}>→ {item}</div>)}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────── MAIN APP ───────────────────────────
export default function AntigravityBlueprint() {
  const [activeTab, setActiveTab] = useState(0);
  const tabComponents = [SystemFlow, CustomerApp, ShopkeeperApp, Algorithms, BackendAPIs, LLMPrompts, FullStackCode];
  const ActiveComponent = tabComponents[activeTab];

  return (
    <div style={{ background: colors.bg, minHeight: "100vh", fontFamily: "'Segoe UI', system-ui, sans-serif", color: colors.text }}>
      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #00e5ff15 0%, #a855f715 50%, #ff6b3515 100%)", borderBottom: `1px solid ${colors.border}`, padding: "20px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 6 }}>
            <span style={{ fontSize: 36 }}>⚡</span>
            <div>
              <h1 style={{ margin: 0, fontSize: 28, fontWeight: 900, background: "linear-gradient(90deg, #00e5ff, #a855f7, #ff6b35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                ANTIGRAVITY PLATFORM
              </h1>
              <div style={{ color: colors.muted, fontSize: 13, marginTop: 2 }}>
                Complete Hyperlocal Delivery System — Blinkit/Zepto Style · Full Stack + Algorithms + LLM Prompts
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
            {["Node.js", "PostgreSQL+PostGIS", "Redis", "Elasticsearch", "Socket.io", "React Native", "Claude API"].map(t => (
              <Tag key={t} color={colors.accent}>{t}</Tag>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "0 24px", overflowX: "auto" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4 }}>
          {tabs.map((tab, i) => (
            <button key={i} onClick={() => setActiveTab(i)} style={{
              background: "transparent", border: "none", borderBottom: `3px solid ${activeTab === i ? colors.accent : "transparent"}`,
              color: activeTab === i ? colors.accent : colors.muted, padding: "14px 16px",
              cursor: "pointer", fontWeight: activeTab === i ? 700 : 400, fontSize: 13,
              whiteSpace: "nowrap", transition: "all 0.2s"
            }}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
