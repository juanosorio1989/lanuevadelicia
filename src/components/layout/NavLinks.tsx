"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS, type NavLabels } from "./nav-items";

/** Desktop nav; client only to mark the current page with aria-current. */
export function NavLinks({ locale, labels }: { locale: string; labels: NavLabels }) {
  const pathname = usePathname();
  return (
    <nav aria-label={labels.main} className="hidden flex-1 items-center gap-1 md:flex">
      {NAV_ITEMS.map((item) => {
        const href = `/${locale}${item.href}/`;
        const active = pathname === href || pathname === `/${locale}${item.href}`;
        return (
          <Link
            key={item.key}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center rounded-full px-3 text-sm hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-cream-50 ${
              active ? "font-bold" : ""
            }`}
          >
            {labels[item.key]}
          </Link>
        );
      })}
    </nav>
  );
}
