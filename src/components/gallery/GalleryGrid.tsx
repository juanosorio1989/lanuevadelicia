"use client";

import { useRef, useState } from "react";
import ExportedImage from "next-image-export-optimizer";
import { GalleryDialog, type GalleryPhoto } from "./GalleryDialog";

export interface GalleryGroup {
  id: string;
  label: string;
  photos: GalleryPhoto[];
}

/**
 * Thumbnails are plain links to the full image, so the gallery works without JS.
 * With JS, a click opens the native dialog instead. It receives only {src,width,height,alt}, never the photo manifest.
 */
export function GalleryGrid({
  groups,
  closeLabel,
  openLabel,
}: {
  groups: GalleryGroup[];
  closeLabel: string;
  /** Template with an {alt} placeholder. */
  openLabel: string;
}) {
  const [current, setCurrent] = useState<GalleryPhoto | null>(null);
  const opener = useRef<HTMLElement | null>(null);

  return (
    <>
      {groups.map((group) => (
        <section key={group.id} aria-labelledby={`gallery-${group.id}`} className="mt-8">
          <h2 id={`gallery-${group.id}`} className="text-2xl">
            {group.label}
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {group.photos.map((photo) => (
              <li key={photo.src}>
                <a
                  href={photo.src}
                  aria-label={openLabel.replace("{alt}", photo.alt)}
                  onClick={(e) => {
                    e.preventDefault();
                    opener.current = e.currentTarget;
                    setCurrent(photo);
                  }}
                  className="block overflow-hidden rounded-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900"
                >
                  <ExportedImage
                    src={photo.src}
                    alt={photo.alt}
                    width={photo.width}
                    height={photo.height}
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                    loading="lazy"
                    className="aspect-[4/3] w-full object-cover transition-transform hover:scale-105"
                  />
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <GalleryDialog
        photo={current}
        closeLabel={closeLabel}
        onClose={() => {
          setCurrent(null);
          opener.current?.focus();
        }}
      />
    </>
  );
}
