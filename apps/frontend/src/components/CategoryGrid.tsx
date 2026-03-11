"use client";

import Link from "next/link";
import { PenTool, Cross, Egg, ChevronRight } from "lucide-react";

export default function CategoryGrid() {
  const categories = [
    {
      id: "stationary",
      title: "Stationary",
      subtitle: "Pens, Paper & More",
      color: "bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40",
      iconColor: "text-blue-600 dark:text-blue-400",
      buttonColor: "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
      icon: <PenTool className="w-10 h-10" />,
      link: "/category/stationary"
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      subtitle: "Medicines & Health",
      color: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40",
      iconColor: "text-casano-green dark:text-[#19c74a]",
      buttonColor: "bg-casano-green hover:bg-[#158233] dark:bg-[#19c74a] dark:hover:bg-[#14a33c]",
      icon: <Cross className="w-10 h-10" />,
      link: "/category/pharmacy"
    },
    {
      id: "groceries",
      title: "Eggs & Groceries",
      subtitle: "Daily Essentials",
      color: "bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/20 dark:hover:bg-orange-900/40",
      iconColor: "text-casano-orange dark:text-orange-400",
      buttonColor: "bg-casano-orange hover:bg-casano-orange-dark dark:bg-orange-500 dark:hover:bg-orange-600",
      icon: <Egg className="w-10 h-10" />,
      link: "/category/groceries"
    }
  ];

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight transition-colors duration-300">Shop by Category</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id} 
            className={`${category.color} rounded-3xl p-6 sm:p-8 flex items-center justify-between transition-colors group cursor-pointer border border-transparent shadow-sm hover:shadow-md`}
          >
            <div className="flex-1">
              <div className={`${category.iconColor} mb-4 bg-white dark:bg-[#2a2a2a] w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm -rotate-3 group-hover:rotate-0 transition-all duration-300`}>
                {category.icon}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 transition-colors duration-300">{category.title}</h3>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-6 transition-colors duration-300">{category.subtitle}</p>
              
              <Link href={category.link} className="inline-block">
                <button className={`${category.buttonColor} text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md transition-transform hover:-translate-y-0.5 flex items-center gap-1.5`}>
                  Order Now <ChevronRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
            
            {/* Abstract Graphic Element right aligned */}
            <div className="hidden sm:block opacity-20 group-hover:opacity-40 transition-opacity">
                {/* Large blurred icon */}
                <div className={`scale-[3] ${category.iconColor}`}>
                    {category.icon}
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
