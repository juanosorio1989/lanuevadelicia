import type { Restaurant } from "@/types/content";

// Every fact here comes from spec 02 (business facts). Do not add facts without owner confirmation.
export const restaurant: Restaurant = {
  name: "La Nueva Delicia",
  address: {
    street: "93-16B 37th Ave",
    locality: "Jackson Heights",
    region: "NY",
    postalCode: "11372",
    country: "US",
    oneLine: "93-16B 37th Ave, Jackson Heights, NY 11372",
  },
  phone: { e164: "+17186723456", display: "(718) 672-3456" },
  email: "info@lanuevadelicia.com",
  hours: [
    { days: [1, 2, 3, 4], open: "09:00", close: "21:00" },
    { days: [5, 6, 7], open: "09:00", close: "22:00" },
  ],
  breakfastUntil: "13:00",
  happyHour: [
    { days: [1, 2, 3, 4, 5], from: "12:00", to: "19:00" },
    { days: [6, 7], from: "17:00", to: "20:00" },
  ],
  happyHourCocktailPrice: 8,
  deliveryNote: {
    es: "El domicilio a más de una milla tiene un cargo extra.",
    en: "Delivery beyond one mile has an extra charge.",
  },
  instagram: {
    handle: "@lanuevadeliciarestaurante",
    url: "https://www.instagram.com/lanuevadeliciarestaurante/",
  },
  googleMapsUrl: "https://maps.app.goo.gl/4CmW2ZLtRpvPJKb56",
  rating: { value: 4.4, count: 452, asOf: "2026-11-12", displayCount: "450+" },
  delivery: [
    {
      app: "ubereats",
      label: "Uber Eats",
      url: "https://www.ubereats.com/store/la-nueva-delicias/uPk0HRZTWfGVY-h8iVvtoA",
    },
    {
      app: "doordash",
      label: "DoorDash",
      url: "https://www.doordash.com/store/la-nueva-delicia-jackson-heights-704445/13145759",
    },
    {
      app: "grubhub",
      label: "Grubhub",
      url: "https://www.grubhub.com/restaurant/la-nueva-delicia-9316-37th-ave-suite-b-jackson-heights/3157876",
    },
  ],
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://lanuevadelicia.com",
  timeZone: "America/New_York",
  foundedClaim: { es: "más de 30 años", en: "30+ years" },
};
