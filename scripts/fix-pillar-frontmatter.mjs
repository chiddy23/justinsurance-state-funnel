import fs from "node:fs";

const updates = {
  "src/content/blog/state-license-georgia/how-to-get-your-georgia-insurance-license-2026-step-by-step-guide.md": {
    titleSearch: "How to Get Your Georgia Insurance License: 2026 Step-by-Step Guide",
    titleNew: "How to Get Your Georgia Insurance License in 2026",
    descSearchStart: "Georgia resident licensing now routes through Sircon",
    descNew: "Georgia routes resident producer applications through Sircon, uses Pearson VUE exams, and sets prelicensing at 8.0 hours under Rule 120-2-3-.08.",
  },
  "src/content/blog/state-license-ohio/how-to-get-your-ohio-insurance-license-2026-step-by-step-guide.md": {
    titleSearch: "How to Get Your Ohio Insurance License: 2026 Step-by-Step Guide",
    titleNew: "How to Get Your Ohio Insurance License in 2026",
    descSearchStart: "Ohio still requires 20 clock hours of ODI-approved prelicensing",
    descNew: "Ohio requires 20 clock hours of ODI-approved prelicensing per major line, a 180-day certificate window, and PSI exam scheduling for producers.",
  },
  "src/content/blog/state-license-illinois/how-to-get-your-illinois-insurance-license-2026-step-by-step-guide.md": {
    titleSearch: "How to Get Your Illinois Insurance License: 2026 Step-by-Step Guide",
    titleNew: "How to Get Your Illinois Insurance License in 2026",
    descSearchStart: "Illinois still requires 20 hours of prelicensing per line",
    descNew: "Illinois requires 20 hours of prelicensing per line (7.5 classroom or live web), Pearson VUE general + state exams, and a 5-day NIPR cooling period.",
  },
  "src/content/blog/state-license-pennsylvania/how-to-get-your-pennsylvania-insurance-license-2026-step-by-step-guide.md": {
    titleSearch: "How to Get Your Pennsylvania Insurance License: 2026 Step-by-Step Guide",
    titleNew: "How to Get Your Pennsylvania Insurance License 2026",
    descSearchStart: "Pennsylvania charges a $55 resident producer application fee",
    descNew: "Pennsylvania charges $55 for resident producer applications, routes exams through PSI, and uses IdentoGO for fingerprinting after you pass.",
  },
  "src/content/blog/state-license-arizona/how-to-get-your-arizona-insurance-license-2026-step-by-step-guide.md": {
    titleSearch: "How to Get Your Arizona Insurance License: 2026 Step-by-Step Guide",
    titleNew: "How to Get Your Arizona Insurance License in 2026",
    descSearchStart: "Arizona producers must keep transaction records",
    descNew: "Arizona producers must keep records 3 years (A.R.S. § 20-290), pass PSI exams (12-month NIPR validity), and meet A.R.S. § 20-1691.12 for LTC sales.",
  },
};

for (const [file, u] of Object.entries(updates)) {
  let src = fs.readFileSync(file, "utf8");
  // Replace title (handle quoted form)
  const titleRe = new RegExp(`title:\\s*['"]?${u.titleSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}['"]?`);
  if (!titleRe.test(src)) console.warn(`  WARN title not matched for ${file}`);
  src = src.replace(titleRe, `title: '${u.titleNew}'`);
  // Replace description block — match >- block style
  const descRe = new RegExp(`description:\\s*>-\\s*\\n(?:\\s+[^\\n]+\\n)+`, "");
  src = src.replace(descRe, `description: '${u.descNew.replace(/'/g, "''")}'\n`);
  fs.writeFileSync(file, src);
  console.log(`OK: ${file.split("/").slice(-2).join("/")}`);
  console.log(`    title: ${u.titleNew} (${u.titleNew.length} chars)`);
  console.log(`    desc:  ${u.descNew.length} chars`);
}
