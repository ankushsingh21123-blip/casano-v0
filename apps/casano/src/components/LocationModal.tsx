"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const { setDeliveryLocation } = useAuth();
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start pt-[86px] justify-center sm:justify-start sm:pl-[24%]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative rounded-2xl shadow-2xl w-full max-w-[500px] p-8 animate-in fade-in zoom-in-95 duration-200 mt-2 mx-4 sm:mx-0 border"
           style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}>
        <h2 className="text-[20px] font-bold mb-6 font-['Playfair_Display'] flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
          Welcome to <span style={{ color: "#C1492E", fontStyle: "italic" }}>Casano</span>
        </h2>
        
        <div className="flex items-start gap-4 mb-6">
          <MapPin className="w-8 h-8 mt-1 flex-shrink-0" style={{ color: "#B8962E" }} />
          <p className="text-[14px] leading-snug" style={{ color: "var(--text-secondary)" }}>
            Please provide your delivery location to see products at nearby stores.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            disabled={isDetecting}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-[14px] transition-all hover:scale-105 whitespace-nowrap shadow-lg flex-shrink-0 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:scale-100"
            style={{ background: "linear-gradient(135deg, #C1492E, #a03a22)", color: "#fff", boxShadow: "0 4px 15px rgba(193,73,46,0.3)" }}
            onClick={() => {
              if (navigator.geolocation) {
                setIsDetecting(true);
                navigator.geolocation.getCurrentPosition(
                  async (pos) => { 
                    try {
                      // Fetch real address from nominatim
                      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
                      const data = await res.json();
                      const address = data.display_name || 'Detected Location';
                      setDeliveryLocation(address.split(',').slice(0, 3).join(', '));
                    } catch (e) {
                      setDeliveryLocation("Detected Location");
                    }
                    setIsDetecting(false);
                    onClose(); 
                  },
                  (err) => {
                    alert('Location access denied. Please search manually.');
                    setIsDetecting(false);
                  }
                );
              } else {
                alert('Geolocation is not supported by your browser.');
              }
            }}
          >
            {isDetecting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {isDetecting ? "Detecting..." : "Detect my location"}
          </button>
          
          <div className="flex items-center justify-center w-full sm:w-auto py-2 sm:py-0 text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            <span className="px-2 uppercase tracking-wider text-xs">or</span>
          </div>

          <div className="w-full relative">
            <input 
              type="text" 
              placeholder="Search delivery location..."
              className="w-full border rounded-xl px-4 py-3 text-[14px] outline-none transition-colors"
              style={{ background: "transparent", borderColor: "var(--surface-border)", color: "var(--text-primary)" }}
              onFocus={(e) => e.target.style.borderColor = "#C1492E"}
              onBlur={(e) => e.target.style.borderColor = "var(--surface-border)"}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                  setDeliveryLocation(e.currentTarget.value.trim());
                  onClose();
                }
              }}
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}
