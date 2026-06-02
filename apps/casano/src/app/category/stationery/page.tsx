import { CategoryPageTemplate } from "@/components/CategoryPageTemplate";

const products = [
  { name: "Spiral Notebook A5", price: "79", icon: "notebook" },
  { name: "Ballpoint Pens (10)", price: "49", icon: "pen" },
  { name: "Highlighters Set (6)", price: "99", icon: "highlighter" },
  { name: "Sticky Notes Pack", price: "59", icon: "sticky" },
  { name: "Ruler 30cm", price: "29", icon: "ruler" },
  { name: "Pencil Box", price: "149", icon: "pencilbox" },
  { name: "Stapler", price: "129", icon: "stapler" },
  { name: "Scissors", price: "69", icon: "scissors" },
  { name: "Eraser Pack (4)", price: "39", icon: "eraser" },
  { name: "HB Pencils (12)", price: "59", icon: "pencil" },
  { name: "Geometry Box", price: "199", icon: "geometry" },
  { name: "A4 Paper Ream", price: "299", icon: "paper" },
  { name: "Whiteboard Marker (4)", price: "89", icon: "marker" },
  { name: "File Folder (5 pcs)", price: "149", icon: "folder" },
  { name: "Correction Pen", price: "49", icon: "correction" },
  { name: "Glue Stick", price: "39", icon: "glue" },
  { name: "Tape Dispenser", price: "199", icon: "tape" },
  { name: "Calculator", price: "299", icon: "calculator" },
  { name: "Clipboard", price: "99", icon: "clipboard" },
  { name: "Index Cards (50)", price: "69", icon: "index" },
  { name: "Fountain Pen Set", price: "349", icon: "fountain" },
  { name: "Sketchbook A4", price: "179", icon: "sketchbook" },
  { name: "Watercolor Set (12)", price: "249", icon: "watercolor" },
  { name: "Binder Clips (12)", price: "45", icon: "clips" },
];

export default function StationeryPage() {
  return (
    <CategoryPageTemplate
      category="Stationery"
      gradient="linear-gradient(135deg, #f7971e, #ffd200)"
      products={products}
    />
  );
}
