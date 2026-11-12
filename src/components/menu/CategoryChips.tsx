"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

export type Chip = { id: string; label: string };

/** Anchor chips (work without JS). With JS: highlights the section in view and keeps that chip visible. */
export function CategoryChips({ chips, label }: { chips: Chip[]; label: string }) {
  const [active, setActive] = useState<string | null>(null);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = chips.map((c) => document.getElementById(c.id)).filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    // The band between the sticky stack and the upper part of the viewport counts as "in view".
    const offset = nav.current ? parseFloat(getComputedStyle(nav.current).top) + nav.current.offsetHeight : 112;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const first = sections.find((s) => visible.has(s.id));
        if (first) setActive(first.id);
      },
      { rootMargin: `-${offset + 8}px 0px -55% 0px` },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [chips]);

  useEffect(() => {
    const el = nav.current?.querySelector<HTMLElement>('[aria-current="true"]');
    const box = nav.current;
    if (!el || !box) return;
    box.scrollLeft = el.offsetLeft - (box.clientWidth - el.offsetWidth) / 2;
  }, [active]);

  return (
    <nav
      ref={nav}
      aria-label={label}
      data-testid="menu-chips"
      className="sticky top-[var(--menu-header-h)] z-30 overflow-x-auto border-b border-sand-100 bg-cream-50"
    >
      <ul className="mx-auto flex w-max min-w-full max-w-none gap-2 px-4 py-2 md:px-8">
        {chips.map((c) => (
          <li key={c.id}>
            <a
              href={`#${c.id}`}
              aria-current={active === c.id ? "true" : undefined}
              onClick={() => track("view_menu_category", { category: c.id })}
              className="flex min-h-11 items-center rounded-full border-[1.5px] border-green-900 px-3.5 text-[0.8125rem] font-medium whitespace-nowrap text-green-900 aria-[current=true]:bg-green-900 aria-[current=true]:text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900"
            >
              {c.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
