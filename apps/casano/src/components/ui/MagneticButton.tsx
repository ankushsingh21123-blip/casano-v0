"use client";

import { useRef, useCallback, ReactNode } from "react";

interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  strength?: number;
  "data-cursor"?: string;
}

/**
 * Magnetic button — pointer attracts the element toward the cursor on hover.
 * Perfect for CTAs on desktop.
 */
export default function MagneticButton({
  children,
  onClick,
  className = "",
  style = {},
  strength = 0.35,
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * strength;
      const dy = (e.clientY - cy) * strength;
      ref.current.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
    },
    [strength]
  );

  const handleMouseLeave = useCallback(() => {
    if (!ref.current) return;
    ref.current.style.transform = "translate(0,0) scale(1)";
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{
        transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), background 0.2s",
        ...style,
      }}
      data-cursor="cta"
      {...rest}
    >
      {children}
    </button>
  );
}
