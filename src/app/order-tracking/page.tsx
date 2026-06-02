"use client";

import { useEffect, useState, useRef } from 'react';
import { Phone, HelpCircle, ShieldCheck, MapPin, X, ChevronRight, Package, CheckCircle, Truck, Home, Store, Bot, Star, ChefHat } from 'lucide-react';
import { ReactNode } from 'react';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerTooltip,
  MapControls,
  MapRoute,
  useMap,
} from "@/components/ui/map";

/* ─── Coordinates ─── */
const STORE_COORDS: [number, number] = [77.6245, 12.9352]; // Casano Store (lng, lat)
const HOME_COORDS: [number, number] = [77.6390, 12.9480]; // Customer Home
const MAP_CENTER: [number, number] = [77.6317, 12.9416]; // Midpoint

/* ─── Route GeoJSON ─── */
const routeGeoJSON: GeoJSON.Feature<GeoJSON.LineString> = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "LineString",
    coordinates: [
      STORE_COORDS,
      [77.6270, 12.9370],
      [77.6300, 12.9395],
      [77.6330, 12.9420],
      [77.6355, 12.9445],
      [77.6375, 12.9465],
      HOME_COORDS,
    ],
  },
};

/* ─── Tracking step data ─── */
const STEPS: { icon: ReactNode; label: string; sub: string }[] = [
  { icon: <Package className="w-5 h-5" />, label: 'Order confirmed', sub: 'We received your order' },
  { icon: <ChefHat className="w-5 h-5" />, label: 'Packing your order', sub: 'Your items are being packed' },
  { icon: <Truck className="w-5 h-5" />, label: 'On the way', sub: 'Arriving in 15 minutes' },
  { icon: <Home className="w-5 h-5" />, label: 'Delivered', sub: 'Enjoy your order!' },
];

/* ─── Support chat history ─── */
const CHAT_HISTORY = [
  {
    time: 'March 11, 7:29 PM',
    event: 'Order Placed',
    amount: '₹204.00',
    product: 'Brown Rolling Paper 64 sheets + 64 tips & Crushing Tray',
    status: 'Packed',
  },
];

/* ─── Animated Delivery Marker (pulsing driver dot on the route) ─── */
function AnimatedDriverMarker({ progress }: { progress: number }) {
  // Interpolate along the route based on progress (0–1)
  const coords = routeGeoJSON.geometry.coordinates;
  const totalSegments = coords.length - 1;
  const segIndex = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
  const segProgress = (progress * totalSegments) - segIndex;

  const lng = coords[segIndex][0] + (coords[segIndex + 1][0] - coords[segIndex][0]) * segProgress;
  const lat = coords[segIndex][1] + (coords[segIndex + 1][1] - coords[segIndex][1]) * segProgress;

  return (
    <MapMarker longitude={lng} latitude={lat}>
      <MarkerContent>
        <div className="relative">
          {/* Pulse ring */}
          <div className="absolute -inset-2 rounded-full bg-[#19c74a]/30 animate-ping" />
          {/* Driver dot */}
          <div className="w-5 h-5 rounded-full bg-[#19c74a] border-[3px] border-white shadow-lg shadow-[#19c74a]/40 relative z-10" />
        </div>
      </MarkerContent>
      <MarkerTooltip>
        <span className="font-bold">Kiran is on the way!</span>
      </MarkerTooltip>
    </MapMarker>
  );
}

export default function OrderTrackingPage() {
  const [driverAssigned, setDriverAssigned] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 0-indexed
  const [supportOpen, setSupportOpen] = useState(false);
  const [driverProgress, setDriverProgress] = useState(0);

  /* Auto-animate tracking steps */
  useEffect(() => {
    const t1 = setTimeout(() => setDriverAssigned(true), 3000);
    const t2 = setTimeout(() => setCurrentStep(2), 6000); // "On the way"
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  /* Animate driver along route when step >= 2 */
  useEffect(() => {
    if (currentStep < 2) return;
    const interval = setInterval(() => {
      setDriverProgress(prev => {
        if (prev >= 0.85) {
          clearInterval(interval);
          return 0.85;
        }
        return prev + 0.003;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [currentStep]);

  const statusText = currentStep < 2 ? 'Packing your order' : 'Arriving in 15 minutes';

  return (
    <div className="min-h-screen bg-[#e8e8e8] dark:bg-[#121212] flex flex-col lg:flex-row">

      {/* ─── Left Panel (info card) ─── */}
      <div className="relative z-10 w-full lg:w-[480px] lg:max-h-screen lg:overflow-y-auto bg-white dark:bg-[#1a1a1a] shadow-2xl flex flex-col lg:order-first order-last">

        {/* Top status */}
        <div className="px-6 pt-8 pb-6 border-b border-gray-100 dark:border-gray-800">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wide">Order is confirmed</p>
          <h1 className="text-3xl font-black text-[#19c74a] tracking-tight">{statusText}</h1>
        </div>

        {/* Progress steps */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-gray-100 dark:bg-gray-800" />
            <div
              className="absolute left-[21px] top-6 w-0.5 bg-[#19c74a] transition-all duration-1000 ease-in-out"
              style={{ height: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
            />
            <div className="space-y-4">
              {STEPS.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 relative">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg flex-shrink-0 transition-all duration-500 ${
                    idx <= currentStep
                      ? 'bg-[#19c74a] shadow-md shadow-[#19c74a]/30 scale-110'
                      : 'bg-gray-100 dark:bg-[#252525]'
                  }`}>
                    {step.icon}
                  </div>
                  <div>
                    <p className={`font-bold text-sm ${idx <= currentStep ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                      {step.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${idx <= currentStep ? 'text-gray-500 dark:text-gray-400' : 'text-gray-300 dark:text-gray-700'}`}>
                      {step.sub}
                    </p>
                  </div>
                  {idx <= currentStep && (
                    <CheckCircle className="w-4 h-4 text-[#19c74a] ml-auto" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Driver card */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          {!driverAssigned ? (
            <div className="bg-gray-50 dark:bg-[#252525] rounded-2xl p-5 text-center border border-gray-200 dark:border-gray-800">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-[#19c74a] rounded-full animate-spin mx-auto mb-3" />
              <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">Assigning delivery partner</h3>
              <p className="text-xs text-gray-500">We&apos;ll assign one as soon as your order is packed.</p>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-[#333] shadow-md flex-shrink-0">
                <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200&q=80" alt="Kiran" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">Your Delivery Partner</p>
                <h3 className="text-lg font-black text-gray-900 dark:text-white leading-none">Kiran Sharma</h3>
                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> 2.4 km away <span className="mx-1">•</span> <Star className="w-3 h-3 text-amber-400" /> 4.8</p>
              </div>
              <button className="w-12 h-12 bg-[#19c74a]/10 hover:bg-[#19c74a]/20 text-[#19c74a] rounded-full flex items-center justify-center transition-colors">
                <Phone className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Safety note */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <button className="w-full flex items-center gap-3 group">
            <ShieldCheck className="w-5 h-5 text-[#19c74a] flex-shrink-0" />
            <div className="flex-1 text-left">
              <p className="font-bold text-gray-900 dark:text-white text-sm">Your Casano store is 2 km away.</p>
              <p className="text-xs text-casano-orange font-bold mt-0.5 group-hover:underline">
                Learn about delivery partner safety →
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Delivery details */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-400" /> Your delivery details
          </h3>
          <div className="space-y-3 text-sm">
            <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-4">
              <p className="font-bold text-gray-900 dark:text-white mb-1">Delivery at Home</p>
              <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed">
                Ankush, Scaler, Macdonalds Electronic City Phase 1, Electronic City, Bengaluru - 560100
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">Ankush</p>
                <p className="text-gray-500 text-xs">+91 85230XXXXX</p>
              </div>
              <Phone className="w-4 h-4 text-gray-400" />
            </div>
            <div className="bg-gray-50 dark:bg-[#252525] rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wide">Order ID</p>
              <p className="font-black text-gray-900 dark:text-white tracking-widest text-sm">#ORD37929818736</p>
            </div>
          </div>
        </div>

        {/* Need help */}
        <div className="px-6 py-4">
          <button
            onClick={() => setSupportOpen(true)}
            className="w-full flex items-center justify-between p-4 bg-gray-50 dark:bg-[#252525] hover:bg-gray-100 dark:hover:bg-[#333] transition-colors rounded-xl border border-gray-100 dark:border-gray-800 group"
          >
            <div className="flex items-center gap-3 font-bold text-gray-900 dark:text-white">
              <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-casano-orange transition-colors" />
              Need help?
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* ─── Right Map Area (mapcn MapLibre GL) ─── */}
      <div className="relative flex-1 h-[45vh] lg:h-screen">
        <Map
          center={MAP_CENTER}
          zoom={14}
          pitch={30}
          className="w-full h-full"
        >
          {/* Map Controls */}
          <MapControls
            position="bottom-right"
            showZoom={true}
            showLocate={true}
          />

          {/* Route line from store to home */}
          <MapRoute
            coordinates={routeGeoJSON.geometry.coordinates as [number, number][]}
            color="#19c74a"
            width={4}
            opacity={0.8}
          />

          {/* Store Marker */}
          <MapMarker longitude={STORE_COORDS[0]} latitude={STORE_COORDS[1]}>
            <MarkerContent>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#1a1a1a] rounded-xl px-3 py-2 shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-shadow">
                <div className="w-7 h-7 rounded-full bg-[#19c74a]/15 flex items-center justify-center">
                  <Store className="w-4 h-4 text-[#19c74a]" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">Casano Store</span>
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <span>Pickup location • Electronic City</span>
            </MarkerTooltip>
          </MapMarker>

          {/* Home Marker */}
          <MapMarker longitude={HOME_COORDS[0]} latitude={HOME_COORDS[1]}>
            <MarkerContent>
              <div className="flex items-center gap-1.5 bg-white dark:bg-[#1a1a1a] rounded-xl px-3 py-2 shadow-lg border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-xl transition-shadow">
                <div className="w-7 h-7 rounded-full bg-blue-500/15 flex items-center justify-center">
                  <Home className="w-4 h-4 text-blue-500" />
                </div>
                <span className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">Your Home</span>
              </div>
            </MarkerContent>
            <MarkerTooltip>
              <span>Delivery address • Bengaluru</span>
            </MarkerTooltip>
          </MapMarker>

          {/* Animated Driver Marker (shows after driver is assigned and step is "On the way") */}
          {driverAssigned && currentStep >= 2 && (
            <AnimatedDriverMarker progress={driverProgress} />
          )}
        </Map>

        {/* Status overlay on map */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white dark:bg-[#1a1a1a] rounded-full px-6 py-3 shadow-xl border border-gray-100 dark:border-gray-800 flex items-center gap-3 z-10">
          <div className="w-3 h-3 rounded-full bg-[#19c74a] animate-pulse" />
          <span className="font-bold text-gray-900 dark:text-white text-sm">{statusText}</span>
        </div>
      </div>

      {/* ─── Support Chat Modal ─── */}
      {supportOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSupportOpen(false)} />

          {/* Chat panel */}
          <div className="relative w-full sm:max-w-[480px] bg-white dark:bg-[#1a1a1a] rounded-t-3xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden">
            {/* Chat header */}
            <div className="bg-[#19c74a] px-5 py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-black text-white text-[15px]">Casano Support</p>
                <p className="text-white/80 text-xs font-medium">Your personal virtual assistant</p>
              </div>
              <button
                onClick={() => setSupportOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Chat body */}
            <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* Today heading */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider px-2">Today</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
              </div>

              {/* Order event card */}
              {CHAT_HISTORY.map((h, i) => (
                <div key={i} className="bg-gray-50 dark:bg-[#252525] rounded-2xl p-4 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#19c74a]/10 flex items-center justify-center flex-shrink-0">
                      <Package className="w-5 h-5 text-[#19c74a]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs text-gray-400 font-medium">{h.time}</p>
                        <span className="text-xs font-black text-[#19c74a] bg-[#19c74a]/10 px-2 py-0.5 rounded-full">
                          {h.status}
                        </span>
                      </div>
                      <p className="font-bold text-gray-900 dark:text-white text-sm">
                        {h.event} | {h.amount}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 leading-relaxed">{h.product}</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Bot message */}
              <div className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-[#19c74a] flex items-center justify-center text-white text-xs flex-shrink-0"><Bot className="w-4 h-4" /></div>
                <div className="bg-[#19c74a]/10 rounded-2xl rounded-tl-none p-4 max-w-[80%]">
                  <p className="text-sm text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                    Hi! Your order is packed and a delivery partner will be assigned shortly. Expected delivery in <strong>15 minutes</strong>. Is there anything I can help you with?
                  </p>
                </div>
              </div>
            </div>

            {/* Quick options */}
            <div className="px-5 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex gap-2 flex-wrap">
                {['Track my order', 'Cancel order', 'Change address', 'Talk to agent'].map(opt => (
                  <button
                    key={opt}
                    className="px-4 py-2 rounded-full border border-[#19c74a] text-[#19c74a] text-xs font-bold hover:bg-[#19c74a]/5 transition-colors"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
