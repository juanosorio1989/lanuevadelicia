"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Sticky header wrapper. Sets data-scrolled after 24px of scroll; children style themselves with group-data-[scrolled]. */
export function HeaderShell({ children }: { children: ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className="group sticky top-0 z-40 bg-green-900 py-2 text-cream-50 transition-[padding] duration-200 data-[scrolled]:py-0.5"
    >
      {children}
    </header>
  );
}
