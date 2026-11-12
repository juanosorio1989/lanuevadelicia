import { GoogleAnalytics as NextGoogleAnalytics } from "@next/third-parties/google";

/** Loads GA4 after hydration, and only when NEXT_PUBLIC_GA_ID is set (spec 08). */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return <NextGoogleAnalytics gaId={id} />;
}
