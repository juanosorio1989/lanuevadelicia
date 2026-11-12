"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";
import { restaurant } from "@/data/restaurant";
import { track } from "@/lib/analytics";
import { mapsEmbedUrl } from "@/lib/links";

/** Click-to-load map: no Google request until the visitor asks for it. */
export type MapLabels = { view: string; title: string; hint: string };

export function MapEmbedLive({ labels: t, location: page = "home" }: { labels: MapLabels; location?: "home" | "visit" }) {
  const [loaded, setLoaded] = useState(false);

  if (loaded) {
    return (
      <iframe
        title={t.title}
        src={mapsEmbedUrl()}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-72 w-full rounded-card border-0 md:h-full md:min-h-72"
      />
    );
  }
  return (
    <div className="flex h-72 flex-col items-center justify-center gap-3 rounded-card bg-green-900 p-6 text-center text-cream-50 md:h-full md:min-h-72">
      <MapPin aria-hidden="true" size={32} className="text-cream-50" />
      <p className="font-bold">{restaurant.address.oneLine}</p>
      <button
        type="button"
        onClick={() => {
          setLoaded(true);
          track("load_map", { page });
        }}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-terra-700 px-6 py-2 font-bold text-white hover:bg-cream-50 hover:text-green-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
      >
        {t.view}
      </button>
      <p className="text-sm text-sand-100">{t.hint}</p>
    </div>
  );
}
