"use client";

import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: React.ReactNode;
  as?: "section" | "div";
}

export function SectionWrapper({
  id,
  className,
  children,
  as: Tag = "section",
}: SectionWrapperProps) {
  return (
    <Tag id={id} className={cn("py-10 md:py-16 lg:py-20 scroll-mt-20 w-full", className)}>
      <div className={cn("max-w-6xl mx-auto px-4 sm:px-6", className?.includes("full-width") ? "max-w-none" : "")}>
        {children}
      </div>
    </Tag>
  );
}
