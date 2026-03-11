"use client";

import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Cross } from "lucide-react";

export default function PharmacyPage() {
  const products = [
    {
      id: "ph1",
      name: "Volini Pain Relief Spray",
      weight: "40 g",
      price: 154,
      image: "https://m.media-amazon.com/images/I/61uRb-Z99BL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
    },
    {
      id: "ph2",
      name: "Vicks VapoRub",
      weight: "50 ml",
      price: 145,
      image: "https://m.media-amazon.com/images/I/61b78j56DNL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
      tag: "Bestseller"
    },
    {
      id: "ph3",
      name: "Dolo 650 Tablet",
      weight: "15 Tablets",
      price: 33,
      image: "https://static.oxinis.com/healthmug/image/product/140226-1-1000.webp",
      deliveryTime: "15 MINS",
    },
    {
      id: "ph4",
      name: "Himalaya Liv.52 DS Tablets",
      weight: "60 Tablets",
      price: 170,
      image: "https://m.media-amazon.com/images/I/614Yg1R3+mL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
    },
    {
      id: "ph5",
      name: "Pudin Hara Pearls",
      weight: "10 Pearls",
      price: 25,
      image: "https://m.media-amazon.com/images/I/61G+h-Gk-gL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <Header />
      
      <div className="bg-casano-green text-white w-full py-12 px-4 shadow-sm relative overflow-hidden">
         <div className="absolute right-10 bottom-0 opacity-10">
            <Cross className="w-64 h-64 -mb-10 -mr-10" />
         </div>
         <div className="max-w-[1400px] mx-auto relative z-10 flex items-center gap-4">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                 <Cross className="w-8 h-8 text-white" />
             </div>
             <div>
                 <h1 className="text-3xl sm:text-4xl font-black">Pharmacy</h1>
                 <p className="text-green-100 font-medium">Medicines, First Aid & Wellness</p>
             </div>
         </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 py-8 pb-24">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Explore Products</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {products.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </main>
    </div>
  );
}
