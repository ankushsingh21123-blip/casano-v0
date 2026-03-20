import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Smartphone Stand", price: "299", emoji: "📱" },
  { name: "Wireless Earbuds", price: "1499", emoji: "🎧" },
  { name: "Smartwatch", price: "2999", emoji: "⌚" },
  { name: "Power Bank 10000mAh", price: "799", emoji: "🔋" },
  { name: "USB-C Cable", price: "199", emoji: "🔌" },
  { name: "Bluetooth Speaker", price: "1299", emoji: "🔊" },
  { name: "Webcam 1080p", price: "1799", emoji: "📷" },
  { name: "Mechanical Keyboard", price: "2499", emoji: "⌨️" },
  { name: "Gaming Mouse", price: "999", emoji: "🖱️" },
  { name: "Monitor Stand", price: "699", emoji: "🖥️" },
  { name: "Laptop Sleeve", price: "499", emoji: "💻" },
  { name: "Wireless Charger", price: "899", emoji: "⚡" },
  { name: "Screen Protector", price: "149", emoji: "🛡️" },
  { name: "Phone Case", price: "199", emoji: "📲" },
  { name: "LED Desk Lamp", price: "599", emoji: "💡" },
  { name: "Mini Drone", price: "3999", emoji: "🚁" },
  { name: "VR Headset", price: "4999", emoji: "🥽" },
  { name: "Smart Plug", price: "499", emoji: "🔌" },
  { name: "Action Camera", price: "3499", emoji: "🎥" },
  { name: "Drawing Tablet", price: "2499", emoji: "✍️" },
  { name: "SSD 256GB", price: "1999", emoji: "💾" },
  { name: "Memory Card 64GB", price: "499", emoji: "💿" },
  { name: "Hub 7-in-1", price: "1299", emoji: "🔗" },
  { name: "Noise Cancelling Headphones", price: "3999", emoji: "🎵" },
];

export default function GadgetsPage() {
  return (
    <CategoryPageTemplate
      category="Gadgets"
      emoji="📱"
      gradient="linear-gradient(135deg, #232526, #414345)"
      products={products}
    />
  );
}
