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
requireFile("out/_redirects");
requireFile("out/_headers");
if (existsSync("out/fr")) errors.push("out/fr must not exist");

if (errors.length) {
  console.error(errors.map((e) => `FAIL: ${e}`).join("\n"));
  process.exit(1);
}
console.log("out/ OK");
