import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Smartphone Stand", price: "299", icon: "phone" },
  { name: "Wireless Earbuds", price: "1499", icon: "earbuds" },
  { name: "Smartwatch", price: "2999", icon: "smartwatch" },
  { name: "Power Bank 10000mAh", price: "799", icon: "powerbank" },
  { name: "USB-C Cable", price: "199", icon: "cable" },
  { name: "Bluetooth Speaker", price: "1299", icon: "speaker" },
  { name: "Webcam 1080p", price: "1799", icon: "webcam" },
  { name: "Mechanical Keyboard", price: "2499", icon: "keyboard" },
  { name: "Gaming Mouse", price: "999", icon: "mouse" },
  { name: "Monitor Stand", price: "699", icon: "monitor" },
  { name: "Laptop Sleeve", price: "499", icon: "laptop" },
  { name: "Wireless Charger", price: "899", icon: "charger" },
  { name: "Screen Protector", price: "149", icon: "screen-protector" },
  { name: "Phone Case", price: "199", icon: "phonecase" },
  { name: "LED Desk Lamp", price: "599", icon: "lamp" },
  { name: "Mini Drone", price: "3999", icon: "drone" },
  { name: "VR Headset", price: "4999", icon: "vr" },
  { name: "Smart Plug", price: "499", icon: "plug" },
  { name: "Action Camera", price: "3499", icon: "camera" },
  { name: "Drawing Tablet", price: "2499", icon: "tablet" },
  { name: "SSD 256GB", price: "1999", icon: "ssd" },
  { name: "Memory Card 64GB", price: "499", icon: "memory" },
  { name: "Hub 7-in-1", price: "1299", icon: "hub" },
  { name: "Noise Cancelling Headphones", price: "3999", icon: "headphones" },
];

export default function GadgetsPage() {
  return (
    <CategoryPageTemplate
      category="Gadgets"
      gradient="linear-gradient(135deg, #232526, #414345)"
      products={products}
    />
  );
}
