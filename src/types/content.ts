export type { Locale } from "@/i18n/routing";
export type L10n = { es: string; en: string };
/** ISO weekday: 1 = Monday ... 7 = Sunday (not JS getDay()). */
export type IsoWeekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;
export type CategoryId =
  | "desayunos"
  | "antojitos"
  | "ricuras"
  | "pollo"
  | "mariscos"
  | "ensaladas"
  | "especiales"
  | "infantil"
  | "extras"
  | "postres"
  | "bebidas"
  | "cocteles"
  | "cervezas";
export type PhotoId = string;

export interface Photo {
  id: PhotoId;
  src: string;
  width: number;
  height: number;
  alt: L10n;
  group: "dishes" | "drinks" | "specials" | "brand" | "restaurant";
}
export interface MenuOption {
  label: L10n;
  price?: number;
}
export interface MenuItem {
  id: string;
  category: CategoryId;
  subcategory?: L10n;
  name: L10n;
  description?: L10n;
  price?: number;
  options?: MenuOption[];
  image?: PhotoId;
  featured?: boolean;
  featuredOrder?: number;
  available?: boolean;
  allergens?: string[];
}
export interface MenuCategory {
  id: CategoryId;
  name: L10n;
  note?: L10n;
  order: number;
}
export interface SpecialDay {
  day: IsoWeekday;
  main: L10n;
  alternative?: L10n;
  price: number;
  flyer: PhotoId;
}
/** open/close are 'HH:MM', 24h, America/New_York. */
export interface HoursRule {
  days: IsoWeekday[];
  open: string;
  close: string;
}
export type Hours = HoursRule[];
export interface Restaurant {
  name: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    country: "US";
    oneLine: string;
  };
  phone: { e164: string; display: string };
  email: string;
  hours: Hours;
  breakfastUntil: string;
  happyHour: { days: IsoWeekday[]; from: string; to: string }[];
  happyHourCocktailPrice: number;
  deliveryNote: L10n;
  instagram: { handle: string; url: string };
  googleMapsUrl: string;
  googlePlaceId?: string;
  rating: { value: number; count: number; asOf: string; displayCount: string };
  delivery: {
    app: "ubereats" | "doordash" | "grubhub";
    label: string;
    url: string;
  }[];
  siteUrl: string;
  timeZone: "America/New_York";
  foundedClaim: L10n;
}
