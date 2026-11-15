"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Search, X } from "lucide-react";
import { TrackedLink } from "@/components/layout/TrackedLink";
import { track } from "@/lib/analytics";
import { isTrackableSearchTerm, matchesSearch } from "@/lib/search";
import { CategoryChips, type Chip } from "./CategoryChips";

const noopSubscribe = () => () => {};

export type MenuToolbarLabels = {
  chips: string;
  swipeHint: string;
  search: string;
  clear: string;
  noResults: string;
  noResultsCall: string;
  resultsOne: string;
  /** Contains `{count}`. */
  resultsOther: string;
};

/** Search pause before the `search` event is sent, and the shortest term worth sending. */
const SEARCH_EVENT_DELAY_MS = 1000;
const SEARCH_EVENT_MIN_LENGTH = 2;

/**
 * Hides the items that do not match the query, then the lists, subcategory groups and sections left empty.
 * Returns the ids of the sections still visible and the number of visible items. An empty query shows everything.
 */
function applyFilter(query: string): { visibleSections: Set<string>; count: number } {
  const list = document.querySelector("[data-menu-list]");
  const visibleSections = new Set<string>();
  if (!list) return { visibleSections, count: 0 };
  const active = query.trim() !== "";
  let count = 0;
  for (const li of list.querySelectorAll<HTMLElement>("li[data-item]")) {
    li.hidden = !matchesSearch(li.dataset.search ?? "", query);
    if (!li.hidden) count++;
  }
  for (const el of list.querySelectorAll<HTMLElement>("[data-search-list], [data-search-group], section[id]")) {
    el.hidden = active && !el.querySelector("li[data-item]:not([hidden])");
    if (!el.hidden && el.matches("section[id]")) visibleSections.add(el.id);
  }
  return { visibleSections, count };
}

/**
 * The sticky block under the header: search box (JS only), swipe hint and category chips.
 * It measures its own height and publishes `--menu-sticky-offset` on its parent, so section anchors clear it
 * whatever its current height (hint shown or hidden, font size). Without JS the page's static fallback applies.
 */
export function MenuToolbar({
  chips,
  labels,
  phone,
}: {
  chips: Chip[];
  labels: MenuToolbarLabels;
  phone: { display: string; href: string };
}) {
  const root = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(new Set());
  const [count, setCount] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const lastSent = useRef("");
  // The search box has no meaning without JS, so it renders only after hydration.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const publish = () => {
    const el = root.current;
    el?.parentElement?.style.setProperty(
      "--menu-sticky-offset",
      `calc(var(--menu-header-h) + ${el.getBoundingClientRect().height}px + 0.25rem)`,
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

  useEffect(() => () => clearTimeout(timer.current), []);

  const change = (next: string) => {
    setQuery(next);
    const { visibleSections, count } = applyFilter(next);
    setCount(count);
    setHiddenIds(new Set(chips.map((c) => c.id).filter((id) => !visibleSections.has(id))));
    // Typing deep in the page: bring the results up so they sit right under the toolbar.
    const list = document.querySelector("[data-menu-list]");
    const bar = root.current;
    if (list && bar) {
      // The toolbar's stuck position (it may have scrolled off with a page that just got short).
      const stuckBottom = parseFloat(getComputedStyle(bar).top) + bar.getBoundingClientRect().height;
      const gap = list.getBoundingClientRect().top - stuckBottom;
      if (gap < 0) window.scrollTo({ top: window.scrollY + gap, behavior: "instant" });
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const term = next.trim().toLowerCase();
      if (term.length >= SEARCH_EVENT_MIN_LENGTH && term !== lastSent.current && isTrackableSearchTerm(term)) {
        lastSent.current = term;
        track("search", { search_term: term });
      }
    }, SEARCH_EVENT_DELAY_MS);
  };

  const clear = () => {
    change("");
    input.current?.focus();
  };

  const searching = query.trim() !== "";
  const status = !searching
    ? ""
    : count === 0
      ? labels.noResults
      : count === 1
        ? labels.resultsOne
        : labels.resultsOther.replace("{count}", String(count));

  // The browser scrolled to a #hash on load, before the search box added its height; scroll again with the new offset.
  useEffect(() => {
    if (!mounted || !location.hash) return;
    publish();
    let id = location.hash.slice(1);
    try {
      id = decodeURIComponent(id);
    } catch {
      // Malformed escape such as #%E0: use the raw string.
    }
    document.getElementById(id)?.scrollIntoView();
  }, [mounted]);

  return (
    <>
      <div
        ref={root}
        data-testid="menu-toolbar"
        className="sticky top-[var(--menu-header-h)] z-30 border-b border-sand-100 bg-cream-50"
      >
        {mounted && (
          <div role="search" className="mx-auto max-w-6xl px-4 pt-2 md:px-8">
            <div className="flex min-h-11 items-center rounded-full border-[1.5px] border-sand-100 bg-white pl-4 text-charcoal-900 focus-within:border-green-900">
              {/* The label wraps only icon + input, so the clear button does not leak into the input's name. */}
              <label className="flex min-h-11 flex-1 items-center gap-2">
                <Search aria-hidden="true" size={18} className="shrink-0 text-green-900" />
                <span className="sr-only">{labels.search}</span>
                <input
                  ref={input}
                  type="search"
                  value={query}
                  placeholder={labels.search}
                  onChange={(e) => change(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape" && query !== "") {
                      e.preventDefault();
                      clear();
                    }
                  }}
                  className="w-full bg-transparent text-base outline-none placeholder:text-muted-600 [&::-webkit-search-cancel-button]:appearance-none"
                />
              </label>
              {query !== "" ? (
                <button
                  type="button"
                  aria-label={labels.clear}
                  onClick={clear}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full text-green-900 focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-green-900"
                >
                  <X aria-hidden="true" size={18} />
                </button>
              ) : (
                <span className="pr-4" />
              )}
            </div>
          </div>
        )}
        {mounted && (
          <p role="status" className="sr-only">
            {status}
          </p>
        )}
        <CategoryChips chips={chips} label={labels.chips} swipeHint={labels.swipeHint} hiddenIds={hiddenIds} />
      </div>
      {mounted && searching && count === 0 && (
        <p data-testid="menu-no-results" className="mx-auto max-w-6xl px-4 py-8 text-center md:px-8">
          {labels.noResults} {labels.noResultsCall}{" "}
          <TrackedLink
            href={phone.href}
            event="click_call"
            params={{ location: "menu" }}
            className="font-bold text-green-900 underline"
          >
            {phone.display}
          </TrackedLink>
          .
        </p>
      )}
    </>
  );
}
