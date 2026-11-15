"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import { track } from "@/lib/analytics";

export type Chip = { id: string; label: string };

/** Anchor chips (work without JS). With JS: highlights the section in view and keeps that chip visible. */
export function CategoryChips({
  chips,
  label,
  swipeHint,
  searchLabel,
}: {
  chips: Chip[];
  label: string;
  swipeHint: string;
  searchLabel: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  // Below lg the chips overflow: a hint line and a right-edge fade say "swipe". No JS: both stay visible.
  const [scrolled, setScrolled] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const box = nav.current;
    if (!box) return;
    const update = () => {
      if (box.scrollLeft > 8) setScrolled(true);
      setAtEnd(box.scrollLeft + box.clientWidth >= box.scrollWidth - 8);
    };
    update();
    box.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      box.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const sections = chips
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    // The band between the sticky stack and the upper part of the viewport counts as "in view".
    const offset = bar.current
      ? parseFloat(getComputedStyle(bar.current).top) + bar.current.offsetHeight
      : 112;
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

  const showHint = !scrolled && !atEnd;

  return (
    <>
      <div
        ref={bar}
        className="sticky top-[var(--menu-header-h)] z-30 border-b border-sand-100 bg-cream-50"
      >
        {/* MOCKUP: search box look only, no filtering yet. */}
        <div role="search" className="mx-auto max-w-6xl px-4 pt-2 md:px-8">
          <label className="flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-sand-100 bg-white px-4 text-charcoal-900 focus-within:border-green-900">
            <Search
              aria-hidden="true"
              size={18}
              className="shrink-0 text-green-900"
            />
            <span className="sr-only">{searchLabel}</span>
            <input
              type="search"
              placeholder={searchLabel}
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-600"
            />
          </label>
        </div>
        <p
          aria-hidden="true"
          data-testid="menu-swipe-hint"
          className={`mx-auto max-w-6xl px-4 pt-1.5 text-[0.8125rem] font-bold text-terra-700 md:px-8 lg:hidden ${showHint ? "" : "hidden"}`}
        >
          {swipeHint} →
        </p>
        <div className="relative">
          <nav
            ref={nav}
            aria-label={label}
            data-testid="menu-chips"
            className="overflow-x-auto"
          >
            <ul className="mx-auto flex w-max min-w-full max-w-none gap-2 px-4 py-2 md:px-8">
              {chips.map((c) => (
                <li key={c.id}>
                  <a
                    href={`#${c.id}`}
                    aria-current={active === c.id ? "true" : undefined}
                    onClick={() =>
                      track("view_menu_category", { category: c.id })
                    }
                    className="flex min-h-11 items-center rounded-full border-[1.5px] border-green-900 px-3.5 text-[0.8125rem] font-medium whitespace-nowrap text-green-900 aria-[current=true]:bg-green-900 aria-[current=true]:text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900"
                  >
                    {c.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-y-0 right-0 flex w-14 items-center justify-end bg-gradient-to-l from-cream-50 via-cream-50/90 to-transparent pr-1 text-green-900 transition-opacity lg:hidden ${atEnd ? "opacity-0" : ""}`}
          >
            <ChevronRight size={22} />
          </div>
        </div>
      </div>
    </>
  );
}
