"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Search } from "lucide-react";
import { CategoryChips, type Chip } from "./CategoryChips";

const noopSubscribe = () => () => {};

export type MenuToolbarLabels = { chips: string; swipeHint: string; search: string };

/**
 * The sticky block under the header: search box (JS only), swipe hint and category chips.
 * It measures its own height and publishes `--menu-sticky-offset` on its parent, so section anchors clear it
 * whatever its current height (hint shown or hidden, font size). Without JS the page's static fallback applies.
 */
export function MenuToolbar({ chips, labels }: { chips: Chip[]; labels: MenuToolbarLabels }) {
  const root = useRef<HTMLDivElement>(null);
  // The search box has no meaning without JS, so it renders only after hydration.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const publish = () => {
    const el = root.current;
    el?.parentElement?.style.setProperty(
      "--menu-sticky-offset",
      `calc(var(--menu-header-h) + ${el.offsetHeight}px + 0.25rem)`,
    );
  };

  useEffect(() => {
    const el = root.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      parent.style.removeProperty("--menu-sticky-offset");
    };
  }, []);

  // The browser scrolled to a #hash on load, before the search box added its height; scroll again with the new offset.
  useEffect(() => {
    if (!mounted || !location.hash) return;
    publish();
    document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
  }, [mounted]);

  return (
    <div
      ref={root}
      data-testid="menu-toolbar"
      className="sticky top-[var(--menu-header-h)] z-30 border-b border-sand-100 bg-cream-50"
    >
      {mounted && (
        <div role="search" className="mx-auto max-w-6xl px-4 pt-2 md:px-8">
          <label className="flex min-h-11 items-center gap-2 rounded-full border-[1.5px] border-sand-100 bg-white px-4 text-charcoal-900 focus-within:border-green-900">
            <Search aria-hidden="true" size={18} className="shrink-0 text-green-900" />
            <span className="sr-only">{labels.search}</span>
            <input
              type="search"
              placeholder={labels.search}
              className="w-full bg-transparent text-base outline-none placeholder:text-muted-600"
            />
          </label>
        </div>
      )}
      <CategoryChips chips={chips} label={labels.chips} swipeHint={labels.swipeHint} />
    </div>
  );
}
