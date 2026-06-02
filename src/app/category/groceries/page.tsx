import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Fresh Tomatoes", price: "29", icon: "tomato" },
  { name: "Amul Milk 500ml", price: "28", icon: "milk" },
  { name: "Whole Wheat Bread", price: "45", icon: "bread" },
  { name: "Bananas (6 pcs)", price: "35", icon: "banana" },
  { name: "Onions 1kg", price: "40", icon: "onion" },
  { name: "Potatoes 1kg", price: "35", icon: "potato" },
  { name: "Green Spinach", price: "20", icon: "spinach" },
  { name: "Eggs (12 pcs)", price: "90", icon: "egg" },
  { name: "Curd 400g", price: "55", icon: "curd" },
  { name: "Desi Ghee 500ml", price: "340", icon: "ghee" },
  { name: "Carrots 500g", price: "30", icon: "carrot" },
  { name: "Cucumber", price: "25", icon: "cucumber" },
  { name: "Lemon 4 pcs", price: "20", icon: "lemon" },
  { name: "Orange Juice 1L", price: "99", icon: "orange" },
  { name: "Basmati Rice 1kg", price: "120", icon: "rice" },
  { name: "Atta 5kg", price: "280", icon: "wheat" },
  { name: "Toor Dal 500g", price: "85", icon: "dal" },
  { name: "Mustard Oil 1L", price: "165", icon: "oil" },
  { name: "Sugar 1kg", price: "50", icon: "sugar" },
  { name: "Salt 1kg", price: "20", icon: "salt" },
  { name: "Garlic 100g", price: "30", icon: "garlic" },
  { name: "Ginger 100g", price: "20", icon: "ginger" },
  { name: "Butter 100g", price: "55", icon: "butter" },
  { name: "Paneer 200g", price: "90", icon: "paneer" },
];

export default function GroceriesPage() {
  return (
    <CategoryPageTemplate
      category="Groceries"
      gradient="linear-gradient(135deg, #56ab2f, #a8e063)"
      products={products}
    />
  );
}
