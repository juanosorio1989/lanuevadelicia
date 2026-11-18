import { routing } from "./routing";

/**
 * Cloudflare serves the /es/ HTML at `/` through a 200 rewrite, so usePathname() reports "/"
 * there. Treat it as the default locale home so nav and language switch behave as on /es/.
 */
export function localizedPathname(pathname: string): string {
  return pathname === "" || pathname === "/" ? `/${routing.defaultLocale}/` : pathname;
}
