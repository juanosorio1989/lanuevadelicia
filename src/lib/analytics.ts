/** Where on the site a tracked link lives (spec 08). `story` is the Our Story page call to action. */
export type TrackLocation = "hero" | "header" | "bottom_bar" | "visit" | "footer" | "story";

/** Params each GA4 event must send (spec 08). `locale` is added by track(). */
export type EventParams = {
  click_directions: { location: TrackLocation };
  click_call: { location: TrackLocation };
  click_delivery: { app: string; location: TrackLocation };
  click_reviews: { action: "read" | "write" };
  load_map: { page: "home" | "visit" };
  switch_language: { from: string; to: string };
  view_menu_category: { category: string };
  click_instagram: { location: TrackLocation };
};

export type AnalyticsEvent = keyof EventParams;

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Sends a GA4 event only when gtag is loaded. Adds the page locale to every event. Never throws. */
export function track<E extends AnalyticsEvent>(event: E, params: EventParams[E]): void {
  try {
    if (typeof window === "undefined") return;
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag !== "function") return;
    const locale = typeof document !== "undefined" ? document.documentElement.lang : "";
    gtag("event", event, { locale, ...(params as Record<string, string>) });
  } catch {
    // analytics must never break the page
  }
}
