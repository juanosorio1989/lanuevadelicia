import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

const linkClass =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 py-2 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid focus-visible:outline-green-900";
const primary = `${linkClass} bg-terra-700 text-white hover:bg-green-900`;
const outline = `${linkClass} border-2 border-green-900 text-green-900 hover:bg-green-900 hover:text-cream-50`;

// COPY-REVIEW: the 404 copy is Claude's draft.
// Single bilingual 404 (Spanish first). Next writes it to out/404.html.
export default function NotFound() {
  return (
    <html lang="es" className={fontVariables}>
      <body className="bg-cream-50 text-green-900">
        <main className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-terra-700">404</p>
          <section lang="es" aria-labelledby="nf-es" className="mt-2">
            <h1 id="nf-es" className="text-[1.75rem] md:text-4xl">
              Página no encontrada
            </h1>
            <p className="mt-2">No encontramos lo que buscas. Prueba con estos enlaces:</p>
            <p className="mt-4 flex flex-wrap gap-3">
              <Link href="/es/menu/" className={primary}>
                Ver el menú
              </Link>
              <Link href="/es/visit/" className={outline}>
                Visítanos
              </Link>
            </p>
          </section>
          <section lang="en" aria-labelledby="nf-en" className="mt-10 border-t border-sand-100 pt-8">
            <h2 id="nf-en" className="text-[1.75rem] md:text-4xl">
              Page not found
            </h2>
            <p className="mt-2">We could not find what you were looking for. Try these links:</p>
            <p className="mt-4 flex flex-wrap gap-3">
              <Link href="/en/menu/" className={primary}>
                See the menu
              </Link>
              <Link href="/en/visit/" className={outline}>
                Visit us
              </Link>
            </p>
          </section>
        </main>
      </body>
    </html>
  );
}
