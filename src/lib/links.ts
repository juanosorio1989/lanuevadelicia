import { restaurant } from "@/data/restaurant";
import type { Restaurant } from "@/types/content";

function destination(r: Restaurant): string {
  return encodeURIComponent(`${r.name}, ${r.address.oneLine}`);
}

export function directionsUrl(r: Restaurant = restaurant): string {
  const base = `https://www.google.com/maps/dir/?api=1&destination=${destination(r)}`;
  return r.googlePlaceId
    ? `${base}&destination_place_id=${encodeURIComponent(r.googlePlaceId)}`
    : base;
}

export function telHref(r: Restaurant = restaurant): string {
  return `tel:${r.phone.e164}`;
}

export function mapsEmbedUrl(r: Restaurant = restaurant): string {
  return `https://www.google.com/maps?q=${destination(r)}&output=embed`;
}

export function reviewsUrl(r: Restaurant = restaurant): string {
  return r.googleMapsUrl;
}

export function writeReviewUrl(r: Restaurant = restaurant): string {
  return r.googlePlaceId
    ? `https://search.google.com/local/writereview?placeid=${encodeURIComponent(r.googlePlaceId)}`
    : r.googleMapsUrl;
}
