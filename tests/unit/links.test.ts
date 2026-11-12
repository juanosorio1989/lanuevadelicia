import { describe, it, expect } from "vitest";
import { restaurant } from "@/data/restaurant";
import {
  directionsUrl,
  telHref,
  mapsEmbedUrl,
  reviewsUrl,
  writeReviewUrl,
} from "@/lib/links";

const dest = encodeURIComponent(
  "La Nueva Delicia, 93-16B 37th Ave, Jackson Heights, NY 11372",
);

describe("link builders", () => {
  it("builds links from the restaurant facts", () => {
    expect(directionsUrl()).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=" + dest,
    );
    expect(telHref()).toBe("tel:+17186723456");
    expect(mapsEmbedUrl()).toBe(
      "https://www.google.com/maps?q=" + dest + "&output=embed",
    );
    expect(reviewsUrl()).toBe("https://maps.app.goo.gl/4CmW2ZLtRpvPJKb56");
    // no place id yet: write-review falls back to the listing
    expect(writeReviewUrl()).toBe("https://maps.app.goo.gl/4CmW2ZLtRpvPJKb56");
  });

  it("uses the place id when known", () => {
    const r = { ...restaurant, googlePlaceId: "ChIJtest" };
    expect(directionsUrl(r).endsWith("&destination_place_id=ChIJtest")).toBe(true);
    expect(writeReviewUrl(r)).toBe(
      "https://search.google.com/local/writereview?placeid=ChIJtest",
    );
  });
});
