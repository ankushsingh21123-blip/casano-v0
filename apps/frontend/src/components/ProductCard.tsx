"use client";

import { useState } from "react";
import Image from "next/image";
import ProductDetailsModal from "./ProductDetailsModal";

interface ProductProps {
  id: string;
  name: string;
  weight: string;
  price: number;
  originalPrice?: number;
  image: string;
  deliveryTime: string;
  tag?: string; 
}

export default function ProductCard(props: ProductProps) {
  const { id, name, weight, price, originalPrice, image, deliveryTime, tag } = props;
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className="relative group bg-white border border-gray-100 hover:border-brand-green hover:shadow-md transition-all rounded-xl p-3 flex flex-col h-full cursor-pointer overflow-hidden"
      >
        
        {/* Product Image & Time */}
        <div className="relative w-full aspect-square bg-white rounded-lg mb-3 flex items-center justify-center p-2">
          {tag && (
            <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-sm z-10">
              {tag}
            </div>
          )}
          <div className="relative w-full h-full">
            <img 
                src={image} 
                alt={name}
                className="object-contain w-full h-full"
            />
          </div>
          
          {/* Delivery Time Badge */}
          <div className="absolute bottom-1 left-1 bg-white border border-gray-200 shadow-sm rounded-md px-1.5 py-0.5 flex items-center gap-1 z-10">
            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="text-[10px] font-bold text-gray-800">{deliveryTime}</span>
          </div>
        </div>

        {/* Product Details */}
        <h3 className="font-semibold text-[13px] text-gray-800 leading-snug line-clamp-2 mb-1 flex-1">
          {name}
        </h3>
        <div className="text-[12px] text-gray-500 mb-3">
          {weight}
        </div>

        {/* Pricing & Add Button */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <span className="font-bold text-[14px] text-gray-800">₹{price}</span>
            {originalPrice && (
              <span className="text-[12px] text-gray-400 line-through">₹{originalPrice}</span>
            )}
          </div>

          {quantity === 0 ? (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setQuantity(1);
              }}
              className="border border-brand-green text-brand-green bg-brand-light-green hover:bg-brand-green hover:text-white px-5 py-1.5 rounded-lg font-bold text-[13px] transition-colors"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-brand-green text-white rounded-lg overflow-hidden h-8" onClick={(e) => e.stopPropagation()}>
              <button 
                className="w-8 h-full flex items-center justify-center font-bold hover:bg-[#0b721b] transition-colors"
                onClick={() => setQuantity(q => q - 1)}
              >
                −
              </button>
              <span className="w-6 text-center text-[13px] font-bold">{quantity}</span>
              <button 
                className="w-8 h-full flex items-center justify-center font-bold hover:bg-[#0b721b] transition-colors"
                onClick={() => setQuantity(q => q + 1)}
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      <ProductDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={props}
      />
    </>
  );
}
