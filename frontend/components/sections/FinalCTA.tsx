"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Mail } from "lucide-react";

export function FinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="relative overflow-hidden py-14 sm:py-18 md:py-24 w-full">
      {/* Background radial glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
        aria-hidden="true"
      >
        <div
          className="w-[600px] h-[400px] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(0,0,0,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{
            opacity: 0,
            scale: prefersReducedMotion ? 1 : 0.97,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="space-y-5"
        >
          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-tight">
            Ready to stop missing leads?
          </h2>

          {/* Subtext */}
          <p className="text-zinc-600 text-sm sm:text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Book a 20-minute demo. We will show you KnowBridge live and help you
            configure it for your business.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link href="/book-a-demo" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base px-7 py-3.5 group"
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-sm sm:text-base text-zinc-800 hover:text-black py-3.5"
              >
                <Mail className="w-4 h-4 mr-1 text-zinc-500" />
                <span>Contact Us</span>
              </Button>
            </Link>
          </div>

          {/* Micro trust row */}
          <p className="text-xs text-zinc-400 pt-2">
            No credit card required &middot; 20-minute live setup walkthrough &middot; Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
}
