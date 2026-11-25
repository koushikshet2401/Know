"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ArrowRight } from "lucide-react";

export function AdminHero() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="admin-hero" className="relative py-20 md:py-24 overflow-hidden">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Badge */}
          <Badge className="mb-6">Admin Dashboard</Badge>

          {/* H1 */}
          <h1 className="text-[clamp(2.5rem,5vw,3.75rem)] font-black tracking-tight leading-[1.12] text-zinc-900">
            Everything you need to manage AI support — in one place.
          </h1>

          {/* Subtext */}
          <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mt-6">
            The KnowBridge admin panel gives your team full visibility and control
            over every customer conversation, your AI knowledge base, and your chat
            widget — all from a single dashboard.
          </p>

          {/* CTA */}
          <div className="mt-10 flex justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/book-a-demo" className="flex items-center gap-2">
                <span>Book a Demo to See It Live</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
