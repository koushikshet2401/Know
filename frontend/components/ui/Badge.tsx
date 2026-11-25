import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
        "bg-zinc-100 text-zinc-800 border border-zinc-200/80 shadow-2xs",
        className
      )}
    >
      {children}
    </span>
  );
}
