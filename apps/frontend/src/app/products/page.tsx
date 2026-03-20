"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Link from "next/link";

const allProducts = [
  // Groceries
  { name: "Fresh Tomatoes", price: "29", emoji: "🍅", category: "Groceries", path: "/category/groceries" },
  { name: "Amul Milk 500ml", price: "28", emoji: "🥛", category: "Groceries", path: "/category/groceries" },
  { name: "Whole Wheat Bread", price: "45", emoji: "🍞", category: "Groceries", path: "/category/groceries" },
  { name: "Bananas (6 pcs)", price: "35", emoji: "🍌", category: "Groceries", path: "/category/groceries" },
  { name: "Onions 1kg", price: "40", emoji: "🧅", category: "Groceries", path: "/category/groceries" },
  { name: "Potatoes 1kg", price: "35", emoji: "🥔", category: "Groceries", path: "/category/groceries" },
  { name: "Green Spinach", price: "20", emoji: "🥬", category: "Groceries", path: "/category/groceries" },
  { name: "Eggs (12 pcs)", price: "90", emoji: "🥚", category: "Groceries", path: "/category/groceries" },
  { name: "Curd 400g", price: "55", emoji: "🫙", category: "Groceries", path: "/category/groceries" },
  { name: "Basmati Rice 1kg", price: "120", emoji: "🍚", category: "Groceries", path: "/category/groceries" },
  { name: "Atta 5kg", price: "280", emoji: "🌾", category: "Groceries", path: "/category/groceries" },
  { name: "Sugar 1kg", price: "50", emoji: "🍬", category: "Groceries", path: "/category/groceries" },

  // Fashion
  { name: "Graphic Tee", price: "349", emoji: "👕", category: "Fashion", path: "/category/fashion" },
  { name: "Jogger Pants", price: "599", emoji: "👖", category: "Fashion", path: "/category/fashion" },
  { name: "Sneakers", price: "1299", emoji: "👟", category: "Fashion", path: "/category/fashion" },
  { name: "Sunglasses", price: "499", emoji: "🕶️", category: "Fashion", path: "/category/fashion" },
  { name: "Handbag", price: "899", emoji: "👜", category: "Fashion", path: "/category/fashion" },
  { name: "Cap", price: "299", emoji: "🧢", category: "Fashion", path: "/category/fashion" },
  { name: "Hoodie", price: "799", emoji: "🧥", category: "Fashion", path: "/category/fashion" },
  { name: "Watch", price: "1999", emoji: "⌚", category: "Fashion", path: "/category/fashion" },
  { name: "Formal Shirt", price: "699", emoji: "👔", category: "Fashion", path: "/category/fashion" },
  { name: "Kurti", price: "549", emoji: "👘", category: "Fashion", path: "/category/fashion" },

  // Gadgets
  { name: "Wireless Earbuds", price: "1499", emoji: "🎧", category: "Gadgets", path: "/category/gadgets" },
  { name: "Smartwatch", price: "2999", emoji: "⌚", category: "Gadgets", path: "/category/gadgets" },
  { name: "Power Bank 10000mAh", price: "799", emoji: "🔋", category: "Gadgets", path: "/category/gadgets" },
  { name: "Bluetooth Speaker", price: "1299", emoji: "🔊", category: "Gadgets", path: "/category/gadgets" },
  { name: "Mechanical Keyboard", price: "2499", emoji: "⌨️", category: "Gadgets", path: "/category/gadgets" },
  { name: "Gaming Mouse", price: "999", emoji: "🖱️", category: "Gadgets", path: "/category/gadgets" },
  { name: "Wireless Charger", price: "899", emoji: "⚡", category: "Gadgets", path: "/category/gadgets" },
  { name: "LED Desk Lamp", price: "599", emoji: "💡", category: "Gadgets", path: "/category/gadgets" },
  { name: "SSD 256GB", price: "1999", emoji: "💾", category: "Gadgets", path: "/category/gadgets" },
  { name: "Webcam 1080p", price: "1799", emoji: "📷", category: "Gadgets", path: "/category/gadgets" },

  // Stationery
  { name: "Spiral Notebook A5", price: "79", emoji: "📓", category: "Stationery", path: "/category/stationery" },
  { name: "Ballpoint Pens (10)", price: "49", emoji: "🖊️", category: "Stationery", path: "/category/stationery" },
  { name: "Highlighters Set (6)", price: "99", emoji: "🖍️", category: "Stationery", path: "/category/stationery" },
  { name: "Sticky Notes Pack", price: "59", emoji: "📝", category: "Stationery", path: "/category/stationery" },
  { name: "Geometry Box", price: "199", emoji: "📐", category: "Stationery", path: "/category/stationery" },
  { name: "A4 Paper Ream", price: "299", emoji: "📄", category: "Stationery", path: "/category/stationery" },
  { name: "Calculator", price: "299", emoji: "🧮", category: "Stationery", path: "/category/stationery" },
  { name: "Sketchbook A4", price: "179", emoji: "🎨", category: "Stationery", path: "/category/stationery" },
  { name: "Watercolor Set (12)", price: "249", emoji: "🖌️", category: "Stationery", path: "/category/stationery" },
  { name: "Fountain Pen Set", price: "349", emoji: "🖋️", category: "Stationery", path: "/category/stationery" },

  // Gym
  { name: "Dumbbells 5kg Pair", price: "999", emoji: "🏋️", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Yoga Mat 6mm", price: "599", emoji: "🧘", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Resistance Bands", price: "399", emoji: "💪", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Whey Protein 1kg", price: "1799", emoji: "🥛", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Skipping Rope", price: "199", emoji: "🪢", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Gym Bag", price: "799", emoji: "🎒", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Kettlebell 8kg", price: "1299", emoji: "🔵", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Massage Gun", price: "2999", emoji: "⚡", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Running Shoes", price: "1499", emoji: "👟", category: "Gym & Fitness", path: "/category/gym" },
  { name: "Protein Shaker", price: "249", emoji: "🧃", category: "Gym & Fitness", path: "/category/gym" },
];

const categories = ["All", "Groceries", "Fashion", "Gadgets", "Stationery", "Gym & Fitness"];

const categoryMeta: Record<string, { gradient: string; emoji: string }> = {
  "All":          { gradient: "linear-gradient(135deg, #ff6b35, #ffd200)", emoji: "🛍️" },
  "Groceries":    { gradient: "linear-gradient(135deg, #56ab2f, #a8e063)", emoji: "🛒" },
  "Fashion":      { gradient: "linear-gradient(135deg, #f953c6, #b91d73)", emoji: "👗" },
  "Gadgets":      { gradient: "linear-gradient(135deg, #232526, #414345)", emoji: "📱" },
  "Stationery":   { gradient: "linear-gradient(135deg, #f7971e, #ffd200)", emoji: "✏️" },
  "Gym & Fitness":{ gradient: "linear-gradient(135deg, #fc4a1a, #f7b733)", emoji: "💪" },
};

export default function ProductsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = allProducts.filter((p: any) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const meta = categoryMeta[activeCategory];

  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#121212]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 pb-20 pt-8">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-semibold">All Products</span>
        </div>

        {/* Hero Banner */}
        <div
          className="w-full rounded-3xl p-8 mb-8 flex items-center gap-6"
          style={{ background: meta.gradient }}
        >
          <span className="text-6xl">{meta.emoji}</span>
          <div>
            <h1 className="text-3xl font-black text-white">
              {activeCategory === "All" ? "All Products" : activeCategory}
            </h1>
            <p className="text-white/80 mt-1 font-medium">
              {filtered.length} products · Delivered in 15 mins
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍  Search products..."
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
            className="w-full max-w-lg px-5 py-3 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e1e1e] text-gray-900 dark:text-gray-100 font-medium outline-none focus:border-orange-400 transition-colors"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex gap-3 flex-wrap mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-full font-bold text-sm transition-all ${
                activeCategory === cat
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-200 dark:shadow-orange-900 scale-105"
                  : "bg-white dark:bg-[#1e1e1e] text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-[#2a2a2a] border border-gray-200 dark:border-gray-700"
              }`}
            >
              {categoryMeta[cat].emoji} {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400 text-lg font-semibold">
            No products found 😕
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((p, i) => (
              <Link href={p.path} key={i}>
                <div className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group h-full">
                  <div className="w-full aspect-square rounded-xl bg-gray-50 dark:bg-[#2a2a2a] flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                    {p.emoji}
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400 mb-1 block">
                    {p.category}
                  </span>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
                  <p className="text-orange-500 font-black text-sm mt-1">₹{p.price}</p>
                  <button
                    onClick={(e: any) => e.preventDefault()}
                    className="mt-2 w-full text-xs font-bold bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-xl transition-colors"
                  >
                    Add
                  </button>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
