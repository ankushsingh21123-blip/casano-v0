"use client";
import Header from "@/components/Header";
import Link from "next/link";

// Shared template for category pages
interface CategoryPageProps {
  category: string;
  emoji: string;
  gradient: string;
  products: { name: string; price: string; emoji: string }[];
}

export function CategoryPageTemplate({ category, emoji, gradient, products }: CategoryPageProps) {
  return (
    <div className="min-h-screen bg-[#F5F5F5] dark:bg-[#121212]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 pb-20 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-orange-500 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-900 dark:text-white font-semibold">{category}</span>
        </div>

        {/* Hero */}
        <div
          className="w-full rounded-3xl p-8 mb-10 flex items-center gap-6"
          style={{ background: gradient }}
        >
          <span className="text-6xl">{emoji}</span>
          <div>
            <h1 className="text-3xl font-black text-white">{category}</h1>
            <p className="text-white/80 mt-1 font-medium">
              {products.length}+ products available · Delivered in 15 mins
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((p, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1e1e1e] rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-full aspect-square rounded-xl bg-gray-50 dark:bg-[#2a2a2a] flex items-center justify-center text-4xl mb-3 group-hover:scale-110 transition-transform">
                {p.emoji}
              </div>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{p.name}</p>
              <p className="text-orange-500 font-black text-sm mt-1">₹{p.price}</p>
              <button className="mt-2 w-full text-xs font-bold bg-green-500 hover:bg-green-600 text-white py-1.5 rounded-xl transition-colors">
                Add
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
