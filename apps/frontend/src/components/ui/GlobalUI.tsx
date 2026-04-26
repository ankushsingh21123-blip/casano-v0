"use client";

import dynamic from "next/dynamic";

// Scroll progress bar only — custom cursor removed
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"), { ssr: false });

export default function GlobalUI() {
  return <ScrollProgress />;
}
