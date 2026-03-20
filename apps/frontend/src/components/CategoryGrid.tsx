"use client";

import Link from "next/link";

export default function CategoryGrid() {
  const categories = [
    {
      id: "stationary",
      title: "Stationery",
      subtitle: "Pens, Paper & More",
      image: "/category_stationery.png",
      link: "/category/stationary",
      accent: "#B8962E", // Gold
      bg: "linear-gradient(135deg, #FBF5E1, #EFEADD)",
    },
    {
      id: "pharmacy",
      title: "Pharmacy",
      subtitle: "Medicines & Health",
      image: "/category_pharmacy.png",
      link: "/category/pharmacy",
      accent: "#214A36", // Forest green
      bg: "linear-gradient(135deg, #E6F2EC, #D0EAD9)",
    },
    {
      id: "groceries",
      title: "Groceries",
      subtitle: "Daily Essentials",
      image: "/category_groceries.png",
      link: "/category/groceries",
      accent: "#C1492E", // Saffron
      bg: "linear-gradient(135deg, #FAE8E5, #F5D0C8)",
    },
  ];

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-black tracking-tight"
            style={{ color: "#2A2B2A", fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Shop by Category
          </h2>
          <p className="text-sm mt-1" style={{ color: "#9A9B9A" }}>
            From your local Kirana partner — delivered in 15 minutes
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((category) => (
          <Link href={category.link} key={category.id}>
            <div
              className="group relative rounded-2xl overflow-hidden transition-all cursor-pointer"
              style={{ border: "1px solid #E2DDD0", background: "#EFEADD" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = category.accent + "66";
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${category.accent}1A`;
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = "#E2DDD0";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
              }}
            >
              {/* Image */}
              <div
                className="relative h-[180px] sm:h-[200px] overflow-hidden"
                style={{ background: category.bg }}
              >
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e: any) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                {/* Label on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-black text-white tracking-tight">{category.title}</h3>
                  <p className="text-sm text-white/80 font-medium">{category.subtitle}</p>
                </div>
              </div>

              {/* CTA Row */}
              <div className="p-4 flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "#9A9B9A" }}>Delivered in 15 min</span>
                <button
                  className="text-white px-4 py-2 rounded-lg font-bold text-[13px] transition-all"
                  style={{ background: category.accent }}
                >
                  Order Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
