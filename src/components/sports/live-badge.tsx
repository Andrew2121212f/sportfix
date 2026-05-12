"use client";

import { cn } from "@/lib/utils";

export default function LiveBadge({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-accent-green/10 text-accent-green text-xs font-bold uppercase tracking-wider", className)}>
      <span className="h-1.5 w-1.5 rounded-full bg-accent-green animate-pulse-live" />
      Live
    </span>
  );
}
