'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, ChevronDown, Clock, ShoppingCart, Home, List,
  History, ArrowRight, X, LocateFixed, CheckCircle, CreditCard,
  Wallet, User, Phone, Package, Headphones, LogOut, ArrowLeft
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import LoginModal from './LoginModal';
import ThemeToggle from './ThemeToggle';

const CATEGORIES = [
  { name: 'Groceries', image: '/category_groceries.png', path: '/category/groceries', bg: 'bg-green-50' },
  { name: 'Fashion', image: '/category_fashion.png', path: '/category/fashion', bg: 'bg-pink-50' },
  { name: 'Gadgets', image: '/category_gadgets.png', path: '/category/gadgets', bg: 'bg-slate-100' },
  { name: 'Stationery', image: '/category_stationery.png', path: '/category/stationary', bg: 'bg-yellow-50' },
  { name: 'Gym', image: '/category_gym.png', path: '/category/gym', bg: 'bg-orange-50' },
  { name: 'Pharmacy', image: '/category_pharmacy.png', path: '/category/pharmacy', bg: 'bg-blue-50' },
  { name: 'Dairy', image: '/category_groceries.png', path: '/category/groceries', bg: 'bg-indigo-50' },
  { name: 'Bakery', image: '/category_stationery.png', path: '/category/stationary', bg: 'bg-amber-50' },
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
    statusColor: 'text-[#19c74a] bg-[#19c74a]/10',
  },
  {
    id: 'ORD-2024-002',
    date: 'Mar 7, 2024',
    items: ['Maggi x3', 'Eggs x1'],
    total: 87,
    status: 'Delivered',
    statusColor: 'text-[#19c74a] bg-[#19c74a]/10',
  },
];

type AppState = 'home' | 'checkout' | 'tracking' | 'profile' | 'orders' | 'support';

export default function MobileHome() {
  const [appState, setAppState] = useState<AppState>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { items, addItem, removeItem, cartTotal, cartCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();

  const deliveryFee = 0;
  const handlingFee = 5;
  const finalTotal = cartTotal > 0 ? cartTotal + deliveryFee + handlingFee : 0;

  const bg = isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900';
  const cardBg = isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100';

  const handleAdd = (p: typeof PRODUCTS[0]) => {
    addItem({ id: p.id, name: p.name, price: p.price, originalPrice: p.origPrice, image: p.image, size: p.weight });
  };
  const handleRemove = (id: string) => removeItem(id);

  return (
    <div className={`flex w-full flex-col min-h-screen relative font-sans transition-colors duration-300 ${bg}`}>

      {/* ── HOME SCREEN ── */}
      {appState === 'home' && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto pb-36 no-scrollbar">

          {/* Header */}
          <div className={`sticky top-0 z-40 pb-3 pt-4 px-4 shadow-sm border-b transition-colors ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between mb-3">
              <button className="flex items-center gap-2" onClick={() => {}}>
                <div className={`rounded-xl p-2 ${isDarkMode ? 'bg-green-900/30' : 'bg-green-50'}`}>
                  <MapPin size={18} className="text-[#19c74a]" />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-[15px] leading-none">Delivery in 15 mins</span>
                    <ChevronDown size={14} className="text-gray-400" />
                  </div>
                  <p className={`text-xs mt-0.5 truncate max-w-[190px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.address || 'Select your location'}
                  </p>
                </div>
              </button>
              <div className="flex items-center gap-2">
                <ThemeToggle isDarkMode={isDarkMode} toggle={() => setIsDarkMode(!isDarkMode)} />
              </div>
            </div>

            {/* Search */}
            <button
              className={`w-full rounded-xl px-4 py-3 flex items-center gap-3 text-left transition-colors ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}
              onClick={() => window.location.href = '/products'}
            >
              <Search size={18} className="text-gray-400 flex-shrink-0" />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>Search products...</span>
            </button>
          </div>

          {/* Promo Banner */}
          <div className="px-4 py-4">
            <div className="bg-gradient-to-r from-[#fd7e14] to-[#e8650f] rounded-2xl p-5 text-white relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-xs font-bold opacity-80 uppercase tracking-wider mb-1">Limited time</p>
                <h3 className="text-xl font-black leading-tight">Flat 30% off groceries</h3>
                <p className="text-sm opacity-90 mt-1">Min order ₹199 · Code FRESH30</p>
                <button
                  onClick={() => window.location.href = '/category/groceries'}
                  className="mt-3 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                >
                  Shop Now
                </button>
              </div>
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full" />
              <div className="absolute -right-2 top-2 w-16 h-16 bg-white/10 rounded-full" />
            </div>
          </div>

          {/* Categories Grid */}
          <div className="px-4 mb-6">
            <h2 className={`text-[17px] font-black tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shop by Category</h2>
            <div className="grid grid-cols-4 gap-3">
              {CATEGORIES.map((cat, i) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={i}
                  className="flex flex-col items-center gap-2"
                  onClick={() => window.location.href = cat.path}
                >
                  <div className={`w-[68px] h-[68px] rounded-2xl overflow-hidden border ${isDarkMode ? 'border-gray-800 bg-[#1e1e1e]' : `${cat.bg} border-gray-100`} flex items-center justify-center`}>
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      onError={(e: any) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                    />
                  </div>
                  <span className={`text-[11px] font-semibold text-center leading-tight w-[68px] truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{cat.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className={`py-5 border-t ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="px-4 flex justify-between items-center mb-4">
              <h2 className={`text-[17px] font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Popular Items</h2>
              <button className="text-sm text-[#19c74a] font-bold" onClick={() => window.location.href = '/products'}>See All</button>
            </div>
            <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar snap-x pb-2">
              {PRODUCTS.map((p: any) => {
                const cartItem = items.find(i => i.id === p.id);
                const qty = cartItem?.quantity || 0;
                return (
                  <div
                    key={p.id}
                    className={`min-w-[145px] max-w-[145px] rounded-2xl p-3 border shadow-sm flex flex-col snap-start flex-shrink-0 ${isDarkMode ? 'bg-[#222] border-gray-800' : 'bg-white border-gray-100'}`}
                  >
                    <div className="relative mb-3">
                      <div className={`w-full aspect-square rounded-xl overflow-hidden ${isDarkMode ? 'bg-[#111]' : 'bg-gray-50'}`}>
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute top-1.5 left-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-1">
                        <Clock size={9} className="text-[#19c74a]" />
                        <span className="text-[9px] font-black text-[#19c74a]">15 MIN</span>
                      </div>
                    </div>
                    <h3 className={`font-bold text-xs leading-snug line-clamp-2 mb-1 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{p.name}</h3>
                    <p className="text-[10px] text-gray-400 mb-2">{p.weight}</p>
                    <div className="mt-auto flex justify-between items-center">
                      <div>
                        <p className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{p.price}</p>
                        {p.origPrice > p.price && <p className="text-[10px] text-gray-400 line-through">₹{p.origPrice}</p>}
                      </div>
                      {qty === 0 ? (
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleAdd(p)}
                          className="border border-[#19c74a] text-[#19c74a] bg-transparent px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          ADD
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-[#19c74a] text-white rounded-lg px-2 py-1.5 text-xs font-black">
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
        </motion.main>
      )}

      {/* ── ORDER HISTORY ── */}
      {appState === 'orders' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
          <div className={`p-4 flex items-center gap-4 border-b ${cardBg}`}>
            <button onClick={() => setAppState('profile')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black">My Orders</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {MOCK_ORDERS.map(order => (
              <div key={order.id} className={`rounded-2xl p-4 border shadow-sm ${cardBg}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-sm">{order.id}</p>
                    <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.date}</p>
                  </div>
                  <span className={`text-[11px] font-black px-2 py-1 rounded-full ${order.statusColor}`}>{order.status}</span>
                </div>
                <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{order.items.join(' · ')}</p>
                <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3">
                  <span className="font-black text-sm">₹{order.total}</span>
                  <button className="text-xs font-bold text-[#19c74a] border border-[#19c74a] px-3 py-1.5 rounded-lg">Reorder</button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── SUPPORT ── */}
      {appState === 'support' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
          <div className={`p-4 flex items-center gap-4 border-b ${cardBg}`}>
            <button onClick={() => setAppState('profile')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black">Support</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {[
              { q: 'How do I track my order?', a: 'Go to My Orders and tap on your active order to see a live map.' },
              { q: 'Can I cancel my order?', a: 'Orders can be cancelled within 2 minutes of placing. After that, contact support.' },
              { q: 'What is the delivery charge?', a: 'Delivery is free on all orders above ₹99.' },
              { q: 'How do I return a product?', a: 'You can raise a return request from Orders within 24 hours of delivery.' },
            ].map((faq, i) => (
              <div key={i} className={`rounded-2xl p-4 border shadow-sm ${cardBg}`}>
                <p className="font-bold text-sm mb-2">{faq.q}</p>
                <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{faq.a}</p>
              </div>
            ))}
            <div className={`rounded-2xl p-5 border shadow-sm text-center ${cardBg}`}>
              <Phone size={28} className="mx-auto text-[#19c74a] mb-3" />
              <p className="font-black text-sm mb-1">Need more help?</p>
              <p className={`text-xs mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Our team is available 24/7</p>
              <a href="tel:+911800001234" className="inline-block bg-[#19c74a] text-white px-5 py-2.5 rounded-xl font-bold text-sm">
                Call Support
              </a>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── PROFILE SCREEN ── */}
      {appState === 'profile' && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
          <div className={`p-5 flex items-center justify-between border-b ${cardBg}`}>
            <h2 className="text-xl font-black">My Account</h2>
            <button onClick={() => setAppState('home')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {isLoggedIn ? (
              <>
                {/* User Card */}
                <div className={`rounded-2xl p-5 border shadow-sm flex items-center gap-4 ${cardBg}`}>
                  <div className="w-14 h-14 bg-gradient-to-br from-[#fd7e14] to-[#e8650f] rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-sm">
                    {user?.name ? user.name.charAt(0).toUpperCase() : <User size={24} />}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-tight">{user?.name || 'User'}</h3>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>+91 {user?.phone}</p>
                    {user?.address && (
                      <p className={`text-xs mt-1 truncate max-w-[200px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{user.address}</p>
                    )}
                  </div>
                </div>

                {/* Menu */}
                <div className={`rounded-2xl overflow-hidden border shadow-sm ${cardBg}`}>
                  {[
                    { icon: Package, label: 'My Orders', onClick: () => setAppState('orders') },
                    { icon: MapPin, label: 'Saved Addresses', onClick: () => {} },
                    { icon: Wallet, label: 'Casano Wallet (₹450)', onClick: () => {} },
                    { icon: Headphones, label: 'Help & Support', onClick: () => setAppState('support') },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={item.onClick}
                      className={`w-full flex items-center justify-between p-4 border-b last:border-0 text-left transition-colors ${isDarkMode ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-100 hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={isDarkMode ? 'text-gray-400' : 'text-gray-500'} />
                        <span className="font-semibold text-sm">{item.label}</span>
                      </div>
                      <ArrowRight size={16} className="text-gray-400" />
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => { logout(); setAppState('home'); }}
                  className="w-full py-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl font-bold text-sm border border-red-100 dark:border-red-900 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut size={16} />
                  Log Out
                </button>
              </>
            ) : (
              <div className={`rounded-2xl p-8 border text-center shadow-sm ${cardBg}`}>
                <div className="w-16 h-16 bg-gray-100 dark:bg-[#2a2a2a] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User size={28} className="text-gray-400" />
                </div>
                <h3 className="font-black text-lg mb-2">Sign in to continue</h3>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>View orders, manage address and more</p>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="w-full bg-[#19c74a] hover:bg-[#15a83e] text-white py-3.5 rounded-xl font-bold text-sm transition-colors"
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
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
          <div className={`p-4 flex items-center gap-4 border-b ${cardBg}`}>
            <button onClick={() => setAppState('home')} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-lg font-black">Payment</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Delivery Address */}
            <div className={`rounded-2xl p-4 border shadow-sm ${cardBg}`}>
              <div className="flex gap-3 items-start">
                <LocateFixed size={20} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-black text-sm">Delivering to Home</h4>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {user?.address || '12th Main Rd, HSR Layout, Bengaluru'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className={`rounded-2xl p-4 border shadow-sm ${cardBg}`}>
              <h4 className="font-black mb-4 text-sm">Payment Method</h4>
              <div onClick={() => setAppState('tracking')} className={`flex items-center justify-between p-3 rounded-xl border-2 border-[#19c74a] cursor-pointer mb-3 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 bg-[#19c74a]/10 rounded-lg flex items-center justify-center">
                    <Phone size={16} className="text-[#19c74a]" />
                  </div>
                  <span className="font-bold text-sm">UPI (GPay, PhonePe)</span>
                </div>
                <CheckCircle className="text-[#19c74a]" size={20} />
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer mb-3 ${isDarkMode ? 'border-gray-700' : ''}`}>
                <div className="w-8 h-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <CreditCard size={16} className="text-blue-500" />
                </div>
                <span className="font-semibold text-sm">Credit / Debit Card</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer ${isDarkMode ? 'border-gray-700' : ''}`}>
                <div className="w-8 h-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                  <Wallet size={16} className="text-purple-500" />
                </div>
                <span className="font-semibold text-sm">Casano Wallet</span>
              </div>
            </div>

            {/* Bill Summary */}
            <div className={`rounded-2xl p-4 border shadow-sm ${cardBg}`}>
              <h4 className="font-black mb-3 text-sm">Bill Summary</h4>
              <BillRow label="Item Total" value={`₹${cartTotal}`} isDark={isDarkMode} />
              <BillRow label="Delivery" value="FREE" isDark={isDarkMode} highlight />
              <BillRow label="Handling Fee" value={`₹${handlingFee}`} isDark={isDarkMode} />
              <div className="border-t border-dashed my-3 border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between font-black text-base">
                <span>To Pay</span>
                <span>₹{finalTotal}</span>
              </div>
            </div>
          </div>

          <div className={`p-4 border-t ${cardBg}`}>
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setAppState('tracking')}
              className="w-full bg-[#19c74a] hover:bg-[#15a83e] text-white rounded-2xl py-4 font-black text-base shadow-lg transition-colors flex items-center justify-between px-5"
            >
              <span>₹{finalTotal}</span>
              <span className="flex items-center gap-2">Pay via UPI <ArrowRight size={18} /></span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ── ORDER TRACKING ── */}
      {appState === 'tracking' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`fixed inset-0 z-50 flex flex-col ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 bg-[#19c74a]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Package size={28} className="text-[#19c74a]" />
            </div>
            <h2 className="text-2xl font-black text-[#19c74a] mb-1">Order Placed!</h2>
            <p className={`font-medium text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Your order is being prepared. ETA: 15 mins</p>
          </div>

          <div className="flex-1 bg-gradient-to-b from-gray-900 to-gray-800 relative flex items-center justify-center overflow-hidden">
            <motion.div animate={{ scale: [1, 2.5], opacity: [0.6, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-32 h-32 border border-[#19c74a] rounded-full" />
            <motion.div animate={{ scale: [1, 3.5], opacity: [0.3, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.7 }} className="absolute w-32 h-32 border border-[#19c74a] rounded-full" />
            <div className="w-4 h-4 bg-blue-400 rounded-full border-2 border-white shadow-lg shadow-blue-400/50 z-10" />
          </div>

          <div className={`p-6 rounded-t-3xl -mt-6 z-20 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className={`flex items-center gap-4 border-b pb-5 mb-5 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <User size={20} className="text-gray-400" />
              </div>
              <div>
                <h3 className="font-black">Ramesh Kumar</h3>
                <p className={`text-xs font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Delivery Partner · 4.9 rated</p>
              </div>
              <button className="ml-auto bg-green-50 dark:bg-green-900/20 text-[#19c74a] px-4 py-1.5 rounded-full font-black text-xs border border-green-100 dark:border-green-900">
                CALL
              </button>
            </div>
            <button
              onClick={() => { setAppState('home'); }}
              className={`w-full border-2 py-3.5 rounded-xl font-bold text-sm transition-colors ${isDarkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-700'}`}
            >
              Return to Home
            </button>
          </div>
        </motion.div>
      )}

      {/* ── BOTTOM: CART STRIP + NAV ── */}
      {(appState === 'home') && (
        <div className="fixed bottom-0 w-full max-w-md mx-auto z-50">
          <AnimatePresence>
            {cartCount > 0 && !isCartOpen && (
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 60, opacity: 0 }}
                onClick={() => setIsCartOpen(true)}
                className="mx-3 mb-3 bg-[#19c74a] text-white rounded-2xl py-3.5 px-5 shadow-xl flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShoppingCart size={16} />
                  </div>
                  <div>
                    <div className="font-black text-sm">{cartCount} Item{cartCount > 1 && 's'} · ₹{cartTotal}</div>
                    <div className="text-[10px] font-semibold text-green-100">Free delivery in 15 mins</div>
                  </div>
                </div>
                <span className="flex items-center gap-1 font-black text-sm">View Cart <ArrowRight size={16} /></span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Bar */}
          <div className={`px-6 pt-3 pb-6 flex justify-around items-center rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.06)] border-t ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
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
              className={`fixed bottom-0 w-full max-w-md mx-auto z-50 rounded-t-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}
            >
              <div className={`px-5 py-4 flex justify-between items-center border-b ${cardBg}`}>
                <h3 className="font-black text-lg">Your Cart</h3>
                <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 no-scrollbar">
                {/* Delivery Info */}
                <div className={`rounded-2xl p-4 border flex items-center gap-3 shadow-sm ${cardBg}`}>
                  <Clock size={18} className="text-[#19c74a]" />
                  <span className="font-bold text-sm">Delivery in 15 minutes</span>
                </div>

                {/* Items */}
                <div className={`rounded-2xl border shadow-sm overflow-hidden ${cardBg}`}>
                  {items.map((item: any) => (
                    <div key={item.id} className={`p-4 flex gap-3 border-b last:border-0 ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
                      <div className={`w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border ${isDarkMode ? 'bg-[#111] border-gray-800' : 'bg-gray-50 border-gray-100'}`}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                        <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.size} · ₹{item.price}</p>
                        <div className="flex items-center gap-2 bg-[#19c74a] text-white rounded-lg px-2 py-1 text-xs font-black w-fit mt-2">
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
                <div className={`rounded-2xl p-4 border shadow-sm ${cardBg}`}>
                  <BillRow label="Item Total" value={`₹${cartTotal}`} isDark={isDarkMode} />
                  <BillRow label="Delivery" value="FREE" isDark={isDarkMode} highlight />
                  <BillRow label="Handling" value={`₹${handlingFee}`} isDark={isDarkMode} />
                  <div className="border-t border-dashed my-3 border-gray-200 dark:border-gray-700" />
                  <div className="flex justify-between font-black text-base">
                    <span>To Pay</span><span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <div className={`p-4 border-t ${cardBg}`}>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsCartOpen(false);
                    if (!isLoggedIn) { setIsLoginOpen(true); } else { setAppState('checkout'); }
                  }}
                  className="w-full bg-[#19c74a] hover:bg-[#15a83e] text-white rounded-2xl py-4 font-black text-base shadow-lg transition-colors flex justify-between items-center px-5"
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
function BillRow({ label, value, isDark, highlight = false }: { label: string; value: string; isDark: boolean; highlight?: boolean }) {
  return (
    <div className={`flex justify-between text-sm mb-1.5 ${highlight ? 'text-[#19c74a] font-bold' : `${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium`}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-colors ${active ? 'text-[#19c74a]' : 'text-gray-400 hover:text-gray-600'}`}
    >
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}
