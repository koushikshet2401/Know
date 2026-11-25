"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Clock, AlertCircle, TrendingDown, Check } from "lucide-react";

const problemCards = [
  {
    icon: Clock,
    title: "Slow replies kill buying intent",
    desc: "By the time you reply on WhatsApp or email, the visitor has already found a competitor.",
  },
  {
    icon: AlertCircle,
    title: "Long forms lose qualified leads",
    desc: "Most visitors will not fill a contact form just to ask a simple question. They bounce silently.",
  },
  {
    icon: TrendingDown,
    title: "You cannot support customers at 3am",
    desc: "Your team is offline. Your leads are not. Without automation, you miss the conversation entirely.",
  },
];

const solutionChecklist = [
  "Trained on your documents and website pages",
  "Embeds on any website with one script tag",
  "Qualifies leads before they bounce",
  "Transfers to human agents when needed",
  "Each business's data is fully isolated",
];

export function AboutProblem() {
  const prefersReducedMotion = useReducedMotion();
  const block1Ref = useRef<HTMLDivElement>(null);
  const block1InView = useInView(block1Ref, { once: true, margin: "-60px" });

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      <div
        ref={block1Ref}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-6"
      >
        {/* Left Column — Problem Copy */}
        <motion.div
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -24 }}
          animate={
            block1InView
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: prefersReducedMotion ? 0 : -24 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-start"
        >
          <div className="flex items-start gap-4 mb-3">
            <span className="text-zinc-200 font-black text-5xl md:text-7xl select-none leading-none tracking-tighter shrink-0">
              01
            </span>
            <div className="pt-1">
              <Badge className="mb-2 text-red-600 bg-red-50 border-red-200">
                Why KnowBridge Exists
              </Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                Most websites are silent when customers have questions.
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-zinc-600 text-sm md:text-base leading-relaxed pt-1">
            <p>
              A potential customer lands on your website. They want to know if
              your product is right for them. There is no one to ask. The FAQ
              page is buried three clicks deep. They leave. That lead is gone —
              and you never even knew they were there.
            </p>
            <p>
              If you have a WhatsApp link, they message you and wait hours for a
              reply. If you have a contact form, it feels like effort. Most
              people do not fill it. The ones who do are frustrated before they
              even hear from you.
            </p>
            <p className="text-zinc-900 font-semibold border-l-2 border-zinc-900 pl-3">
              Your best leads are the ones who showed intent but hit silence.
              Every unanswered question is a lost opportunity. KnowBridge fills
              that silence — instantly, accurately, and around the clock.
            </p>
          </div>
        </motion.div>

        {/* Right Column — 3 Problem Cards */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          {problemCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
                animate={
                  block1InView
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: prefersReducedMotion ? 0 : 24 }
                }
                transition={{
                  duration: 0.45,
                  delay: prefersReducedMotion ? 0 : 0.1 + idx * 0.1,
                  ease: "easeOut",
                }}
                className="p-4 sm:p-4.5 rounded-card bg-white border border-zinc-200 hover:border-zinc-300 transition-all duration-200 group shadow-xs"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-semibold text-zinc-900">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Shift Statement */}
      <div className="w-full bg-zinc-100/80 rounded-2xl border border-zinc-200/80 p-5 md:p-6 text-center">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-zinc-900 tracking-tight leading-snug">
          &ldquo;What if your website could answer every question, qualify every lead, and never miss a conversation — without adding a single person to your team?&rdquo;
        </h3>
      </div>
    </SectionWrapper>
  );
}

export function AboutSolution() {
  const prefersReducedMotion = useReducedMotion();
  const block3Ref = useRef<HTMLDivElement>(null);
  const block3InView = useInView(block3Ref, { once: true, margin: "-60px" });

  return (
    <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
      <div
        ref={block3Ref}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
      >
        {/* Left Column — Checklist */}
        <div className="lg:col-span-5 order-2 lg:order-1 flex flex-col gap-2.5">
          {solutionChecklist.map((item, idx) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, x: prefersReducedMotion ? 0 : -20 }}
              animate={
                block3InView
                  ? { opacity: 1, x: 0 }
                  : { opacity: 0, x: prefersReducedMotion ? 0 : -20 }
              }
              transition={{
                duration: 0.45,
                delay: prefersReducedMotion ? 0 : 0.08 + idx * 0.08,
                ease: "easeOut",
              }}
              className="flex items-center gap-3 p-3 sm:p-3.5 rounded-btn bg-white border border-zinc-200 hover:border-zinc-300 transition-colors shadow-xs"
            >
              <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" strokeWidth={3} />
              </div>
              <span className="text-xs sm:text-sm font-medium text-zinc-900">
                {item}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right Column — Solution Copy */}
        <motion.div
          initial={{ opacity: 0, x: prefersReducedMotion ? 0 : 24 }}
          animate={
            block3InView
              ? { opacity: 1, x: 0 }
              : { opacity: 0, x: prefersReducedMotion ? 0 : 24 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="lg:col-span-7 order-1 lg:order-2 flex flex-col items-start"
        >
          <div className="flex items-start justify-between w-full gap-4 mb-3">
            <div className="pt-1">
              <Badge className="mb-2">The Solution</Badge>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-zinc-900 tracking-tight leading-tight">
                An AI that knows your product as well as you do.
              </h2>
            </div>
            <span className="text-zinc-200 font-black text-5xl md:text-7xl select-none leading-none tracking-tighter shrink-0 text-right">
              02
            </span>
          </div>

          <div className="space-y-3 text-zinc-600 text-sm md:text-base leading-relaxed pt-1">
            <p>
              You give KnowBridge your documents — product guides, FAQs, pricing
              pages, return policies. You can also paste your website URL and
              the bot reads your pages automatically. It builds a knowledge
              base specific to your business and answers from it.
            </p>
            <p>
              When a customer asks a question, the bot answers from your
              content. Not from the internet. Not from a generic template. Your
              words, your knowledge, delivered instantly.
            </p>
            <p className="text-zinc-900 font-semibold border-l-2 border-zinc-900 pl-3">
              When a question is too complex, the bot transfers the
              conversation to one of your human agents automatically — with
              the full chat history already visible. No forms. No waiting. No
              repeating.
            </p>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}

export function About() {
  return (
    <div className="w-full relative">
      <AboutProblem />
      <AboutSolution />
    </div>
  );
}
