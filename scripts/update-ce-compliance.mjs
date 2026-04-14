import fs from "node:fs";

const filePath = "src/lib/states.ts";
let src = fs.readFileSync(filePath, "utf8");

// Full 6-field updates for 8 gap states
const fullUpdates = {
  Georgia: {
    lateFee: "$15 during 15-day grace period (on top of $100/line renewal)",
    gracePeriod: "15 days after expiration",
    reinstatementFee: "$280 total; fingerprinting required again if 6+ months expired",
    reinstatementWindow: "Up to 12 months; reapply as new after 12 months",
    carryForward: "No — excess credits do not carry to next renewal period",
    lapseConsequence: "Your license expires, and after a 15-day grace period you pay $280 to reinstate; after 12 months you must reapply as a new licensee.",
  },
  Hawaii: {
    lateFee: "None — no grace period, license lapses immediately on expiration",
    gracePeriod: "None — license lapses on expiration date",
    reinstatementFee: "$300 total ($200 penalty + $100 renewal) per Commissioner's Memo 2021-9LIC",
    reinstatementWindow: "Up to 1 year; full relicensing required after",
    carryForward: "No — excess credits cannot be carried forward",
    lapseConsequence: "Your license lapses immediately on expiration and you must pay $300 plus complete CE within 1 year or relicense entirely.",
  },
  Kentucky: {
    lateFee: "$40 (with active appointments) / $80 (without) within 2 months",
    gracePeriod: "2-month late renewal window after expiration",
    reinstatementFee: "After 2 months: full re-application + background check + standard fees",
    reinstatementWindow: "12 months via re-application; after 12 months full relicensing",
    carryForward: "Yes — up to 12 hours may carry forward",
    lapseConsequence: "Your license cancels after the 2-month late window, and you must file a full re-application within 12 months or complete prelicensing and the exam again.",
  },
  "New Mexico": {
    lateFee: "$150 total within 30-day grace ($60 renewal + $90 late); +$50 CE penalty if CE incomplete",
    gracePeriod: "30-day grace for late renewal",
    reinstatementFee: "Days 31–365: $180 total ($120 reinstatement + $60 renewal); +$50 CE penalty if applicable",
    reinstatementWindow: "30-day grace → 31–365 reinstatement → relicense after 1 year",
    carryForward: "No — credits do not carry forward",
    lapseConsequence: "Your license has a 30-day grace period with a $150 late fee; after that you pay $180 to reinstate within a year or must retest and re-fingerprint.",
  },
  "Rhode Island": {
    lateFee: "None during 30-day grace — standard $130 renewal fee applies",
    gracePeriod: "30 days after expiration (no penalty)",
    reinstatementFee: "Days 31–365: $170 resident ($130 renewal + $50 reinstatement) / $180 non-resident",
    reinstatementWindow: "30-day grace → 31–365 reinstatement → reapply as new after 1 year",
    carryForward: "Yes — up to 12 hours; ethics carry as general only (must earn 3 new ethics each cycle)",
    lapseConsequence: "Your license has a no-penalty 30-day grace, then a $170 reinstatement window through month 12, after which you must reapply as a new licensee.",
  },
  Vermont: {
    lateFee: "None — no late renewal allowed; license suspended on expiration",
    gracePeriod: "None — license suspended on expiration date",
    reinstatementFee: "$30/line renewal fee + late renewal penalty (amount not published online)",
    reinstatementWindow: "Up to 2 years (unusually long); after 2 years, full relicensing including exam",
    carryForward: "Not publicly addressed — contact Vermont DFR",
    lapseConsequence: "Your license is suspended immediately at expiration and must be reinstated within 2 years via the initial application process, or you must retake the exam.",
  },
  Washington: {
    lateFee: "$82.50/line for days 1–60 after expiration (via OIC Online Services only)",
    gracePeriod: "60 days after expiration for late renewal",
    reinstatementFee: "$165 for individual full-lines producer (days 61–365) per WAC 284-17-490",
    reinstatementWindow: "Days 1–60 late renewal → 61–365 reinstatement → new licensee after 1 year",
    carryForward: "No — excess credits cannot be carried forward",
    lapseConsequence: "Your license has a 60-day late renewal window at $82.50/line, then a $165 reinstatement window through month 12 before you must reapply.",
  },
  Wisconsin: {
    lateFee: "None — no grace period, no late renewal allowed",
    gracePeriod: "None — license expires immediately at expiration",
    reinstatementFee: "$70 resident / $140 non-resident; delinquent CE also requires Laws & Regulation Assessment",
    reinstatementWindow: "Up to 1 year; full relicensing after (prelicensing, exam, fingerprints)",
    carryForward: "No — excess credits cannot be carried forward",
    lapseConsequence: "Your license expires instantly with no late renewal option; you have 1 year to pay $70 plus any required testing or you must relicense entirely.",
  },
};

// Carry-forward-only updates (all other researched states)
const carryForwardUpdates = {
  Alaska: "Yes — up to 8 excess hours may carry forward",
  Florida: "Yes — up to 24 hours; ethics carry as general only (must earn 4 new FL Law & Ethics each cycle)",
  Louisiana: "Yes — up to 10 hours (general credits only); none for adjusters",
  Maine: "No — excess credits do not carry forward",
  Maryland: "No — excess credits do not carry forward",
  Massachusetts: "Yes — up to 45 hours (MA uses 3-year cycle); ethics carry as general only, must earn 3 new ethics each cycle",
  Minnesota: "No — excess credits do not carry forward",
  Mississippi: "No — excess credits do not carry forward",
  Montana: "No — excess credits do not carry forward",
  "New York": "Likely no — no current official carry-forward language (NY S.6122-A pending; monitor for signature)",
  Pennsylvania: "Yes — up to 24 hours may carry forward",
  Texas: "No — excess credits do not carry forward",
  "West Virginia": "Yes — up to 6 excess hours may carry forward",
};

function replaceComplianceField(stateName, field, newValue) {
  const nameRegex = new RegExp(`(name: "${stateName.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&")}",[\\s\\S]*?compliance: \\{[\\s\\S]*?${field}: )"[^"]*"(,)`);
  const before = src;
  src = src.replace(nameRegex, (_, p1, p2) => `${p1}${JSON.stringify(newValue)}${p2}`);
  return src !== before;
}

let totalChanges = 0;

// Full updates
for (const [state, fields] of Object.entries(fullUpdates)) {
  for (const [field, value] of Object.entries(fields)) {
    const changed = replaceComplianceField(state, field, value);
    if (!changed) console.warn(`  WARN: ${state}.${field} not updated`);
    else totalChanges++;
  }
  console.log(`Updated all 6 fields for ${state}`);
}

// Carry-forward-only updates
for (const [state, value] of Object.entries(carryForwardUpdates)) {
  const changed = replaceComplianceField(state, "carryForward", value);
  if (!changed) console.warn(`  WARN: ${state}.carryForward not updated`);
  else {
    totalChanges++;
    console.log(`Updated carryForward for ${state}`);
  }
}

fs.writeFileSync(filePath, src);
console.log(`\nTotal field replacements: ${totalChanges}`);
