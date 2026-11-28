"use client";

import { AdminHero } from "@/components/sections/admin/AdminHero";
import { FeatureBlock } from "@/components/sections/admin/FeatureBlock";
import { AdminVideoSection } from "@/components/sections/admin/AdminVideoSection";
import { AdminCapabilityGrid } from "@/components/sections/admin/AdminCapabilityGrid";
import { ADMIN_PANEL_FEATURES } from "@/lib/constants";

export function AdminFeatures() {
  return (
    <div className="w-full">
      {/* 1. Hero / Header */}
      <AdminHero />

      {/* 2. Feature Blocks with Video/Image Slots for each paragraph */}
      <div className="max-w-6xl mx-auto px-6">
        {ADMIN_PANEL_FEATURES.map((feature, index) => (
          <FeatureBlock
            key={feature.id}
            {...feature}
            index={index}
          />
        ))}
      </div>

      {/* 3. Walkthrough Video Section */}
      <AdminVideoSection />

      {/* 4. Dashboard Capabilities 9-Cell Grid */}
      <AdminCapabilityGrid />
    </div>
  );
}
