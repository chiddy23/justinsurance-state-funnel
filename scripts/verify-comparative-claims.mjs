#!/usr/bin/env node
/**
 * Quarterly verification: scan comparative-content surfaces for
 * literal-falsity / Lanham-Act risk patterns that have been previously
 * remediated. Run via `npm run verify-comparative-claims`.
 *
 * Exits 0 if clean, exits 1 if any flagged pattern is found.
 *
 * Update this list whenever new false-claim patterns are remediated.
 * See docs/comparative-content-sop.md for the full quarterly checklist.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

const SURFACES = [
  "src/content/blog",
  "src/app/compare",
  "src/app/webinars",
  "src/lib/comparison-data.ts",
];

// Patterns previously remediated. Any reappearance is a regression.
const FLAGGED_PATTERNS = [
  /no methodology/i,
  /without disclosing methodology/i,
  /does not disclose methodology/i,
  /does not disclose sample size/i,
  /impossible to schedule/i,
  /most candidates can'?t/i,
  /most adults can'?t/i,
  /most frequently cited.*complaint/i,
];

function* walk(p) {
  const stat = statSync(p);
  if (stat.isFile()) {
    yield p;
    return;
  }
  if (stat.isDirectory()) {
    for (const entry of readdirSync(p)) {
      yield* walk(join(p, entry));
    }
  }
}

let hits = 0;
const allHits = [];

for (const surface of SURFACES) {
  const abs = join(ROOT, surface);
  try {
    for (const file of walk(abs)) {
      if (!/\.(md|mdx|tsx?|jsx?)$/.test(file)) continue;
      const content = readFileSync(file, "utf8");
      const lines = content.split("\n");
      lines.forEach((line, i) => {
        for (const pattern of FLAGGED_PATTERNS) {
          if (pattern.test(line)) {
            hits++;
            allHits.push({
              file: relative(ROOT, file),
              line: i + 1,
              pattern: pattern.source,
              context: line.trim().slice(0, 200),
            });
          }
        }
      });
    }
  } catch (err) {
    console.error(`Could not scan ${surface}: ${err.message}`);
  }
}

console.log("=== Comparative-content claim verification ===\n");

if (hits === 0) {
  console.log("PASS: zero flagged patterns found across:");
  for (const s of SURFACES) console.log(`  - ${s}`);
  console.log("\nNext quarterly reverification: see docs/comparative-content-sop.md");
  process.exit(0);
} else {
  console.log(`FAIL: ${hits} flagged pattern(s) found:\n`);
  for (const hit of allHits) {
    console.log(`  ${hit.file}:${hit.line}`);
    console.log(`    Pattern: /${hit.pattern}/`);
    console.log(`    Context: ${hit.context}\n`);
  }
  console.log("Review against docs/comparative-content-sop.md before fixing.");
  process.exit(1);
}
