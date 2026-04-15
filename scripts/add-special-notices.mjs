import fs from "node:fs";

const filePath = "src/lib/states.ts";
const src = fs.readFileSync(filePath, "utf8");
const lines = src.split(/\r?\n/);

const notices = {
  Florida: [
    {
      kind: "alert",
      title: "Florida no longer offers remote or online-proctored licensing exams",
      body: "As of February 16, 2024, all Florida insurance licensing exams must be taken in person at a Pearson VUE testing center. Remote/online testing has been permanently discontinued — plan your study schedule around an in-person exam appointment.",
    },
    {
      kind: "tip",
      title: "Your course completion certificate is valid for 4 years",
      body: "After you finish your JustInsurance Florida prelicensing course, you have 4 years to sit for the state exam before the certificate expires. If you let it lapse, prelicensing must be completed again. Most candidates test within 60–90 days of completion.",
    },
    {
      kind: "tip",
      title: "You must apply for your license within 12 months of passing the exam",
      body: "If you wait longer than 12 months after passing to submit your Florida license application through NIPR, you will be required to retake the state licensing exam before your application can be processed. Don't let the window close.",
    },
    {
      kind: "update",
      title: "Florida CE hours reduce after 6 years of licensure",
      body: "New agents complete 24 CE hours per renewal cycle for the first 6 years of licensure. After that, the requirement drops to 20 CE hours per cycle. Florida also allows up to 24 excess CE hours to carry forward into the next renewal period.",
    },
    {
      kind: "tip",
      title: "Florida 2-15 exam: 150 questions, 2 hours 45 minutes",
      body: "The Florida 2-15 Life, Health & Annuity combined licensing exam contains approximately 150 questions with a 2-hour 45-minute time limit. Passing score is 70%. Verify current exam parameters in the Pearson VUE Florida candidate handbook before test day.",
      link: { href: "https://home.pearsonvue.com/fl/insurance", text: "Pearson VUE Florida portal", external: true },
    },
  ],
  California: [
    {
      kind: "update",
      title: "California Prelicensing Update — Effective January 1, 2026",
      body: "California has simplified its prelicensing requirements. As of January 1, 2026, the state eliminated most line-specific prelicensing hour requirements, retaining only the mandatory 12-hour Code and Ethics (C&E) course. The state exam requirement remains unchanged — structured preparation significantly improves first-attempt pass rates even without mandated seat-time.",
    },
    {
      kind: "tip",
      title: "California uses PSI for both in-person and online proctored exams",
      body: "California candidates can test at PSI test centers or via PSI Bridge online proctoring. The California Life & Health licensing exam typically contains 75–150 questions depending on line of authority, with a 1.5–3 hour time limit. Confirm current availability and format in your PSI candidate handbook.",
      link: { href: "https://test-takers.psiexams.com/cadi", text: "PSI California portal", external: true },
    },
    {
      kind: "tip",
      title: "Covered California certification is a separate step",
      body: "Agents who want to sell health insurance through Covered California (the state's ACA marketplace) must complete a separate Covered California certification in addition to standard licensure. This is not part of prelicensing and must be renewed annually.",
      link: { href: "https://www.coveredca.com/agents/", text: "coveredca.com/agents", external: true },
    },
  ],
};

function findInsertionPoint(stateName) {
  const nameIdx = lines.findIndex((l) => l.includes(`name: "${stateName}",`));
  if (nameIdx === -1) throw new Error(`State not found: ${stateName}`);
  // Insert immediately after the practiceExams block close
  for (let i = nameIdx; i < nameIdx + 300; i++) {
    if (/^\s{4}practiceExams:\s*\{/.test(lines[i])) {
      for (let j = i + 1; j < i + 12; j++) {
        if (/^\s{4}\},\s*$/.test(lines[j])) {
          return j + 1; // insert after the close
        }
      }
    }
  }
  throw new Error(`practiceExams close not found for ${stateName}`);
}

function buildNoticesBlock(arr) {
  const out = [`    specialNotices: [`];
  for (const n of arr) {
    out.push(`      {`);
    out.push(`        kind: ${JSON.stringify(n.kind)},`);
    out.push(`        title: ${JSON.stringify(n.title)},`);
    out.push(`        body: ${JSON.stringify(n.body)},`);
    if (n.link) {
      const ext = n.link.external ? `, external: true` : "";
      out.push(`        link: { href: ${JSON.stringify(n.link.href)}, text: ${JSON.stringify(n.link.text)}${ext} },`);
    }
    out.push(`      },`);
  }
  out.push(`    ],`);
  return out;
}

// Insert in reverse order (highest line first) so earlier indices remain valid
const targets = Object.entries(notices)
  .map(([name, arr]) => ({ name, arr, idx: findInsertionPoint(name) }))
  .sort((a, b) => b.idx - a.idx);

for (const t of targets) {
  const block = buildNoticesBlock(t.arr);
  lines.splice(t.idx, 0, ...block);
  console.log(`Inserted ${t.arr.length} notices for ${t.name} at line ${t.idx + 1}`);
}

fs.writeFileSync(filePath, lines.join("\n"));
console.log("\nDone.");
