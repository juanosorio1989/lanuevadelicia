// Crawls out/**/*.html and fails if an internal href/src does not resolve to a file in out/.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = "out";
const SKIP_DIRS = new Set(["_next"]);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIRS.has(name)) yield* walk(p);
    } else if (name.endsWith(".html")) yield p;
  }
}

function resolves(pathname) {
  const p = join(root, decodeURIComponent(pathname));
  if (!existsSync(p)) return false;
  if (statSync(p).isDirectory()) return existsSync(join(p, "index.html"));
  return true;
}

const broken = [];
let checked = 0;
for (const file of walk(root)) {
  const html = readFileSync(file, "utf8");
  const pageDir = "/" + relative(root, file).replace(/\\/g, "/").replace(/[^/]*$/, "");
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const raw = m[1].replaceAll("&amp;", "&");
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/.test(raw)) continue;
    const [pathAndQuery, hash] = raw.split("#");
    const path = pathAndQuery.split("?")[0];
    const abs = path ? new URL(path, `http://x${pageDir}`).pathname : pageDir;
    checked++;
    if (!resolves(abs)) {
      broken.push(`${file}: ${raw} -> missing ${abs}`);
      continue;
    }
    if (hash && abs.endsWith("/")) {
      const target = readFileSync(join(root, abs, "index.html"), "utf8");
      if (!target.includes(`id="${hash}"`)) broken.push(`${file}: ${raw} -> no id="${hash}" in ${abs}`);
    }
  }
}

if (broken.length) {
  console.error(`${broken.length} broken internal link(s):\n` + broken.map((b) => `  ${b}`).join("\n"));
  process.exit(1);
}
console.log(`links OK (${checked} internal references checked)`);
