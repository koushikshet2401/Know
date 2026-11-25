"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Play, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface FeatureBlockProps {
  id: string;
  title: string;
  description: string;
  bullets: string[] | readonly string[];
  videoUrl: string;
  side: "left" | "right";
  index: number;
}

export function FeatureBlock({
  id,
  title,
  description,
  bullets,
  videoUrl,
  side,
  index,
}: FeatureBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();

  const isPlaceholder =
    !videoUrl || videoUrl === "PLACEHOLDER" || videoUrl.includes("PLACEHOLDER");
  const isYouTube = videoUrl?.includes("youtube.com/embed");

  const videoInitialX = prefersReducedMotion ? 0 : side === "left" ? -32 : 32;
  const textInitialX = prefersReducedMotion ? 0 : side === "left" ? 32 : -32;

  return (
    <div
      ref={ref}
      id={id}
      className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center py-16 lg:py-24 border-b border-zinc-200 last:border-b-0"
    >
      {/* Video Div */}
      <motion.div
        initial={{ opacity: 0, x: videoInitialX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: videoInitialX }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn(
          "w-full flex-1",
          side === "left" ? "order-1 lg:order-1" : "order-1 lg:order-2"
        )}
      >
        <div className="relative rounded-xl bg-zinc-50 border border-zinc-200 overflow-hidden aspect-video shadow-xs group">
          {isPlaceholder ? (
            <div className="w-full h-full bg-white flex flex-col items-center justify-center p-6 text-center select-none">
              <div className="w-14 h-14 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                <Play className="w-7 h-7 text-zinc-900 fill-zinc-900/10 ml-0.5" />
              </div>
              <span className="text-zinc-500 text-sm mt-3 font-medium">
                Dashboard video — coming soon
              </span>
            </div>
          ) : isYouTube ? (
            <iframe
              src={videoUrl}
              title={title}
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : (
            <video
              src={videoUrl}
              controls
              className="w-full h-full object-cover"
            />
          )}
        </div>
      </motion.div>

      {/* Text Div */}
      <motion.div
        initial={{ opacity: 0, x: textInitialX }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: textInitialX }}
        transition={{ duration: 0.6, ease: "easeOut", delay: prefersReducedMotion ? 0 : 0.1 }}
        className={cn(
          "w-full flex-1",
          side === "left" ? "order-2 lg:order-2" : "order-2 lg:order-1"
        )}
      >
        <div className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-3">
          Panel 0{index + 1}
        </div>

        <h3 className="text-zinc-900 font-bold text-2xl sm:text-3xl leading-snug mb-4">
          {title}
        </h3>

        <p className="text-zinc-600 text-base leading-relaxed mb-6">
          {description}
        </p>

        {/* Bullets with stagger */}
        <div className="space-y-3">
          {bullets.map((bullet, bIdx) => (
            <motion.div
              key={bIdx}
              initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
                delay: prefersReducedMotion ? 0 : 0.2 + bIdx * 0.08,
              }}
              className="flex items-start gap-3"
            >
              <CheckCircle2 className="w-[18px] h-[18px] text-zinc-900 mt-0.5 shrink-0" />
              <span className="text-zinc-700 text-sm leading-relaxed">
                {bullet}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
