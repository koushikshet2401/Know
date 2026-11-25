"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PinnedOverlayCardProps {
  id?: string;
  zIndex: number;
  bgClassName?: string;
  className?: string;
  children: React.ReactNode;
  isFirst?: boolean;
}

export function PinnedOverlayCard({
  id,
  zIndex,
  bgClassName = "bg-white",
  className,
  children,
  isFirst = false,
}: PinnedOverlayCardProps) {
  const containerRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Track progress of scrolling past this pinned card
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // On desktop, as the next card overlays this pinned card, gently scale down and dim
  // to give a smooth 3D sheet-stacking depth effect.
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    [1, prefersReducedMotion ? 1 : 0.96]
  );
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.85],
    [1, prefersReducedMotion ? 1 : 0.85]
  );

  return (
    <section
      id={id}
      ref={containerRef}
      style={{ zIndex }}
      className={cn(
        // On desktop (lg:): sticky pinned cards that stack and overlay at top-16 (64px)
        // On mobile (< lg:): smooth natural scroll flow so tall content is never cut off or occluded
        "relative lg:sticky lg:top-16 w-full lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center",
        "scroll-mt-16 lg:[scroll-snap-align:start]",
        "overflow-hidden max-w-full",
        bgClassName,
        // Card styling: smooth top edge and subtle drop-shadow separating from the card behind it
        !isFirst && [
          "rounded-t-2xl sm:rounded-t-3xl lg:rounded-t-[2.25rem]",
          "border-t border-zinc-200/90",
          "shadow-[0_-12px_28px_rgba(0,0,0,0.05)] lg:shadow-[0_-24px_48px_rgba(0,0,0,0.07)]",
        ],
        className
      )}
    >
      <motion.div
        style={{
          scale,
          opacity,
          transformOrigin: "center top",
        }}
        className="w-full h-full flex flex-col justify-center max-w-full"
      >
        {children}
      </motion.div>
    </section>
  );
}
