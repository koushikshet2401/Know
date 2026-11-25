"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  MessageSquare,
  BookOpen,
  Globe,
  UserCheck,
  ShieldCheck,
  Zap,
  LayoutDashboard,
  Filter,
} from "lucide-react";

const featuresList = [
  {
    icon: MessageSquare,
    title: "AI Chat Widget",
    body: "Embeds on any website with a single script tag. No iframes, no plugins, no complex setup. Works on React, Next.js, WordPress, Webflow, Shopify, and plain HTML.",
  },
  {
    icon: BookOpen,
    title: "Document Knowledge Base",
    body: "Upload your PDFs and documents directly from the dashboard. The AI answers only from your uploaded content — never from the open internet.",
  },
  {
    icon: Globe,
    title: "Web Crawling",
    body: "Give the bot your website URL. It reads your pages, learns your product, and starts answering questions from your live web content automatically.",
  },
  {
    icon: UserCheck,
    title: "Human Agent Handoff",
    body: "When the bot cannot confidently answer, it transfers the conversation to a human agent automatically. Your agent sees the full history before typing a single word.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-Tenant Isolation",
    body: "Every business gets a completely isolated knowledge base and conversation history. No data from one business can ever be accessed by another — by architecture, not just by policy.",
  },
  {
    icon: Zap,
    title: "Instant AI Responses",
    body: "Vector similarity search over your documents returns accurate, context-aware answers in under a second. Powered by OpenAI embeddings and pgvector.",
  },
  {
    icon: LayoutDashboard,
    title: "Centralised Admin Dashboard",
    body: "Manage live conversations, upload documents, configure your bot, generate your embed code, and add team members — all from one login, one screen.",
  },
  {
    icon: Filter,
    title: "Lead Qualification",
    body: "The bot collects context from visitors before escalating to your team. Your agents receive warm, qualified leads — not cold enquiries from strangers.",
  },
];

export function Features() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
        <Badge className="mb-2">Features</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-1.5">
          Everything your support team needs. Nothing it doesn&apos;t.
        </h2>
        <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          Built for the actual workflow of a SaaS business or agency. AI-first,
          human-ready, secure by architecture.
        </p>
      </div>

      {/* Feature Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5 max-w-6xl mx-auto"
      >
        {featuresList.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 14,
              }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: prefersReducedMotion ? 0 : 14 }
              }
              transition={{
                duration: 0.4,
                delay: prefersReducedMotion ? 0 : idx * 0.04,
                ease: "easeOut",
              }}
              className="p-3.5 sm:p-4 rounded-card bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md transition-all duration-200 group flex flex-col justify-start gap-2.5 shadow-xs"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-zinc-200/70 transition-colors duration-200">
                <Icon className="w-4 h-4 text-zinc-900" />
              </div>
              <div className="flex-1">
                <h3 className="text-zinc-900 font-bold text-sm mb-0.5">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 text-xs leading-relaxed">
                  {feature.body}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
