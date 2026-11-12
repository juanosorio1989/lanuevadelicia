// Builds once with NEXT_PUBLIC_GA_ID=G-TEST123 and checks the gtag loader is in the HTML.
// The normal out/ is moved aside and restored, so run this on its own (npm run check:ga).
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync, renameSync, rmSync } from "node:fs";

const ID = "G-TEST123";
const aside = ".out-main";
if (existsSync(aside)) {
  if (existsSync("out")) {
    console.error(`FAIL: both ${aside}/ and out/ exist. Inspect them and delete the stale one by hand; nothing was changed.`);
    process.exit(1);
  }
  // A previous run was interrupted after moving out/ aside: put the real build back first.
  renameSync(aside, "out");
  console.log(`restored out/ from ${aside}/ left by an interrupted run`);
}
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
