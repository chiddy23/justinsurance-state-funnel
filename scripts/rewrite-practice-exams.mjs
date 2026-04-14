// Definitive rewrite: for each state with a practiceExams block, replace its 3 URLs
// with the correct values derived from the Absorb catalog.
import fs from "node:fs";

const catalog = JSON.parse(
  fs.readFileSync("C:/Users/Chidd/Downloads/absorb-state-catalog-with-courses.json", "utf8")
);
const src = fs.readFileSync("src/lib/states.ts", "utf8");
const lines = src.split(/\r?\n/);

const slugToName = {
  alabama:"Alabama",alaska:"Alaska",arizona:"Arizona",arkansas:"Arkansas",
  california:"California",colorado:"Colorado",connecticut:"Connecticut",
  delaware:"Delaware",florida:"Florida",georgia:"Georgia",hawaii:"Hawaii",
  idaho:"Idaho",illinois:"Illinois",indiana:"Indiana",iowa:"Iowa",
  kansas:"Kansas",kentucky:"Kentucky",louisiana:"Louisiana",maine:"Maine",
  maryland:"Maryland",massachusetts:"Massachusetts",michigan:"Michigan",
  minnesota:"Minnesota",missouri:"Missouri",montana:"Montana",
  nebraska:"Nebraska","new-hampshire":"New Hampshire","new-jersey":"New Jersey",
  "new-mexico":"New Mexico","new-york":"New York","north-carolina":"North Carolina",
  "north-dakota":"North Dakota",ohio:"Ohio",oklahoma:"Oklahoma",oregon:"Oregon",
  pennsylvania:"Pennsylvania","rhode-island":"Rhode Island",
  "south-carolina":"South Carolina","south-dakota":"South Dakota",
  tennessee:"Tennessee",texas:"Texas",utah:"Utah",vermont:"Vermont",
  virginia:"Virginia",washington:"Washington","west-virginia":"West Virginia",
  wisconsin:"Wisconsin",wyoming:"Wyoming",
};

function urlsFor(slug) {
  const courses = catalog.states[slug]?.courses || [];
  const stateName = slugToName[slug];
  const stripState = (t) => {
    // Strip the state name prefix from the course title so we can look at just the LOA part.
    const re = new RegExp(`^${stateName.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}\\s+`, "i");
    return t.replace(re, "");
  };
  const find = (pred) => courses.find((c) => pred(stripState(c.title)))?.addToCartUrl || null;
  return {
    lifeUrl: find((s) => /^Life\s+Practice/i.test(s)),
    healthUrl: find((s) => /^Health\s+Practice/i.test(s)),
    combinedUrl: find((s) => /^Life\s*\+\s*Health\s+Practice|^Life\s+and\s+Health\s+Practice/i.test(s)),
  };
}

let rewrites = 0;
const issues = [];
for (const [slug, stateName] of Object.entries(slugToName)) {
  const urls = urlsFor(slug);
  if (!urls.lifeUrl || !urls.healthUrl || !urls.combinedUrl) {
    issues.push(`${slug} → missing: ${Object.entries(urls).filter(([,v])=>!v).map(([k])=>k).join(",")}`);
    continue;
  }
  const nameIdx = lines.findIndex((l) => l.includes(`name: "${stateName}",`));
  if (nameIdx === -1) { issues.push(`${slug} → state not found`); continue; }
  // Find practiceExams block within 260 lines
  let peIdx = -1;
  for (let i = nameIdx; i < Math.min(nameIdx + 260, lines.length); i++) {
    if (/^\s{4}practiceExams:\s*\{/.test(lines[i])) { peIdx = i; break; }
  }
  if (peIdx === -1) { issues.push(`${slug} → practiceExams block not found`); continue; }
  // Rewrite the 3 URL lines
  for (let i = peIdx + 1; i < peIdx + 6; i++) {
    if (/^\s{6}lifeUrl:/.test(lines[i])) lines[i] = `      lifeUrl: ${JSON.stringify(urls.lifeUrl)},`;
    else if (/^\s{6}healthUrl:/.test(lines[i])) lines[i] = `      healthUrl: ${JSON.stringify(urls.healthUrl)},`;
    else if (/^\s{6}combinedUrl:/.test(lines[i])) lines[i] = `      combinedUrl: ${JSON.stringify(urls.combinedUrl)},`;
  }
  rewrites++;
}

fs.writeFileSync("src/lib/states.ts", lines.join("\n"));
console.log(`Rewrote ${rewrites} states`);
if (issues.length) { console.log("\nIssues:"); issues.forEach((i) => console.log("  " + i)); }
