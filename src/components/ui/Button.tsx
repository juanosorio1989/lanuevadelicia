import type { AnchorHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "on-dark";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-2 text-base font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-terra-700 text-white hover:bg-green-900 focus-visible:outline-green-900",
  outline: "border-2 border-green-900 text-green-900 hover:bg-green-900 hover:text-cream-50 focus-visible:outline-green-900",
  "on-dark": "border-2 border-cream-50 text-cream-50 hover:bg-cream-50 hover:text-green-900 focus-visible:outline-cream-50",
};

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className"> & {
  variant?: ButtonVariant;
  href: string;
  external?: boolean;
  className?: string;
  children: ReactNode;
};

// Button is server-safe: onClick (e.g. track()) requires rendering it from a client component (Task 7 adds TrackedLink).
export function Button({ variant = "primary", href, external, className = "", children, ...rest }: Props) {
  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`.trim()}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
