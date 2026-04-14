import fs from "node:fs";

const filePath = "src/lib/states.ts";
const src = fs.readFileSync(filePath, "utf8");
const lines = src.split(/\r?\n/);

const data = {
  Florida: {
    lateFee: "Settlement Stipulation fine (negotiated)",
    gracePeriod: "~45 days after compliance period ends",
    reinstatementFee: "$25 appointment reinstatement + $60 appointment fee",
    reinstatementWindow: "Good-cause extension or Settlement Stipulation",
    carryForward: "Not addressed — contact Florida DFS for written policy",
    lapseConsequence: "Your appointments get cancelled, you cannot write business, and you must pay a fine under a Settlement Stipulation plus reinstatement fees.",
  },
  Texas: {
    lateFee: "$25 late fee (if renewal not paid by expiration)",
    gracePeriod: "90 days after expiration to renew",
    reinstatementFee: "$50 per CE hour not completed + $25 late fee + new application fee",
    reinstatementWindow: "91 days–1 year; after 1 year full re-application",
    carryForward: "Not addressed — contact TDI CE Unit",
    lapseConsequence: "You're fined $50 for every CE hour missed, pay a $25 late fee, and after 90 days must reinstate with new fingerprints and a new application.",
  },
  California: {
    lateFee: "50% penalty added to renewal fee",
    gracePeriod: "None — not authorized until reinstated",
    reinstatementFee: "50% of original renewal fee (penalty)",
    reinstatementWindow: "Up to 1 year after expiration; after that, new application required",
    carryForward: "CE completed while inactive is credited toward reinstatement",
    lapseConsequence: "You cannot legally sell insurance until you pay a 50% reinstatement penalty and complete CE, and after one year you must start over as a new applicant.",
  },
  "New York": {
    lateFee: "Not publicly posted — contact DFS",
    gracePeriod: "None formal — CE must be complete before renewal",
    reinstatementFee: "$10 filing fee + license class fee",
    reinstatementWindow: "Up to 2 years; after that new license required",
    carryForward: "Not addressed — contact DFS CE Unit",
    lapseConsequence: "You must complete all 15 CE credits and file a relicensing application with a $10 fee, and if more than 2 years pass you must start over with a new license.",
  },
  Georgia: {
    lateFee: "Fee via Sircon checkout — contact OCI",
    gracePeriod: "None formal — license inactivates if CE incomplete",
    reinstatementFee: "Filed through Sircon (displays fees at checkout)",
    reinstatementWindow: "Up to 12 months; fingerprints required if reinstating within 6 months",
    carryForward: "Not addressed — contact Georgia OCI",
    lapseConsequence: "Your license is inactivated and you have 12 months to reinstate through Sircon, or you must apply for a new license.",
  },
  "North Carolina": {
    lateFee: "No separate late fee",
    gracePeriod: "4 months after CE compliance date",
    reinstatementFee: "$75 (paid to Prometric)",
    reinstatementWindow: "4 months; after that full prelicensing + exam required",
    carryForward: "Yes — excess general hours carry forward; ethics only as general credit",
    lapseConsequence: "You cannot legally transact insurance in NC; after the 4-month window you must retake prelicensing education and pass the state exam again.",
  },
  Ohio: {
    lateFee: "$50 late renewal fee during 1-month grace",
    gracePeriod: "1 month after expiration",
    reinstatementFee: "$300 (plus renewal fee if applicable)",
    reinstatementWindow: "Up to 1 year; after that full re-licensing required",
    carryForward: "Yes — up to 50% of next cycle's requirement (up to 12 hrs for Major Lines)",
    lapseConsequence: "Your license is suspended and you cannot transact insurance in Ohio until CE is completed and reinstatement fees are paid.",
  },
  Pennsylvania: {
    lateFee: "Not publicly posted as separate fee",
    gracePeriod: "60 days for retroactive reinstatement",
    reinstatementFee: "$165 (payable to Commonwealth of Pennsylvania)",
    reinstatementWindow: "Up to 12 months; after that full re-licensing required",
    carryForward: "Yes — up to 24 excess CE hours may carry to next period",
    lapseConsequence: "You cannot legally transact insurance in PA; all outstanding CE for the lapsed period must be completed before reinstatement.",
  },
  Illinois: {
    lateFee: "$215 penalty fee",
    gracePeriod: "None — license lapses on expiration if CE incomplete",
    reinstatementFee: "$215 reinstatement + $215 renewal = $430 total",
    reinstatementWindow: "Up to 12 months via NIPR; after that full re-licensing required",
    carryForward: "Limited — excess ethics only as general credit; new ethics course required each cycle",
    lapseConsequence: "You cannot legally transact insurance in Illinois; carriers may withhold commissions until your license is reinstated.",
  },
  Virginia: {
    lateFee: "Reinstatement fee = 2× renewal fee per line",
    gracePeriod: "None — license expires on renewal date",
    reinstatementFee: "$10 renewal + $20 reinstatement per line of authority",
    reinstatementWindow: "Up to 12 months from renewal date",
    carryForward: "No — excess CE credits do not carry forward",
    lapseConsequence: "You cannot legally transact insurance in Virginia; all CE must be completed before reinstatement is submitted through Sircon.",
  },
};

function findStateCeClose(stateName) {
  const nameIdx = lines.findIndex((l) => l.includes(`name: "${stateName}",`));
  if (nameIdx === -1) throw new Error(`State not found: ${stateName}`);
  let ceOpenIdx = -1;
  for (let i = nameIdx; i < nameIdx + 250 && i < lines.length; i++) {
    if (/^\s{4}ce:\s*\{/.test(lines[i])) {
      ceOpenIdx = i;
      break;
    }
  }
  if (ceOpenIdx === -1) throw new Error(`ce block not found for ${stateName}`);
  for (let i = ceOpenIdx + 1; i < ceOpenIdx + 50; i++) {
    if (/^\s{4}\},\s*$/.test(lines[i])) return i;
  }
  throw new Error(`ce close not found for ${stateName}`);
}

function buildComplianceBlock(c) {
  const indent = "      ";
  const lines = [
    `${indent}compliance: {`,
    `${indent}  lateFee: ${JSON.stringify(c.lateFee)},`,
    `${indent}  gracePeriod: ${JSON.stringify(c.gracePeriod)},`,
    `${indent}  reinstatementFee: ${JSON.stringify(c.reinstatementFee)},`,
    `${indent}  reinstatementWindow: ${JSON.stringify(c.reinstatementWindow)},`,
    `${indent}  carryForward: ${JSON.stringify(c.carryForward)},`,
    `${indent}  lapseConsequence: ${JSON.stringify(c.lapseConsequence)},`,
    `${indent}},`,
  ];
  return lines;
}

const targets = Object.entries(data)
  .map(([name, c]) => ({ name, c, closeIdx: findStateCeClose(name) }))
  .sort((a, b) => b.closeIdx - a.closeIdx);

for (const t of targets) {
  const block = buildComplianceBlock(t.c);
  lines.splice(t.closeIdx, 0, ...block);
  console.log(`Inserted compliance for ${t.name} before line ${t.closeIdx + 1}`);
}

fs.writeFileSync(filePath, lines.join("\n"));
console.log(`\nDone. ${targets.length} states updated.`);
