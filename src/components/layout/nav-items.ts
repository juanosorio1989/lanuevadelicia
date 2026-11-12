export const NAV_ITEMS = [
  { key: "menu", href: "/menu" },
  { key: "specials", href: "/specials" },
  { key: "story", href: "/our-story" },
  { key: "gallery", href: "/gallery" },
  { key: "visit", href: "/visit" },
] as const;

export type NavLabelKey = (typeof NAV_ITEMS)[number]["key"] | "main" | "openMenu" | "closeMenu";
export type NavLabels = Record<NavLabelKey, string>;
