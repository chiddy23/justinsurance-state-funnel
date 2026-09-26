import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

// seo-data.json is a legacy downstream artifact. Keep its purchase URLs in
// agreement with catalog-links.json so a future import cannot restore Absorb
// AddToCart links. Washington DC is not in the 50-state website catalog, so
// its legacy purchase fields fail closed to the first-party selector.
const root = resolve(import.meta.dirname, "..");
const sourcePath = resolve(root, "src/lib/seo-data.json");
const catalog = JSON.parse(readFileSync(resolve(root, "src/lib/catalog-links.json"), "utf8"));
const statesSource = readFileSync(resolve(root, "src/lib/states.ts"), "utf8");
const slugsByCode = new Map(
  [...statesSource.matchAll(/abbreviation:\s*"([A-Z]{2})",\s*slug:\s*"([a-z-]+)"/g)]
    .map((match) => [match[1], match[2]]),
);
assert.equal(slugsByCode.size, 50, "Expected 50 website state mappings");

let stateCode = "";
let fields = 0;
const original = readFileSync(sourcePath, "utf8");
const updated = original.split(/(?<=\n)/).map((line) => {
  const stateMatch = line.match(/"STATE_ABBR":\s*"([A-Z]{2})"/);
  if (stateMatch) stateCode = stateMatch[1];
  const fieldMatch = line.match(/"(life|health)_prelicense_url":/);
  if (!fieldMatch) return line;
  assert.ok(stateCode, "Purchase URL appeared before STATE_ABBR");
  const slug = slugsByCode.get(stateCode);
  assert.ok(slug || stateCode === "DC", `Unknown state code ${stateCode}`);
  const href = slug
    ? catalog[slug]?.prelicensing?.[fieldMatch[1]]
    : "https://justinsuranceco.com/prelicensing";
  assert.ok(href && !href.includes("/#/AddToCart"), `${stateCode}: invalid replacement`);
  fields++;
  return line.replace(/(^\s*"(?:life|health)_prelicense_url":\s*)"[^"]*"/, (_, prefix) => prefix + JSON.stringify(href));
}).join("");
assert.equal(fields, 102, "Expected two legacy purchase fields for each of 51 records");

if (process.argv.includes("--write")) {
  if (updated !== original) writeFileSync(sourcePath, updated, "utf8");
  console.log(`Synced ${fields} legacy purchase URLs to first-party checkout or safe catalog routes.`);
} else {
  assert.equal(original, updated, "seo-data.json purchase links drifted; run node scripts/sync-seo-purchase-links.mjs --write");
  console.log(`PASS: ${fields} legacy purchase fields agree with the live website catalog.`);
}
