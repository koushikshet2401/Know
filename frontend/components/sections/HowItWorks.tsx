"use client";

import { useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { SectionWrapper } from "@/components/ui/SectionWrapper";
import { Copy, Check } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Add your knowledge",
    body: "Upload your product docs, FAQs, pricing pages, and return policies. Or paste your website URL — the bot reads your pages and learns your content automatically.",
  },
  {
    number: "02",
    title: "Configure your bot",
    body: "Set your bot name, greeting message, widget colour, and escalation behaviour from the admin dashboard. No code required.",
  },
  {
    number: "03",
    title: "Embed on your site",
    body: "Copy one script tag generated from your dashboard. Paste it into your website body. The widget goes live instantly on any website or platform.",
  },
  {
    number: "04",
    title: "Manage and grow",
    body: "Monitor live conversations, update your knowledge base, and have your team jump into any conversation whenever needed.",
  },
];

const embedSnippet = `<div id="knowbridge-chat-root"></div>
<script>
  window.CHAT_CONFIG = {
    tenantId: "your-tenant-id",
    theme: "blue"
  };
</script>
<script src="https://cdn.knowbridge.io/widget.js" async></script>`;

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const prefersReducedMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full relative">
      <SectionWrapper className="py-6 sm:py-8 md:py-10 lg:py-12">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-8">
          <Badge className="mb-2">Setup</Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
            From documents to deployed in four steps.
          </h2>
        </div>

        {/* Timeline Layout */}
        <div ref={ref} className="relative mb-6 sm:mb-8">
          {/* Desktop Connecting Dashed Line */}
          <div className="hidden lg:block absolute top-5 left-12 right-12 h-0.5 border-t-2 border-dashed border-zinc-300 -z-0" />

          {/* Steps Container */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                initial={{
                  opacity: 0,
                  x: prefersReducedMotion ? 0 : -16,
                  y: prefersReducedMotion ? 0 : 8,
                }}
                animate={
                  isInView
                    ? { opacity: 1, x: 0, y: 0 }
                    : {
                        opacity: 0,
                        x: prefersReducedMotion ? 0 : -16,
                        y: prefersReducedMotion ? 0 : 8,
                      }
                }
                transition={{
                  duration: 0.45,
                  delay: prefersReducedMotion ? 0 : idx * 0.1,
                  ease: "easeOut",
                }}
                className="flex flex-col items-start relative pl-6 lg:pl-0 border-l-2 lg:border-l-0 border-dashed border-zinc-200 lg:border-transparent"
              >
                {/* Step Circle */}
                <div className="w-10 h-10 rounded-full border border-zinc-300 bg-white text-zinc-900 font-bold text-base flex items-center justify-center shrink-0 mb-3 shadow-xs -ml-[27px] lg:ml-0">
                  {step.number}
                </div>

                <h3 className="text-zinc-900 font-bold text-base mb-1">
                  {step.title}
                </h3>
                <p className="text-zinc-600 text-xs sm:text-sm leading-relaxed">
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Embed Code Snippet Card */}
        <motion.div
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
            duration: 0.5,
            delay: prefersReducedMotion ? 0 : 0.45,
            ease: "easeOut",
          }}
          className="max-w-xl mx-auto rounded-card bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg"
        >
          {/* Snippet Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-950 border-b border-zinc-800">
            <span className="text-xs font-medium text-zinc-400">
              The only code you need to add
            </span>
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-btn text-xs font-semibold text-zinc-300 bg-white/10 hover:bg-white/20 border border-white/10 hover:text-white transition-colors cursor-pointer select-none"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Snippet Code Block */}
          <pre className="p-4 font-mono text-xs text-zinc-200 overflow-x-auto leading-relaxed bg-zinc-950/80">
            <code>{embedSnippet}</code>
          </pre>
        </motion.div>
      </SectionWrapper>
    </div>
  );
}
