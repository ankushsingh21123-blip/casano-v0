"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";

interface CategorySectionProps {
  title: string;
  items: Array<{
    id: string;
    name: string;
    weight: string;
    price: number;
    originalPrice?: number;
    image: string;
    deliveryTime: string;
    tag?: string;
  }>;
}

export default function CategorySection({ title, items }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -800, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 800, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full max-w-[1280px] mx-auto px-4 md:px-0 mt-10 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h2>
        <a href="#" className="text-brand-green font-bold text-[15px] hover:underline hidden sm:block">
          see all
        </a>
      </div>

      <div className="relative group/section">
        {/* Left Scroll Button */}
        <button 
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white shadow-lg rounded-full p-2 text-gray-800 opacity-0 group-hover/section:opacity-100 transition-opacity disabled:opacity-0 hidden md:flex"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Scrollable Container */}
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto gap-4 pb-4 hide-scrollbar snap-x snap-mandatory"
          style={{ scrollPadding: "0 1rem" }}
        >
          {items.map((item) => (
            <div key={item.id} className="min-w-[180px] w-[180px] snap-start flex-shrink-0">
              <ProductCard {...item} />
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button 
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)] rounded-full p-2 text-gray-800 opacity-0 group-hover/section:opacity-100 transition-opacity hidden md:flex"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
