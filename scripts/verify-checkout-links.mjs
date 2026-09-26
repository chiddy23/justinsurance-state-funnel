import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

// Fail closed if a stale branch replaces the first-party purchase routes.
// Catalog browsing links may still point to Absorb; product purchase links may not.
const root = resolve(import.meta.dirname, "..");
const read = (path) => readFileSync(join(root, path), "utf8");
const catalog = JSON.parse(read("src/lib/catalog-links.json"));
const statesSource = read("src/lib/states.ts");
const productKinds = ["life", "health", "life-and-health"];
const exceptions = new Set([
  "florida/continuing-education/life",
  "florida/continuing-education/health",
  "florida/continuing-education/life-and-health",
  "illinois/continuing-education/life",
  "illinois/continuing-education/health",
  "illinois/continuing-education/life-and-health",
  "indiana/continuing-education/life",
  "indiana/continuing-education/health",
  "indiana/continuing-education/life-and-health",
  "massachusetts/continuing-education/life",
  "massachusetts/continuing-education/health",
  "massachusetts/continuing-education/life-and-health",
  "minnesota/continuing-education/life",
  "minnesota/continuing-education/health",
  "minnesota/continuing-education/life-and-health",
  "new-york/prelicensing/health",
  "new-york/prelicensing/life-and-health",
  "new-york/continuing-education/life",
  "new-york/continuing-education/health",
  "new-york/continuing-education/life-and-health",
  "north-dakota/continuing-education/health",
  "utah/continuing-education/life",
  "utah/continuing-education/health",
  "utah/continuing-education/life-and-health",
  "virginia/continuing-education/life",
  "virginia/continuing-education/health",
  "washington/continuing-education/life",
  "washington/continuing-education/health",
  "washington/continuing-education/life-and-health",
  "wisconsin/continuing-education/health",
]);

const stateCodes = new Map(
  [...statesSource.matchAll(/abbreviation:\s*"([A-Z]{2})",\s*slug:\s*"([a-z-]+)"/g)]
    .map((match) => [match[2], match[1].toLowerCase()]),
);
assert.equal(stateCodes.size, 50, "Expected 50 state-code mappings in states.ts");
assert.equal(Object.keys(catalog).length, 50, "Expected 50 state catalogs");
assert.equal(exceptions.size, 30, "Review changes to the exception inventory explicitly");

let purchaseLinks = 0;
let exceptionLinks = 0;
const seenSkus = new Set();
for (const [state, groups] of Object.entries(catalog)) {
  const code = stateCodes.get(state);
  assert.ok(code, `${state}: no state code`);
  for (const group of ["prelicensing", "continuing-education"]) {
    assert.ok(groups[group], `${state}/${group}: missing catalog group`);
    for (const kind of productKinds) {
      const label = `${state}/${group}/${kind}`;
      const href = groups[group][kind];
      assert.equal(typeof href, "string", `${label}: missing link`);
      assert.ok(!href.includes("/#/AddToCart"), `${label}: direct Absorb cart is forbidden`);
      if (exceptions.has(label)) {
        // A known non-checkout course must stay on its reviewed informational
        // route until the course has an approved, working first-party SKU.
        assert.ok(
          href.startsWith("/") || href.startsWith("https://yourinsurancelicense.myabsorb.com/#/catalog/"),
          `${label}: exception changed; review availability before updating this test`,
        );
        exceptionLinks++;
        continue;
      }
      const url = new URL(href);
      assert.equal(url.origin, "https://checkout.justinsuranceco.com", `${label}: wrong checkout host`);
      assert.equal(url.pathname, "/checkout", `${label}: wrong checkout path`);
      const skuKind = kind === "life-and-health" ? "life-health" : kind;
      const expectedSku = `${code}${group === "continuing-education" ? "-ce" : ""}-${skuKind}`;
      assert.equal(url.searchParams.get("sku"), expectedSku, `${label}: wrong course SKU`);
      assert.ok(!seenSkus.has(expectedSku), `${label}: duplicate SKU`);
      seenSkus.add(expectedSku);
      purchaseLinks++;
    }
  }
}
assert.equal(purchaseLinks, 270, "First-party catalog purchase-link count changed; review it explicitly");
assert.equal(exceptionLinks, 30, "Non-checkout exception count changed; review it explicitly");

// The state-specific practice-exam buttons are generated from states.ts.
// New York has no practice-exam group in this source, so the current baseline is 49.
for (const [field, suffix] of [
  ["lifeUrl", "life"],
  ["healthUrl", "health"],
  ["combinedUrl", "life-health"],
]) {
  const urls = [...statesSource.matchAll(new RegExp(`${field}:\\s*"([^"]+)"`, "g"))].map((match) => match[1]);
  assert.equal(urls.length, 49, `${field}: expected one link per available state`);
  for (const href of urls) {
    const url = new URL(href);
    assert.equal(url.origin, "https://checkout.justinsuranceco.com", `${field}: wrong checkout host`);
    assert.equal(url.pathname, "/checkout", `${field}: wrong checkout path`);
    assert.match(url.searchParams.get("sku") || "", new RegExp(`^[a-z]{2}-practice-${suffix}$`), `${field}: wrong SKU`);
  }
}

// Three P&C products still use explicitly reviewed Absorb carts. Do not allow
// any additional direct Absorb cart links to appear in website source files.
const allowedDirectCartIds = new Set([
  "619B808F-7017-4374-9A8B-14B4C659E284",
  "1090FCF8-B6EF-4361-9F5B-AAA17A612D23",
  "13D82FEE-FE0D-4943-B7EB-D258EF6CE98D",
]);
function sourceFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : [path];
  });
}
let directCartLinks = 0;
for (const path of sourceFiles(join(root, "src"))) {
  if (!/\.(tsx?|json)$/.test(path)) continue;
  const content = readFileSync(path, "utf8");
  for (const match of content.matchAll(/https:\/\/yourinsurancelicense\.myabsorb\.com\/#\/AddToCart\?CourseIds=([0-9a-f-]{36})/gi)) {
    assert.ok(allowedDirectCartIds.has(match[1].toUpperCase()), `${path}: unexpected direct Absorb cart`);
    directCartLinks++;
  }
}
assert.equal(directCartLinks, 3, "Direct Absorb cart exception count changed; review it explicitly");
assert.ok(existsSync(join(root, "src/app/live/page.tsx")), "The /live landing page must be present");
const livePage = read("src/app/live/page.tsx");
assert.ok(
  livePage.includes('line === "life-and-health" ? "life-health" : line'),
  "The /live Life & Health selection must use the checkout's life-health SKU",
);
assert.ok(
  livePage.includes("-${skuLine}`"),
  "The /live checkout URL must use the mapped SKU line",
);
const layout = read("src/app/layout.tsx");
assert.ok(layout.includes("<AttributionBridge />"), "Checkout attribution bridge is missing from the root layout");
console.log(`PASS: ${purchaseLinks} first-party catalog links, 147 practice-exam links, 30 reviewed catalog exceptions, 3 reviewed P&C exceptions, /live, and attribution bridge.`);
