"use client";

import { useEffect, useSyncExternalStore } from "react";
import { nyNow } from "@/lib/hours";

function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000);
  return () => clearInterval(id);
}
const getSnapshot = () => nyNow(new Date()).weekday;
const getServerSnapshot = () => null;

/** Renders nothing. After hydration it marks today's card (New York time) and, with no hash, scrolls to it once. */
export function TodayHighlighter() {
  const weekday = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  useEffect(() => {
    if (weekday === null) return;
    const cards = document.querySelectorAll<HTMLElement>(
      "[id^='day-'][aria-labelledby]",
    );
    cards.forEach((card) => {
      const isToday = card.id === `day-${weekday}`;
      if (isToday) card.setAttribute("aria-current", "date");
      else card.removeAttribute("aria-current");
      const badge = card.querySelector<HTMLElement>("[data-today-badge]");
      if (badge) badge.hidden = !isToday;
    });
  }, [weekday]);

  useEffect(() => {
    if (weekday === null || window.location.hash) return;
    document
      .getElementById(`day-${weekday}`)
      ?.scrollIntoView({ block: "start" });
    // Only the first load: later weekday changes must not move the page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekday === null]);

  return null;
}
