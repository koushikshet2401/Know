"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight, LayoutDashboard } from "lucide-react";

export function BenefitsFinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 md:py-28 bg-zinc-50 border-t border-zinc-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{
            opacity: 0,
            y: prefersReducedMotion ? 0 : 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* H2 */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            All of this — from one script tag.
          </h2>

          {/* Subtext */}
          <p className="text-zinc-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Add KnowBridge to your website today and start converting visitors
            into conversations, conversations into leads, and leads into
            customers.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/book-a-demo" className="w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-3.5 group"
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/admin-panel" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto text-base px-8 py-3.5 group text-zinc-800"
              >
                <LayoutDashboard className="w-4 h-4 mr-2 text-zinc-500" />
                <span>See the Admin Panel</span>
              </Button>
            </Link>
          </div>

          {/* Trust line */}
          <p className="text-zinc-500 text-xs sm:text-sm pt-2">
            Setup takes under 10 minutes · No developer required · Free onboarding support
          </p>
        </motion.div>
      </div>
    </section>
  );
}
