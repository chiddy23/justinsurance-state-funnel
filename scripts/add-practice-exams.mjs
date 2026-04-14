import fs from "node:fs";

const catalog = JSON.parse(
  fs.readFileSync("C:/Users/Chidd/Downloads/absorb-state-catalog-with-courses.json", "utf8")
);
const filePath = "src/lib/states.ts";
const src = fs.readFileSync(filePath, "utf8");
const lines = src.split(/\r?\n/);

const slugToName = {
  alabama: "Alabama", alaska: "Alaska", arizona: "Arizona", arkansas: "Arkansas",
  california: "California", colorado: "Colorado", connecticut: "Connecticut",
  delaware: "Delaware", florida: "Florida", georgia: "Georgia", hawaii: "Hawaii",
  idaho: "Idaho", illinois: "Illinois", indiana: "Indiana", iowa: "Iowa",
  kansas: "Kansas", kentucky: "Kentucky", louisiana: "Louisiana", maine: "Maine",
  maryland: "Maryland", massachusetts: "Massachusetts", michigan: "Michigan",
  minnesota: "Minnesota", missouri: "Missouri", montana: "Montana",
  nebraska: "Nebraska", "new-hampshire": "New Hampshire", "new-jersey": "New Jersey",
  "new-mexico": "New Mexico", "new-york": "New York", "north-carolina": "North Carolina",
  "north-dakota": "North Dakota", ohio: "Ohio", oklahoma: "Oklahoma", oregon: "Oregon",
  pennsylvania: "Pennsylvania", "rhode-island": "Rhode Island",
  "south-carolina": "South Carolina", "south-dakota": "South Dakota",
  tennessee: "Tennessee", texas: "Texas", utah: "Utah", vermont: "Vermont",
  virginia: "Virginia", washington: "Washington", "west-virginia": "West Virginia",
  wisconsin: "Wisconsin", wyoming: "Wyoming",
};

function pickCourses(courses) {
  const find = (pred) => courses.find(pred)?.addToCartUrl || null;
  // Life + Health (combined) — match "Life + Health" or "Life and Health"
  const combinedUrl = find((c) => /life\s*\+\s*health|life\s+and\s+health/i.test(c.title));
  // Life only — exclude combined
  const lifeUrl = find(
    (c) => /\blife\b/i.test(c.title) && !/\+|and/.test(c.title.replace(/Practice Exam/i, ""))
  );
  // Health only — exclude combined
  const healthUrl = find(
    (c) => /\bhealth\b/i.test(c.title) && !/\+|and/.test(c.title.replace(/Practice Exam/i, ""))
  );
  return { lifeUrl, healthUrl, combinedUrl };
}

function insertAfterCeBlock(stateName, practiceExams) {
  const nameIdx = lines.findIndex((l) => l.includes(`name: "${stateName}",`));
  if (nameIdx === -1) return { skipped: true, reason: "state not found" };

  // Find ce: { line then walk to matching close `    },` (4-space indented)
  let ceOpen = -1;
  for (let i = nameIdx; i < nameIdx + 260; i++) {
    if (/^\s{4}ce:\s*\{/.test(lines[i])) {
      ceOpen = i;
      break;
    }
  }
  if (ceOpen === -1) return { skipped: true, reason: "ce block not found" };
  let ceClose = -1;
  for (let i = ceOpen + 1; i < ceOpen + 60; i++) {
    if (/^\s{4}\},\s*$/.test(lines[i])) {
      ceClose = i;
      break;
    }
  }
  if (ceClose === -1) return { skipped: true, reason: "ce close not found" };

  // Skip if practiceExams already present (check next 4 lines)
  for (let i = ceClose + 1; i < ceClose + 5; i++) {
    if (/^\s{4}practiceExams:/.test(lines[i] || "")) {
      return { skipped: true, reason: "already present" };
    }
  }

  const block = [
    `    practiceExams: {`,
    `      lifeUrl: ${JSON.stringify(practiceExams.lifeUrl)},`,
    `      healthUrl: ${JSON.stringify(practiceExams.healthUrl)},`,
    `      combinedUrl: ${JSON.stringify(practiceExams.combinedUrl)},`,
    `      price: "$59",`,
    `    },`,
  ];

  lines.splice(ceClose + 1, 0, ...block);
  return { skipped: false };
}

// Process in reverse line order so indices stay valid
const entries = Object.entries(catalog.states)
  .filter(([slug]) => slugToName[slug])
  .map(([slug, data]) => {
    const courses = pickCourses(data.courses);
    return { slug, stateName: slugToName[slug], courses };
  });

// Find each state's line index and sort descending
const withIdx = entries.map((e) => {
  const idx = lines.findIndex((l) => l.includes(`name: "${e.stateName}",`));
  return { ...e, idx };
});
withIdx.sort((a, b) => b.idx - a.idx);

let inserted = 0;
const skipped = [];
for (const e of withIdx) {
  const result = insertAfterCeBlock(e.stateName, e.courses);
  if (result.skipped) {
    skipped.push(`${e.stateName}: ${result.reason}`);
  } else {
    inserted++;
  }
}

fs.writeFileSync(filePath, lines.join("\n"));
console.log(`Inserted practiceExams for ${inserted} states`);
if (skipped.length) {
  console.log("\nSkipped:");
  skipped.forEach((s) => console.log("  " + s));
}

// Flag states in catalog but not matched
const matched = new Set(entries.map((e) => e.slug));
const unmatched = Object.keys(catalog.states).filter((s) => !matched.has(s));
if (unmatched.length) {
  console.log("\nUnmatched catalog entries (skipped):", unmatched);
}

// Flag our 50 states missing from catalog
const ourStates = new Set(Object.keys(slugToName));
const missing = [...ourStates].filter((s) => !catalog.states[s]);
if (missing.length) {
  console.log("\nOur states with NO catalog data:", missing);
}
