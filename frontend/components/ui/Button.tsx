"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-zinc-900 text-white font-semibold hover:bg-black shadow-sm active:bg-zinc-800",
  secondary:
    "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50 hover:border-zinc-300 shadow-xs",
  ghost: "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm rounded-btn",
  md: "px-6 py-3 text-sm font-semibold rounded-btn",
  lg: "px-8 py-4 text-base font-semibold rounded-btn",
};

const MotionButton = motion.button;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      disabled,
      asChild,
      href,
      ...props
    },
    ref
  ) => {
    return (
      <MotionButton
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn(
          "inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 select-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled}
        {...(props as React.ComponentPropsWithoutRef<typeof MotionButton>)}
      >
        {children}
      </MotionButton>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps };
