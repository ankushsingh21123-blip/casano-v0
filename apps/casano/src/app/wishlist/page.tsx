"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-main)" }}>
      <Header />
      <main className="max-w-[800px] mx-auto px-4 pt-[100px] pb-20">
        {/* Back link */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-[#C1492E] transition-colors flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span>›</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>Wishlist</span>
        </div>

        {/* Empty state */}
        <div
          className="rounded-3xl p-12 flex flex-col items-center justify-center text-center border"
          style={{ background: "var(--surface-card)", borderColor: "var(--surface-border)" }}
        >
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
            style={{ background: "rgba(193,73,46,0.08)" }}
          >
            <Heart className="w-10 h-10" style={{ color: "#C1492E" }} />
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: "var(--text-primary)" }}>
            Your Wishlist
          </h1>
          <p className="text-base font-medium mb-2" style={{ color: "var(--text-secondary)" }}>
            0 items in your wishlist
          </p>
          <p className="text-sm mb-8 max-w-sm" style={{ color: "var(--text-muted)" }}>
            Items you save to your wishlist will appear here. Start browsing products and tap the heart icon to save them!
          </p>
          <Link
            href="/products"
            className="px-8 py-3.5 rounded-xl font-bold text-white text-sm transition-all hover:shadow-lg"
            style={{ background: "#C1492E", boxShadow: "0 4px 15px rgba(193,73,46,0.3)" }}
          >
            Browse Products
          </Link>
        </div>
      </main>
    </div>
  );
}
