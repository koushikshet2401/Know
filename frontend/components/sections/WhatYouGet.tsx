"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import {
  TrendingUp,
  Zap,
  UserCheck,
  LayoutDashboard,
  Code2,
  ShieldCheck,
  Check,
} from "lucide-react";

const stats = [
  { value: "24/7", label: "Always-on support" },
  { value: "< 10 min", label: "Time to integrate" },
  { value: "1 script tag", label: "All you need to add" },
];

const benefitBlocks = [
  {
    icon: TrendingUp,
    headline: "Never miss a lead again",
    subheadline: "Your chatbot qualifies visitors 24/7 — even at 3am.",
    body: "Most websites lose leads silently. A visitor lands, has a question, finds no one to ask, and leaves. KnowBridge changes that. The moment someone opens the chat, they get an instant response — no forms, no waiting, no bouncing.",
    points: [
      "Chatbot engages visitors the moment they open the widget",
      "Collects name, email, and use case before escalating",
      "Works 24 hours a day, 7 days a week — no human required",
      "You wake up to qualified leads, not missed visitors",
    ],
  },
  {
    icon: Zap,
    headline: "Customers get instant answers from your own content",
    subheadline: "No generic responses. No hallucinations. Just your knowledge.",
    body: "The bot answers only from documents and pages you provide — your product guides, FAQs, pricing, return policies. If you did not write it, the bot does not say it. This means accurate, on-brand answers every single time.",
    points: [
      "Upload your PDFs and docs to train the bot",
      "Give the bot your website URL for automatic web crawling",
      "Answers reference your actual content, not the internet",
      "Update knowledge anytime — changes go live immediately",
    ],
  },
  {
    icon: UserCheck,
    headline: "Complex questions go straight to your team",
    subheadline: "AI handles the volume. Your team handles what matters.",
    body: "When the bot cannot confidently answer, it does not guess. It transfers the conversation to one of your human agents — with the full chat history already visible. Your customer never has to repeat themselves.",
    points: [
      "Bot detects when a question is outside its knowledge",
      "Transfers to a human agent automatically",
      "Agent sees the full chat history before they type a word",
      "Customer experience stays smooth — no drop-off, no frustration",
    ],
  },
  {
    icon: LayoutDashboard,
    headline: "Full control from a centralised dashboard",
    subheadline: "Manage conversations, knowledge, and your bot — all in one place.",
    body: "You get a complete admin panel the moment you integrate KnowBridge. Upload documents, configure the widget, watch live conversations, and manage your team — from one login.",
    points: [
      "Live conversation feed — see every chat as it happens",
      "Upload and manage documents from the dashboard",
      "Configure bot name, greeting, theme, and behaviour",
      "Add team members and manage agent access",
      "Generate your embed code from the same screen",
    ],
  },
  {
    icon: Code2,
    headline: "Integrated in under 10 minutes",
    subheadline: "One script tag. Any website. Done.",
    body: "You do not need a developer team or a week of setup. KnowBridge generates a single script tag from your dashboard. Paste it into your website body. Your AI chatbot goes live immediately — with your branding and your knowledge.",
    points: [
      "Works on React, Next.js, HTML, WordPress, Webflow, Shopify",
      "No iframes, no plugins, no complex configuration",
      "Your Tenant ID is the only thing you need in the snippet",
      "Bot inherits your configured theme and knowledge automatically",
    ],
  },
  {
    icon: ShieldCheck,
    headline: "Your data stays yours — always",
    subheadline: "Multi-tenant isolation means no business can ever see another's data.",
    body: "KnowBridge uses enterprise-grade multi-tenant architecture. Your knowledge base, conversations, and customer data are locked to your account. No other business on the platform can access it. Ever.",
    points: [
      "Every business gets a unique isolated tenant",
      "Vector search is scoped to your documents only",
      "Origin validation ensures only your registered domain can use your bot",
      "No cross-tenant data leakage — by architecture, not just by policy",
    ],
  },
];

export function WhatYouGet() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
        <Badge className="mb-2">What You Get</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-2">
          Everything that changes the moment you add KnowBridge to your website.
        </h2>
      </div>

      {/* 3 Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-4 rounded-xl bg-white border border-zinc-200/80 text-center shadow-xs"
          >
            <div className="text-2xl sm:text-3xl font-black text-zinc-900 tracking-tight mb-1">
              {stat.value}
            </div>
            <div className="text-xs sm:text-sm font-medium text-zinc-600">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* 6 Benefit Blocks Grid: 2 columns on desktop, 1 on mobile */}
      <div
        ref={ref}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 max-w-6xl mx-auto"
      >
        {benefitBlocks.map((block, idx) => {
          const Icon = block.icon;
          return (
            <motion.div
              key={block.headline}
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
              className="p-5 sm:p-6 rounded-card bg-white border border-zinc-200 hover:border-zinc-300 transition-all duration-200 group flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 group-hover:bg-zinc-200/70 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-zinc-900" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-zinc-900 leading-snug">
                      {block.headline}
                    </h3>
                    <p className="text-xs font-medium text-zinc-500 mt-0.5">
                      {block.subheadline}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4">
                  {block.body}
                </p>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-zinc-100">
                {block.points.map((pt) => (
                  <div
                    key={pt}
                    className="flex items-start gap-2 text-xs text-zinc-700"
                  >
                    <Check className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </SectionWrapper>
  );
}
