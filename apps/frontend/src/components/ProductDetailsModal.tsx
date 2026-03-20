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
    stock?: number; // Added stock property
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
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              </div>
              <div className="w-12 h-12 border border-gray-200 rounded-lg p-1 opacity-50">
                  <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
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
               {product.stock !== undefined && product.stock > 0 && product.stock <= 5 && (
                 <span className="text-[12px] text-[#e03131] font-bold mb-1 animate-pulse">Only {product.stock} left in stock! Hurry!</span>
               )}
               <span className="text-xl font-bold text-gray-800">₹{product.price}</span>
               {product.originalPrice && (
                 <span className="text-[13px] text-gray-500 line-through">MRP ₹{product.originalPrice}</span>
               )}
               <span className="text-[10px] text-gray-500">(Inclusive of all taxes)</span>
            </div>

            {/* Add Button Area / Out of Stock */}
            {product.stock === 0 ? (
              <button 
                className="ml-auto bg-gray-100 text-gray-500 font-bold px-5 py-2 rounded-lg text-[13px] border border-gray-200 shadow-sm"
              >
                Notify Me
              </button>
            ) : quantity === 0 ? (
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

          {/* Zepto Style: Coupons & Offers */}
          <div className="mt-2 mb-6">
            <h3 className="font-bold text-[14px] text-gray-800 mb-3 flex items-center gap-2">
               <span className="text-brand-orange">%</span> Coupons & Offers
            </h3>
            <div className="bg-orange-50/50 border border-orange-100 p-3 rounded-xl flex items-start gap-3">
               <div className="w-8 h-8 flex-shrink-0 bg-white rounded-full flex items-center justify-center border border-orange-100 p-1">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1024px-UPI-Logo-vector.svg.png" alt="UPI" className="w-full h-full object-contain" />
               </div>
               <div>
                 <div className="text-[13px] font-bold text-gray-800">Get up to ₹50 cashback</div>
                 <div className="text-[11px] text-gray-500 mt-0.5 leading-snug">Pay using any UPI app. Minimum order value ₹299.</div>
               </div>
            </div>
          </div>

          {/* Why shop from Casano */}
          <div className="mt-4 border-t border-gray-100 pt-6">
            <h3 className="font-bold text-[15px] text-gray-800 mb-4">Why shop from Casano?</h3>
            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fcf2d3] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">⚡</span>
                 </div>
                 <div>
                    <div className="text-[13px] font-bold text-gray-800">Delivered from Your Neighbourhood</div>
                    <div className="text-[12px] text-gray-500 leading-snug mt-1">We partner with local Kirana shops near you. Your order ships directly from your neighbourhood store — no warehouses, no waiting.</div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fcf2d3] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">🤝</span>
                 </div>
                 <div>
                    <div className="text-[13px] font-bold text-gray-800">Support Local Businesses</div>
                    <div className="text-[12px] text-gray-500 leading-snug mt-1">Every order you place supports a local shopkeeper in your area — not a large corporation.</div>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-[#fcf2d3] flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">📦</span>
                 </div>
                 <div>
                    <div className="text-[13px] font-bold text-gray-800">Verified Local Inventory</div>
                    <div className="text-[12px] text-gray-500 leading-snug mt-1">Products are sourced directly from partner stores in your locality — fresh, local, and trusted by your community.</div>
                 </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
