import type { Metadata } from "next";
import { DemoForm } from "@/components/forms/DemoForm";
import { Badge } from "@/components/ui/Badge";
import { Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Book a Demo",
  description:
    "See KnowBridge live. Book a 20-minute demo and get your AI support bot live on your website.",
};

const EXPECTATIONS = [
  "Live product walkthrough",
  "Setup on your actual website",
  "Answers to your specific questions",
  "No sales pressure",
];

export default function BookADemoPage() {
  return (
    <div className="py-12 md:py-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
          {/* Left Column (Sticky on scroll) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
            <Badge>Personalized Walkthrough</Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 tracking-tight leading-tight">
              See KnowBridge in action.
            </h1>

            <p className="text-zinc-600 text-base md:text-lg leading-relaxed">
              Book a 20-minute demo. We will show you live how to set up your AI
              support bot and go live on your website.
            </p>

            <div className="pt-2 border-t border-zinc-200 space-y-4">
              <h2 className="text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                What to expect
              </h2>
              <ul className="space-y-3">
                {EXPECTATIONS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-zinc-700">
                    <div className="w-5 h-5 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-zinc-900" strokeWidth={3} />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-btn bg-zinc-50 border border-zinc-200">
              <p className="text-xs text-zinc-600 font-medium">
                ⚡ <span className="text-zinc-900 font-semibold">Tagline:</span> Most demos take less than 20 minutes.
              </p>
            </div>
          </div>

          {/* Right Column (Form) */}
          <div className="lg:col-span-7">
            <DemoForm />
          </div>
        </div>
      </div>
    </div>
  );
}
