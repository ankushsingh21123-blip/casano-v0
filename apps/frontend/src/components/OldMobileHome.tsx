'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, User, ChevronDown, Clock, ShoppingCart, Home, List, History, ArrowRight, X, LocateFixed, CheckCircle, CreditCard, Wallet, Moon, Sun, Bot } from 'lucide-react';
import Image from 'next/image';
import ThemeToggle from '../components/ThemeToggle';

const CATEGORIES = [
  { name: 'Vegetables & Fruits', image: '🍅' },
  { name: 'Dairy & Breakfast', image: '🥛' },
  { name: 'Munchies', image: '🍟' },
  { name: 'Cold Drinks', image: '🥤' },
  { name: 'Instant & Frozen', image: '🍜' },
  { name: 'Tea, Coffee', image: '☕' },
  { name: 'Bakery', image: '🍞' },
  { name: 'Sweet Tooth', image: '🍫' }
];

const PRODUCTS = [
  { id: 1, name: 'Amul Taaza Toned Milk', price: 28, origPrice: 30, weight: '500 ml', emoji: '🥛' },
  { id: 2, name: 'Nandini Curd (Pouch)', price: 22, origPrice: 24, weight: '500 g', emoji: '🥣' },
  { id: 3, name: 'Maggi 2-Min Noodles', price: 14, origPrice: 14, weight: '70 g', emoji: '🍜' },
  { id: 4, name: 'Farm Fresh Eggs', price: 45, origPrice: 50, weight: '6 pcs', emoji: '🥚' },
];

export default function OldMobileHome() {
  const [appState, setAppState] = useState<'home' | 'checkout' | 'radar' | 'profile'>('home');
  const [cart, setCart] = useState<{product: any, qty: number}[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  
  // Derived state
  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.qty), 0);
  const discount = cartTotal > 100 ? 15 : 0;
  const finalTotal = cartTotal > 0 ? cartTotal + 15 /* delivery */ - discount + 2 /* platform */ : 0;

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? {...i, qty: i.qty + 1} : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === id);
      if (existing && existing.qty > 1) return prev.map(i => i.product.id === id ? {...i, qty: i.qty - 1} : i);
      return prev.filter(i => i.product.id !== id);
    });
  };

  return (
    <div className={`flex w-full flex-col min-h-screen relative font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#121212] text-white' : 'bg-gray-50 text-gray-900'}`}>
      
      {/* ────────────────── SCREEN: HOME ────────────────── */}
      {appState === 'home' && (
        <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto pb-32 no-scrollbar">
          
          {/* Header */}
          <div className={`sticky top-0 z-40 pb-3 pt-4 px-4 shadow-sm border-b transition-colors ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`rounded-full p-2 ${isDarkMode ? 'bg-orange-900/30 text-orange-400' : 'bg-orange-100 text-[#fd7e14]'}`}>
                  <MapPin size={22} fill={isDarkMode ? '#b45309' : '#fded00'} />
                </div>
                <div>
                  <div className="flex items-center gap-1 cursor-pointer">
                    <h2 className="font-extrabold text-lg leading-none tracking-tight">Delivery in 8 mins</h2>
                    <ChevronDown size={18} />
                  </div>
                  <p className={`text-xs mt-0.5 truncate max-w-[200px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>BTM Layout, Koramangala...</p>
                </div>
              </div>
              <ThemeToggle isDarkMode={isDarkMode} toggle={() => setIsDarkMode(!isDarkMode)} />
            </div>

            {/* Smart Search */}
            <div className={`rounded-xl px-4 py-3 flex items-center gap-3 shadow-inner ${isDarkMode ? 'bg-[#2a2a2a]' : 'bg-gray-100'}`}>
              <Search size={20} className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} />
              <div className={`flex-1 text-sm font-medium h-5 overflow-hidden relative ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                <motion.div animate={{ y: [0, -20, -40, -60, -80, 0] }} transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }} className="absolute left-0">
                  <div className="h-5">Search "milk"</div>
                  <div className="h-5">Search "chips"</div>
                  <div className="h-5">Search "bread"</div>
                  <div className="h-5">Search "ice cream"</div>
                  <div className="h-5">Search "milk"</div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Carousels */}
          <div className="px-4 py-5 w-full flex gap-3 overflow-x-auto no-scrollbar snap-x">
            <div className="min-w-[85%] bg-gradient-to-r from-[#fded00] to-[#f59e0b] rounded-2xl p-4 snap-center relative overflow-hidden shadow-sm text-black">
              <h3 className="text-xl font-black w-3/4 tracking-tight">Zero Delivery Fee!</h3>
              <p className="text-sm font-bold opacity-80 mt-1">On your first 3 orders</p>
              <div className="absolute -right-4 -bottom-4 text-7xl opacity-40">🛵</div>
            </div>
            <div className="min-w-[85%] bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-4 snap-center relative overflow-hidden shadow-sm text-white">
              <h3 className="text-xl font-black w-3/4 tracking-tight">Cyber Chill Deals</h3>
              <p className="text-sm font-bold opacity-90 mt-1">Up to 40% OFF Beverages</p>
              <div className="absolute -right-2 -bottom-2 text-6xl opacity-50">🧊</div>
            </div>
          </div>

          {/* Categories Grid */}
          <div className="px-4 mb-8">
            <h2 className={`text-lg font-extrabold tracking-tight mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Shop by Category</h2>
            <div className="grid grid-cols-4 gap-y-6 gap-x-2">
              {CATEGORIES.map((cat, i) => (
                <motion.div whileTap={{ scale: 0.95 }} key={i} className="flex flex-col items-center gap-2 cursor-pointer group">
                  <div className={`w-[72px] h-[72px] rounded-2xl flex items-center justify-center transition-colors shadow-sm ${isDarkMode ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
                    <span className="text-3xl">{cat.image}</span>
                  </div>
                  <span className={`text-[11px] font-semibold text-center leading-tight h-8 w-16 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{cat.name}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div className={`py-6 pb-8 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className="px-4 flex justify-between items-center mb-4">
              <h2 className={`text-lg font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Rolling Fast</h2>
              <span className="text-sm text-[#0c831f] font-bold cursor-pointer">See All</span>
            </div>
            <div className="flex gap-4 px-4 overflow-x-auto no-scrollbar snap-x">
              {PRODUCTS.map(p => {
                const qty = cart.find(i => i.product.id === p.id)?.qty || 0;
                return (
                  <div key={p.id} className={`min-w-[145px] max-w-[145px] rounded-2xl p-3 border shadow-sm flex flex-col snap-start relative ${isDarkMode ? 'bg-[#222] border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="absolute top-2 left-2 bg-gray-100/10 backdrop-blur-md rounded flex items-center gap-1 px-1.5 py-0.5 z-10">
                      <Clock size={10} className="text-[#0c831f]" />
                      <span className="text-[9px] font-black tracking-wide text-[#0c831f]">8 MINS</span>
                    </div>
                    <div className={`w-full aspect-square rounded-xl mb-3 flex items-center justify-center text-5xl ${isDarkMode ? 'bg-[#111]' : 'bg-[#f8f8f8]'}`}>
                      {p.emoji}
                    </div>
                    <h3 className={`font-bold text-xs leading-snug line-clamp-2 h-8 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>{p.name}</h3>
                    <p className="text-[10px] font-semibold text-gray-500 mt-1 mb-2">{p.weight}</p>
                    <div className="mt-auto flex justify-between items-center pt-1">
                      <div>
                        <p className={`font-black text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>₹{p.price}</p>
                        {p.origPrice > p.price && <p className="text-[10px] text-gray-400 line-through">₹{p.origPrice}</p>}
                      </div>
                      
                      {qty === 0 ? (
                        <motion.button 
                          whileTap={{ scale: 0.9 }} 
                          onClick={() => addToCart(p)} 
                          className={`w-[4.5rem] py-1.5 rounded-[3px] text-xs font-bold transition-all duration-200 ease-in-out border hover:brightness-90 active:brightness-100 ${isDarkMode ? 'bg-[#0c831f] border-[#0c831f] text-black' : 'bg-transparent border-[#0c831f] text-[#0c831f] hover:bg-green-50'}`}
                        >
                          ADD
                        </motion.button>
                      ) : (
                        <div className="flex items-center gap-2 bg-[#0c831f] text-white rounded-lg px-2 py-1.5 text-xs font-black">
                          <span onClick={() => removeFromCart(p.id)} className="cursor-pointer px-1">-</span>
                          <span>{qty}</span>
                          <span onClick={() => addToCart(p)} className="cursor-pointer px-1">+</span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.main>
      )}

      {/* ────────────────── BOTTOM NAVIGATION & FLOATING CART ────────────────── */}
      {appState === 'home' && (
        <div className="fixed bottom-0 w-full max-w-md mx-auto z-50">
          
          {/* Floating Action Cart */}
          <AnimatePresence>
            {totalItems > 0 && !isCartOpen && (
              <motion.div 
                initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                onClick={() => setIsCartOpen(true)}
                className="mx-4 mb-4 bg-[#0c831f] text-white rounded-2xl p-3 px-4 shadow-xl flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🛍️</div>
                  <div>
                    <div className="font-extrabold text-sm">{totalItems} Item{totalItems > 1 && 's'} | ₹{cartTotal}</div>
                    <div className="text-[10px] font-bold text-green-100">Superfast delivery in 8 mins</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 font-extrabold text-sm tracking-wide">
                  View Cart <ArrowRight size={16} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nav Bar */}
          <div className={`px-6 pt-3 pb-6 flex justify-between items-center rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] ${isDarkMode ? 'bg-[#1a1a1a] border-t border-gray-800' : 'bg-white border-t border-gray-100'}`}>
            <NavIcon icon={<Home size={24} />} label="Home" active />
            <NavIcon icon={<List size={24} />} label="Categories" />
            <NavIcon icon={<History size={24} />} label="History" />
            <NavIcon icon={<User size={24} />} label="Profile" onClick={() => setAppState('profile')} />
          </div>
        </div>
      )}

      {/* ────────────────── SLIDE-UP CART SHEET ────────────────── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-50 max-w-md mx-auto" />
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: "spring", bounce: 0, duration: 0.3 }} className={`fixed bottom-0 w-full max-w-md mx-auto z-50 rounded-t-3xl overflow-hidden shadow-2xl ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
              <div className={`px-4 py-3 flex justify-between items-center border-b ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
                <h3 className="font-extrabold text-lg">Your Cart</h3>
                <X size={24} className="cursor-pointer text-gray-400" onClick={() => setIsCartOpen(false)} />
              </div>
              
              <div className="p-4 max-h-[60vh] overflow-y-auto">
                <div className={`rounded-2xl p-4 mb-4 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                  <div className="flex gap-3 mb-4 items-center">
                    <Clock size={20} className="text-[#0c831f]" />
                    <span className="font-extrabold text-sm">Delivery in 8 mins</span>
                  </div>
                  
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between items-center mb-4 last:mb-0">
                      <div className="flex gap-3 items-center">
                        <div className="text-3xl bg-gray-100 rounded-lg p-1 w-12 h-12 flex items-center justify-center">{item.product.emoji}</div>
                        <div>
                          <p className="text-sm font-bold line-clamp-1 max-w-[120px]">{item.product.name}</p>
                          <p className="text-xs text-gray-500 font-semibold">{item.product.weight} • ₹{item.product.price}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-[#0c831f] text-white rounded-lg px-2 py-1.5 font-black text-sm">
                        <span onClick={() => removeFromCart(item.product.id)} className="cursor-pointer px-1">-</span>
                        <span>{item.qty}</span>
                        <span onClick={() => addToCart(item.product)} className="cursor-pointer px-1">+</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={`rounded-2xl p-4 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
                  <h4 className="font-extrabold mb-3">Bill Details</h4>
                  <BillRow label="Item Total" value={`₹${cartTotal}`} />
                  <BillRow label="Delivery Fee" value="₹15" />
                  <BillRow label="Handling Fee" value="₹2" />
                  {discount > 0 && <BillRow label="Promo Discount" value={`-₹${discount}`} highlight />}
                  <div className="border-t border-dashed my-3 border-gray-300 dark:border-gray-700" />
                  <div className="flex justify-between font-black text-lg">
                    <span>To Pay</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <div className={`p-4 border-t ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setIsCartOpen(false); setAppState('checkout'); }}
                  className={`w-full rounded-[3px] py-4 font-bold text-lg shadow-lg flex justify-between items-center px-6 transition-all duration-200 ease-in-out border hover:brightness-[0.85] active:brightness-100 ${isDarkMode ? 'bg-[#0c831f] border-[#0c831f] text-black' : 'bg-[#0c831f] border-[#0c831f] text-white'}`}
                >
                  <span>₹{finalTotal}</span>
                  <span className="flex items-center gap-2">Proceed to Pay <ArrowRight size={20} /></span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ────────────────── SCREEN: CHECKOUT & MAP ────────────────── */}
      {appState === 'checkout' && (
        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} className={`fixed inset-0 z-50 flex flex-col max-w-md mx-auto ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
          <div className={`p-4 flex items-center gap-4 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <ArrowRight size={24} className="rotate-180 cursor-pointer" onClick={() => setAppState('home')} />
            <h2 className="text-xl font-extrabold">Complete Payment</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* Map Mockup */}
            <div className={`rounded-2xl overflow-hidden shadow-sm border ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="h-32 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=12.9716,77.5946&zoom=15&size=400x150&sensor=false')] bg-cover bg-center flex items-center justify-center relative">
                <div className="absolute inset-0 bg-blue-500/10"></div>
                <div className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-lg shadow-blue-500/50 absolute"></div>
                <div className="w-12 h-12 rounded-full bg-blue-500/20 absolute animate-ping"></div>
              </div>
              <div className="p-4 flex gap-3 items-start">
                <LocateFixed className="text-blue-600 mt-1 shrink-0" size={20} />
                <div>
                  <h4 className="font-extrabold text-sm">Delivery to Home</h4>
                  <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>12th Main Rd, Sector 6, HSR Layout, Bengaluru</p>
                </div>
              </div>
            </div>

            {/* Payment Options */}
            <div className={`rounded-2xl p-4 shadow-sm border ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
              <h4 className="font-extrabold mb-4">Payment Method</h4>
              <div onClick={() => setAppState('radar')} className={`flex items-center justify-between p-3 rounded-xl border-2 border-green-500 cursor-pointer mb-3 ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                <div className="flex gap-3 items-center">
                  <span className="text-2xl">📱</span>
                  <span className="font-bold">UPI (GPay, PhonePe)</span>
                </div>
                <CheckCircle className="text-green-500" size={20} />
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer mb-3 ${isDarkMode ? 'border-gray-700' : ''}`}>
                <CreditCard className="text-blue-500" />
                <span className="font-bold text-sm">Credit / Debit Card</span>
              </div>
              <div className={`flex items-center gap-3 p-3 rounded-xl border border-gray-200 cursor-pointer ${isDarkMode ? 'border-gray-700' : ''}`}>
                <Wallet className="text-purple-500" />
                <span className="font-bold text-sm">Razorpay Wallet</span>
              </div>
            </div>
          </div>
          
          <div className={`p-4 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <motion.button onClick={() => setAppState('radar')} whileTap={{ scale: 0.98 }} className="w-full bg-[#0c831f] text-white rounded-2xl py-4 font-black text-lg shadow-lg">
              Pay ₹{finalTotal} via UPI
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* ────────────────── SCREEN: LIVE RADAR (ORDER PLACED) ────────────────── */}
      {appState === 'radar' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`fixed inset-0 z-50 flex flex-col justify-between max-w-md mx-auto ${isDarkMode ? 'bg-[#121212]' : 'bg-white'}`}>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-black text-[#0c831f] mb-1">Order Received!</h2>
            <p className={`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Rider is on the way. ETA: 8 mins</p>
          </div>

          <div className="flex-1 relative flex items-center justify-center bg-gray-900 overflow-hidden">
            {/* Radar Animation Elements */}
            <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=12.9716,77.5946&zoom=16&size=400x600&style=feature:all|element:labels|visibility:off&style=feature:water|element:geometry|color:0x111111&style=feature:landscape|element:geometry|color:0x222222&style=feature:road|element:geometry|color:0x333333&sensor=false')] bg-cover bg-center opacity-70"></div>
            
            <motion.div animate={{ scale: [1, 2.5], opacity: [0.8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute w-32 h-32 border border-[#0c831f] rounded-full"></motion.div>
            <motion.div animate={{ scale: [1, 4], opacity: [0.5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.5 }} className="absolute w-32 h-32 border border-[#0c831f] rounded-full"></motion.div>
            
            {/* Rider Dot */}
            <motion.div animate={{ x: [-80, -20, 20, 0], y: [100, 30, -20, 0] }} transition={{ duration: 10, ease: "linear" }} className="absolute z-10 w-8 h-8 bg-black rounded-full border-2 border-white flex items-center justify-center shadow-2xl">
              🛵
            </motion.div>
            
            {/* Destination Pin */}
            <div className="absolute w-4 h-4 rounded-full bg-blue-500 border-2 border-white z-0"></div>
          </div>

          <div className={`p-6 rounded-t-3xl -mt-6 z-20 ${isDarkMode ? 'bg-[#1a1a1a]' : 'bg-white'}`}>
            <div className="flex items-center gap-4 border-b pb-4 mb-4 dark:border-gray-800">
              <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-xl">👤</div>
              <div>
                <h3 className="font-extrabold">Ramesh Kumar</h3>
                <p className="text-xs font-bold text-gray-500">Delivery Partner • ⭐ 4.9</p>
              </div>
              <div className="ml-auto bg-green-100 text-[#0c831f] px-3 py-1.5 rounded-full font-black text-xs">
                CALL
              </div>
            </div>
            <button onClick={() => { setAppState('home'); setCart([]); }} className="w-full border-2 border-gray-200 text-gray-700 py-3 rounded-xl font-bold dark:border-gray-700 dark:text-gray-300">
              Return to Home
            </button>
          </div>
        </motion.div>
      )}

      {/* ────────────────── SCREEN: PROFILE / USER ACCOUNT ────────────────── */}
      {appState === 'profile' && (
        <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className={`fixed inset-0 z-50 flex flex-col max-w-md mx-auto ${isDarkMode ? 'bg-[#121212]' : 'bg-gray-50'}`}>
          <div className={`p-6 flex items-center justify-between shadow-sm border-b ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
            <h2 className="text-2xl font-extrabold tracking-tight">My Account</h2>
            <X size={28} className="cursor-pointer" onClick={() => setAppState('home')} />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            
            {/* User Details */}
            <div className={`rounded-2xl p-6 flex items-center gap-4 shadow-sm border ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className="w-16 h-16 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-full flex items-center justify-center text-white text-2xl font-black shadow-inner">
                RK
              </div>
              <div>
                <h3 className="text-xl font-extrabold mb-0.5">Rahul Kapoor</h3>
                <p className={`font-semibold text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>+91 98765 43210</p>
                <div className="mt-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-[10px] font-black w-fit border border-yellow-200">CASANO PRO</div>
              </div>
            </div>

            {/* Account Options */}
            <div className={`rounded-2xl overflow-hidden shadow-sm border ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-100'}`}>
              <div className={`flex items-center justify-between p-4 border-b cursor-pointer ${isDarkMode ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-100 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <MapPin size={20} className="text-[#0c831f]" />
                  <span className="font-bold text-sm">Saved Addresses</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </div>
              
              <div className={`flex items-center justify-between p-4 border-b cursor-pointer ${isDarkMode ? 'border-gray-800 hover:bg-gray-900' : 'border-gray-100 hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <History size={20} className="text-blue-500" />
                  <span className="font-bold text-sm">Previous Orders</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </div>
              
              <div className={`flex items-center justify-between p-4 cursor-pointer ${isDarkMode ? 'hover:bg-gray-900' : 'hover:bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <Wallet size={20} className="text-purple-500" />
                  <span className="font-bold text-sm">Casano Wallet (₹450)</span>
                </div>
                <ArrowRight size={16} className="text-gray-400" />
              </div>
            </div>

            {/* Logout */}
            <button className="w-full mt-8 py-4 bg-red-50 text-red-600 rounded-2xl font-black text-sm border border-red-100 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-900 dark:text-red-400">
              LOG OUT
            </button>
          </div>
        </motion.div>
      )}

      {/* ────────────────── FLOATING AI ASSISTANT ────────────────── */}
      {appState === 'home' && (
        <div className="fixed bottom-24 right-4 z-40">
          <motion.div 
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => setIsAssistantOpen(!isAssistantOpen)}
            className="w-14 h-14 bg-black rounded-full flex items-center justify-center shadow-xl border-2 border-white cursor-pointer relative"
          >
            <Bot size={24} className="text-[#fded00]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-r from-orange-500 to-yellow-500"></span>
            </span>
          </motion.div>

          <AnimatePresence>
            {isAssistantOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className={`absolute bottom-16 right-0 w-72 rounded-2xl shadow-2xl p-4 border overflow-hidden ${isDarkMode ? 'bg-[#1a1a1a] border-gray-800' : 'bg-white border-gray-200'}`}
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="flex gap-2 items-center">
                    <Bot size={16} className="text-[#fd7e14]" />
                    <span className="font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">Casano AI</span>
                  </div>
                  <X size={16} className="text-gray-400 cursor-pointer" onClick={() => setIsAssistantOpen(false)} />
                </div>
                <p className="text-xs font-semibold leading-relaxed mb-3">Hi! I notice you have eggs and milk in your cart. Would you like to add Bread to complete your breakfast?</p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-50 text-green-700 text-xs font-bold py-1.5 rounded-lg border border-green-200 hover:bg-green-100">Add Bread +₹40</button>
                  <button className="flex-1 bg-gray-50 text-gray-600 text-xs font-bold py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">No thanks</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}

// Helpers
function BillRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className={`flex justify-between text-sm mb-1 line-clamp-1 max-h-5 overflow-hidden ${highlight ? 'text-[#0c831f] font-bold' : 'text-gray-600 font-semibold dark:text-gray-400'}`}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

function NavIcon({ icon, label, active = false, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex flex-col items-center gap-1 cursor-pointer transition-colors ${active ? 'text-black dark:text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}>
      {icon}
      <span className="text-[10px] font-bold">{label}</span>
    </div>
  );
}
