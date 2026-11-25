"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  MessageSquare,
  UserCheck,
  BookOpen,
  Globe,
  Settings,
  Copy,
  Users,
  LayoutDashboard,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { ADMIN_CAPABILITY_GRID } from "@/lib/constants";

const iconMap: Record<string, LucideIcon> = {
  MessageSquare,
  UserCheck,
  BookOpen,
  Globe,
  Settings,
  Copy,
  Users,
  LayoutDashboard,
  CheckCircle,
};

export function AdminCapabilityGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper id="admin-capabilities" className="py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-6" ref={ref}>
        {/* H2 */}
        <h2 className="text-center text-zinc-900 font-bold text-3xl sm:text-4xl tracking-tight">
          Everything in the dashboard — at a glance
        </h2>

        {/* 9-cell Grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ADMIN_CAPABILITY_GRID.map((item, idx) => {
            const Icon = iconMap[item.icon] ?? CheckCircle;

            return (
              <motion.div
                key={item.label}
                initial={{
                  opacity: 0,
                  y: prefersReducedMotion ? 0 : 16,
                }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: prefersReducedMotion ? 0 : 16 }
                }
                transition={{
                  duration: 0.4,
                  ease: "easeOut",
                  delay: prefersReducedMotion ? 0 : idx * 0.05,
                }}
                className="bg-white border border-zinc-200 rounded-card p-6 text-center flex flex-col items-center justify-center hover:border-zinc-300 shadow-2xs transition-all duration-200 group"
              >
                <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center group-hover:bg-zinc-200/80 group-hover:scale-105 transition-transform duration-200">
                  <Icon className="w-6 h-6 text-zinc-900" />
                </div>
                <span className="text-zinc-800 text-sm font-semibold mt-3">
                  {item.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </SectionWrapper>
  );
}
