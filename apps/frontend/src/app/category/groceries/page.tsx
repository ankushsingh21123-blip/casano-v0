import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Fresh Tomatoes", price: "29", emoji: "🍅" },
  { name: "Amul Milk 500ml", price: "28", emoji: "🥛" },
  { name: "Whole Wheat Bread", price: "45", emoji: "🍞" },
  { name: "Bananas (6 pcs)", price: "35", emoji: "🍌" },
  { name: "Onions 1kg", price: "40", emoji: "🧅" },
  { name: "Potatoes 1kg", price: "35", emoji: "🥔" },
  { name: "Green Spinach", price: "20", emoji: "🥬" },
  { name: "Eggs (12 pcs)", price: "90", emoji: "🥚" },
  { name: "Curd 400g", price: "55", emoji: "🫙" },
  { name: "Desi Ghee 500ml", price: "340", emoji: "🧈" },
  { name: "Carrots 500g", price: "30", emoji: "🥕" },
  { name: "Cucumber", price: "25", emoji: "🥒" },
  { name: "Lemon 4 pcs", price: "20", emoji: "🍋" },
  { name: "Orange Juice 1L", price: "99", emoji: "🍊" },
  { name: "Basmati Rice 1kg", price: "120", emoji: "🍚" },
  { name: "Atta 5kg", price: "280", emoji: "🌾" },
  { name: "Toor Dal 500g", price: "85", emoji: "🫘" },
  { name: "Mustard Oil 1L", price: "165", emoji: "🫙" },
  { name: "Sugar 1kg", price: "50", emoji: "🍬" },
  { name: "Salt 1kg", price: "20", emoji: "🧂" },
  { name: "Garlic 100g", price: "30", emoji: "🧄" },
  { name: "Ginger 100g", price: "20", emoji: "🫚" },
  { name: "Butter 100g", price: "55", emoji: "🧈" },
  { name: "Paneer 200g", price: "90", emoji: "🍱" },
];

export default function GroceriesPage() {
  return (
    <CategoryPageTemplate
      category="Groceries"
      emoji="🛒"
      gradient="linear-gradient(135deg, #56ab2f, #a8e063)"
      products={products}
    />
  );
}
