import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Dumbbells 5kg Pair", price: "999", emoji: "🏋️" },
  { name: "Yoga Mat 6mm", price: "599", emoji: "🧘" },
  { name: "Resistance Bands (5 set)", price: "399", emoji: "💪" },
  { name: "Gym Gloves", price: "349", emoji: "🧤" },
  { name: "Whey Protein 1kg", price: "1799", emoji: "🥛" },
  { name: "Skipping Rope", price: "199", emoji: "🪢" },
  { name: "Gym Bag", price: "799", emoji: "🎒" },
  { name: "Foam Roller", price: "499", emoji: "🔵" },
  { name: "Pull-Up Bar", price: "899", emoji: "🏆" },
  { name: "Ab Roller", price: "349", emoji: "⭕" },
  { name: "Kettlebell 8kg", price: "1299", emoji: "🔵" },
  { name: "Push-Up Bars", price: "299", emoji: "💪" },
  { name: "Exercise Ball", price: "599", emoji: "🏀" },
  { name: "Protein Shaker", price: "249", emoji: "🧃" },
  { name: "BCAA Supplement", price: "1299", emoji: "💊" },
  { name: "Creatine 250g", price: "999", emoji: "⚗️" },
  { name: "Running Shoes", price: "1499", emoji: "👟" },
  { name: "Compression Tights", price: "699", emoji: "🩳" },
  { name: "Water Bottle 1L", price: "349", emoji: "💧" },
  { name: "Massage Gun", price: "2999", emoji: "⚡" },
  { name: "Heart Rate Monitor", price: "1999", emoji: "❤️" },
  { name: "Sports Towel", price: "199", emoji: "🏊" },
  { name: "Gym Chalk 100g", price: "149", emoji: "🤍" },
  { name: "Ankle Weights 2kg", price: "449", emoji: "🏋️" },
];

export default function GymPage() {
  return (
    <CategoryPageTemplate
      category="Gym & Fitness"
      emoji="💪"
      gradient="linear-gradient(135deg, #fc4a1a, #f7b733)"
      products={products}
    />
  );
}
