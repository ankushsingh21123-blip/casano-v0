"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Graphic Tee", price: "349", emoji: "👕" },
  { name: "Jogger Pants", price: "599", emoji: "👖" },
  { name: "Sneakers", price: "1299", emoji: "👟" },
  { name: "Sunglasses", price: "499", emoji: "🕶️" },
  { name: "Handbag", price: "899", emoji: "👜" },
  { name: "Cap", price: "299", emoji: "🧢" },
  { name: "Hoodie", price: "799", emoji: "🧥" },
  { name: "Denim Jacket", price: "1499", emoji: "🧣" },
  { name: "Watch", price: "1999", emoji: "⌚" },
  { name: "Belt", price: "349", emoji: "👔" },
  { name: "Formal Shirt", price: "699", emoji: "👔" },
  { name: "Track Suit", price: "999", emoji: "🩱" },
  { name: "Sandals", price: "449", emoji: "👡" },
  { name: "Socks (3 pairs)", price: "199", emoji: "🧦" },
  { name: "Kurti", price: "549", emoji: "👘" },
  { name: "Ethnic Set", price: "1299", emoji: "🥻" },
  { name: "Wallet", price: "399", emoji: "👛" },
  { name: "Scarf", price: "249", emoji: "🧣" },
  { name: "Earrings", price: "199", emoji: "💎" },
  { name: "Bracelet", price: "299", emoji: "📿" },
  { name: "Shorts", price: "399", emoji: "🩳" },
  { name: "Swimwear", price: "599", emoji: "🩱" },
  { name: "Rain Jacket", price: "1199", emoji: "🧤" },
  { name: "Gloves", price: "249", emoji: "🧤" },
];

export default function FashionPage() {
  return (
    <CategoryPageTemplate
      category="Fashion"
      emoji="👗"
      gradient="linear-gradient(135deg, #f953c6, #b91d73)"
      products={products}
    />
  );
}
