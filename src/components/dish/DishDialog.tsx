"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ExportedImage from "next-image-export-optimizer";
import { X } from "lucide-react";
import type { DishDisplay } from "@/lib/dish";

/**
 * One native <dialog> per page. Cards stay server components: any click on `a[data-dish="<id>"]` opens that dish
 * (event delegation). Modified clicks keep the default (the link goes to the photo file).
 */
export function DishDialog({ dishes, closeLabel, actions }: { dishes: DishDisplay[]; closeLabel: string; actions: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [dish, setDish] = useState<DishDisplay | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[data-dish]");
      if (!anchor) return;
      const found = dishes.find((d) => d.id === anchor.dataset.dish);
      if (!found) return;
      e.preventDefault();
      opener.current = anchor;
      setDish(found);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [dishes]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (dish && !dialog.open) {
      dialog.showModal();
      // Chrome makes the scroll container focusable and showModal() would pick it; focus the close button explicitly.
      closeBtn.current?.focus();
    }
    if (!dish && dialog.open) dialog.close();
  }, [dish]);

  return (
    <dialog
      ref={ref}
      onClose={() => {
        setDish(null);
        opener.current?.focus();
      }}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
      aria-labelledby="dish-dialog-title"
      className="m-auto w-[min(92vw,40rem)] overflow-hidden rounded-card bg-cream-50 p-0 backdrop:bg-black/70"
    >
      <div className="relative max-h-[92vh] overflow-y-auto">
        <button
          ref={closeBtn}
          type="button"
          onClick={() => ref.current?.close()}
          aria-label={closeLabel}
          className="absolute top-2 right-2 inline-flex size-11 items-center justify-center rounded-full bg-green-900 text-cream-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
        >
          <X aria-hidden="true" size={20} />
        </button>
        {dish && (
          <>
            <ExportedImage
              src={dish.photo.src}
              alt={dish.photo.alt}
              width={dish.photo.width}
              height={dish.photo.height}
              sizes="(min-width: 768px) 640px, 92vw"
              className="mx-auto max-h-[60vh] w-auto max-w-full object-contain"
            />
            <div className="p-4 text-sm">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id="dish-dialog-title" className="font-display text-xl font-bold">
                  {dish.name}
                </h2>
                {dish.price && <span className="shrink-0 font-bold text-terra-700">{dish.price}</span>}
              </div>
              {dish.description && <p className="mt-1 text-muted-600">{dish.description}</p>}
              <DishOptions options={dish.options} />
              <div className="mt-4 border-t border-sand-100 pt-4">{actions}</div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}

/** Same lines as ItemOptions on the cards: unpriced options as one list, priced ones as rows. */
function DishOptions({ options }: { options: DishDisplay["options"] }) {
  const priced = options.filter((o) => o.price !== undefined);
  const plain = options.filter((o) => o.price === undefined);
  if (priced.length === 0 && plain.length === 0) return null;
  return (
    <div className="mt-2 text-muted-600">
      {plain.length > 0 && <p>{plain.map((o) => o.label).join(" · ")}</p>}
      {priced.length > 0 && (
        <ul>
          {priced.map((o) => (
            <li key={o.label} className="flex justify-between gap-3">
              <span>{o.label}</span>
              <span className="font-bold text-terra-700">{o.price}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
