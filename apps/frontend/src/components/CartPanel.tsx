"use client";

import { useEffect, useState } from "react";
import { X, ChevronRight, Minus, Plus, Clock, Truck, FileText, HeartHandshake, Heart, ShoppingCart, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Checkbox from "./Checkbox";

interface CartPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick?: () => void;
}

export default function CartPanel({ isOpen, onClose, onLoginClick }: CartPanelProps) {
  const router = useRouter();
  const { items, addItem, removeItem, cartTotal } = useCart();
  const { isLoggedIn } = useAuth();

  // Donation & Tip state
  const [donationChecked, setDonationChecked] = useState(false);
  const [selectedTip, setSelectedTip] = useState<number | 'custom' | null>(null);
  const [customTip, setCustomTip] = useState('');

  const deliveryCharge = 0;
  const handlingCharge = 5;
  const donationAmount = donationChecked ? 1 : 0;
  const tipAmount = selectedTip === 'custom' ? (parseInt(customTip) || 0) : (selectedTip ?? 0);
  const totalPay = cartTotal > 0 ? cartTotal + deliveryCharge + handlingCharge + donationAmount + tipAmount : 0;
  const originalTotal = items.reduce((s, i) => s + (i.originalPrice ?? i.price) * i.quantity, 0);
  const savedAmount = items.reduce((s, i) => s + ((i.originalPrice ?? i.price) - i.price) * i.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-[70] w-full sm:w-[420px] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        style={{ background: "#FDFBF7" }}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between z-10 sticky top-0" style={{ background: "#EFEADD", borderBottom: "1px solid #E2DDD0" }}>
          <h2 className="text-[18px] font-black flex items-center gap-2" style={{ color: "#2A2B2A" }}>
            My Cart
          </h2>
          <button onClick={onClose} className="p-2 rounded-full transition-colors" style={{ background: "#FDFBF7", border: "1px solid #E2DDD0" }}>
            <X className="w-4 h-4 stroke-[3]" style={{ color: "#2A2B2A" }} />
          </button>
        </div>

        {/* Content Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">

          {/* Free Delivery Banner */}
          <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "#EFEADD", border: "1px solid #E2DDD0" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#E6F2EC", border: "1px solid #C5E4D0" }}>
              <Clock className="w-5 h-5" style={{ color: "#214A36" }} />
            </div>
            <div>
              <p className="font-extrabold text-[15px]" style={{ color: "#2A2B2A" }}>Free delivery in 15 minutes</p>
              <p className="text-xs font-medium mt-0.5" style={{ color: "#9A9B9A" }}>Shipment of {items.length} item{items.length !== 1 ? 's' : ''}</p>
            </div>
          </div>

          {/* Items List */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid #E2DDD0", background: "#EFEADD" }}>
            <div className="divide-y" style={{ borderColor: "#E2DDD0" }}>
              {items.length === 0 ? (
                <div className="p-8 text-center flex flex-col items-center justify-center mt-8">
                  <div className="w-16 h-16 mb-4 rounded-2xl bg-gray-50 dark:bg-[#222] flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm">Add some items from your local Kirana store!</p>
                </div>
              ) : items.map((item: any) => (
                <div key={item.id} className="p-4 flex gap-4">
                  <div className="w-[72px] h-[72px] bg-white rounded-xl p-2 border border-gray-100 dark:border-gray-800 flex-shrink-0 shadow-sm">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain rounded" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[14px] font-semibold text-gray-800 dark:text-gray-200 leading-snug mb-0.5">{item.name}</h4>
                      <p className="text-[13px] text-gray-500 font-medium mb-3">{item.size}</p>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center text-sm gap-1.5">
                        <span className="font-bold text-gray-900 dark:text-white text-[15px]">₹{item.price}</span>
                        {item.originalPrice && (
                          <span className="text-gray-400 line-through text-xs font-medium">₹{item.originalPrice}</span>
                        )}
                      </div>

                      {/* Saffron Quantity Toggle */}
                      <div className="flex items-center rounded-lg h-8" style={{ background: "#C1492E" }}>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="w-8 h-full flex items-center justify-center font-bold rounded-l-lg transition-colors text-white"
                          style={{ color: "#fff" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Minus className="w-4 h-4 stroke-[3]" />
                        </button>
                        <span className="w-7 text-center text-[13px] font-bold text-white">{item.quantity}</span>
                        <button
                          onClick={() => {
                            const { quantity, ...itemWithoutQuantity } = item;
                            addItem(itemWithoutQuantity);
                          }}
                          className="w-8 h-full flex items-center justify-center font-bold rounded-r-lg transition-colors text-white"
                          onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <Plus className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Details */}
          {items.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-4">Bill details</h3>

              {/* Items total with savings */}
              <div className="flex items-center justify-between mb-3 text-[13px] font-medium">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5" /> Items total
                  {savedAmount > 0 && (
                    <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md" style={{ color: "#214A36", background: "#E6F2EC" }}>
                      Saved ₹{savedAmount}
                    </span>
                  )}
                </span>
                <div className="flex items-center gap-1.5">
                  {savedAmount > 0 && (
                    <span className="text-gray-400 line-through text-xs">₹{originalTotal}</span>
                  )}
                  <span className="text-gray-900 dark:text-gray-300">₹{cartTotal}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3 text-[13px] font-medium">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Truck className="w-3.5 h-3.5" /> Delivery charge</span>
                <span className="font-bold" style={{ color: "#214A36" }}>FREE</span>
              </div>

              <div className="flex items-center justify-between mb-4 text-[13px] font-medium">
                <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><FileText className="w-3.5 h-3.5" /> Handling charge</span>
                <span className="text-gray-900 dark:text-gray-300">₹{handlingCharge}</span>
              </div>

              {donationChecked && (
                <div className="flex items-center justify-between mb-3 text-[13px] font-medium">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><HeartHandshake className="w-3.5 h-3.5" /> Feeding India donation</span>
                  <span className="text-gray-900 dark:text-gray-300">₹1</span>
                </div>
              )}

              {tipAmount > 0 && (
                <div className="flex items-center justify-between mb-3 text-[13px] font-medium">
                  <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2"><Heart className="w-3.5 h-3.5" /> Delivery partner tip</span>
                  <span className="text-gray-900 dark:text-gray-300">₹{tipAmount}</span>
                </div>
              )}

              <div className="border-t border-dashed border-gray-200 dark:border-gray-800 pt-4 flex items-center justify-between">
                <span className="font-bold text-gray-900 dark:text-white text-[15px]">Grand total</span>
                <span className="font-black text-[18px] text-gray-900 dark:text-white tracking-tight">₹{totalPay}</span>
              </div>

              <div className="mt-4 text-[11px] text-gray-400 leading-tight bg-gray-50 dark:bg-[#222] p-3 rounded-xl">
                Cancellation Policy: Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.
              </div>
            </div>
          )}

          {/* ─── Feeding India Donation ─── */}
          {items.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-start gap-3">
              <div className="w-12 h-12 rounded-xl flex-shrink-0 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-100 dark:border-yellow-900/30 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 dark:text-white text-[14px]">Feeding India donation</p>
                <p className="text-[12px] text-gray-500 mt-0.5 leading-relaxed">
                  Working towards a malnutrition free India. Feeding India…{" "}
                  <span className="text-[#19c74a] font-semibold cursor-pointer">read more</span>
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 mt-1">
                <span className="text-[13px] font-bold text-gray-700 dark:text-gray-300">₹1</span>
                <Checkbox
                  id="feeding-india-checkbox"
                  checked={donationChecked}
                  onChange={setDonationChecked}
                />
              </div>
            </div>
          )}

          {/* ─── Tip Your Delivery Partner ─── */}
          {items.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-900 dark:text-white text-[15px] mb-1">Tip your delivery partner</h3>
              <p className="text-[12px] text-gray-500 mb-4 leading-relaxed">
                Your kindness means a lot! 100% of your tip will go directly to your delivery partner.
              </p>
              <div className="flex gap-2 flex-wrap">
                {[
                  { amount: 20, label: '₹20' },
                  { amount: 30, label: '₹30' },
                  { amount: 50, label: '₹50' },
                ].map((tip) => (
                  <button
                    key={tip.amount}
                    onClick={() => setSelectedTip(selectedTip === tip.amount ? null : tip.amount)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-semibold transition-all active:scale-95 ${
                      selectedTip === tip.amount
                        ? 'border-[#19c74a] bg-[#19c74a]/10 text-[#19c74a]'
                        : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#19c74a] hover:text-[#19c74a] hover:bg-[#19c74a]/5'
                    }`}
                  >
                    {tip.label}
                  </button>
                ))}
                <button
                  onClick={() => setSelectedTip(selectedTip === 'custom' ? null : 'custom')}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-[13px] font-semibold transition-all active:scale-95 ${
                    selectedTip === 'custom'
                      ? 'border-[#19c74a] bg-[#19c74a]/10 text-[#19c74a]'
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#19c74a] hover:text-[#19c74a] hover:bg-[#19c74a]/5'
                  }`}
                >
                  Custom amount
                </button>
              </div>
              {selectedTip === 'custom' && (
                <div className="mt-3">
                  <input
                    type="number"
                    placeholder="Enter custom tip amount..."
                    value={customTip}
                    onChange={(e: any) => setCustomTip(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222] rounded-xl px-4 py-2.5 text-[13px] font-semibold text-gray-900 dark:text-white outline-none focus:border-[#19c74a] transition-colors"
                  />
                </div>
              )}
            </div>
          )}

          {/* User Delivery Info (Auth Guard) */}
          {isLoggedIn && items.length > 0 && (
            <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-[#222] flex items-center justify-center border border-gray-200 dark:border-gray-700">
                  <MapPin className="w-4 h-4 text-[#19c74a]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">Delivering to Home</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[190px]">
                    Ankush, Scaler, Macdonals Electronic City Phas...
                  </p>
                </div>
              </div>
              <button className="text-[#19c74a] font-bold text-xs uppercase tracking-wider hover:opacity-80">Change</button>
            </div>
          )}

          <div className="h-28"></div> {/* Bottom Button Padding */}
        </div>

        {/* Sticky Proceed Button */}
        {items.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 z-10" style={{ background: "#EFEADD", borderTop: "1px solid #E2DDD0", boxShadow: "0 -10px 30px rgba(0,0,0,0.04)" }}>
            {!isLoggedIn ? (
              <button
                onClick={onLoginClick}
                className="w-full text-white rounded-[14px] p-4 flex items-center justify-center font-bold text-[17px] transition-all hover:-translate-y-0.5"
                style={{ background: "#C1492E", boxShadow: "0 4px 16px #C1492E33" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
                onMouseLeave={e => (e.currentTarget.style.background = "#C1492E")}
              >
                Login to Proceed <ChevronRight className="w-5 h-5 ml-1 stroke-[3]" />
              </button>
            ) : (
              <button
                onClick={() => {
                  onClose();
                  router.push("/checkout");
                }}
                className="w-full text-white rounded-[14px] p-4 flex items-center justify-between font-bold transition-all hover:-translate-y-0.5"
                style={{ background: "#C1492E", boxShadow: "0 4px 16px #C1492E33" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
                onMouseLeave={e => (e.currentTarget.style.background = "#C1492E")}
              >
                <div className="flex flex-col text-left">
                  <span className="text-[13px] text-white/95 font-semibold">₹{totalPay}</span>
                  <span className="text-[15px] font-black uppercase tracking-wider">Total</span>
                </div>
                <div className="flex items-center text-[17px]">
                  Proceed to Pay <ChevronRight className="w-5 h-5 ml-2 stroke-[3]" />
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
