"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";

export function BenefitsHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="benefits-hero" className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <Badge className="mb-6">What You Get</Badge>

          {/* H1 */}
          <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-black tracking-tight leading-[1.1] text-zinc-900">
            <span className="block">Everything that changes when you</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-500">
              add KnowBridge to your website.
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mt-6">
            One script tag. Six immediate upgrades to how your business handles
            customer conversations, lead generation, and support.
          </p>

          {/* 3 Stat-style Callouts */}
          <div className="mt-12 w-full max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 border-t sm:border-t-0 border-zinc-200 pt-8 sm:pt-0">
            <div className="sm:border-r border-zinc-200 sm:pr-8 text-center">
              <div className="text-zinc-900 font-black text-3xl sm:text-4xl tracking-tight">
                24/7
              </div>
              <div className="text-zinc-500 text-sm mt-1 font-medium">
                Always-on support
              </div>
            </div>

            <div className="sm:border-r border-zinc-200 sm:px-8 text-center border-t sm:border-t-0 border-zinc-200 pt-4 sm:pt-0">
              <div className="text-zinc-900 font-black text-3xl sm:text-4xl tracking-tight">
                &lt; 10 min
              </div>
              <div className="text-zinc-500 text-sm mt-1 font-medium">
                Time to integrate
              </div>
            </div>

            <div className="sm:pl-8 text-center border-t sm:border-t-0 border-zinc-200 pt-4 sm:pt-0">
              <div className="text-zinc-900 font-black text-3xl sm:text-4xl tracking-tight">
                1 script tag
              </div>
              <div className="text-zinc-500 text-sm mt-1 font-medium">
                All you need to add
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
