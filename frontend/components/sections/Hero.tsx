"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { AnimatedChat } from "@/components/sections/AnimatedChat";
import { ArrowRight, ChevronDown } from "lucide-react";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();

  const leftVariants: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const rightVariants: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, delay: 0.15, ease: "easeOut" },
    },
  };

  return (
    <div className="relative overflow-hidden py-6 sm:py-8 md:py-12 w-full max-w-full">
      {/* Background radial gradient glow centered on the left column */}
      <div
        className="pointer-events-none absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full blur-[120px] -z-10"
        style={{
          background:
            "radial-gradient(circle, rgba(0,0,0,0.03) 0%, transparent 70%)",
        }}
      />

      {/* Subtle background SVG grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.35]"
        style={{
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.07) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      <SectionWrapper className="py-0 md:py-0">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center"
        >
          {/* Left Column — Copy */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            {/* Category Badge */}
            <div className="mb-4">
              <Badge className="px-3.5 py-1.5 text-xs font-semibold tracking-wide">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 animate-pulse" />
                AI-Powered Customer Support
              </Badge>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1.08] mb-4">
              Your website is losing leads{" "}
              <span className="text-zinc-500 font-extrabold block sm:inline">
                because no one is answering.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-zinc-600 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mb-6">
              KnowBridge embeds an AI chatbot into your website that answers
              customer questions instantly — trained on your own documents,
              connected to your team, and live in under 10 minutes.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto mb-6">
              <Link href="#contact" className="w-full sm:w-auto">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base px-6 py-3.5 justify-center group"
                >
                  <span>Book a Demo</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>

              <Link href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto text-sm sm:text-base text-zinc-800 hover:text-black justify-center py-3.5"
                >
                  <span>See How It Works</span>
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>

            {/* Trust line below CTAs */}
            <p className="text-xs sm:text-sm text-zinc-500 font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>No credit card required</span>
              <span className="text-zinc-300">·</span>
              <span>One script tag to embed</span>
              <span className="text-zinc-300">·</span>
              <span>Human handoff built in</span>
            </p>
          </motion.div>

          {/* Right Column — Animated Chat Widget Preview */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="lg:col-span-5 flex justify-center w-full"
          >
            <AnimatedChat />
          </motion.div>
        </div>
      </SectionWrapper>
    </div>
  );
}
