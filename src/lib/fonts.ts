import { DM_Sans, Playfair_Display } from "next/font/google";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
  preload: false,
  variable: "--font-playfair",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const fontVariables = `${playfair.variable} ${dmSans.variable}`;
