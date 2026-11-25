"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { CheckCircle2, ArrowRight } from "lucide-react";

const pricingTiers = [
  {
    name: "Starter",
    price: "$29/mo (placeholder)",
    bestFor: "Small websites and solo founders",
    features: [
      "1 website",
      "500 conversations per month",
      "PDF document uploads",
      "Basic widget with theme selection",
      "Email support",
    ],
    cta: "Get Started",
    highlighted: false,
    href: "#contact",
  },
  {
    name: "Professional",
    price: "$79/mo (placeholder)",
    bestFor: "Growing SaaS companies and small teams",
    features: [
      "3 websites",
      "2,000 conversations per month",
      "PDF uploads + web crawling",
      "Human agent handoff",
      "Admin dashboard with agent management",
      "Priority email support",
    ],
    cta: "Get Started",
    highlighted: true,
    href: "#contact",
  },
  {
    name: "Business",
    price: "$199/mo (placeholder)",
    bestFor: "Agencies and multi-product businesses",
    features: [
      "10 websites",
      "10,000 conversations per month",
      "All Professional features",
      "Multiple agent accounts",
      "Dedicated onboarding support",
    ],
    cta: "Get Started",
    highlighted: false,
    href: "#contact",
  },
  {
    name: "Enterprise",
    price: "Custom pricing",
    bestFor: "Large teams with specific requirements",
    features: [
      "Unlimited websites",
      "Unlimited conversations",
      "Custom integration support",
      "Dedicated account manager",
      "SLA discussion available",
    ],
    cta: "Contact Us",
    highlighted: false,
    href: "#contact",
  },
];

export function Pricing() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
        <Badge className="mb-2">Pricing</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight mb-1.5">
          Plans that grow with your business.
        </h2>
        <p className="text-zinc-600 text-xs sm:text-sm md:text-base leading-relaxed">
          All prices are indicative. Contact us for exact commercial terms.
        </p>
      </div>

      {/* Pricing Grid */}
      <div
        ref={ref}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 max-w-7xl mx-auto items-stretch mb-5"
      >
        {pricingTiers.map((tier, idx) => {
          const isHighlighted = tier.highlighted;

          return (
            <motion.div
              key={tier.name}
              initial={{
                opacity: 0,
                y: prefersReducedMotion ? 0 : 20,
              }}
              animate={
                isInView
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: prefersReducedMotion ? 0 : 20 }
              }
              transition={{
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : idx * 0.08,
                ease: "easeOut",
              }}
              className={`relative flex flex-col p-4.5 sm:p-5 rounded-card transition-all duration-200 ${
                isHighlighted
                  ? "bg-white border-2 border-zinc-900 shadow-xl shadow-zinc-900/10 lg:scale-[1.02] z-10"
                  : "bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-md shadow-xs"
              }`}
            >
              {/* Highlight Badge */}
              {isHighlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-zinc-900 text-white shadow-xs">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tier Name & Price */}
              <div className="mb-3">
                <h3 className="text-lg font-bold text-zinc-900 mb-0.5">
                  {tier.name}
                </h3>
                <div className="flex items-baseline gap-1 my-1.5">
                  <span className="text-xl sm:text-2xl font-black text-zinc-900 tracking-tight">
                    {tier.price}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-medium">
                  Best for: {tier.bestFor}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-zinc-100 my-2.5" />

              {/* Feature List */}
              <ul className="space-y-2 mb-5 flex-1">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-xs text-zinc-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-zinc-900 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Action */}
              <div className="pt-2">
                <Link href={tier.href} className="w-full block">
                  <Button
                    variant={isHighlighted ? "primary" : "secondary"}
                    size="sm"
                    className="w-full text-xs font-semibold justify-center group py-2"
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Disclaimer below cards */}
      <p className="text-center text-xs text-zinc-500 max-w-xl mx-auto">
        Conversation limits, storage, and feature availability are subject to change. Prices shown are illustrative and not final commercial terms.
      </p>
    </SectionWrapper>
  );
}
