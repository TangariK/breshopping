"use client";

import { useId, useState } from "react";
import { maskMoneyDigits, parseBRLToNumber } from "@/shared/lib/money";
import { cn } from "@/shared/lib/cn";

type Props = {
  label: string;
  value: number;
  onChange: (n: number) => void;
  helperText?: string;
  id?: string;
  className?: string;
};

/**
 * Campo monetário com máscara BRL e valor numérico controlado.
 */
export function MoneyField({ label, value, onChange, helperText, id, className }: Props) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const [display, setDisplay] = useState(() =>
    value > 0 ? maskMoneyDigits(String(Math.round(value * 100))) : "",
  );

  return (
    <div className={cn("space-y-1", className)}>
      <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <input
        id={fieldId}
        inputMode="numeric"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          const masked = digits ? maskMoneyDigits(digits) : "";
          setDisplay(masked);
          onChange(parseBRLToNumber(masked));
        }}
      />
      {helperText ? <p className="text-xs text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
