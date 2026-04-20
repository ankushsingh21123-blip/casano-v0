"use client";

import dynamic from "next/dynamic";

// Desktop-only decorative layers — hidden on mobile via CSS and dynamic import
const CustomCursor   = dynamic(() => import("@/components/ui/CustomCursor"),   { ssr: false });
const ScrollProgress = dynamic(() => import("@/components/ui/ScrollProgress"), { ssr: false });

export default function GlobalUI() {
  return (
    <>
      <CustomCursor />
      <ScrollProgress />
    </>
  );
}
