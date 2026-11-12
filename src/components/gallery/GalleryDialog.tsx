"use client";

import { useEffect, useRef } from "react";
import ExportedImage from "next-image-export-optimizer";
import { X } from "lucide-react";

export interface GalleryPhoto {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Native <dialog> (modal): Escape and backdrop click close it; the caller restores focus. */
export function GalleryDialog({
  photo,
  closeLabel,
  onClose,
}: {
  photo: GalleryPhoto | null;
  closeLabel: string;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (photo && !dialog.open) dialog.showModal();
    if (!photo && dialog.open) dialog.close();
  }, [photo]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-label={photo?.alt}
      className="m-auto max-h-[92vh] w-[min(92vw,64rem)] overflow-visible rounded-card bg-cream-50 p-0 backdrop:bg-black/70"
    >
      {photo && (
        <div className="relative">
          <ExportedImage
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 1024px, 92vw"
            className="mx-auto max-h-[80vh] w-auto max-w-full rounded-card object-contain"
          />
          <p className="px-4 py-3 text-sm text-green-900">{photo.alt}</p>
          <button
            type="button"
            onClick={() => ref.current?.close()}
            aria-label={closeLabel}
            className="absolute top-2 right-2 inline-flex size-11 items-center justify-center rounded-full bg-green-900 text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>
      )}
    </dialog>
  );
}
