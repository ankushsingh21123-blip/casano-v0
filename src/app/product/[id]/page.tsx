"use client";

import { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { ChevronRight, Home, Plus, Minus } from 'lucide-react';

const mockProduct = {
  id: 'almonds-500g',
  title: 'Premium Quality California Almonds (Badam)',
  category: 'Dry Fruits & Nuts',
  subCategory: 'Almonds',
  weight: '500 g',
  mrp: 450,
  sellingPrice: 399,
  discount: '11% OFF',
  images: [
    'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=800&q=80',
    'https://images.unsplash.com/photo-1599598425947-330026e4e1a1?w=800&q=80',
    'https://images.unsplash.com/photo-1629824641973-c155d3e028b1?w=800&q=80'
  ],
  deliveryTime: '15 mins',
  description: 'Premium quality meticulously sourced california almonds, packed with crunch and perfect for your daily dose of healthy fats and protein. Enjoy the nutrient-dense profile that Casano guarantees.'
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { items, addItem, removeItem } = useCart();
  const [activeImage, setActiveImage] = useState(0);

  const cartItem = items.find(i => i.id === mockProduct.id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => {
    addItem({
      id: mockProduct.id,
      name: mockProduct.title,
      price: mockProduct.sellingPrice,
      originalPrice: mockProduct.mrp,
      size: mockProduct.weight,
      image: mockProduct.images[0]
    });
  };

  const handleRemove = () => {
    removeItem(mockProduct.id);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212] py-8 transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="hover:text-casano-orange transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            Home
          </a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <a href="#" className="hover:text-casano-orange transition-colors">{mockProduct.category}</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span className="text-gray-900 dark:text-gray-200 font-medium">{mockProduct.subCategory}</span>
        </nav>

        {/* Product Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 bg-white dark:bg-[#1a1a1a] rounded-3xl p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800">
          
          {/* Left Column - Image Carousel */}
          <div className="w-full lg:w-1/2 flex flex-col items-center">
            {/* Main Image */}
            <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-[#252525] border border-gray-100 dark:border-gray-800 flex items-center justify-center p-8 mb-4 shadow-inner">
              <img 
                src={mockProduct.images[activeImage]} 
                alt={mockProduct.title} 
                className="object-cover w-full h-full transform transition-transform duration-500 hover:scale-105 rounded-xl"
              />
              <div className="absolute top-4 right-4 bg-orange-100 text-casano-orange font-bold px-3 py-1 rounded-full text-xs shadow-sm shadow-orange-500/10">
                11% OFF
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex gap-4">
              {mockProduct.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(idx)}
                  className={`relative w-20 sm:w-24 aspect-square rounded-xl border-[3px] overflow-hidden transition-all duration-300 ${activeImage === idx ? 'border-casano-green shadow-md scale-105' : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} alt="" className="object-cover w-full h-full" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            
            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-[1.1] mb-3 tracking-tight">
              {mockProduct.title}
            </h1>
            
            <div className="text-gray-500 dark:text-gray-400 font-medium mb-6 flex items-center gap-2">
              <span className="bg-gray-100 dark:bg-[#333] px-3 py-1.5 rounded-lg text-[13px] tracking-wide uppercase font-bold text-gray-700 dark:text-gray-300">{mockProduct.weight}</span>
            </div>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100 dark:border-gray-800">
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 font-medium line-through decoration-gray-300 dark:decoration-gray-600 decoration-2 mb-1">MRP ₹{mockProduct.mrp}</span>
                <span className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white flex items-baseline tracking-tighter">
                  <span className="text-xl mr-1 font-extrabold">₹</span>{mockProduct.sellingPrice}
                </span>
                <span className="text-xs text-casano-green font-bold mt-1.5 uppercase tracking-wide">Inclusive of all taxes</span>
              </div>
            </div>

            {/* Add to Cart Logic */}
            <div className="mb-8 w-full">
              {quantity === 0 ? (
                <button 
                  onClick={handleAdd}
                  className="w-full sm:w-[300px] bg-[#19c74a] hover:bg-[#14a33c] text-white px-8 py-4 rounded-2xl font-black text-[17px] shadow-[0_10px_20px_-10px_rgba(25,199,74,0.6)] hover:shadow-[0_10px_20px_-5px_rgba(25,199,74,0.8)] transition-all flex justify-center items-center gap-3 transform hover:-translate-y-1"
                >
                  Add to Cart
                  <Plus className="w-5 h-5 stroke-[4]" />
                </button>
              ) : (
                <div className="w-full sm:w-[220px] h-[58px] flex items-center justify-between bg-[#19c74a] text-white p-2 rounded-2xl shadow-[0_10px_20px_-10px_rgba(25,199,74,0.6)]">
                  <button 
                    onClick={handleRemove}
                    className="w-12 h-12 flex items-center justify-center hover:bg-black/20 rounded-xl transition-colors disabled:opacity-50"
                  >
                    <Minus className="w-5 h-5 stroke-[4]" />
                  </button>
                  <span className="font-black text-xl px-2 w-[50px] text-center">{quantity}</span>
                  <button 
                    onClick={handleAdd}
                    className="w-12 h-12 flex items-center justify-center hover:bg-black/20 rounded-xl transition-colors"
                  >
                    <Plus className="w-5 h-5 stroke-[4]" />
                  </button>
                </div>
              )}
            </div>

            {/* Product Meta */}
            <div className="bg-gray-50/80 dark:bg-[#252525]/80 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 mb-6 group hover:border-casano-green/40 transition-colors">
              <h3 className="font-bold text-gray-900 dark:text-white mb-2 text-sm flex items-center justify-between">
                Delivery in 15 mins
                <svg className="w-5 h-5 text-casano-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </h3>
              <p className="text-xs text-gray-500 font-medium">Order now and get it instantly from your nearest Kirana star store.</p>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Product Details</h3>
              <p className="text-[15px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                {mockProduct.description}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
