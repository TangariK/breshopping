import type { HTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type Props = HTMLAttributes<HTMLSpanElement> & {
  tone?: "success" | "warning" | "neutral" | "muted";
};

/**
 * Badge de status (ex.: disponível / reservado).
 */
export function Badge({ className, tone = "neutral", ...props }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        tone === "success" && "bg-emerald-100 text-emerald-900",
        tone === "warning" && "bg-amber-100 text-amber-900",
        tone === "neutral" && "bg-blue-100 text-blue-900",
        tone === "muted" && "bg-muted text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
