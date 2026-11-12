export type AnalyticsEvent =
  | "click_directions"
  | "click_call"
  | "click_delivery"
  | "click_reviews"
  | "load_map"
  | "switch_language"
  | "view_menu_category"
  | "click_instagram";

type Gtag = (command: "event", name: string, params: Record<string, string>) => void;

/** Sends a GA4 event only when gtag is loaded. Never throws. */
export function track(event: AnalyticsEvent, params: Record<string, string>): void {
  try {
    if (typeof window === "undefined") return;
    const gtag = (window as unknown as { gtag?: Gtag }).gtag;
    if (typeof gtag === "function") gtag("event", event, params);
  } catch {
    // analytics must never break the page
  }
}
