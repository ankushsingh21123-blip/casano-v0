import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Dumbbells 5kg Pair", price: "999", icon: "dumbbells" },
  { name: "Yoga Mat 6mm", price: "599", icon: "yoga" },
  { name: "Resistance Bands (5 set)", price: "399", icon: "bands" },
  { name: "Gym Gloves", price: "349", icon: "gymgloves" },
  { name: "Whey Protein 1kg", price: "1799", icon: "protein" },
  { name: "Skipping Rope", price: "199", icon: "rope" },
  { name: "Gym Bag", price: "799", icon: "gymbag" },
  { name: "Foam Roller", price: "499", icon: "roller" },
  { name: "Pull-Up Bar", price: "899", icon: "pullup" },
  { name: "Ab Roller", price: "349", icon: "abroller" },
  { name: "Kettlebell 8kg", price: "1299", icon: "kettlebell" },
  { name: "Push-Up Bars", price: "299", icon: "pushup" },
  { name: "Exercise Ball", price: "599", icon: "ball" },
  { name: "Protein Shaker", price: "249", icon: "shaker" },
  { name: "BCAA Supplement", price: "1299", icon: "bcaa" },
  { name: "Creatine 250g", price: "999", icon: "creatine" },
  { name: "Running Shoes", price: "1499", icon: "shoes" },
  { name: "Compression Tights", price: "699", icon: "tights" },
  { name: "Water Bottle 1L", price: "349", icon: "bottle" },
  { name: "Massage Gun", price: "2999", icon: "massage" },
  { name: "Heart Rate Monitor", price: "1999", icon: "heartrate" },
  { name: "Sports Towel", price: "199", icon: "towel" },
  { name: "Gym Chalk 100g", price: "149", icon: "chalk" },
  { name: "Ankle Weights 2kg", price: "449", icon: "ankleweights" },
];

export default function GymPage() {
  return (
    <CategoryPageTemplate
      category="Gym & Fitness"
      gradient="linear-gradient(135deg, #fc4a1a, #f7b733)"
      products={products}
    />
  );
}
