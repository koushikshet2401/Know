"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  TrendingUp,
  Brain,
  Clock,
  Users,
  ShieldCheck,
  Code2,
} from "lucide-react";

const reasonsList = [
  {
    icon: TrendingUp,
    title: "You stop losing leads silently",
    body: "Every visitor who opens the chat and gets an instant answer is a lead you would have lost without KnowBridge. The bot works while your team sleeps.",
  },
  {
    icon: Brain,
    title: "Answers come from your content — not the internet",
    body: "Generic AI chatbots hallucinate. KnowBridge answers only from documents and pages you provide. Every response is grounded in your actual business knowledge.",
  },
  {
    icon: Clock,
    title: "Setup takes under 10 minutes",
    body: "Upload your documents, configure your bot, copy one script tag, paste it into your website. Your AI support is live before your next meeting.",
  },
  {
    icon: Users,
    title: "Your team stays in control",
    body: "Agents can see every conversation and take over from the AI at any time. AI handles the volume, your team handles the complexity. You decide who handles what.",
  },
  {
    icon: ShieldCheck,
    title: "Your data never mixes with another business",
    body: "KnowBridge uses multi-tenant architecture. Your knowledge base, conversations, and customer data are locked to your account. Isolated at the database level.",
  },
  {
    icon: Code2,
    title: "One script tag is all it takes",
    body: "No developer team required. No week-long integration. One snippet in your website body and your AI chatbot is live — with your branding and your knowledge.",
  },
];

export function WhyKnowBridge() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
        <Badge className="mb-2">Why KnowBridge</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-1.5">
          Six reasons businesses choose KnowBridge.
        </h2>
        <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          Built to turn quiet visitors into engaged, paying customers.
        </p>
      </div>

      {/* 6 Reasons Grid: 3 columns on desktop, 2 on tablet, 1 on mobile */}
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 max-w-6xl mx-auto"
      >
        {reasonsList.map((reason, idx) => {
          const Icon = reason.icon;
          return (
            <motion.div
              key={reason.title}
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
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : idx * 0.05,
                ease: "easeOut",
              }}
              className="p-4 sm:p-5 rounded-card bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-start gap-3 shadow-xs"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-zinc-200/70 transition-colors duration-200">
                <Icon className="w-4.5 h-4.5 text-zinc-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 font-bold text-sm sm:text-base mb-1">
                  {reason.title}
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  {reason.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
