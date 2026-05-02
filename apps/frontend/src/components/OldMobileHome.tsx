'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ChevronDown, Clock, ShoppingCart, Home, List,
  History, ArrowRight, X, LocateFixed, CheckCircle, CreditCard,
  Wallet, User, Phone, Package, Headphones, LogOut, ArrowLeft,
  Heart, Shield, Zap, Star, Tag, ChevronRight, Gift, RefreshCw, Truck, BadgeCheck
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';
import ThemeToggle from './ThemeToggle';
import MobileHomeSkeleton from './ui/SkeletonLoader';
import UnicornScene from "unicornstudio-react";

const SEARCH_HINTS = [
  'Search "milk"', 'Search "bread"', 'Search "medicines"',
  'Search "pens"', 'Search "eggs"', 'Search "rice"',
];

const DEALS = [
  { label: 'Flat 30% Off', desc: 'On Premium Groceries', tag: 'CASANO30', color: '#C1492E', bg: 'linear-gradient(135deg, #C1492E, #a03a22)', validity: 'Valid till midnight' },
  { label: 'Under ₹99', desc: 'Daily Essentials', tag: 'STEAL DEAL', color: '#B8962E', bg: 'linear-gradient(135deg, #B8962E, #8A701F)', validity: 'Limited stock' },
  { label: 'Buy 1 Get 1', desc: 'Beverages & Snacks', tag: 'BOGO', color: '#214A36', bg: 'linear-gradient(135deg, #214A36, #163224)', validity: 'Ends in 2h 45m' },
];

const CATEGORIES = [
  { name: 'Groceries', image: '/category_groceries.png', path: '/category/groceries', fallbackColor: '#FAE8E5' },
  { name: 'Fashion', image: '/category_fashion.png', path: '/category/fashion', fallbackColor: '#FBF5E1' },
  { name: 'Gadgets', image: '/category_gadgets.png', path: '/category/gadgets', fallbackColor: '#E2DDD0' },
  { name: 'Stationery', image: '/category_stationery.png', path: '/category/stationary', fallbackColor: '#E6F2EC' },
  { name: 'Gym', image: '/category_gym.png', path: '/category/gym', fallbackColor: '#FAE8E5' },
  { name: 'Pharmacy', image: '/category_pharmacy.png', path: '/category/pharmacy', fallbackColor: '#FBF5E1' },
  { name: 'Dairy', image: '/category_groceries.png', path: '/category/groceries', fallbackColor: '#E2DDD0' },
  { name: 'Bakery', image: '/category_stationery.png', path: '/category/stationary', fallbackColor: '#E6F2EC' },
];

const PRODUCTS = [
  { id: 'mob-1', name: 'Amul Taaza Toned Milk', price: 28, origPrice: 30, weight: '500 ml', image: '/category_groceries.png' },
  { id: 'mob-2', name: 'Nandini Curd Pouch', price: 22, origPrice: 24, weight: '500 g', image: '/category_groceries.png' },
  { id: 'mob-3', name: 'Maggi 2-Min Noodles', price: 14, origPrice: 14, weight: '70 g', image: '/category_stationery.png' },
  { id: 'mob-4', name: 'Farm Fresh Eggs', price: 45, origPrice: 50, weight: '6 pcs', image: '/category_groceries.png' },
];

const MOCK_ORDERS = [
  {
    id: 'ORD-2024-001',
    date: 'Mar 10, 2024',
    items: ['Amul Milk x2', 'Bread x1'],
    total: 82,
    status: 'Delivered',
    statusColor: 'text-[#214A36] bg-[#E6F2EC]',
    images: ['/category_groceries.png', '/category_groceries.png'],
  },
  {
    id: 'ORD-2024-002',
    date: 'Mar 7, 2024',
    items: ['Maggi x3', 'Eggs x1'],
    total: 87,
    status: 'Delivered',
    statusColor: 'text-[#214A36] bg-[#E6F2EC]',
    images: ['/category_stationery.png', '/category_groceries.png'],
  },
  {
    id: 'ORD-2024-003',
    date: 'Feb 28, 2024',
    items: ['Curd x2', 'Pen Set x1'],
    total: 125,
    status: 'Cancelled',
    statusColor: 'text-[#C1492E] bg-[#FAE8E5]',
    images: ['/category_groceries.png', '/category_stationery.png'],
  },
];

type AppState = 'home' | 'checkout' | 'tracking' | 'profile' | 'orders' | 'support';

export default function MobileHome() {
  const [appState, setAppState] = useState<AppState>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchIdx, setSearchIdx] = useState(0);
  const { items, addItem, removeItem, cartTotal, cartCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();

  // Apply dark mode class to <html> only when user explicitly toggles
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  }, []);

  // On mount, ensure dark class matches state (default: light)
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  // Skeleton loading simulation
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  // Rotating search placeholder
  useEffect(() => {
    const t = setInterval(() => setSearchIdx(i => (i + 1) % SEARCH_HINTS.length), 2500);
    return () => clearInterval(t);
  }, []);

  const deliveryFee = 0;
  const handlingFee = 5;
  const finalTotal = cartTotal > 0 ? cartTotal + deliveryFee + handlingFee : 0;

  const handleAdd = (p: typeof PRODUCTS[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, originalPrice: p.origPrice, image: p.image, size: p.weight });
  };
  const handleRemove = (id: string) => removeItem(id);

  if (isLoading) return <MobileHomeSkeleton />;

  return (
    <div className="flex w-full flex-col min-h-screen relative font-sans transition-colors duration-300" style={{ background: "var(--bg-main)", color: "var(--text-primary)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
      {/* Background UnicornScene */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30 mix-blend-screen">
        <UnicornScene
          projectId="18CBccbb02aYYChpjQtO"
          width="100%"
          height="100%"
          scale={1}
          dpi={1.5}
          sdkUrl="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@2.1.11/dist/unicornStudio.umd.js"
        />
      </div>

      {/* ── HOME SCREEN ── */}
      {appState === 'home' && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 flex-1 overflow-y-auto pb-36 hide-scrollbar">

          {/* Header */}
          <div className="sticky top-0 z-40 pb-3 pt-3 px-4 shadow-sm border-b transition-colors" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <div className="flex items-center justify-between mb-3">
              <button className="flex items-center gap-2" onClick={() => {}}>
                <div className="rounded-xl p-2" style={{ background: "rgba(193,73,46,0.1)" }}>
                  <MapPin size={18} style={{ color: "var(--action-primary)" }} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-[15px] leading-none" style={{ fontFamily: "var(--font-heading)" }}>Delivery in 15 mins</span>
                    <ChevronDown size={14} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <p className="text-xs mt-0.5 truncate max-w-[190px] font-medium" style={{ color: "var(--text-secondary)" }}>
                    {user?.address || 'Select your location'}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2" style={{ transform: 'scale(0.7)', transformOrigin: 'center right' }}>
                <ThemeToggle isDarkMode={isDarkMode} toggle={toggleDarkMode} />
              </div>
            </div>

            {/* Search with rotating placeholder */}
            <button
              className="w-full rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-colors border"
              style={{ background: "var(--bg-main)", borderColor: "var(--surface-border)" }}
              onClick={() => window.location.href = '/products'}
            >
              <Search size={18} style={{ color: "var(--text-muted)" }} className="flex-shrink-0" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={searchIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-sm font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {SEARCH_HINTS[searchIdx]}
                </motion.span>
              </AnimatePresence>
            </button>
          </div>

          {/* Promo Banner */}
          <div className="px-4 py-4">
            <div className="flex gap-3 overflow-x-auto hide-scrollbar snap-x pb-2">
              {DEALS.map((deal, idx) => (
                <div key={idx} className="min-w-[280px] max-w-[280px] snap-center rounded-2xl p-5 text-white relative overflow-hidden shadow-md flex-shrink-0" style={{ background: deal.bg }}>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-[10px] font-black opacity-90 uppercase tracking-widest bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">{deal.tag}</p>
                      <div className="flex items-center gap-1 opacity-80">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold">{deal.validity}</span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-black leading-tight mt-1" style={{ fontFamily: "var(--font-heading)" }}>{deal.label}</h3>
                    <p className="text-xs opacity-90 mt-1 font-medium">{deal.desc}</p>
                    <button
                      onClick={() => window.location.href = '/category/groceries'}
                      className="mt-4 text-[#2A2B2A] bg-white text-[11px] font-black px-4 py-2.5 rounded-xl transition-transform hover:scale-105 shadow-sm"
                    >
                      Shop Now
                    </button>
                  </div>
                  {/* Decorative orbs */}
                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                  <div className="absolute -right-2 top-2 w-16 h-16 bg-white/10 rounded-full blur-md" />
                  <div className="absolute left-10 -bottom-10 w-24 h-24 bg-black/10 rounded-full blur-xl" />
                </div>
              ))}
            </div>
          </div>

          {/* Trust Badges */}
          <div className="px-4 mb-4 flex gap-2 overflow-x-auto hide-scrollbar snap-x pb-2">
            {[
              { icon: Truck, text: 'Free Delivery', sub: 'Above ₹99', color: '#B8962E', bgLight: 'rgba(184,150,46,0.1)' },
              { icon: Zap, text: '15 Min', sub: 'VIP Delivery', color: '#214A36', bgLight: 'rgba(33,74,54,0.1)' },
              { icon: Shield, text: '100% Secure', sub: 'Payments', color: '#7C3AED', bgLight: 'rgba(124,58,237,0.1)' },
            ].map((b, i) => (
              <motion.div whileTap={{ scale: 0.95 }} key={i} className="flex-1 min-w-[115px] snap-center flex items-center gap-2.5 rounded-2xl px-3 py-3 border shadow-sm" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: b.bgLight }}>
                  <b.icon size={16} style={{ color: b.color }} />
                </div>
                <div>
                  <p className="text-[11px] font-black leading-tight tracking-tight whitespace-nowrap">{b.text}</p>
                  <p className="text-[9px] font-bold mt-0.5 opacity-80 whitespace-nowrap" style={{ color: b.color }}>{b.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Categories Grid */}
          <div className="px-4 mb-6">
            <h2 className="text-[17px] font-black tracking-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>Shop by Category</h2>
            <div className="grid grid-cols-4 gap-3">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  className="flex flex-col items-center gap-2"
                  onClick={() => window.location.href = cat.path}
                >
                  <div className="w-[68px] h-[68px] rounded-2xl overflow-hidden border flex items-center justify-center" style={{ background: cat.fallbackColor, borderColor: "var(--surface-border)" }}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e: any) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-center leading-tight w-[68px] truncate" style={{ color: "var(--text-secondary)" }}>{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="py-5 border-t" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <div className="px-4 flex justify-between items-center mb-4">
              <h2 className="text-[17px] font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Popular Items</h2>
              <button className="text-sm font-bold" style={{ color: "var(--action-primary)" }} onClick={() => window.location.href = '/products'}>See All</button>
            </div>
            <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar snap-x pb-2">
              {PRODUCTS.map((p: any) => {
                const cartItem = items.find(i => i.id === p.id);
                const qty = cartItem?.quantity || 0;
                return (
                  <div
                    key={p.id}
                    className="min-w-[145px] max-w-[145px] rounded-2xl p-3 border shadow-sm flex flex-col snap-start flex-shrink-0"
                    style={{ background: "var(--bg-main)", borderColor: "var(--surface-border)" }}
                  >
                    <div className="relative mb-3">
                      <div className="w-full aspect-square rounded-xl overflow-hidden border" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-1.5 left-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-1 border border-[#B8962E33]">
                        <Clock size={9} style={{ color: "#B8962E" }} />
                        <span className="text-[9px] font-black" style={{ color: "#B8962E" }}>15 MIN</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xs leading-snug line-clamp-2 mb-1" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                    <p className="text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>{p.weight}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <div>
                        <p className="font-black text-sm raj-price">₹{p.price}</p>
                        {p.origPrice > p.price && <p className="text-[10px] line-through" style={{ color: "var(--text-muted)" }}>₹{p.origPrice}</p>}
                      </div>
                      {qty === 0 ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdd(p)}
                          className="border px-3 py-1.5 rounded-lg text-xs font-bold"
                          style={{ color: "var(--action-primary)", borderColor: "var(--action-primary)", background: "transparent" }}
                        >
                          ADD
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-black text-white" style={{ background: "var(--action-primary)" }}>
                          <button onClick={() => handleRemove(p.id)} className="w-4 text-center font-black">−</button>
                          <span className="w-4 text-center">{qty}</span>
                          <button onClick={() => handleAdd(p)} className="w-4 text-center font-black">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Reorder Section */}
          <div className="py-5 border-t" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <div className="px-4 flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <RefreshCw size={16} style={{ color: "var(--action-primary)" }} />
                <h2 className="text-[17px] font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>Buy it again</h2>
              </div>
              <button className="text-sm font-bold" style={{ color: "var(--action-primary)" }} onClick={() => window.location.href = '/account/orders'}>History</button>
            </div>
            <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar snap-x pb-2">
              {PRODUCTS.slice(2, 6).map((p: any) => {
                const cartItem = items.find(i => i.id === p.id);
                const qty = cartItem?.quantity || 0;
                return (
                  <div
                    key={`reorder-${p.id}`}
                    className="min-w-[120px] max-w-[120px] rounded-xl p-2.5 border shadow-sm flex flex-col snap-start flex-shrink-0"
                    style={{ background: "var(--bg-main)", borderColor: "var(--surface-border)" }}
                  >
                    <div className="relative mb-2">
                      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <h3 className="font-bold text-[11px] leading-snug line-clamp-1 mb-1" style={{ color: "var(--text-primary)" }}>{p.name}</h3>
                    <div className="mt-auto flex justify-between items-center pt-1">
                      <p className="font-black text-xs raj-price">₹{p.price}</p>
                      {qty === 0 ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdd(p)}
                          className="w-6 h-6 flex items-center justify-center rounded-md"
                          style={{ background: "var(--action-primary)", color: "white" }}
                        >
                          <span className="font-bold text-sm">+</span>
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-black text-white" style={{ background: "var(--action-primary)" }}>
                          <button onClick={() => handleRemove(p.id)} className="w-3 text-center font-black">−</button>
                          <span className="w-3 text-center">{qty}</span>
                          <button onClick={() => handleAdd(p)} className="w-3 text-center font-black">+</button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Footer Trust */}
          <div className="px-4 pb-6">
            <div className="rounded-2xl p-4 text-center border" style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}>
              <div className="flex justify-center gap-6 mb-3">
                {[
                  { icon: Shield, label: 'Secure' },
                  { icon: RefreshCw, label: 'Easy Returns' },
                  { icon: Truck, label: 'Free Delivery' },
                ].map((t, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(193,73,46,0.08)' }}>
                      <t.icon size={16} style={{ color: 'var(--action-primary)' }} />
                    </div>
                    <span className="text-[9px] font-bold" style={{ color: 'var(--text-muted)' }}>{t.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-medium" style={{ color: 'var(--text-muted)' }}>FSSAI Licensed · 100% Fresh Guaranteed · Casano.in</p>
            </div>
          </div>
        </motion.main>
      )}

      {/* ── ORDER HISTORY ── */}
      {appState === 'orders' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-main)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="p-4 flex items-center gap-4 border-b" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <button onClick={() => setAppState('home')} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--surface-border)" }}>
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-lg font-black" style={{ fontFamily: "var(--font-heading)" }}>Your Orders</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {MOCK_ORDERS.map(order => (
              <div key={order.id} className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                {/* Status + Price row */}
                <div className="p-4 pb-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm">{order.status === 'Delivered' ? 'Order delivered' : 'Order cancelled'}</span>
                      {order.status === 'Delivered' ? (
                        <CheckCircle size={15} style={{ color: '#214A36' }} />
                      ) : (
                        <X size={15} style={{ color: '#C1492E' }} />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-black text-sm">₹{order.total}</span>
                      <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Placed at {order.date}</p>
                </div>
                {/* Product thumbnails */}
                <div className="px-4 py-2 flex gap-2">
                  {order.images.map((img, idx) => (
                    <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border flex-shrink-0" style={{ borderColor: 'var(--surface-border)' }}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                {/* Order Again CTA */}
                <div className="px-4 pb-4 pt-2">
                  <button className="text-sm font-bold" style={{ color: 'var(--action-primary)' }}>Order Again</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── SUPPORT ── */}
      {appState === 'support' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-main)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="p-4 flex items-center gap-4 border-b" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <button onClick={() => setAppState('home')} className="p-2 rounded-full transition-colors" style={{ background: "var(--surface-border)" }}>
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black" style={{ fontFamily: "var(--font-heading)" }}>Support</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[
              { q: 'How do I track my order?', a: 'Go to My Orders and tap on your active order to see a live map.' },
              { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 minutes of placing. After that, contact support.' },
              { q: 'What is the delivery charge?', a: 'Delivery is free on all orders above ₹99.' },
              { q: 'How do I return a product?', a: 'You can raise a return request from Orders within 24 hours of delivery.' },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                <p className="font-bold text-sm mb-2">{faq.q}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{faq.a}</p>
              </div>
            ))}
            <div className="rounded-2xl p-5 border shadow-sm text-center" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
              <Phone size={28} className="mx-auto mb-3" style={{ color: "var(--action-primary)" }} />
              <p className="font-black text-sm mb-1">Need more help?</p>
              <p className="text-xs mb-2" style={{ color: "var(--text-secondary)" }}>Our team is available 24/7</p>
              <p className="text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>📞 8523048480</p>
              <a href="tel:+918523048480" className="inline-block text-white px-5 py-2.5 rounded-xl font-bold text-sm" style={{ background: "var(--action-primary)" }}>
                Call Support
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PROFILE SCREEN ── */}
      {appState === 'profile' && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-main)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="p-4 flex items-center gap-4 border-b" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <button onClick={() => setAppState('home')} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "var(--surface-border)" }}>
              <ArrowLeft size={18} />
            </button>
            <h2 className="text-lg font-black" style={{ fontFamily: "var(--font-heading)" }}>Profile</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoggedIn ? (
              <>
                {/* User Card */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-black shadow-sm" style={{ background: "linear-gradient(135deg, #C1492E, #B8962E)" }}>
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-tight">{user?.name || 'User'}</h3>
                    <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>+91 {user?.phone}</p>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Package, label: 'Your\nOrders', onClick: () => setAppState('orders') },
                    { icon: Headphones, label: 'Help &\nSupport', onClick: () => setAppState('support') },
                    { icon: Heart, label: 'Your\nWishlist', onClick: () => {} },
                  ].map((item, i) => (
                    <button key={i} onClick={item.onClick}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-colors"
                      style={{ background: 'var(--surface-card)', borderColor: 'var(--surface-border)' }}
                    >
                      <item.icon size={22} style={{ color: 'var(--text-muted)' }} />
                      <span className="text-[11px] font-semibold text-center leading-tight whitespace-pre-line">{item.label}</span>
                    </button>
                  ))}
                </div>

                {/* Wallet Card */}
                <div className="rounded-2xl p-4 border shadow-sm flex items-center justify-between" style={{ background: 'rgba(184,150,46,0.06)', borderColor: 'rgba(184,150,46,0.2)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(184,150,46,0.15)' }}>
                      <Wallet size={18} style={{ color: '#B8962E' }} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">Casano Cash</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Available Balance: <b>₹450</b></p>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg border" style={{ borderColor: 'var(--surface-border)' }}>Add</span>
                </div>

                {/* Your Information */}
                <div>
                  <h3 className="text-sm font-black mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Your Information</h3>
                  <div className="rounded-2xl border shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                    {[
                      { icon: MapPin, label: 'Saved Addresses', onClick: () => {} },
                      { icon: Gift, label: 'Refer & Earn', onClick: () => {} },
                      { icon: Headphones, label: 'Help & Support', onClick: () => setAppState('support') },
                    ].map((item, i) => (
                      <button
                        key={i}
                        onClick={item.onClick}
                        className="w-full flex items-center justify-between p-4 text-left transition-colors"
                        style={{ borderBottom: i < 2 ? '1px dashed var(--surface-border)' : 'none' }}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon size={18} style={{ color: "var(--text-muted)" }} />
                          <span className="font-semibold text-sm">{item.label}</span>
                        </div>
                        <ChevronRight size={16} style={{ color: "var(--text-muted)" }} />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { logout(); setAppState('home'); }}
                  className="w-full py-4 rounded-2xl font-bold text-sm border hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
                  style={{ background: "rgba(193,73,46,0.1)", borderColor: "rgba(193,73,46,0.3)", color: "#C1492E" }}
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </>
            ) : (
              <div className="rounded-2xl p-8 border text-center shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: "var(--surface-border)" }}>
                  <User size={28} style={{ color: "var(--text-muted)" }} />
                </div>
                <h3 className="font-black text-lg mb-2" style={{ fontFamily: "var(--font-heading)" }}>Sign in to continue</h3>
                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>View orders, manage address and more</p>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full text-white py-3.5 rounded-xl font-bold text-sm transition-colors raj-btn"
                >
                  Sign in / Sign up
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* ── CHECKOUT SCREEN ── */}
      {appState === 'checkout' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-main)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="p-4 flex items-center gap-4 border-b" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <button onClick={() => setAppState('home')} className="p-2 rounded-full transition-colors" style={{ background: "var(--surface-border)" }}>
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black" style={{ fontFamily: "var(--font-heading)" }}>Payment</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Delivery Address */}
            <div className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
              <div className="flex gap-3 items-start">
                <LocateFixed size={20} className="mt-0.5 flex-shrink-0" style={{ color: "var(--action-primary)" }} />
                <div>
                  <h4 className="font-black text-sm">Delivering to Home</h4>
                  <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                    {user?.address || '12th Main Rd, HSR Layout, Bengaluru'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
              <h4 className="font-black mb-4 text-sm">Payment Method</h4>
              <div onClick={() => setAppState('tracking')} className="flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer mb-3" style={{ borderColor: "var(--action-primary)", background: "rgba(193,73,46,0.05)" }}>
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(193,73,46,0.1)" }}>
                    <Phone size={16} style={{ color: "var(--action-primary)" }} />
                  </div>
                  <span className="font-bold text-sm">UPI (GPay, PhonePe)</span>
                </div>
                <CheckCircle size={20} style={{ color: "var(--action-primary)" }} />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer mb-3" style={{ borderColor: "var(--surface-border)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center p-2" style={{ background: "var(--surface-border)" }}>
                  <CreditCard size={16} />
                </div>
                <span className="font-semibold text-sm">Credit / Debit Card</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer" style={{ borderColor: "var(--surface-border)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center p-2" style={{ background: "var(--surface-border)" }}>
                  <Wallet size={16} />
                </div>
                <span className="font-semibold text-sm">Casano Wallet</span>
              </div>
            </div>

            {/* Bill Summary */}
            <div className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
              <h4 className="font-black mb-3 text-sm">Bill Summary</h4>
              <BillRow label="Item Total" value={`₹${cartTotal}`} />
              <BillRow label="Delivery" value="FREE" highlight />
              <BillRow label="Handling Fee" value={`₹${handlingFee}`} />
              <div className="border-t border-dashed my-3" style={{ borderColor: "var(--surface-border)" }} />
              <div className="flex justify-between font-black text-base">
                <span>To Pay</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>

          <div className="p-4 border-t" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setAppState('tracking')}
              className="w-full text-white rounded-2xl py-4 font-black text-base shadow-lg flex items-center justify-between px-5 raj-btn"
            >
              <span>₹{finalTotal}</span>
              <span className="flex items-center gap-2">Pay via UPI <ArrowRight size={18} /></span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ── ORDER TRACKING ── */}
      {appState === 'tracking' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-50 flex flex-col" style={{ background: "var(--bg-main)", paddingTop: "env(safe-area-inset-top, 0px)" }}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "rgba(193,73,46,0.1)" }}>
              <Package size={28} style={{ color: "var(--action-primary)" }} />
            </div>
            <h2 className="text-2xl font-black mb-1" style={{ color: "var(--action-primary)" }}>Order Placed!</h2>
            <p className="font-medium text-sm" style={{ color: "var(--text-secondary)" }}>Your order is being prepared. ETA: 15 mins</p>
          </div>

          <div className="flex-1 relative flex items-center justify-center overflow-hidden" style={{ background: "linear-gradient(to bottom, var(--surface-card), var(--bg-main))" }}>
            <motion.div animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-32 h-32 border rounded-full" style={{ borderColor: "var(--action-primary)" }} />
            <motion.div animate={{ scale: [1, 3.5], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.7 }} className="absolute w-32 h-32 border rounded-full" style={{ borderColor: "var(--action-primary)" }} />
            <div className="w-4 h-4 rounded-full border-2 shadow-lg z-10" style={{ background: "#B8962E", borderColor: "var(--surface-card)" }} />
          </div>

          <div className="p-6 rounded-t-3xl -mt-6 z-20" style={{ background: "var(--surface-card)" }}>
            <div className="flex items-center gap-4 border-b pb-5 mb-5" style={{ borderColor: "var(--surface-border)" }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "var(--surface-border)" }}>
                <User size={20} style={{ color: "var(--text-muted)" }} />
              </div>
              <div>
                <h3 className="font-black">Ramesh Kumar</h3>
                <p className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>Delivery Partner · 4.9 rated</p>
              </div>
              <button className="ml-auto px-4 py-1.5 rounded-full font-black text-xs border" style={{ color: "var(--action-primary)", borderColor: "var(--action-primary)", background: "rgba(193,73,46,0.1)" }}>
                CALL
              </button>
            </div>
            <button
              onClick={() => { setAppState('home'); }}
              className="w-full border-2 py-3.5 rounded-xl font-bold text-sm transition-colors"
              style={{ borderColor: "var(--surface-border)", color: "var(--text-primary)" }}
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      )}

      {/* ── BOTTOM: CART STRIP + NAV ── */}
      {(appState === 'home') && (
        <div className="fixed bottom-0 w-full max-w-md mx-auto z-50">
          {/* Free delivery bar */}
          {cartCount === 0 && (
            <div className="mx-3 mb-2 rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-lg" style={{ background: '#1a1714', color: '#fff' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(184,150,46,0.2)' }}>
                <Truck size={14} style={{ color: '#B8962E' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold">Unlock free delivery</p>
                <p className="text-[10px] opacity-70">Shop for ₹99</p>
              </div>
            </div>
          )}
          <AnimatePresence>
            {cartCount > 0 && !isCartOpen && (
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                onClick={() => setIsCartOpen(true)}
                className="mx-3 mb-3 text-white rounded-2xl py-3.5 px-5 shadow-xl flex items-center justify-between cursor-pointer raj-btn"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-black/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart size={16} />
                  </div>
                  <div>
                    <div className="font-black text-sm">{cartCount} Item{cartCount > 1 && 's'} · ₹{cartTotal}</div>
                    <div className="text-[10px] font-semibold text-white/80">Free delivery in 15 mins</div>
                  </div>
                </div>
                <span className="flex items-center gap-1 font-black text-sm">View Cart <ArrowRight size={16} /></span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Bar */}
          <div className="px-6 pt-3 pb-6 flex justify-around items-center rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
            <NavItem icon={<Home size={22} />} label="Home" active onClick={() => setAppState('home')} />
            <NavItem icon={<List size={22} />} label="Categories" onClick={() => window.location.href = '/category/groceries'} />
            <NavItem icon={<History size={22} />} label="Orders" onClick={() => isLoggedIn ? setAppState('orders') : setIsLoginOpen(true)} />
            <NavItem icon={<User size={22} />} label="Account" onClick={() => setAppState('profile')} />
          </div>
        </div>
      )}

      {/* ── CART SHEET ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-50" />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed bottom-0 w-full max-w-md mx-auto z-50 rounded-t-3xl overflow-hidden shadow-2xl"
              style={{ background: "var(--bg-main)" }}
            >
              <div className="px-5 py-4 flex justify-between items-center border-b" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                <h3 className="font-black text-lg">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full transition-colors" style={{ background: "var(--surface-border)" }}>
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 hide-scrollbar">
                {/* Delivery Info */}
                <div className="rounded-2xl p-4 border flex items-center gap-3 shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                  <Clock size={18} style={{ color: "var(--action-primary)" }} />
                  <span className="font-bold text-sm">Delivery in 15 minutes</span>
                </div>

                {/* Items */}
                <div className="rounded-2xl border shadow-sm overflow-hidden" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                  {items.map((item: any) => (
                    <div key={item.id} className="p-4 flex gap-3 border-b last:border-0" style={{ borderColor: "var(--surface-border)" }}>
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border" style={{ background: "var(--surface-border)", borderColor: "var(--surface-border)" }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>{item.size} · ₹{item.price}</p>
                        <div className="flex items-center gap-2 text-white rounded-lg px-2 py-1 text-xs font-black w-fit mt-2" style={{ background: "var(--action-primary)" }}>
                          <button onClick={() => removeItem(item.id)} className="w-4 text-center">−</button>
                          <span className="w-4 text-center">{item.quantity}</span>
                          <button onClick={() => { const { quantity, ...rest } = item; addItem(rest); }} className="w-4 text-center">+</button>
                        </div>
                      </div>
                      <span className="font-black text-sm">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* Bill */}
                <div className="rounded-2xl p-4 border shadow-sm" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                  <BillRow label="Item Total" value={`₹${cartTotal}`} />
                  <BillRow label="Delivery" value="FREE" highlight />
                  <BillRow label="Handling" value={`₹${handlingFee}`} />
                  <div className="border-t border-dashed my-3" style={{ borderColor: "var(--surface-border)" }} />
                  <div className="flex justify-between font-black text-base">
                    <span>To Pay</span><span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t" style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsCartOpen(false);
                    if (!isLoggedIn) { setIsLoginOpen(true); } else { setAppState('checkout'); }
                  }}
                  className="w-full text-white rounded-2xl py-4 font-black text-base shadow-lg transition-colors flex justify-between items-center px-5 raj-btn"
                >
                  <span>₹{finalTotal}</span>
                  <span className="flex items-center gap-2">
                    {isLoggedIn ? 'Proceed to Pay' : 'Login to Proceed'} <ArrowRight size={18} />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

// Helpers
function BillRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm mb-1.5 font-medium" style={{ color: highlight ? "var(--action-primary)" : "var(--text-secondary)" }}>
      <span style={{ fontWeight: highlight ? 700 : 500 }}>{label}</span>
      <span style={{ fontWeight: highlight ? 700 : 500 }}>{value}</span>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 transition-colors"
      style={{ color: active ? "var(--action-primary)" : "var(--text-muted)" }}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
