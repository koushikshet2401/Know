"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export function AdminFinalCTA() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden py-24 text-center border-t border-zinc-200 bg-zinc-50">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-4"
        >
          {/* H2 */}
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-900 tracking-tight leading-tight">
            Ready to see the dashboard for your business?
          </h2>

          {/* Subtext */}
          <p className="text-zinc-600 text-base sm:text-lg max-w-md mx-auto leading-relaxed">
            Book a demo and we will walk you through the admin panel live,
            configured for your use case.
          </p>

          {/* Button */}
          <div className="pt-4 flex justify-center">
            <Button variant="primary" size="lg" asChild>
              <Link href="/book-a-demo" className="flex items-center gap-2 group">
                <span>Book a Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
