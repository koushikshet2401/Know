import { Hero } from "@/components/sections/Hero";
import { AboutProblem, AboutSolution } from "@/components/sections/About";
import { Features } from "@/components/sections/Features";
import { WhyKnowBridge } from "@/components/sections/WhyKnowBridge";
import { WhatYouGet } from "@/components/sections/WhatYouGet";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { AdminFeatures } from "@/components/sections/AdminFeatures";
import { ContactSection } from "@/components/sections/ContactSection";
import { PinnedOverlayCard } from "@/components/ui/PinnedOverlayCard";

export default function HomePage() {
  return (
    <div className="relative w-full">
      {/* 1. Hero Card */}
      <PinnedOverlayCard
        id="hero"
        zIndex={10}
        bgClassName="bg-white"
        isFirst={true}
      >
        <Hero />
      </PinnedOverlayCard>

      {/* 2. The Problem We Solve */}
      <PinnedOverlayCard
        id="about"
        zIndex={12}
        bgClassName="bg-zinc-50"
      >
        <AboutProblem />
      </PinnedOverlayCard>

      {/* 3. The Solution */}
      <PinnedOverlayCard
        id="solution"
        zIndex={14}
        bgClassName="bg-white"
      >
        <AboutSolution />
      </PinnedOverlayCard>

      {/* 4. Features */}
      <PinnedOverlayCard
        id="features"
        zIndex={16}
        bgClassName="bg-zinc-50"
      >
        <Features />
      </PinnedOverlayCard>

      {/* 5. Why KnowBridge (Reasons) */}
      <PinnedOverlayCard
        id="why-knowbridge"
        zIndex={18}
        bgClassName="bg-white"
      >
        <WhyKnowBridge />
      </PinnedOverlayCard>

      {/* 6. What You Get (Things We Provide) */}
      <PinnedOverlayCard
        id="what-you-get"
        zIndex={20}
        bgClassName="bg-zinc-50"
      >
        <WhatYouGet />
      </PinnedOverlayCard>

      {/* 7. How It Works (Setup) */}
      <PinnedOverlayCard
        id="how-it-works"
        zIndex={22}
        bgClassName="bg-white"
      >
        <HowItWorks />
      </PinnedOverlayCard>

      {/* 8. Admin Features */}
      <PinnedOverlayCard
        id="admin-features"
        zIndex={24}
        bgClassName="bg-zinc-50"
      >
        <AdminFeatures />
      </PinnedOverlayCard>

      {/* 9. Contact & Demo Request Form */}
      <PinnedOverlayCard
        id="contact"
        zIndex={26}
        bgClassName="bg-white"
      >
        <ContactSection />
      </PinnedOverlayCard>
    </div>
  );
}
