"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

const Tag = ({ color, children }: { color: string; children: React.ReactNode }) => (
  <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 10px", fontSize: 12, fontFamily: "monospace", fontWeight: 700 }}>
    {children}
  </span>
);

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: any }) => (
  <div style={{ background: colors.card, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 20, ...style }}>
    {children}
  </div>
);

const CodeBlock = ({ code, lang = "js" }: { code: string; lang?: string }) => (
  <pre style={{
    background: "#070710", border: `1px solid ${colors.border}`, borderRadius: 12,
    padding: 20, overflowX: "auto", fontSize: 12, lineHeight: 1.7,
    color: "#a8d8ff", fontFamily: "'Fira Code', 'Courier New', monospace", margin: "12px 0"
  }}>
    <code>{code}</code>
  </pre>
);

const SectionTitle = ({ children, color = colors.accent2 }: { children: React.ReactNode; color?: string }) => (
  <h2 style={{ color, fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 800, margin: "0 0 16px", letterSpacing: -0.5 }}>
    {children}
  </h2>
);

export default function DunkandarApp() {
  const [screen, setScreen] = useState("register");
  
  const [orders, setOrders] = useState<any[]>([
    { id: "#ORD_8821", item: "Toothpaste + Soap", status: "new", customer: "0.4km", amount: 133 },
    { id: "#ORD_8820", item: "Milk × 3 + Bread", status: "packing", customer: "0.9km", amount: 156 },
    { id: "#ORD_8819", item: "Sanitizer × 2", status: "picked", customer: "1.1km", amount: 198 },
  ]);
  const [newOrderAlert, setNewOrderAlert] = useState<any>(null);

  useEffect(() => {
    const handleStorage = () => {
      const newOrderStr = localStorage.getItem('casano_new_order');
      if (newOrderStr) {
        try {
          const parsed = JSON.parse(newOrderStr);
          setOrders(prev => {
            if (prev.find(o => o.id === parsed.id)) return prev;
            return [parsed, ...prev];
          });
          setNewOrderAlert(parsed);
          setScreen("dashboard");
          localStorage.removeItem('casano_new_order');
        } catch (e) {}
      }
    };
    
    handleStorage();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] font-sans selection:bg-[#ff6b35]/30">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div style={{ background: colors.bg, minHeight: "80vh", padding: "20px" }}>
          <SectionTitle color={colors.accent2}>Shopkeeper Interface (Dunkandar)</SectionTitle>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["register", "dashboard", "inventory", "orders"].map(s => (
              <button key={s} onClick={() => setScreen(s)} style={{
                background: screen === s ? colors.accent2 : "transparent", color: screen === s ? "#fff" : colors.muted,
                border: `1px solid ${screen === s ? colors.accent2 : colors.border}`, borderRadius: 20, padding: "8px 16px",
                cursor: "pointer", fontWeight: 700, fontSize: 13, transition: "all 0.2s"
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
              {newOrderAlert && (
                <Card>
                  <div style={{ color: colors.yellow, fontWeight: 700, marginBottom: 12 }}>⚡ New Order Request (60s to accept)</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                    <div>
                      <div style={{ color: colors.text }}>{newOrderAlert.item}</div>
                      <div style={{ color: colors.muted, fontSize: 12 }}>Customer: {newOrderAlert.customer} away · Total: ₹{newOrderAlert.amount}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button 
                        onClick={() => setNewOrderAlert(null)}
                        style={{ background: colors.green + "33", color: colors.green, border: `1px solid ${colors.green}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = colors.green + "44"} onMouseOut={e => e.currentTarget.style.background = colors.green + "33"}>✓ Accept</button>
                      <button 
                        onClick={() => setNewOrderAlert(null)}
                        style={{ background: colors.accent2 + "22", color: colors.accent2, border: `1px solid ${colors.accent2}`, borderRadius: 8, padding: "8px 16px", cursor: "pointer", fontWeight: 700, transition: "background 0.2s" }} onMouseOver={e => e.currentTarget.style.background = colors.accent2 + "33"} onMouseOut={e => e.currentTarget.style.background = colors.accent2 + "22"}>✗ Reject</button>
                    </div>
                  </div>
                </Card>
              )}
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
              ].map(item => (
                <Card key={item.name} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                  <div>
                    <div style={{ color: colors.text, fontSize: 14, fontWeight: 600 }}>{item.name}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
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
              {orders.map(o => (
                <Card key={o.id} style={{ marginBottom: 10 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
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
      </main>

      <Footer />
    </div>
  );
}
