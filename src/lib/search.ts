import type { Locale, MenuItem } from "@/types/content";

/** Menu search helpers: accent- and case-insensitive, word-based matching. */

/** NFD, drop combining marks, lower-case; every run of non-letters/digits becomes one space; trimmed. */
export function normalizeSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** True when every word of the query is a substring of the (already normalized) text. A blank query matches. */
export function matchesSearch(normalizedText: string, query: string): boolean {
  const q = normalizeSearch(query);
  if (q === "") return true;
  return q.split(" ").every((token) => normalizedText.includes(token));
}

/** The normalized text a menu item is matched against (rendered as `data-search`). */
export function searchText(item: MenuItem, locale: Locale): string {
  return normalizeSearch(`${item.name[locale]} ${item.description?.[locale] ?? ""}`);
}
