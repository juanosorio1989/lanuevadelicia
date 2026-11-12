import type { ReactNode } from "react";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-xs font-bold uppercase tracking-[0.12em] text-terra-700 ${className}`.trim()}>
      {children}
    </p>
  );
}
