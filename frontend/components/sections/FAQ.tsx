"use client";

import { motion, useReducedMotion } from "framer-motion";
import * as Accordion from "@radix-ui/react-accordion";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { FAQ_ITEMS } from "@/lib/constants";
import { ChevronDown } from "lucide-react";

export function FAQ() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 md:mb-8">
        <Badge className="mb-2.5">FAQ</Badge>
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
          Frequently asked questions.
        </h2>
      </div>

      {/* Accordion Container */}
      <motion.div
        initial={{
          opacity: 0,
          y: prefersReducedMotion ? 0 : 16,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="max-w-[720px] mx-auto divide-y divide-zinc-200 rounded-card bg-white border border-zinc-200 p-5 sm:p-7 shadow-xs"
      >
        <Accordion.Root type="single" collapsible className="w-full">
          {FAQ_ITEMS.map((item, idx) => (
            <Accordion.Item
              key={item.question}
              value={`item-${idx}`}
              className="py-3.5 first:pt-0 last:pb-0 border-b border-zinc-200 last:border-b-0"
            >
              <Accordion.Header className="flex">
                <Accordion.Trigger className="flex flex-1 items-center justify-between text-left font-semibold text-zinc-900 text-sm sm:text-base transition-colors hover:text-black group cursor-pointer py-1">
                  <span className="pr-4">{item.question}</span>
                  <ChevronDown
                    className="w-4.5 h-4.5 text-zinc-400 shrink-0 transition-transform duration-300 ease-out group-data-[state=open]:rotate-180 group-data-[state=open]:text-zinc-900"
                    aria-hidden
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <div className="pt-2 pb-1 text-xs sm:text-sm text-zinc-600 leading-relaxed">
                  {item.answer}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </motion.div>
    </SectionWrapper>
  );
}
