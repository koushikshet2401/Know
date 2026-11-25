import type { Metadata } from "next";
import { AdminHero } from "@/components/sections/admin/AdminHero";
import { FeatureBlock } from "@/components/sections/admin/FeatureBlock";
import { AdminVideoSection } from "@/components/sections/admin/AdminVideoSection";
import { AdminCapabilityGrid } from "@/components/sections/admin/AdminCapabilityGrid";
import { AdminFinalCTA } from "@/components/sections/admin/AdminFinalCTA";
import { ADMIN_PANEL_FEATURES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Admin Panel",
  description:
    "See everything inside the KnowBridge admin dashboard — live conversations, knowledge base management, widget configuration, and agent tools.",
};

export default function AdminPanelPage() {
  return (
    <div className="w-full">
      <AdminHero />

      <div className="max-w-6xl mx-auto px-6">
        {ADMIN_PANEL_FEATURES.map((feature, index) => (
          <FeatureBlock
            key={feature.id}
            {...feature}
            index={index}
          />
        ))}
      </div>

      <AdminVideoSection />
      <AdminCapabilityGrid />
      <AdminFinalCTA />
    </div>
  );
}
