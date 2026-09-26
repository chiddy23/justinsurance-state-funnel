import fs from "node:fs";
let src = fs.readFileSync("src/lib/states.ts", "utf8");

const fixes = {
  Indiana: {
    lifeUrl: "https://checkout.justinsuranceco.com/checkout?sku=in-practice-life",
    healthUrl: "https://checkout.justinsuranceco.com/checkout?sku=in-practice-health",
  },
  Maryland: {
    lifeUrl: "https://checkout.justinsuranceco.com/checkout?sku=md-practice-life",
    healthUrl: "https://checkout.justinsuranceco.com/checkout?sku=md-practice-health",
  },
  "Rhode Island": {
    lifeUrl: "https://checkout.justinsuranceco.com/checkout?sku=ri-practice-life",
    healthUrl: "https://checkout.justinsuranceco.com/checkout?sku=ri-practice-health",
  },
};

for (const [state, urls] of Object.entries(fixes)) {
  const escaped = state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  for (const [field, url] of Object.entries(urls)) {
    const re = new RegExp(
      `(name: "${escaped}",[\\s\\S]*?practiceExams:\\s*\\{[\\s\\S]*?${field}:\\s*)null`
    );
    const before = src;
    src = src.replace(re, (_, p1) => `${p1}${JSON.stringify(url)}`);
    if (src === before) console.warn(`  WARN: ${state}.${field} not patched`);
    else console.log(`  OK: ${state}.${field}`);
  }
}

fs.writeFileSync("src/lib/states.ts", src);
