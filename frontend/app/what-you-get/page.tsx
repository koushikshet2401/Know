import type { Metadata } from "next";
import React from "react";
import { INTEGRATION_BENEFITS } from "@/lib/constants";
import { BenefitsHero } from "@/components/sections/benefits/BenefitsHero";
import { BenefitCard } from "@/components/sections/benefits/BenefitCard";
import { BenefitsDivider } from "@/components/sections/benefits/BenefitsDivider";
import { BenefitsFinalCTA } from "@/components/sections/benefits/BenefitsFinalCTA";

export const metadata: Metadata = {
  title: "What You Get",
  description:
    "See exactly what changes when you add KnowBridge to your website — lead capture, instant AI answers, human handoff, and a full admin dashboard.",
};

export default function WhatYouGetPage() {
  return (
    <div className="w-full">
      <BenefitsHero />
      <div className="space-y-0">
        {INTEGRATION_BENEFITS.map((benefit, index) => (
          <React.Fragment key={benefit.id}>
            <BenefitCard
              benefit={benefit}
              index={index}
              reversed={index % 2 !== 0}
            />
            {index < INTEGRATION_BENEFITS.length - 1 && <BenefitsDivider />}
          </React.Fragment>
        ))}
      </div>
      <BenefitsFinalCTA />
    </div>
  );
}
