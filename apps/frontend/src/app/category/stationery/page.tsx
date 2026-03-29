"use client";
import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Spiral Notebook A5", price: "79", emoji: "📓" },
  { name: "Ballpoint Pens (10)", price: "49", emoji: "🖊️" },
  { name: "Highlighters Set (6)", price: "99", emoji: "🖍️" },
  { name: "Sticky Notes Pack", price: "59", emoji: "📝" },
  { name: "Ruler 30cm", price: "29", emoji: "📏" },
  { name: "Pencil Box", price: "149", emoji: "✏️" },
  { name: "Stapler", price: "129", emoji: "📎" },
  { name: "Scissors", price: "69", emoji: "✂️" },
  { name: "Eraser Pack (4)", price: "39", emoji: "🔲" },
  { name: "HB Pencils (12)", price: "59", emoji: "✏️" },
  { name: "Geometry Box", price: "199", emoji: "📐" },
  { name: "A4 Paper Ream", price: "299", emoji: "📄" },
  { name: "Whiteboard Marker (4)", price: "89", emoji: "🖊️" },
  { name: "File Folder (5 pcs)", price: "149", emoji: "📁" },
  { name: "Correction Pen", price: "49", emoji: "✒️" },
  { name: "Glue Stick", price: "39", emoji: "🔧" },
  { name: "Tape Dispenser", price: "199", emoji: "📦" },
  { name: "Calculator", price: "299", emoji: "🧮" },
  { name: "Clipboard", price: "99", emoji: "📋" },
  { name: "Index Cards (50)", price: "69", emoji: "🗂️" },
  { name: "Fountain Pen Set", price: "349", emoji: "🖋️" },
  { name: "Sketchbook A4", price: "179", emoji: "🎨" },
  { name: "Watercolor Set (12)", price: "249", emoji: "🖌️" },
  { name: "Binder Clips (12)", price: "45", emoji: "🔗" },
];

export default function StationeryPage() {
  return (
    <CategoryPageTemplate
      category="Stationery"
      emoji="✏️"
      gradient="linear-gradient(135deg, #f7971e, #ffd200)"
      products={products}
    />
  );
}
