"use client";

import { useCart } from "@/context/CartContext";
import ProductDetailsModal from "./ProductDetailsModal";
import { useState } from "react";

interface ProductProps {
  id: string;
  name: string;
  weight: string;
  price: number;
  originalPrice?: number;
  image: string;
  deliveryTime: string;
  tag?: string;
  stock?: number;
}

export default function ProductCard(props: ProductProps) {
  const { id, name, weight, price, originalPrice, image, deliveryTime, tag, stock } = props;
  const { items, addItem, removeItem } = useCart();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const cartItem = items.find((i: any) => i.id === id);
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem({ id, name, price, originalPrice, image, size: weight });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeItem(id);
  };

  return (
    <>
      {/* ── Product Card: Sand Beige surface, Saffron CTA, Forest Green price ── */}
      <div
        onClick={() => setIsModalOpen(true)}
        className="relative group flex flex-col h-full cursor-pointer overflow-hidden rounded-xl transition-all duration-200"
        style={{
          background: "#EFEADD",
          border: "1px solid #E2DDD0",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#C1492E55";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px #C1492E0F";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#E2DDD0";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        }}
      >
        {/* Image area */}
        <div className="relative w-full aspect-square rounded-lg overflow-hidden flex items-center justify-center p-2 m-2" style={{ width: "calc(100% - 16px)", background: "#FDFBF7" }}>
          {tag && (
            <div
              className="absolute top-0 left-0 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10"
              style={{ background: "#C1492E" }}
            >
              {tag}
            </div>
          )}
          <img
            src={image}
            alt={name}
            className="object-contain w-full h-full transition-transform group-hover:scale-105"
          />

          {/* Delivery time badge */}
          <div
            className="absolute bottom-1 left-1 rounded-md px-1.5 py-0.5 flex items-center gap-1 z-10"
            style={{ background: "#FDFBF7", border: "1px solid #E2DDD0" }}
          >
            <svg className="w-3 h-3" style={{ color: "#9A9B9A" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[10px] font-bold" style={{ color: "#5A5B5A" }}>{deliveryTime}</span>
          </div>
        </div>

        {/* Product info */}
        <div className="px-3 pb-3 flex flex-col flex-1">
          <h3
            className="font-semibold text-[13px] leading-snug line-clamp-2 mb-1 flex-1"
            style={{ color: "#2A2B2A" }}
          >
            {name}
          </h3>
          <div className="text-[12px] mb-2" style={{ color: "#9A9B9A" }}>{weight}</div>

          {/* Price row + ADD button */}
          <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col">
              {stock !== undefined && stock > 0 && stock <= 5 && (
                <span className="text-[10px] font-bold mb-0.5 animate-pulse" style={{ color: "#C1492E" }}>
                  Only {stock} left! Hurry!
                </span>
              )}
              <span className="font-bold text-[14px]" style={{ color: "#214A36" }}>
                ₹{price}
              </span>
              {originalPrice && originalPrice > price && (
                <span className="text-[11px] line-through" style={{ color: "#9A9B9A" }}>₹{originalPrice}</span>
              )}
            </div>

            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="px-4 py-1.5 rounded-lg font-bold text-[13px] transition-all"
                style={{ border: "1.5px solid #C1492E", color: "#C1492E", background: "transparent" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "#C1492E";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#C1492E";
                }}
              >
                ADD
              </button>
            ) : (
              <div
                className="flex items-center rounded-lg overflow-hidden h-8"
                style={{ background: "#C1492E" }}
                onClick={(e: any) => e.stopPropagation()}
              >
                <button
                  className="w-8 h-full flex items-center justify-center font-bold text-white transition-colors text-lg"
                  style={{ color: "#fff" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={handleRemove}
                >
                  −
                </button>
                <span className="w-7 text-center text-[13px] font-bold text-white">{quantity}</span>
                <button
                  className="w-8 h-full flex items-center justify-center font-bold text-white transition-colors text-lg"
                  onMouseEnter={e => (e.currentTarget.style.background = "#A63C25")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={handleAdd}
                >
                  +
                </button>
              </div>
            )}
          </div>
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
