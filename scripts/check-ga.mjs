// Builds once with NEXT_PUBLIC_GA_ID=G-TEST123 and checks the gtag loader is in the HTML.
// The normal out/ is moved aside and restored, so run this on its own (npm run check:ga).
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, rmSync } from "node:fs";

const ID = "G-TEST123";
const aside = ".out-main";
if (existsSync(aside)) rmSync(aside, { recursive: true });
const hadOut = existsSync("out");
if (hadOut) renameSync("out", aside);

let failure = null;
try {
  const build = spawnSync("npx", ["next", "build"], {
    stdio: "inherit",
    env: { ...process.env, NEXT_PUBLIC_GA_ID: ID },
  });
  if (build.status !== 0) throw new Error("next build failed");
  for (const page of ["out/es/index.html", "out/en/menu/index.html"]) {
    const html = readFileSync(page, "utf8");
    if (!html.includes(`googletagmanager.com/gtag/js?id=${ID}`)) throw new Error(`${page}: gtag script tag missing`);
  }
  console.log(`GA4 loader present with ${ID}`);
} catch (e) {
  failure = e;
} finally {
  rmSync("out", { recursive: true, force: true });
  if (hadOut) renameSync(aside, "out");
}
if (failure) {
  console.error(`FAIL: ${failure.message}`);
  process.exit(1);
}
