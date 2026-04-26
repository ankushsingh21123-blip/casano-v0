import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Graphic Tee", price: "349", icon: "tshirt" },
  { name: "Jogger Pants", price: "599", icon: "pants" },
  { name: "Sneakers", price: "1299", icon: "sneakers" },
  { name: "Sunglasses", price: "499", icon: "sunglasses" },
  { name: "Handbag", price: "899", icon: "handbag" },
  { name: "Cap", price: "299", icon: "cap" },
  { name: "Hoodie", price: "799", icon: "hoodie" },
  { name: "Denim Jacket", price: "1499", icon: "jacket" },
  { name: "Watch", price: "1999", icon: "watch" },
  { name: "Belt", price: "349", icon: "belt" },
  { name: "Formal Shirt", price: "699", icon: "shirt" },
  { name: "Track Suit", price: "999", icon: "tracksuit" },
  { name: "Sandals", price: "449", icon: "sandals" },
  { name: "Socks (3 pairs)", price: "199", icon: "socks" },
  { name: "Kurti", price: "549", icon: "kurti" },
  { name: "Ethnic Set", price: "1299", icon: "ethnic" },
  { name: "Wallet", price: "399", icon: "wallet" },
  { name: "Scarf", price: "249", icon: "scarf" },
  { name: "Earrings", price: "199", icon: "earrings" },
  { name: "Bracelet", price: "299", icon: "bracelet" },
  { name: "Shorts", price: "399", icon: "shorts" },
  { name: "Swimwear", price: "599", icon: "swimwear" },
  { name: "Rain Jacket", price: "1199", icon: "jacket" },
  { name: "Gloves", price: "249", icon: "gloves" },
];

export default function FashionPage() {
  return (
    <CategoryPageTemplate
      category="Fashion"
      gradient="linear-gradient(135deg, #f953c6, #b91d73)"
      products={products}
    />
  );
}
