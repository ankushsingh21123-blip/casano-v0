"use client";

import { useEffect } from "react";
import { MapPin } from "lucide-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[500px] p-6 animate-in fade-in zoom-in-95 duration-200 mt-2">
        <h2 className="text-[17px] font-bold text-gray-800 mb-6">
          Welcome to <span className="text-brand-yellow font-black">blink<span className="text-brand-green">it</span></span>
        </h2>
        
        <div className="flex items-start gap-4 mb-6">
          <MapPin className="w-8 h-8 text-gray-700 mt-1 flex-shrink-0" />
          <p className="text-[14px] text-gray-600 leading-snug">
            Please provide your delivery location to see products at nearby store
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button className="w-full sm:w-auto bg-brand-green hover:bg-[#0b721b] text-white px-6 py-3 rounded-lg font-medium text-[14px] transition-colors whitespace-nowrap">
            Detect my location
          </button>
          
          <div className="flex items-center justify-center w-full sm:w-8 py-2 sm:py-0 text-gray-400 text-sm font-medium">
            <span className="bg-white px-2">OR</span>
          </div>

          <div className="w-full relative">
            <input 
              type="text" 
              placeholder="search delivery location"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-[14px] outline-none focus:border-brand-green focus:shadow-sm"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
}
