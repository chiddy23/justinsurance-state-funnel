const { spawnSync } = require("node:child_process");
const { resolve } = require("node:path");

// Vercel Ignored Build Step semantics are inverted: 0 skips, 1 builds.
// A missing or failing release preflight must skip the build, not publish it.
const root = resolve(__dirname, "..");
for (const script of [
  "scripts/sync-seo-purchase-links.mjs",
  "scripts/verify-checkout-links.mjs",
]) {
  const result = spawnSync(process.execPath, [script], {
    cwd: root,
    stdio: "inherit",
  });
  if (result.status !== 0) {
    console.error(`Release preflight failed (${script}); skipping this Vercel build.`);
    process.exit(0);
  }
}
console.log("Release preflight passed; allowing Vercel build.");
process.exit(1);
