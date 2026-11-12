"use client";

import { useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { NAV_ITEMS, type NavLabels } from "./nav-items";

/** Menu button + full-screen native <dialog>. Escape closes it and the browser returns focus to the button. */
export function MobileNav({ locale, labels: t }: { locale: string; labels: NavLabels }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const button = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={button}
        type="button"
        data-testid="menu-button"
        aria-label={t.openMenu}
        onClick={() => dialog.current?.showModal()}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50 md:hidden"
      >
        <Menu aria-hidden="true" size={26} />
      </button>
      <dialog
        ref={dialog}
        aria-label={t.main}
        onClose={() => button.current?.focus()}
        className="fixed inset-0 m-0 hidden h-full max-h-none w-full max-w-none flex-col bg-green-900 p-0 text-cream-50 open:flex"
      >
        <div className="flex justify-end px-4 py-3">
          <button
            type="button"
            aria-label={t.closeMenu}
            onClick={() => dialog.current?.close()}
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
          >
            <X aria-hidden="true" size={28} />
          </button>
        </div>
        <nav aria-label={t.main} className="flex flex-col gap-1 px-6">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              href={`/${locale}${item.href}/`}
              onClick={() => dialog.current?.close()}
              className="flex min-h-14 items-center font-display text-3xl font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50"
            >
              {t[item.key]}
            </Link>
          ))}
        </nav>
      </dialog>
    </>
  );
}
