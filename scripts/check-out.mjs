import { existsSync, readFileSync } from "node:fs";

const errors = [];
const read = (f) => (existsSync(f) ? readFileSync(f, "utf8") : null);

function requireFile(file, ...needles) {
  const body = read(file);
  if (body === null) {
    errors.push(`missing ${file}`);
    return;
  }
  for (const n of needles) {
    if (!body.includes(n)) errors.push(`${file} does not contain ${JSON.stringify(n)}`);
  }
}

requireFile("out/index.html", "url=/es/");
requireFile("out/es/index.html", '<html lang="es"');
requireFile("out/en/index.html", '<html lang="en"');
requireFile("out/404.html", "Página no encontrada", "Page not found");
requireFile("out/sitemap.xml", "<urlset", "/es/menu/");
requireFile("out/robots.txt", "Sitemap:");
if (!existsSync("out/og/home.jpg")) errors.push("missing out/og/home.jpg");
requireFile("out/_redirects", "/ /es/ 302");
requireFile(
  "out/_headers",
  "/_next/static/*",
  "immutable",
  "X-Content-Type-Options: nosniff",
  "Referrer-Policy:",
  "Content-Security-Policy:",
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
  "frame-src https://www.google.com https://maps.google.com",
);
if (existsSync("out/fr")) errors.push("out/fr must not exist");

if (errors.length) {
  console.error(errors.map((e) => `FAIL: ${e}`).join("\n"));
  process.exit(1);
}
console.log("out/ OK");
