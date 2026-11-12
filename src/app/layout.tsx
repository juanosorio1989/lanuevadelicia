import type { ReactNode } from "react";
import "./globals.css";

// The root layout only passes children through. <html> lives in
// app/[locale]/layout.tsx (and in app/not-found.tsx), per next-intl.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
