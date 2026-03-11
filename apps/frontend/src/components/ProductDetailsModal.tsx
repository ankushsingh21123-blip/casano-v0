"use client";

import { useEffect, useState } from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    description?: string;
    weight: string;
    deliveryTime: string;
  }
}

export default function ProductDetailsModal({ isOpen, onClose, product }: ProductDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-black/60 transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[900px] h-[90vh] sm:h-[600px] flex flex-col sm:flex-row overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button - Desktop (Absolute) / Mobile (Header) */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-800" />
        </button>

        {/* Left Side: Images */}
        <div className="w-full sm:w-1/2 h-[45%] sm:h-full bg-white border-b sm:border-b-0 sm:border-r border-gray-100 p-8 flex flex-col items-center justify-center relative">
           <img 
              src={product.image} 
              alt={product.name}
              className="object-contain w-full max-h-[300px]"
           />
           {/* Carousel placeholders */}
           <div className="absolute bottom-6 flex gap-2">
              <div className="w-12 h-12 border-2 border-brand-green rounded-lg p-1 opacity-100">
                  <img src={product.image} className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-12 border border-gray-200 rounded-lg p-1 opacity-50">
                  <img src={product.image} className="w-full h-full object-contain" />
              </div>
           </div>
           
           <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hidden sm:block">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
           </button>
           <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full hidden sm:block">
              <ChevronRight className="w-5 h-5 text-gray-600" />
           </button>
        </div>

        {/* Right Side: Details */}
        <div className="w-full sm:w-1/2 h-[55%] sm:h-full overflow-y-auto p-6 sm:p-8 flex flex-col">
          
          <div className="text-[12px] text-gray-500 mb-2 truncate">
             Home / Category / {product.name}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 leading-tight mb-4">
            {product.name}
          </h1>

          <div className="inline-block bg-gray-100 text-gray-800 text-[12px] font-bold px-2 py-1 rounded-md mb-4 self-start">
             {product.weight}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex flex-col">
               <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
               {product.originalPrice && (
                 <span className="text-[13px] text-gray-500 line-through">MRP ₹{product.originalPrice}</span>
               )}
               <span className="text-[10px] text-gray-500">(Inclusive of all taxes)</span>
            </div>

            {/* Add Button Area */}
            {quantity === 0 ? (
              <button 
                onClick={() => setQuantity(1)}
                className="ml-auto border border-brand-green text-brand-green bg-brand-light-green hover:bg-brand-green hover:text-white px-8 py-2 rounded-lg font-bold text-[14px] transition-colors shadow-sm"
              >
                ADD
              </button>
            ) : (
              <div className="ml-auto flex items-center bg-brand-green text-white rounded-lg overflow-hidden h-10 shadow-sm w-[100px]">
                <button 
                  className="w-1/3 h-full flex items-center justify-center font-bold hover:bg-[#0b721b] transition-colors"
                  onClick={() => setQuantity(q => q - 1)}
                >
                  −
                </button>
                <span className="w-1/3 text-center text-[15px] font-bold">{quantity}</span>
                <button 
                   className="w-1/3 h-full flex items-center justify-center font-bold hover:bg-[#0b721b] transition-colors"
                   onClick={() => setQuantity(q => q + 1)}
                >
                  +
                </button>
              </div>
            )}
          </div>

          {/* Blinkit Guarantees */}
          <div className="mt-4 border-t border-gray-100 pt-6">
            <h3 className="font-bold text-[15px] text-gray-800 mb-4">Why shop from blinkit?</h3>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fcf2d3] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⏱️</span>
                 </div>
                 <div>
                    <div className="text-[13px] font-bold text-gray-800">Superfast Delivery</div>
                    <div className="text-[12px] text-gray-500 leading-snug mt-1">Get your order delivered to your doorstep at the earliest from dark stores near you.</div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fcf2d3] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">💰</span>
                 </div>
                 <div>
                    <div className="text-[13px] font-bold text-gray-800">Best Prices & Offers</div>
                    <div className="text-[12px] text-gray-500 leading-snug mt-1">Best price destination with offers directly from the manufacturers.</div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fcf2d3] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📦</span>
                 </div>
                 <div>
                    <div className="text-[13px] font-bold text-gray-800">Wide Assortment</div>
                    <div className="text-[12px] text-gray-500 leading-snug mt-1">Choose from 5000+ products across food, personal care, household & other categories.</div>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
