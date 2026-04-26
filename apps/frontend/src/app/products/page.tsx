"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Link from "next/link";
import { ICON_MAP, CATEGORY_ICON_MAP } from "@/components/CategoryPageTemplate";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBag, Search, Plus, Minus, Check, Star, Clock, ArrowRight, X,
} from "lucide-react";

const allProducts = [
  // Groceries
  { id: "g1", name: "Fresh Tomatoes", price: 29, unit: "500g", icon: "tomato", category: "Groceries", path: "/category/groceries", rating: 4.5 },
  { id: "g2", name: "Amul Milk 500ml", price: 28, unit: "500ml", icon: "milk", category: "Groceries", path: "/category/groceries", rating: 4.8 },
  { id: "g3", name: "Whole Wheat Bread", price: 45, unit: "400g", icon: "bread", category: "Groceries", path: "/category/groceries", rating: 4.3 },
  { id: "g4", name: "Bananas (6 pcs)", price: 35, unit: "6 pcs", icon: "banana", category: "Groceries", path: "/category/groceries", rating: 4.6 },
  { id: "g5", name: "Onions 1kg", price: 40, unit: "1kg", icon: "onion", category: "Groceries", path: "/category/groceries", rating: 4.2 },
  { id: "g6", name: "Potatoes 1kg", price: 35, unit: "1kg", icon: "potato", category: "Groceries", path: "/category/groceries", rating: 4.4 },
  { id: "g7", name: "Green Spinach", price: 20, unit: "250g", icon: "spinach", category: "Groceries", path: "/category/groceries", rating: 4.1 },
  { id: "g8", name: "Eggs (12 pcs)", price: 90, unit: "12 pcs", icon: "egg", category: "Groceries", path: "/category/groceries", rating: 4.7 },
  { id: "g9", name: "Curd 400g", price: 55, unit: "400g", icon: "curd", category: "Groceries", path: "/category/groceries", rating: 4.3 },
  { id: "g10", name: "Basmati Rice 1kg", price: 120, unit: "1kg", icon: "rice", category: "Groceries", path: "/category/groceries", rating: 4.9 },
  { id: "g11", name: "Atta 5kg", price: 280, unit: "5kg", icon: "wheat", category: "Groceries", path: "/category/groceries", rating: 4.5 },
  { id: "g12", name: "Sugar 1kg", price: 50, unit: "1kg", icon: "sugar", category: "Groceries", path: "/category/groceries", rating: 4.4 },

  // Fashion
  { id: "f1", name: "Graphic Tee", price: 349, unit: "1 pc", icon: "tshirt", category: "Fashion", path: "/category/fashion", rating: 4.2 },
  { id: "f2", name: "Jogger Pants", price: 599, unit: "1 pc", icon: "pants", category: "Fashion", path: "/category/fashion", rating: 4.3 },
  { id: "f3", name: "Sneakers", price: 1299, unit: "1 pair", icon: "sneakers", category: "Fashion", path: "/category/fashion", rating: 4.6 },
  { id: "f4", name: "Sunglasses", price: 499, unit: "1 pc", icon: "sunglasses", category: "Fashion", path: "/category/fashion", rating: 4.1 },
  { id: "f5", name: "Handbag", price: 899, unit: "1 pc", icon: "handbag", category: "Fashion", path: "/category/fashion", rating: 4.4 },
  { id: "f6", name: "Cap", price: 299, unit: "1 pc", icon: "cap", category: "Fashion", path: "/category/fashion", rating: 4.0 },
  { id: "f7", name: "Hoodie", price: 799, unit: "1 pc", icon: "hoodie", category: "Fashion", path: "/category/fashion", rating: 4.5 },
  { id: "f8", name: "Watch", price: 1999, unit: "1 pc", icon: "watch", category: "Fashion", path: "/category/fashion", rating: 4.7 },
  { id: "f9", name: "Formal Shirt", price: 699, unit: "1 pc", icon: "shirt", category: "Fashion", path: "/category/fashion", rating: 4.3 },
  { id: "f10", name: "Kurti", price: 549, unit: "1 pc", icon: "kurti", category: "Fashion", path: "/category/fashion", rating: 4.2 },

  // Gadgets
  { id: "d1", name: "Wireless Earbuds", price: 1499, unit: "1 pc", icon: "earbuds", category: "Gadgets", path: "/category/gadgets", rating: 4.5 },
  { id: "d2", name: "Smartwatch", price: 2999, unit: "1 pc", icon: "smartwatch", category: "Gadgets", path: "/category/gadgets", rating: 4.6 },
  { id: "d3", name: "Power Bank 10000mAh", price: 799, unit: "1 pc", icon: "powerbank", category: "Gadgets", path: "/category/gadgets", rating: 4.4 },
  { id: "d4", name: "Bluetooth Speaker", price: 1299, unit: "1 pc", icon: "speaker", category: "Gadgets", path: "/category/gadgets", rating: 4.3 },
  { id: "d5", name: "Mechanical Keyboard", price: 2499, unit: "1 pc", icon: "keyboard", category: "Gadgets", path: "/category/gadgets", rating: 4.7 },
  { id: "d6", name: "Gaming Mouse", price: 999, unit: "1 pc", icon: "mouse", category: "Gadgets", path: "/category/gadgets", rating: 4.2 },
  { id: "d7", name: "Wireless Charger", price: 899, unit: "1 pc", icon: "charger", category: "Gadgets", path: "/category/gadgets", rating: 4.1 },
  { id: "d8", name: "LED Desk Lamp", price: 599, unit: "1 pc", icon: "lamp", category: "Gadgets", path: "/category/gadgets", rating: 4.4 },
  { id: "d9", name: "SSD 256GB", price: 1999, unit: "1 pc", icon: "ssd", category: "Gadgets", path: "/category/gadgets", rating: 4.8 },
  { id: "d10", name: "Webcam 1080p", price: 1799, unit: "1 pc", icon: "webcam", category: "Gadgets", path: "/category/gadgets", rating: 4.3 },

  // Stationery
  { id: "s1", name: "Spiral Notebook A5", price: 79, unit: "1 pc", icon: "notebook", category: "Stationery", path: "/category/stationery", rating: 4.3 },
  { id: "s2", name: "Ballpoint Pens (10)", price: 49, unit: "10 pcs", icon: "pen", category: "Stationery", path: "/category/stationery", rating: 4.1 },
  { id: "s3", name: "Highlighters Set (6)", price: 99, unit: "6 pcs", icon: "highlighter", category: "Stationery", path: "/category/stationery", rating: 4.4 },
  { id: "s4", name: "Sticky Notes Pack", price: 59, unit: "100 sheets", icon: "sticky", category: "Stationery", path: "/category/stationery", rating: 4.2 },
  { id: "s5", name: "Geometry Box", price: 199, unit: "1 set", icon: "geometry", category: "Stationery", path: "/category/stationery", rating: 4.5 },
  { id: "s6", name: "A4 Paper Ream", price: 299, unit: "500 sheets", icon: "paper", category: "Stationery", path: "/category/stationery", rating: 4.3 },
  { id: "s7", name: "Calculator", price: 299, unit: "1 pc", icon: "calculator", category: "Stationery", path: "/category/stationery", rating: 4.6 },
  { id: "s8", name: "Sketchbook A4", price: 179, unit: "1 pc", icon: "sketchbook", category: "Stationery", path: "/category/stationery", rating: 4.4 },
  { id: "s9", name: "Watercolor Set (12)", price: 249, unit: "12 colors", icon: "watercolor", category: "Stationery", path: "/category/stationery", rating: 4.7 },
  { id: "s10", name: "Fountain Pen Set", price: 349, unit: "1 set", icon: "fountain", category: "Stationery", path: "/category/stationery", rating: 4.5 },

  // Gym
  { id: "y1", name: "Dumbbells 5kg Pair", price: 999, unit: "1 pair", icon: "dumbbells", category: "Gym & Fitness", path: "/category/gym", rating: 4.5 },
  { id: "y2", name: "Yoga Mat 6mm", price: 599, unit: "1 pc", icon: "yoga", category: "Gym & Fitness", path: "/category/gym", rating: 4.4 },
  { id: "y3", name: "Resistance Bands", price: 399, unit: "1 set", icon: "bands", category: "Gym & Fitness", path: "/category/gym", rating: 4.3 },
  { id: "y4", name: "Whey Protein 1kg", price: 1799, unit: "1kg", icon: "protein", category: "Gym & Fitness", path: "/category/gym", rating: 4.8 },
  { id: "y5", name: "Skipping Rope", price: 199, unit: "1 pc", icon: "rope", category: "Gym & Fitness", path: "/category/gym", rating: 4.2 },
  { id: "y6", name: "Gym Bag", price: 799, unit: "1 pc", icon: "gymbag", category: "Gym & Fitness", path: "/category/gym", rating: 4.3 },
  { id: "y7", name: "Kettlebell 8kg", price: 1299, unit: "1 pc", icon: "kettlebell", category: "Gym & Fitness", path: "/category/gym", rating: 4.6 },
  { id: "y8", name: "Massage Gun", price: 2999, unit: "1 pc", icon: "massage", category: "Gym & Fitness", path: "/category/gym", rating: 4.7 },
  { id: "y9", name: "Running Shoes", price: 1499, unit: "1 pair", icon: "shoes", category: "Gym & Fitness", path: "/category/gym", rating: 4.5 },
  { id: "y10", name: "Protein Shaker", price: 249, unit: "1 pc", icon: "shaker", category: "Gym & Fitness", path: "/category/gym", rating: 4.1 },
];

const categories = ["All", "Groceries", "Fashion", "Gadgets", "Stationery", "Gym & Fitness"];

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const urlSearch = searchParams.get("search") || "";

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState(urlSearch);
  const [selectedProduct, setSelectedProduct] = useState<typeof allProducts[0] | null>(null);
  const { addItem, removeItem, items } = useCart();

  const getQuantity = (id: string) => {
    const item = items.find(i => i.id === id);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    if (urlSearch) setSearch(urlSearch);
  }, [urlSearch]);

  const filtered = allProducts.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const ActiveCategoryIcon = CATEGORY_ICON_MAP[activeCategory] || ShoppingBag;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg, #0f0d0a 0%, #1a1714 50%, #0f0d0a 100%)" }}>
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 pb-20 pt-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "#8a8580" }}>
          <Link href="/" className="hover:text-[#C1492E] transition-colors">Home</Link>
          <span>›</span>
          <span className="font-semibold" style={{ color: "#e8e0d4" }}>All Products</span>
        </div>

        {/* Hero Banner — deep dark gradient */}
        <div
          className="w-full rounded-3xl p-8 mb-8 flex items-center gap-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1510 0%, #2a1f15 40%, #B8962E 200%)" }}
        >
          {/* Subtle glow */}
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 80% 50%, #B8962E33, transparent 70%)" }} />
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10" style={{ background: "rgba(184,150,46,0.15)", border: "1px solid rgba(184,150,46,0.3)" }}>
            <ActiveCategoryIcon className="w-8 h-8" style={{ color: "#B8962E" }} />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black" style={{ color: "#f5f0e8" }}>
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h1>
            <p className="mt-1 font-medium" style={{ color: "#a09080" }}>
              {filtered.length} products · Delivered in 15 mins
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 relative max-w-lg">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b6560" }} />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full pl-11 pr-5 py-3 rounded-2xl font-medium outline-none transition-colors"
            style={{
              background: "#1e1b17",
              border: "1px solid #2e2a25",
              color: "#e8e0d4",
            }}
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-3 flex-wrap mb-8">
          {categories.map((cat) => {
            const CatIcon = CATEGORY_ICON_MAP[cat] || ShoppingBag;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-5 py-2.5 rounded-full font-bold text-sm transition-all flex items-center gap-2"
                style={isActive ? {
                  background: "linear-gradient(135deg, #C1492E, #a03a22)",
                  color: "#fff",
                  boxShadow: "0 4px 20px rgba(193,73,46,0.35)",
                  transform: "scale(1.05)",
                } : {
                  background: "#1e1b17",
                  color: "#a09080",
                  border: "1px solid #2e2a25",
                }}
              >
                <CatIcon className="w-4 h-4" /> {cat}
              </button>
            );
          })}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-lg font-semibold" style={{ color: "#6b6560" }}>
            No products found for &quot;{search}&quot;
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((p) => {
              const ProductIcon = ICON_MAP[p.icon] || ShoppingBag;
              const qty = getQuantity(p.id);
              return (
                <div
                  key={p.id}
                  className="rounded-2xl p-4 transition-all cursor-pointer group h-full relative"
                  style={{
                    background: "#1a1714",
                    border: "1px solid #2e2a25",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#B8962E55";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 30px rgba(184,150,46,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#2e2a25";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Delivery badge */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "#B8962E22", color: "#B8962E" }}>
                    <Clock className="w-3 h-3" /> 15 min
                  </div>

                  {/* Product icon area */}
                  <div
                    className="w-full aspect-square rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-105"
                    style={{ background: "#252017" }}
                    onClick={() => setSelectedProduct(p)}
                  >
                    <ProductIcon className="w-10 h-10 transition-colors" style={{ color: "#6b6055" }} />
                  </div>

                  {/* Category label */}
                  <span className="text-[10px] font-bold uppercase tracking-widest mb-1 block" style={{ color: "#B8962E" }}>
                    {p.category}
                  </span>

                  {/* Name */}
                  <p className="text-sm font-semibold truncate" style={{ color: "#e8e0d4" }}>{p.name}</p>

                  {/* Unit */}
                  <p className="text-[11px] mt-0.5" style={{ color: "#6b6560" }}>{p.unit}</p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3 h-3 fill-current" style={{ color: "#B8962E" }} />
                    <span className="text-[11px] font-semibold" style={{ color: "#a09080" }}>{p.rating}</span>
                  </div>

                  {/* Price */}
                  <p className="font-black text-sm mt-1.5" style={{ color: "#C1492E" }}>₹{p.price}</p>

                  {/* Add/Qty button */}
                  {qty === 0 ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({ id: p.id, name: p.name, price: p.price, size: p.unit, image: "" });
                      }}
                      className="mt-2.5 w-full text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1.5"
                      style={{
                        background: "linear-gradient(135deg, #C1492E, #a03a22)",
                        color: "#fff",
                        boxShadow: "0 2px 10px rgba(193,73,46,0.25)",
                      }}
                    >
                      <Plus className="w-3.5 h-3.5" /> ADD
                    </button>
                  ) : (
                    <div className="mt-2.5 w-full flex items-center justify-between rounded-xl px-1 py-1" style={{ background: "#2a2520", border: "1px solid #C1492E44" }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeItem(p.id); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "#C1492E33", color: "#C1492E" }}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-black" style={{ color: "#e8e0d4" }}>{qty}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); addItem({ id: p.id, name: p.name, price: p.price, size: p.unit, image: "" }); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: "#C1492E", color: "#fff" }}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
          <div
            className="relative w-full max-w-md mx-4 rounded-3xl p-6 max-h-[90vh] overflow-auto"
            style={{ background: "#1a1714", border: "1px solid #2e2a25" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#2e2a25", color: "#a09080" }}>
              <X className="w-4 h-4" />
            </button>

            {(() => {
              const Icon = ICON_MAP[selectedProduct.icon] || ShoppingBag;
              const qty = getQuantity(selectedProduct.id);
              return (
                <>
                  <div className="w-full aspect-square rounded-2xl flex items-center justify-center mb-4" style={{ background: "#252017" }}>
                    <Icon className="w-20 h-20" style={{ color: "#B8962E" }} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "#B8962E" }}>{selectedProduct.category}</span>
                  <h2 className="text-2xl font-black mt-1" style={{ color: "#f5f0e8" }}>{selectedProduct.name}</h2>
                  <p className="text-sm mt-1" style={{ color: "#6b6560" }}>{selectedProduct.unit}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 fill-current" style={{ color: "#B8962E" }} />
                    <span className="font-semibold" style={{ color: "#a09080" }}>{selectedProduct.rating}</span>
                    <span style={{ color: "#6b6560" }}>·</span>
                    <div className="flex items-center gap-1" style={{ color: "#B8962E" }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-sm font-bold">15 min delivery</span>
                    </div>
                  </div>
                  <p className="text-3xl font-black mt-4" style={{ color: "#C1492E" }}>₹{selectedProduct.price}</p>

                  {/* Related / Alternatives header */}
                  <div className="mt-6 pt-4" style={{ borderTop: "1px solid #2e2a25" }}>
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3" style={{ color: "#8a8580" }}>You might also like</h3>
                    <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
                      {allProducts
                        .filter(alt => alt.category === selectedProduct.category && alt.id !== selectedProduct.id)
                        .slice(0, 4)
                        .map(alt => {
                          const AltIcon = ICON_MAP[alt.icon] || ShoppingBag;
                          return (
                            <div key={alt.id} className="flex-shrink-0 w-24 rounded-xl p-2 cursor-pointer" style={{ background: "#252017", border: "1px solid #2e2a25" }} onClick={() => setSelectedProduct(alt)}>
                              <div className="w-full aspect-square rounded-lg flex items-center justify-center mb-1" style={{ background: "#1a1714" }}>
                                <AltIcon className="w-6 h-6" style={{ color: "#6b6055" }} />
                              </div>
                              <p className="text-[10px] font-semibold truncate" style={{ color: "#e8e0d4" }}>{alt.name}</p>
                              <p className="text-[10px] font-black" style={{ color: "#C1492E" }}>₹{alt.price}</p>
                            </div>
                          );
                        })}
                    </div>
                  </div>

                  {/* Add to cart */}
                  <div className="mt-5">
                    {qty === 0 ? (
                      <button
                        onClick={() => addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, size: selectedProduct.unit, image: "" })}
                        className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
                        style={{ background: "linear-gradient(135deg, #C1492E, #a03a22)", boxShadow: "0 4px 20px rgba(193,73,46,0.3)" }}
                      >
                        <Plus className="w-5 h-5" /> Add to Cart — ₹{selectedProduct.price}
                      </button>
                    ) : (
                      <div className="flex items-center justify-between rounded-xl px-2 py-2" style={{ background: "#2a2520", border: "1px solid #C1492E44" }}>
                        <button onClick={() => removeItem(selectedProduct.id)} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#C1492E33", color: "#C1492E" }}>
                          <Minus className="w-5 h-5" />
                        </button>
                        <span className="text-lg font-black" style={{ color: "#e8e0d4" }}>{qty} in cart</span>
                        <button onClick={() => addItem({ id: selectedProduct.id, name: selectedProduct.name, price: selectedProduct.price, size: selectedProduct.unit, image: "" })} className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#C1492E", color: "#fff" }}>
                          <Plus className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
