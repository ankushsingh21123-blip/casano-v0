"use client";

import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { PenTool } from "lucide-react";

export default function StationaryPage() {
  const products = [
    {
      id: "s1",
      name: "Camel Artist Water Colors",
      weight: "1 pack",
      price: 250,
      image: "https://m.media-amazon.com/images/I/71oJ3D0pXIL.jpg",
      deliveryTime: "15 MINS",
    },
    {
      id: "s2",
      name: "Classmate Single Line Notebook",
      weight: "3 pcs",
      price: 150,
      originalPrice: 180,
      image: "https://m.media-amazon.com/images/I/71xSXXG4J9L._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
      tag: "16% OFF"
    },
    {
      id: "s3",
      name: "Faber-Castell Textliner Pastel",
      weight: "5 pcs",
      price: 200,
      image: "https://m.media-amazon.com/images/I/61U+lSj9rZL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
    },
    {
      id: "s4",
      name: "Cello Maxriter Ball Pen Set",
      weight: "10 pcs",
      price: 100,
      image: "https://m.media-amazon.com/images/I/611vXWQ7LRL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
    },
    {
      id: "s5",
      name: "Apsara Platinum Pencils",
      weight: "10 pcs",
      price: 50,
      image: "https://m.media-amazon.com/images/I/61nE+pZpCIL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
    },
    {
      id: "s6",
      name: "Kangaro Desktop Stapler",
      weight: "1 pc",
      price: 125,
      image: "https://m.media-amazon.com/images/I/51A4zYtGqpL._AC_UF1000,1000_QL80_.jpg",
      deliveryTime: "15 MINS",
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans">
      <Header />
      
      <div className="bg-blue-600 text-white w-full py-12 px-4 shadow-sm relative overflow-hidden">
         <div className="absolute right-10 bottom-0 opacity-10">
            <PenTool className="w-64 h-64 -mb-10 -mr-10" />
         </div>
         <div className="max-w-[1400px] mx-auto relative z-10 flex items-center gap-4">
             <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                 <PenTool className="w-8 h-8 text-white" />
             </div>
             <div>
                 <h1 className="text-3xl sm:text-4xl font-black">Stationary</h1>
                 <p className="text-blue-100 font-medium">Pens, Notebooks, Arts & Crafts</p>
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
