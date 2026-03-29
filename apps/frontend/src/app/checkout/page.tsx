"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronDown, ChevronUp, Lock, CreditCard, Wallet,
  Building2, Smartphone, Banknote, Clock, QrCode, CheckCircle2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import AuthGuard from '@/components/AuthGuard';

type PaymentMethod = 'wallets' | 'cards' | 'netbanking' | 'upi' | 'cash' | 'paylater';

/* ── Bank data ── */
const TOP_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', color: '#004C8F', emoji: '🏦' },
  { id: 'kotak', name: 'Kotak', color: '#EF3E33', emoji: '🏧' },
  { id: 'icici', name: 'ICICI', color: '#F07B1A', emoji: '🏛️' },
  { id: 'sbi', name: 'SBI', color: '#22408B', emoji: '🏗️' },
  { id: 'axis', name: 'Axis Bank', color: '#97144C', emoji: '💳' },
];

const ALL_BANKS = [
  'Yes Bank', 'IndusInd Bank', 'Bank of Baroda', 'Punjab National Bank',
  'Canara Bank', 'Union Bank of India', 'IDFC First Bank', 'Federal Bank',
  'RBL Bank', 'Karnataka Bank', 'South Indian Bank',
];

/* ── UPI Apps ── */
const UPI_APPS = [
  { id: 'gpay', name: 'G Pay', emoji: 'G', bg: '#4285F4', fg: '#fff' },
  { id: 'phonepe', name: 'PhonePe', emoji: 'Pe', bg: '#5f259f', fg: '#fff' },
  { id: 'paytm', name: 'Paytm', emoji: 'P', bg: '#00B9F1', fg: '#fff' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartTotal, items, clearCart } = useCart();
  const [activeAccordion, setActiveAccordion] = useState<PaymentMethod | null>('cards');

  /* Card form */
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [nickname, setNickname] = useState('');

  /* Netbanking */
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [allBanksSearch, setAllBanksSearch] = useState('');

  /* UPI */
  const [selectedUPI, setSelectedUPI] = useState<string | null>(null);
  const [showQR, setShowQR] = useState(false);
  const [upiId, setUpiId] = useState('');

  /* Payment flow - multi-step async simulation (Stripe → Kafka → Rider) */
  type ProcessingStep = null | 'initializing' | 'stripe' | 'kafka' | 'rider' | 'done';
  const [processingStep, setProcessingStep] = useState<ProcessingStep>(null);
  const isProcessing = processingStep !== null && processingStep !== 'done';
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  /* Totals */
  const deliveryCharge = 0;
  const handlingCharge = 5;
  const totalPay = cartTotal > 0 ? cartTotal + deliveryCharge + handlingCharge : 0;

  /* Validation */
  const isValidCardNumber = cardNumber.replace(/\s/g, '').length === 16;
  const isValidExpiry = /^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry);
  const isValidCvv = cvv.length >= 3;
  const isValidName = name.trim().length > 0;
  const isFormValid = isValidCardNumber && isValidExpiry && isValidCvv && isValidName;

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formatted && formatted.length <= 19) setCardNumber(formatted);
    else if (!value) setCardNumber('');
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) value = value.substring(0, 2) + '/' + value.substring(2, 4);
    if (value.length <= 5) setExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) setCvv(value);
  };

  const simulatePay = () => {
    // Stage 1: Initializing request
    setProcessingStep('initializing');
    setTimeout(() => {
      // Stage 2: Contacting Stripe Payment Gateway
      setProcessingStep('stripe');
      setTimeout(() => {
        // Stage 3: Requesting to nearby Kirana partner (sends to Vendor App)
        setProcessingStep('kafka');
        setTimeout(() => {
          // Stage 4: Dispatching rider
          setProcessingStep('rider');
          setTimeout(() => {
            // All done!
            setProcessingStep('done');
            setPaymentSuccess(true);
            
            const newOrderEvent = {
              id: `#ORD_${Math.floor(1000 + Math.random() * 9000)}`,
              item: `${items.length} item(s)`,
              status: "new",
              customer: "0.5km",
              amount: totalPay,
              timestamp: Date.now()
            };
            localStorage.setItem('casano_new_order', JSON.stringify(newOrderEvent));
            if (typeof window !== 'undefined') window.dispatchEvent(new Event('storage'));

            setTimeout(() => {
              clearCart();
              router.push('/order-tracking');
            }, 1200);
          }, 1000);
        }, 1200);
      }, 1500);
    }, 800);
  };

  const handleCardSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    simulatePay();
  };

  const toggle = (m: PaymentMethod) =>
    setActiveAccordion(activeAccordion === m ? null : m);

  const filteredBanks = allBanksSearch
    ? ALL_BANKS.filter(b => b.toLowerCase().includes(allBanksSearch.toLowerCase()))
    : ALL_BANKS;

  return (
    <AuthGuard>
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-8 transition-colors duration-300">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
          <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-6">Select Payment Method</h1>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* ── Left Column: Accordion ── */}
            <div className="flex-1 flex flex-col gap-3">

              {/* ── Wallets ── */}
              <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-colors ${activeAccordion === 'wallets' ? 'border-[#19c74a]' : 'border-gray-100 dark:border-gray-800'}`}>
                <button onClick={() => toggle('wallets')} className="w-full px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 font-bold">
                    <Wallet className="w-5 h-5 text-gray-400" /> Wallets
                  </div>
                  {activeAccordion === 'wallets' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {activeAccordion === 'wallets' && (
                  <div className="px-5 pb-5 pt-2 space-y-3">
                    {[{ name: 'Mobikwik', initials: 'M', bg: '#1e3a5f' }, { name: 'PhonePe Wallet', initials: 'Pe', bg: '#5f259f' }].map(w => (
                      <div key={w.name} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-[#222]">
                        <div className="flex items-center gap-3">
                          <div style={{ background: w.bg }} className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                            {w.initials}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm">{w.name}</p>
                            <p className="text-xs text-gray-500 mt-0.5">Link your wallet to pay instantly</p>
                          </div>
                        </div>
                        <button className="text-[#19c74a] font-bold text-sm uppercase tracking-wider border border-[#19c74a]/40 px-3 py-1 rounded-lg hover:bg-[#19c74a]/5 transition">
                          LINK
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Credit / Debit Cards ── */}
              <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-colors ${activeAccordion === 'cards' ? 'border-[#19c74a] shadow-sm' : 'border-gray-100 dark:border-gray-800'}`}>
                <button onClick={() => toggle('cards')} className="w-full px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 font-bold">
                    <CreditCard className={`w-5 h-5 ${activeAccordion === 'cards' ? 'text-[#19c74a]' : 'text-gray-400'}`} />
                    Add credit or debit cards
                  </div>
                  {activeAccordion === 'cards' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {activeAccordion === 'cards' && (
                  <div className="px-5 pb-6 pt-2">
                    {/* Green checked header */}
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-5 h-5 text-[#19c74a]" />
                      <span className="font-bold text-gray-800 dark:text-gray-200 text-sm">Add Debit / Credit / ATM Card</span>
                    </div>
                    {/* Card brand logos */}
                    <div className="flex gap-2 mb-5 flex-wrap">
                      {[
                        { label: 'VISA', color: '#1a1f71', text: '#fff' },
                        { label: 'MC', color: '#EB001B', text: '#fff' },
                        { label: 'RuPay', color: '#097143', text: '#fff' },
                        { label: 'Pluxee', color: '#e91e8c', text: '#fff' },
                        { label: 'Amex', color: '#2E77BC', text: '#fff' },
                        { label: 'Diners', color: '#444', text: '#fff' },
                      ].map(b => (
                        <div key={b.label} style={{ background: b.color, color: b.text }} className="px-2.5 py-1.5 rounded-md text-[11px] font-black tracking-wide">
                          {b.label}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleCardSubmit} className="space-y-4">
                      <input type="text" placeholder="Name on Card" required
                        value={name} onChange={(e: any) => setName(e.target.value)}
                        className="w-full bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#19c74a] transition-colors text-gray-900 dark:text-white font-medium placeholder:font-normal placeholder:text-gray-400"
                      />
                      <input type="text" placeholder="Card Number" required
                        value={cardNumber} onChange={handleCardNumberChange}
                        className="w-full bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#19c74a] transition-colors text-gray-900 dark:text-white font-medium placeholder:font-normal placeholder:text-gray-400 tabular-nums tracking-widest"
                      />
                      <div className="flex gap-4">
                        <input type="text" placeholder="Expiry Date (MM/YY)" required
                          value={expiry} onChange={handleExpiryChange}
                          className="w-1/2 bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#19c74a] transition-colors text-gray-900 dark:text-white font-medium placeholder:font-normal placeholder:text-gray-400"
                        />
                        <div className="w-1/2 relative">
                          <input type="password" placeholder="CVV" required
                            value={cvv} onChange={handleCvvChange} maxLength={4}
                            className="w-full bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 pr-12 outline-none focus:border-[#19c74a] transition-colors text-gray-900 dark:text-white font-medium placeholder:font-normal placeholder:text-gray-400 tabular-nums tracking-widest"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute right-4 top-[14px]" />
                        </div>
                      </div>
                      <input type="text" placeholder="Nickname for card (Optional)"
                        value={nickname} onChange={(e: any) => setNickname(e.target.value)}
                        className="w-full bg-white dark:bg-[#222] border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 outline-none focus:border-[#19c74a] transition-colors text-gray-900 dark:text-white font-medium placeholder:font-normal placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        disabled={!isFormValid || isProcessing}
                        className="w-full mt-2 bg-[#19c74a] hover:bg-[#15a83e] disabled:bg-[#d4edd9] disabled:dark:bg-[#1a4023] disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl p-4 font-bold text-[16px] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#19c74a]/20 disabled:shadow-none"
                      >
                        {isProcessing
                          ? <><div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />Processing...</>
                          : 'Checkout'
                        }
                      </button>
                      <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                        We accept Credit and Debit Cards from Visa, Mastercard, Rupay, Pluxee, American Express & Diners.
                      </p>
                    </form>
                  </div>
                )}
              </div>

              {/* ── Netbanking ── */}
              <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-colors ${activeAccordion === 'netbanking' ? 'border-[#19c74a] shadow-sm' : 'border-gray-100 dark:border-gray-800'}`}>
                <button onClick={() => toggle('netbanking')} className="w-full px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 font-bold">
                    <Building2 className="w-5 h-5 text-gray-400" /> Netbanking
                  </div>
                  {activeAccordion === 'netbanking' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {activeAccordion === 'netbanking' && (
                  <div className="px-5 pb-5 pt-2">
                    {/* Top 5 bank grid */}
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {TOP_BANKS.map(bank => (
                        <button
                          key={bank.id}
                          onClick={() => setSelectedBank(selectedBank === bank.id ? null : bank.id)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all text-center ${
                            selectedBank === bank.id
                              ? 'border-[#19c74a] bg-[#19c74a]/5'
                              : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div style={{ background: bank.color }} className="w-9 h-9 rounded-full flex items-center justify-center text-white text-lg">
                            {bank.emoji}
                          </div>
                          <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300 leading-tight">{bank.name}</span>
                          {selectedBank === bank.id && (
                            <div className="w-4 h-4 rounded-full bg-[#19c74a] flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>

                    {/* All banks searchable dropdown */}
                    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">All Banks</p>
                      <input
                        type="text"
                        placeholder="Search all banks..."
                        value={allBanksSearch}
                        onChange={(e: any) => setAllBanksSearch(e.target.value)}
                        className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#19c74a] transition-colors text-gray-900 dark:text-white mb-2"
                      />
                      <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-100 dark:border-gray-800">
                        {filteredBanks.map(b => (
                          <button
                            key={b}
                            onClick={() => setSelectedBank(b)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-colors ${
                              selectedBank === b
                                ? 'bg-[#19c74a]/10 text-[#19c74a] font-bold'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252525]'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    {selectedBank && (
                      <button onClick={simulatePay} className="w-full mt-4 bg-[#19c74a] hover:bg-[#15a83e] text-white rounded-xl p-4 font-bold text-[16px] transition-all shadow-lg shadow-[#19c74a]/20">
                        Pay with {selectedBank}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ── UPI ── */}
              <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-colors ${activeAccordion === 'upi' ? 'border-[#19c74a] shadow-sm' : 'border-gray-100 dark:border-gray-800'}`}>
                <button onClick={() => toggle('upi')} className="w-full px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 font-bold">
                    <Smartphone className="w-5 h-5 text-gray-400" /> UPI
                  </div>
                  {activeAccordion === 'upi' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {activeAccordion === 'upi' && (
                  <div className="px-5 pb-5 pt-2">
                    {/* Quick app logos */}
                    <div className="flex gap-3 mb-4">
                      {UPI_APPS.map(app => (
                        <button
                          key={app.id}
                          onClick={() => { setSelectedUPI(selectedUPI === app.id ? null : app.id); setShowQR(false); }}
                          className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all flex-1 ${
                            selectedUPI === app.id
                              ? 'border-[#19c74a] bg-[#19c74a]/5'
                              : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                        >
                          <div style={{ background: app.bg, color: app.fg }} className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-md">
                            {app.emoji}
                          </div>
                          <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{app.name}</span>
                        </button>
                      ))}
                    </div>

                    {selectedUPI && (
                      <div className="flex gap-3 mb-4">
                        <input
                          type="text"
                          placeholder={`Enter UPI ID (e.g. name@${selectedUPI})`}
                          value={upiId}
                          onChange={(e: any) => setUpiId(e.target.value)}
                          className="flex-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#222] rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#19c74a] transition-colors text-gray-900 dark:text-white"
                        />
                        <button
                          onClick={simulatePay}
                          disabled={!upiId.includes('@')}
                          className="bg-[#19c74a] disabled:bg-gray-200 disabled:dark:bg-gray-700 disabled:text-gray-400 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all"
                        >
                          Pay
                        </button>
                      </div>
                    )}

                    {/* Divider */}
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                      <span className="text-xs text-gray-400 font-medium">OR</span>
                      <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                    </div>

                    {/* QR Code */}
                    <button
                      onClick={() => setShowQR(!showQR)}
                      className={`w-full py-3 rounded-xl border-2 border-dashed font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        showQR
                          ? 'border-[#19c74a] text-[#19c74a] bg-[#19c74a]/5'
                          : 'border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-[#19c74a] hover:text-[#19c74a]'
                      }`}
                    >
                      <QrCode className="w-5 h-5" />
                      {showQR ? 'Hide QR Code' : 'Generate QR Code'}
                    </button>

                    {showQR && (
                      <div className="mt-4 text-center">
                        {/* Mock QR code using CSS grid pattern */}
                        <div className="inline-block bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                          <div className="w-40 h-40 grid grid-cols-10 gap-0.5">
                            {Array.from({ length: 100 }).map((_, i) => (
                              <div
                                key={i}
                                className="rounded-[1px]"
                                style={{
                                  background: Math.random() > 0.5 || [0,1,2,3,4,10,11,12,13,20,21,22,40,41,42,43,50,51,52,53,60,61,62,63,70,71,72,73,80,81,82,83].includes(i) ? '#111' : '#fff'
                                }}
                              />
                            ))}
                          </div>
                          <p className="text-[11px] text-gray-500 mt-3 font-medium">Scan using any UPI app</p>
                          <p className="text-[10px] text-gray-400 font-medium">Valid for 10 minutes</p>
                        </div>
                        <button onClick={simulatePay} className="mt-4 w-full bg-[#19c74a] hover:bg-[#15a83e] text-white rounded-xl p-3 font-bold text-sm">
                          ✓ I&apos;ve paid via QR
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ── Cash ── */}
              <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-colors ${activeAccordion === 'cash' ? 'border-[#19c74a] shadow-sm' : 'border-gray-100 dark:border-gray-800'}`}>
                <button onClick={() => toggle('cash')} className="w-full px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 font-bold">
                    <Banknote className="w-5 h-5 text-gray-400" /> Cash on Delivery
                  </div>
                  {activeAccordion === 'cash' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {activeAccordion === 'cash' && (
                  <div className="px-5 pb-5 pt-2">
                    <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl p-4 flex items-start gap-3">
                      <span className="text-xl flex-shrink-0">💵</span>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300 leading-relaxed">
                        Please keep exact change handy to help us serve you better.
                      </p>
                    </div>
                    <button onClick={simulatePay} className="w-full mt-4 bg-[#19c74a] hover:bg-[#15a83e] text-white rounded-xl p-4 font-bold text-[16px] transition-all shadow-lg shadow-[#19c74a]/20">
                      Confirm Cash on Delivery
                    </button>
                  </div>
                )}
              </div>

              {/* ── Pay Later ── */}
              <div className={`bg-white dark:bg-[#1a1a1a] rounded-2xl overflow-hidden border transition-colors ${activeAccordion === 'paylater' ? 'border-[#19c74a]' : 'border-gray-100 dark:border-gray-800'}`}>
                <button onClick={() => toggle('paylater')} className="w-full px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-gray-900 dark:text-gray-100 font-bold">
                    <Clock className="w-5 h-5 text-gray-400" /> Pay Later
                  </div>
                  {activeAccordion === 'paylater' ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>
                {activeAccordion === 'paylater' && (
                  <div className="px-5 pb-5 pt-2">
                    <div className="bg-gray-50 dark:bg-[#222] rounded-xl p-4 text-center">
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                        Pay Later options (Simpl, LazyPay, etc.) coming soon!
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Right Column: Order Side Panel ── */}
            <div className="w-full lg:w-[340px] flex-shrink-0">
              <div className="sticky top-[80px] space-y-4">

                {/* Delivery Address */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-sm uppercase tracking-wide flex items-center gap-2">
                    📍 Delivery Address
                  </h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                    <span className="font-semibold text-[#19c74a]">Home: </span>
                    Ankush, Scaler, Macdonals, Electronic City Phase I, Electronic City, Bengaluru
                  </p>
                </div>

                {/* Cart Summary */}
                <div className="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">My Cart</h3>
                    <span className="text-xs text-gray-500 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    {items.map(item => (
                      <div key={item.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800 flex-shrink-0 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">{item.size}</p>
                          <p className="text-xs text-gray-500">₹{item.price} × {item.quantity}</p>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Items ({items.length})</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Delivery</span>
                      <span className="text-[#19c74a] font-bold">FREE</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Handling</span>
                      <span className="font-medium text-gray-800 dark:text-gray-200">₹{handlingCharge}</span>
                    </div>
                    <div className="flex justify-between font-black text-[16px] text-gray-900 dark:text-white pt-2 border-t border-dashed border-gray-200 dark:border-gray-800">
                      <span>Total</span>
                      <span>₹{totalPay}</span>
                    </div>
                  </div>

                  {/* Disabled Pay Now placeholder */}
                  <button
                    disabled
                    className="w-full mt-4 bg-gray-100 dark:bg-[#333] border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 rounded-xl p-4 font-bold text-[16px] flex items-center justify-center cursor-not-allowed"
                  >
                    Pay Now
                  </button>
                  <p className="text-xs text-center text-gray-400 mt-3 font-medium">
                    Select a payment method on the left to proceed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Async Pipeline Processing Overlay (Stripe → Kafka → Rider) ── */}
      {isProcessing && (() => {
        const steps = [
          { id: 'initializing', icon: '🔐', label: 'Securing Connection', sub: 'Encrypting your payment details...' },
          { id: 'stripe',       icon: '💳', label: 'Contacting Payment Gateway', sub: 'Verifying with Stripe...' },
          { id: 'kafka',        icon: '🏪', label: 'Requesting Nearby Store', sub: 'Sending order request to your local Kirana partner...' },
          { id: 'rider',        icon: '🛵', label: 'Dispatching Your Rider', sub: 'Matching nearest delivery partner...' },
        ];
        const currentIdx = steps.findIndex(s => s.id === processingStep);
        const current = steps[currentIdx] ?? steps[0];
        return (
          <div className="fixed inset-0 bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm z-[100] flex flex-col items-center justify-center gap-8 px-6">
            {/* Animated ring with icon */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-gray-100 dark:border-gray-800 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-[#19c74a] rounded-full animate-spin" />
              <span className="text-3xl">{current.icon}</span>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-1 tracking-tight">{current.label}</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 font-medium animate-pulse">{current.sub}</p>
            </div>

            {/* Progress pipeline */}
            <div className="flex items-center gap-2">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-500 ${
                    i < currentIdx  ? 'bg-[#19c74a] border-[#19c74a] text-white' :
                    i === currentIdx ? 'border-[#19c74a] text-[#19c74a] bg-[#e8f9ee] dark:bg-[#19c74a]/10 scale-110' :
                                       'border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                  }`}>
                    {i < currentIdx ? '✓' : step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={`w-8 h-0.5 rounded-full transition-all duration-500 ${
                      i < currentIdx ? 'bg-[#19c74a]' : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-400 font-medium">Please do not close or refresh this page.</p>
          </div>
        );
      })()}

      {/* ── Payment Success Overlay ── */}
      {paymentSuccess && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(8px)',
          zIndex: 110,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center'
        }}>
          {/* keyframes injected safely */}
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes pay-slide-top {
              0%   { transform: translateY(0); }
              50%  { transform: translateY(-70px) rotate(90deg); }
              60%  { transform: translateY(-70px) rotate(90deg); }
              100% { transform: translateY(-8px) rotate(90deg); }
            }
            @keyframes pay-slide-post {
              50%  { transform: translateY(0); }
              100% { transform: translateY(-70px); }
            }
            @keyframes pay-fade-in {
              0%   { opacity: 0; transform: translateY(-5px); }
              100% { opacity: 1; transform: translateY(0); }
            }
          `}} />

          {/* Card widget */}
          <div style={{
            backgroundColor: '#fff', display: 'flex',
            width: 270, height: 120, position: 'relative',
            borderRadius: 6, transform: 'scale(1.03)',
            boxShadow: '0 8px 32px rgba(93,226,163,0.25)'
          }}>
            {/* left green panel */}
            <div style={{
              backgroundColor: '#5de2a3', width: '100%', height: 120,
              borderRadius: 4, position: 'relative', display: 'flex',
              justifyContent: 'center', alignItems: 'center', overflow: 'hidden'
            }}>
              {/* credit card */}
              <div style={{
                width: 70, height: 46, backgroundColor: '#c7ffbc',
                borderRadius: 6, position: 'absolute', display: 'flex',
                zIndex: 10, flexDirection: 'column', alignItems: 'center',
                boxShadow: '9px 9px 9px -2px rgba(77,200,143,0.72)',
                animation: 'pay-slide-top 1.2s cubic-bezier(0.645,0.045,0.355,1) both'
              }}>
                <div style={{ width: 65, height: 13, backgroundColor: '#80ea69', borderRadius: 2, marginTop: 7 }} />
                <div style={{
                  width: 8, height: 8, backgroundColor: '#379e1f',
                  boxShadow: '0 -10px 0 0 #26850e, 0 10px 0 0 #56be3e',
                  borderRadius: '50%', transform: 'rotate(90deg)', margin: '10px 0 0 -30px'
                }} />
              </div>
              {/* POS terminal */}
              <div style={{
                width: 63, height: 75, backgroundColor: '#dddde0',
                position: 'absolute', zIndex: 11, top: 120,
                borderRadius: 6, overflow: 'hidden',
                animation: 'pay-slide-post 1s cubic-bezier(0.165,0.84,0.44,1) both'
              }}>
                <div style={{
                  width: 47, height: 9, backgroundColor: '#545354',
                  position: 'absolute', borderRadius: '0 0 3px 3px', right: 8, top: 8
                }} />
                <div style={{
                  width: 47, height: 23, backgroundColor: '#fff',
                  position: 'absolute', top: 22, right: 8, borderRadius: 3
                }}>
                  <div style={{
                    position: 'absolute', fontSize: 16, width: '100%',
                    left: 0, top: 0, color: '#4b953b', textAlign: 'center',
                    fontFamily: 'sans-serif', fontWeight: 700,
                    animation: 'pay-fade-in 0.3s 1s backwards'
                  }}>$</div>
                </div>
                <div style={{
                  width: 12, height: 12, backgroundColor: '#838183',
                  boxShadow: '0 -18px 0 0 #838183, 0 18px 0 0 #838183',
                  borderRadius: 2, position: 'absolute', transform: 'rotate(90deg)',
                  left: 25, top: 52
                }} />
                <div style={{
                  width: 12, height: 12, backgroundColor: '#aaa9ab',
                  boxShadow: '0 -18px 0 0 #aaa9ab, 0 18px 0 0 #aaa9ab',
                  borderRadius: 2, position: 'absolute', transform: 'rotate(90deg)',
                  left: 25, top: 68
                }} />
              </div>
            </div>
          </div>

          <p style={{ marginTop: 24, fontSize: 18, fontWeight: 900, color: '#19c74a', letterSpacing: '-0.5px' }}>
            Payment Successful!
          </p>
        </div>
      )}
    </>
    </AuthGuard>
  );
}
