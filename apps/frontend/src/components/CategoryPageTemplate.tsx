"use client";
import Header from "@/components/Header";
import Link from "next/link";
import { ReactNode, useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { fetchProducts } from "@/services/api.service";
import { supabase } from "@/lib/supabase";
import {
  ShoppingCart, Shirt, Smartphone, Pencil, Dumbbell, ShoppingBag,
  Apple, Milk, Sandwich, Banana, CircleDot, Carrot, Leaf, Egg,
  Box, CookingPot, Wheat, Candy, Citrus, Cherry, Cookie,
  Bean, FlaskConical, Droplets,
  Footprints, Glasses, Briefcase, Watch, Crown, Gem,
  Headphones, BatteryCharging, Volume2, Keyboard, Mouse, Monitor,
  Laptop, Zap, Shield, Phone, Lightbulb, Camera, HardDrive,
  Save, Link2, Music, Plane, Gamepad2, PenTool,
  BookOpen, PenLine, Highlighter, StickyNote, Ruler, PencilLine,
  Paperclip, Scissors, Square, Triangle, FileText, FolderOpen,
  Calculator, Palette, Brush, ClipboardList, Layers,
  PersonStanding, Backpack, Trophy, Circle,
  Pill, Waves, Heart, GlassWater,
  type LucideIcon,
} from "lucide-react";

// Map product icon keys to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  // Groceries
  "tomato": Apple, "milk": Milk, "bread": Sandwich, "banana": Banana,
  "onion": CircleDot, "potato": CircleDot, "spinach": Leaf, "egg": Egg,
  "curd": Box, "rice": CookingPot, "wheat": Wheat, "sugar": Candy,
  "ghee": Box, "carrot": Carrot, "cucumber": Leaf, "lemon": Citrus,
  "orange": Cherry, "dal": Bean, "oil": Box, "salt": CircleDot,
  "garlic": CircleDot, "ginger": Leaf, "butter": Cookie, "paneer": Square,
  // Fashion
  "tshirt": Shirt, "pants": Ruler, "sneakers": Footprints, "sunglasses": Glasses,
  "handbag": Briefcase, "cap": Crown, "hoodie": Shirt, "jacket": Shirt,
  "watch": Watch, "belt": Ruler, "shirt": Shirt, "tracksuit": Shirt,
  "sandals": Footprints, "socks": Footprints, "kurti": Shirt, "ethnic": Shirt,
  "wallet": Briefcase, "scarf": Shirt, "earrings": Gem, "bracelet": Circle,
  "shorts": Shirt, "swimwear": Waves, "gloves": Shield,
  // Gadgets
  "phone": Smartphone, "earbuds": Headphones, "smartwatch": Watch,
  "powerbank": BatteryCharging, "cable": Zap, "speaker": Volume2,
  "webcam": Camera, "keyboard": Keyboard, "mouse": Mouse,
  "monitor": Monitor, "laptop": Laptop, "charger": Zap,
  "screen-protector": Shield, "phonecase": Phone, "lamp": Lightbulb,
  "drone": Plane, "vr": Gamepad2, "plug": Zap, "camera": Camera,
  "tablet": PenTool, "ssd": HardDrive, "memory": Save, "hub": Link2,
  "headphones": Music,
  // Stationery
  "notebook": BookOpen, "pen": PenLine, "highlighter": Highlighter,
  "sticky": StickyNote, "ruler": Ruler, "pencilbox": PencilLine,
  "stapler": Paperclip, "scissors": Scissors, "eraser": Square,
  "pencil": PencilLine, "geometry": Triangle, "paper": FileText,
  "marker": PenLine, "folder": FolderOpen, "correction": PenLine,
  "glue": Layers, "tape": Layers, "calculator": Calculator,
  "clipboard": ClipboardList, "index": Layers, "fountain": PenTool,
  "sketchbook": Palette, "watercolor": Brush, "clips": Paperclip,
  // Gym
  "dumbbells": Dumbbell, "yoga": PersonStanding, "bands": Dumbbell,
  "gymgloves": Shield, "protein": Milk, "rope": Circle,
  "gymbag": Backpack, "roller": Circle, "pullup": Trophy,
  "abroller": Circle, "kettlebell": Dumbbell, "pushup": Dumbbell,
  "ball": Circle, "shaker": GlassWater, "bcaa": Pill,
  "creatine": FlaskConical, "shoes": Footprints, "tights": Shirt,
  "bottle": Droplets, "massage": Zap, "heartrate": Heart,
  "towel": Waves, "chalk": Circle, "ankleweights": Dumbbell,
};

// Category icon map
const CATEGORY_ICON_MAP: Record<string, LucideIcon> = {
  "All": ShoppingBag,
  "Groceries": ShoppingCart,
  "Fashion": Shirt,
  "Gadgets": Smartphone,
  "Stationery": Pencil,
  "Gym & Fitness": Dumbbell,
};

// Shared template for category pages
interface CategoryPageProps {
  category: string;
  icon?: string;
  gradient: string;
  products: { name: string; price: string; icon: string }[];
}

export function CategoryPageTemplate({ category, icon, gradient, products: initialProducts }: CategoryPageProps) {
  const CategoryIcon = CATEGORY_ICON_MAP[category] || ShoppingBag;
  const { addItem, removeItem, items } = useCart();
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const res = await fetchProducts();
        if (res.data && res.data.length > 0) {
          // Filter by category or map them if needed
          // For now, if there are DB products, we could append them or replace
          // Assuming DB products have category field matching the current category
          const categoryProducts = res.data.filter((p: any) => p.category === category);
          if (categoryProducts.length > 0) {
            // Map DB products to frontend format
            const mapped = categoryProducts.map((p: any) => ({
               id: p.id,
               name: p.name,
               price: p.price.toString(),
               icon: p.icon || 'box'
            }));
            // Merge with hardcoded to keep the demo looking full, or just replace
            // Replacing for now if DB has items for this category
            setProducts(mapped);
          }
        }
      } catch (err) {
        console.error("Failed to load real products:", err);
      }
    };
    
    loadProducts();

    // Supabase realtime subscription
    const channel = supabase
      .channel('public:products')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, payload => {
        console.log('Realtime product change:', payload);
        loadProducts(); // Reload to get updated list/prices
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [category]);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>
      <Header />
      <main className="max-w-[1400px] mx-auto px-4 pb-20 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm mb-6" style={{ color: "var(--text-muted)" }}>
          <Link href="/" className="hover:text-[#C1492E] transition-colors">Home</Link>
          <span>›</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{category}</span>
        </div>

        {/* Hero */}
        <div
          className="w-full rounded-3xl p-8 mb-10 flex items-center gap-6 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, var(--action-primary), #B8962E)", opacity: 0.95 }}
        >
          <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 80% 50%, #B8962E33, transparent 70%)" }} />
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)" }}>
            <CategoryIcon className="w-8 h-8" style={{ color: "#fff" }} />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black" style={{ color: "#fff" }}>{category}</h1>
            <p className="mt-1 font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              {products.length}+ products available · Delivered in 15 mins
            </p>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {products.map((p: any, i) => {
            const ProductIcon = ICON_MAP[p.icon] || ShoppingBag;
            const productId = p.id || `${category.toLowerCase()}-${p.name.toLowerCase().replace(/\s+/g, '-')}`;
            const qty = items.find(item => item.id === productId)?.quantity || 0;
            return (
              <div
                key={i}
                className="rounded-2xl p-4 transition-all cursor-pointer group"
                style={{ background: "var(--surface-card)", border: "1px solid var(--surface-border)" }}
                onMouseEnter={(e: any) => {
                  e.currentTarget.style.borderColor = "var(--action-primary)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(193,73,46,0.12)";
                }}
                onMouseLeave={(e: any) => {
                  e.currentTarget.style.borderColor = "var(--surface-border)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="w-full aspect-square rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform" style={{ background: "var(--bg-main)" }}>
                  <ProductIcon className="w-10 h-10 transition-colors" style={{ color: "var(--text-muted)" }} />
                </div>
                <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>{p.name}</p>
                <p className="font-black text-sm mt-1" style={{ color: "var(--action-primary)" }}>₹{p.price}</p>
                
                {qty === 0 ? (
                  <button
                    onClick={() => addItem({ id: productId, name: p.name, price: parseInt(p.price), size: "", image: "" })}
                    className="mt-2 w-full text-xs font-bold py-2 rounded-xl transition-all flex items-center justify-center gap-1"
                    style={{
                      background: "linear-gradient(135deg, #C1492E, #a03a22)",
                      color: "#fff",
                      boxShadow: "0 2px 10px rgba(193,73,46,0.25)",
                    }}
                  >
                    ADD
                  </button>
                ) : (
                  <div className="mt-2 flex items-center justify-between rounded-xl px-1 py-1" style={{ background: "var(--bg-main)", border: "1px solid rgba(193,73,46,0.3)" }}>
                    <button
                      onClick={() => removeItem(productId)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "rgba(193,73,46,0.15)", color: "var(--action-primary)" }}
                    >
                      −
                    </button>
                    <span className="text-sm font-black" style={{ color: "var(--text-primary)" }}>{qty}</span>
                    <button
                      onClick={() => addItem({ id: productId, name: p.name, price: parseInt(p.price), size: "", image: "" })}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{ background: "#C1492E", color: "#fff" }}
                    >
                      +
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

export { ICON_MAP, CATEGORY_ICON_MAP };
