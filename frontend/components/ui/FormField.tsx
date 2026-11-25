import React from "react";
import { cn } from "@/lib/utils";

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const inputBaseClasses =
  "w-full bg-white border border-zinc-200 rounded-btn px-4 py-2.5 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900/10 shadow-2xs transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed";

export const inputErrorClasses = "border-red-500 focus:border-red-500";

export function FormField({
  label,
  error,
  required,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 w-full text-left", className)}>
      <label className="text-xs font-semibold text-zinc-700 flex items-center gap-1">
        <span>{label}</span>
        {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative w-full">{children}</div>
      {error && (
        <span className="text-xs text-red-600 font-medium mt-0.5 animate-fadeIn">
          {error}
        </span>
      )}
    </div>
  );
}
