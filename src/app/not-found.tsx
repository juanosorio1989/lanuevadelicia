import Link from "next/link";
import { fontVariables } from "@/lib/fonts";
import "./globals.css";

// Single bilingual 404 (Spanish first). Next writes it to out/404.html.
// Task 11 styles it; plain CSS only for now.
export default function NotFound() {
  return (
    <html lang="es" className={fontVariables}>
      <body style={{ padding: "2rem" }}>
        <main>
          <h1>Página no encontrada</h1>
          <p>No encontramos lo que buscas. Prueba con estos enlaces:</p>
          <ul>
            <li><Link href="/es/menu/">Ver el menú</Link></li>
            <li><Link href="/es/visit/">Visítanos</Link></li>
          </ul>
          <h2>Page not found</h2>
          <p>We could not find what you were looking for. Try these links:</p>
          <ul>
            <li><Link href="/en/menu/">See the menu</Link></li>
            <li><Link href="/en/visit/">Visit us</Link></li>
          </ul>
        </main>
      </body>
    </html>
  );
}
