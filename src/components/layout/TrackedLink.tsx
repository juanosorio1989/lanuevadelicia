"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { track, type AnalyticsEvent } from "@/lib/analytics";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "onClick"> & {
  href: string;
  event: AnalyticsEvent;
  params: Record<string, string>;
  external?: boolean;
  /** When set, renders with Button styling. */
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
};

/** An <a> that sends a GA4 event on click. Works as a plain link without JS. */
export function TrackedLink({ href, event, params, external, variant, className = "", children, ...rest }: Props) {
  const onClick = () => track(event, params);
  if (variant) {
    return (
      <Button href={href} variant={variant} external={external} className={className} onClick={onClick} {...rest}>
        {children}
      </Button>
    );
  }
  return (
    <a
      href={href}
      className={className}
      onClick={onClick}
      {...(external ? { target: "_blank", rel: "noopener" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
