// Static server for out/ that mimics Cloudflare Pages: trailing-slash index
// resolution, out/404.html with status 404, and the rules of out/_headers
// (so the CSP is exercised locally). Usage: node scripts/serve-with-headers.mjs [port]
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { gzipSync } from "node:zlib";

const root = resolve("out");
const port = Number(process.argv[2] ?? 4173);
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

const COMPRESSIBLE = new Set([".html", ".js", ".css", ".json", ".xml", ".txt", ".svg"]);

/** Parses the Cloudflare `_headers` format: a path pattern line, then indented `Name: value` lines. */
export function parseHeaders(text) {
  const rules = [];
  let current = null;
  for (const raw of text.split("\n")) {
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    if (/^\s/.test(raw)) {
      const i = raw.indexOf(":");
      if (current && i > 0) current.headers.push([raw.slice(0, i).trim(), raw.slice(i + 1).trim()]);
    } else {
      const escaped = raw.trim().replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
      current = { regex: new RegExp(`^${escaped}$`), headers: [] };
      rules.push(current);
    }
  }
  return rules;
}

const headersFile = join(root, "_headers");
const rules = existsSync(headersFile) ? parseHeaders(readFileSync(headersFile, "utf8")) : [];

function resolveFile(pathname) {
  const safe = normalize(decodeURIComponent(pathname)).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, safe);
  if (!file.startsWith(root)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  let file = resolveFile(pathname);
  let status = 200;
  if (!file) {
    file = join(root, "404.html");
    status = 404;
  }
  const headers = { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" };
  for (const rule of rules) {
    if (!rule.regex.test(pathname)) continue;
    for (const [name, value] of rule.headers) {
      // Later rules add to earlier ones (Cloudflare joins duplicates with a comma).
      headers[name] = headers[name] ? `${headers[name]}, ${value}` : value;
    }
  }
  let body = readFileSync(file);
  // Cloudflare compresses text assets; mimic it so size budgets and Lighthouse see real transfer sizes.
  if (COMPRESSIBLE.has(extname(file)) && /\bgzip\b/.test(req.headers["accept-encoding"] ?? "")) {
    body = gzipSync(body);
    headers["Content-Encoding"] = "gzip";
    headers["Vary"] = "Accept-Encoding";
  }
  res.writeHead(status, headers);
  res.end(body);
}).listen(port, () => console.log(`serving out/ on http://localhost:${port}`));
