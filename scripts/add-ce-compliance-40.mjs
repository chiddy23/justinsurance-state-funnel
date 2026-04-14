import fs from "node:fs";

const filePath = "src/lib/states.ts";
const src = fs.readFileSync(filePath, "utf8");
const lines = src.split(/\r?\n/);

const data = {
  Alabama: { lateFee: "$50 late fee if renewed within 30 days of expiration", gracePeriod: "30-day late-renewal window retroactive to expiration", reinstatementFee: "Twice the renewal fee 31 days–12 months post-expiration", reinstatementWindow: "Up to 12 months from last day of birth month without retesting", carryForward: "No — CE carry-forward not permitted (24 hrs biennial, 3 ethics)", lapseConsequence: "Your license expires and you cannot transact insurance until CE is completed and reinstatement fees are paid." },
  Alaska: { lateFee: "$100 (1–60 days late) / $200 (61+ days)", gracePeriod: "None — license lapses on expiration date", reinstatementFee: "Late penalty + renewal fee; $50 extra if paper-filed", reinstatementWindow: "Up to 1 year after expiration before new license required", carryForward: "Not publicly posted — contact Alaska DOI", lapseConsequence: "Your license lapses and all outstanding CE must be completed before you can reinstate and legally sell insurance." },
  Arizona: { lateFee: "$100 late renewal fee", gracePeriod: "None — license expires; business must stop", reinstatementFee: "$100 late renewal fee plus standard renewal fee", reinstatementWindow: "Typically up to 1 year; otherwise full relicensing", carryForward: "No — carry-forward not permitted (48 hrs required every 4 years)", lapseConsequence: "Your license expires, you must stop transacting insurance, and you owe a $100 late fee plus renewal fee to reinstate." },
  Arkansas: { lateFee: "Not publicly posted — contact Arkansas DOI", gracePeriod: "Governed by Rule 50; lapse begins at expiration", reinstatementFee: "Not publicly posted — contact Arkansas DOI", reinstatementWindow: "Up to 1 year under Rule 50 before retesting required", carryForward: "No — CE carry-forward not permitted under Rule 50", lapseConsequence: "Your license lapses and you must complete delinquent CE and pay reinstatement fees before legally transacting insurance again." },
  Colorado: { lateFee: "No separate late fee — expired license requires full reinstatement", gracePeriod: "None — license expires on continuation date", reinstatementFee: "New application and initial application fees required", reinstatementWindow: "Per Division Regulation 1-2-10", carryForward: "Yes — up to 12 carryover CE credits within 120 days of continuation", lapseConsequence: "Your license expires and you must file a new application and pay initial fees to resume transacting insurance." },
  Connecticut: { lateFee: "$160 late fee ($320 total with $160 renewal) within 1 year", gracePeriod: "Up to 1 year late-renewal window after expiration", reinstatementFee: "$130 reinstatement + NIPR transaction fee after 1 year", reinstatementWindow: "1 year for late renewal; after that, prelicensing + exam required", carryForward: "No — CE carry-forward not permitted (24 hrs biennial)", lapseConsequence: "Your license expires and you face $320 in late fees, or must retake prelicensing and the exam if over a year late." },
  Delaware: { lateFee: "Not publicly posted — contact Delaware DOI", gracePeriod: "CE and renewal fees due by Feb 28 of renewal year", reinstatementFee: "Not publicly posted — contact Delaware Producer Licensing", reinstatementWindow: "Reinstatement available; timeframes not publicly posted", carryForward: "No — CE carry-forward not permitted per Regulation 504", lapseConsequence: "Your license lapses if CE and fees are not received by February 28, and you cannot transact insurance until reinstated." },
  Hawaii: { lateFee: "Penalty fee applies if CE completed within 15 days of or after due date", gracePeriod: "No formal grace period; inactivation risk at expiration", reinstatementFee: "Penalty fee per Commissioner's Memo 2021-9LIC — contact DOI", reinstatementWindow: "Reinstatement term revised effective Jan 1, 2022", carryForward: "No — CE carry-forward not permitted", lapseConsequence: "Your license is inactivated, you cannot transact insurance, and a penalty fee plus CE completion is required to reinstate." },
  Idaho: { lateFee: "$100 (≤30 days) / $200 (31–60) / $300 (61–90)", gracePeriod: "90 days to reinstate without retesting", reinstatementFee: "$100 admin penalty plus CE penalty fees", reinstatementWindow: "90 days to reinstate; 91–365 days requires retesting", carryForward: "No — CE carry-forward not permitted", lapseConsequence: "Your license becomes inactive immediately at expiration, and you owe escalating penalties up to $300 plus reinstatement fees." },
  Indiana: { lateFee: "$120 reinstatement penalty (3× the $40 renewal fee)", gracePeriod: "None — license expires on expiration date", reinstatementFee: "$160 total ($40 renewal + $120 penalty) if CE incomplete", reinstatementWindow: "Up to 12 months after expiration; otherwise new license required", carryForward: "No — CE carry-forward not permitted (24 hrs biennial)", lapseConsequence: "Your license expires and you owe $160 in renewal and penalty fees to reinstate within 12 months or must relicense entirely." },
  Iowa: { lateFee: "$100 reinstatement fee plus $50 renewal fee", gracePeriod: "None — license expires at end of term", reinstatementFee: "$100 reinstatement fee plus $50 renewal fee via NIPR", reinstatementWindow: "Up to 12 months post-expiration before new license required", carryForward: "No — CE carry-forward not permitted (36 hrs triennial)", lapseConsequence: "Your license expires and you must clear CE, pay $150 in fees, and reinstate within 12 months or reapply as new." },
  Kansas: { lateFee: "$100 fee for failure to timely renew", gracePeriod: "None — license terminates on expiration", reinstatementFee: "$100 reinstatement fee plus $50 biennial license fee", reinstatementWindow: "Up to 1 year for residents; up to 4 years for nonresidents", carryForward: "No — CE carry-forward not permitted", lapseConsequence: "Your license terminates and you owe a $100 reinstatement fee plus the $50 renewal fee to return to active status." },
  Kentucky: { lateFee: "Not publicly posted — contact Kentucky DOI", gracePeriod: "Up to 1 year from termination to complete delinquent CE", reinstatementFee: "Standard license fees — specific amount not publicly posted", reinstatementWindow: "12 months from termination without prelicensing/exam", carryForward: "No — CE carry-forward not permitted (24 hrs biennial, 3 ethics)", lapseConsequence: "Your license terminates and you have 12 months to complete delinquent CE and pay fees before prelicensing and exam are required." },
  Louisiana: { lateFee: "Not publicly posted — contact Louisiana DOI", gracePeriod: "None — CE must be complete by renewal date", reinstatementFee: "$100 reinstatement fee", reinstatementWindow: "Must complete all outstanding CE before reinstating", carryForward: "Yes — up to 10 excess hours (life/health/P&C); none for adjusters", lapseConsequence: "Your license lapses and cannot be reinstated until all outstanding CE is completed and the reinstatement fee is paid." },
  Maine: { lateFee: "$25 per CE credit hour, up to $250 max", gracePeriod: "60 days after CE due date to complete credits and pay penalty", reinstatementFee: "Regular licensing fees if cancelled; exam retake required", reinstatementWindow: "Within 2 years if voluntarily terminated before suspension", carryForward: "Not publicly posted — contact Maine DOI", lapseConsequence: "Your license is suspended and then cancelled; you must retake the licensing exam and reapply if not cured within the window." },
  Maryland: { lateFee: "$100 late fee if renewing after expiration", gracePeriod: "Up to 1 year after expiration to reinstate", reinstatementFee: "$100 reinstatement + $54 renewal + $15 fraud fee", reinstatementWindow: "Within 1 year of expiration date", carryForward: "Not publicly posted — contact Maryland DOI", lapseConsequence: "Your license expires and you must complete CE, pay renewal plus a $100 reinstatement fee within one year or reapply entirely." },
  Massachusetts: { lateFee: "Monetary penalties apply; amount varies by lines of authority", gracePeriod: "None — penalties begin at renewal date", reinstatementFee: "$450 or $525 depending on lines of authority", reinstatementWindow: "Reinstatement available for resident producers after suspension", carryForward: "Not publicly posted — contact Massachusetts DOI", lapseConsequence: "Your license may be suspended and you must pay a $450 to $525 reinstatement fee plus complete all outstanding CE hours." },
  Michigan: { lateFee: "No separate late fee; CE must be complete before reinstatement", gracePeriod: "Less than 90 days past CE review date: license reactivates on CE upload", reinstatementFee: "$10 application fee plus $5 NIPR transaction fee", reinstatementWindow: "Within 12 months of CE review date", carryForward: "Yes — excess hours may carry over per DIFS carryover rules", lapseConsequence: "Your license is suspended or inactive and must be reinstated through NIPR with completed CE within 12 months or reapplication is required." },
  Minnesota: { lateFee: "Penalty of 2× the unpaid renewal fee", gracePeriod: "12 months from renewal due date to reinstate without exam", reinstatementFee: "Renewal fee plus 2× penalty on unpaid renewal", reinstatementWindow: "Within 12 months of renewal due date", carryForward: "Not publicly posted — contact MN Commerce", lapseConsequence: "Your license lapses and you must pay double the renewal fee within 12 months or retake the licensing exam to requalify." },
  Mississippi: { lateFee: "$50 late fee within one year after expiration", gracePeriod: "12 months after expiration to reinstate", reinstatementFee: "$50 late fee plus 50% penalty on renewal fee", reinstatementWindow: "Within 12 months of license expiration", carryForward: "Not publicly posted — contact Mississippi MID", lapseConsequence: "Your license expires and you must complete all CE, submit a new application, and pay the $50 late fee within 12 months." },
  Missouri: { lateFee: "$25 per month late fee, up to one year max", gracePeriod: "None — late fees accrue immediately after expiration", reinstatementFee: "$100 renewal fee plus accumulated monthly late fees", reinstatementWindow: "Up to 1 year past expiration with late fees", carryForward: "No — courses must be completed within the applicable biennium", lapseConsequence: "Your license expires and you owe $25 per month in late fees, capped at one year, after which you must reapply entirely." },
  Montana: { lateFee: "$100 late renewal fee if CE not completed on time", gracePeriod: "One-year grace period after expiration with late fee paid", reinstatementFee: "$100 late fee during 1-year grace; reapplication after", reinstatementWindow: "Up to 1 year after expiration for electronic late renewal", carryForward: "Not publicly posted — contact Montana CSI", lapseConsequence: "Your license lapses and you must pay a $100 late fee and complete CE within one year or reapply as a new applicant." },
  Nebraska: { lateFee: "$40 late fee within 30 days of expiration", gracePeriod: "30 days after expiration for late renewal", reinstatementFee: "$90 new application fee if expired 30 days–1 year", reinstatementWindow: "Up to 1 year from expiration to reinstate", carryForward: "Not publicly posted — contact Nebraska DOI", lapseConsequence: "Your license expires and requires a $40 late fee within 30 days or a $90 reinstatement application within one year." },
  Nevada: { lateFee: "$62.50 late penalty within 30-day grace period", gracePeriod: "30 days after expiration to late renew", reinstatementFee: "Total fee up to $435 within 1 year of expiration", reinstatementWindow: "Up to 1 year post-expiration; reapply after", carryForward: "Not publicly posted — contact Nevada DOI", lapseConsequence: "Your license expires and you have 30 days to pay a $62.50 late fee or up to one year to reinstate before full reapplication is required." },
  "New Hampshire": { lateFee: "$50 late CE fee within 60-day window before expiration", gracePeriod: "60 days between CE due date and license expiration", reinstatementFee: "Double the license fee if expired less than 2 years", reinstatementWindow: "Up to 2 years after expiration with new application", carryForward: "Not publicly posted — contact NH Insurance Department", lapseConsequence: "Your license expires, late renewals are not accepted, and you must file a new application with double the license fee within two years." },
  "New Jersey": { lateFee: "$250 late fee 31 days–1 year past expiration", gracePeriod: "30 days after expiration with no penalty", reinstatementFee: "$100 reinstatement fee plus $150 renewal fee", reinstatementWindow: "Up to 1 year beyond original expiration date", carryForward: "Yes — up to 12 CE credits carry over; ethics cannot carry over", lapseConsequence: "Your license expires and you have one year to reinstate with a $250 late fee before you must reapply as a new producer." },
  "New Mexico": { lateFee: "$50 CE penalty before renewal is processed", gracePeriod: "None — license becomes inactive at expiration", reinstatementFee: "Not publicly posted — contact New Mexico OSI", reinstatementWindow: "Reinstatement handled through NIPR same as new application", carryForward: "Not publicly posted — contact New Mexico OSI", lapseConsequence: "Your license becomes inactive and you must reapply through NIPR before legally transacting insurance again." },
  "North Dakota": { lateFee: "No late fee — no grace period exists", gracePeriod: "None — license cancels at expiration", reinstatementFee: "$100 initial-application fee (must reapply)", reinstatementWindow: "License cancels at expiration; must file new initial application", carryForward: "Yes — up to 12 credits (courses within 365 days of expiration); ethics not carried", lapseConsequence: "Your license and all appointments are canceled and you must reapply as a new licensee with a $100 fee." },
  Oklahoma: { lateFee: "Double the renewal fee if reinstating after expiration", gracePeriod: "90-day reinstatement window after expiration", reinstatementFee: "Double renewal fee (~$40 per LOA, plus SBS fee)", reinstatementWindow: "90 days from expiration to reinstate without retesting", carryForward: "Yes — 6 excess hours carry forward as general credits", lapseConsequence: "Your license expires and you must complete CE and pay double the renewal fee within 90 days to reinstate." },
  Oregon: { lateFee: "$90 late renewal fee", gracePeriod: "One-year grace period to late renew (post-Jan 2020 licenses)", reinstatementFee: "$90 late fee plus renewal fee within grace year", reinstatementWindow: "12 months from expiration to late renew; after that, reapply", carryForward: "Not publicly posted — contact Oregon DFR", lapseConsequence: "Your license expires and you have 12 months to late renew with a $90 fee before you must reapply as a new licensee." },
  "Rhode Island": { lateFee: "$100 late fee added to reinstatement", gracePeriod: "None — late fee applies after expiration", reinstatementFee: "$100 late fee plus $120 resident renewal fee", reinstatementWindow: "Reinstatement window not publicly posted — contact RI DBR", carryForward: "Not publicly posted — contact Rhode Island DBR", lapseConsequence: "Your license expires and you must pay a $100 late fee plus the renewal fee and complete all CE to reinstate." },
  "South Carolina": { lateFee: "$50 late CE compliance fee", gracePeriod: "180-day reinstatement window after expiration", reinstatementFee: "$50 paid via NIPR plus completing deficient CE hours", reinstatementWindow: "6 months (180 days); cancels on day 181", carryForward: "Yes — up to 18 excess credits carry to next biennium", lapseConsequence: "Your license is canceled after 180 days and you must retake the state exam, refingerprint, and reapply as a new licensee." },
  "South Dakota": { lateFee: "Double the renewal fee to reinstate", gracePeriod: "12 months to reinstate after lapse", reinstatementFee: "$40 reinstatement fee plus double renewal fee", reinstatementWindow: "12 months from lapse to reinstate without retesting", carryForward: "Not publicly posted — contact South Dakota DOI", lapseConsequence: "Your license lapses, all appointments terminate, and you must complete prior-period CE plus pay double renewal to reinstate within 12 months." },
  Tennessee: { lateFee: "Not publicly posted — contact Tennessee TDCI", gracePeriod: "60-day expired-grace period for renewal", reinstatementFee: "Not publicly posted — contact Tennessee TDCI", reinstatementWindow: "60 days to renew via CORE; up to 1 year to reinstate", carryForward: "Not publicly posted — contact Tennessee TDCI", lapseConsequence: "Your license expires and after 60 days you must request reinstatement; after one year you must retest and reapply." },
  Utah: { lateFee: "Not publicly posted — contact Utah UID", gracePeriod: "Reinstatement available days 4–365 after inactivation", reinstatementFee: "Set per UID FY2025 Fee Schedule — contact UID", reinstatementWindow: "1 year from expiration to reinstate", carryForward: "Not publicly posted — contact Utah UID", lapseConsequence: "Your license inactivates and you have one year to complete CE and pay reinstatement fees before you must reapply as new." },
  Vermont: { lateFee: "Not publicly posted — contact Vermont DFR", gracePeriod: "None — license cannot be reactivated once lapsed", reinstatementFee: "None — must apply as new license", reinstatementWindow: "No reinstatement; must apply as new license", carryForward: "No — excess CE credits do not carry over between review periods", lapseConsequence: "Your license cannot be reactivated and you must apply for a new license, including any required testing." },
  Washington: { lateFee: "Additional late fee applies (amount on OIC fee schedule)", gracePeriod: "60 days after expiration to renew with late fee", reinstatementFee: "Set on OIC fee schedule — contact Washington OIC", reinstatementWindow: "Up to 60 days renew with late fee; reinstatement application after", carryForward: "Not publicly posted — contact Washington OIC", lapseConsequence: "Your license expires and you have 60 days to renew with a late fee before you must complete a full reinstatement application." },
  "West Virginia": { lateFee: "Double the unpaid renewal fee (~$100)", gracePeriod: "None — license expires at due date", reinstatementFee: "$50 renewal plus $100 penalty (double-fee) within 12 months", reinstatementWindow: "12 months from renewal due date to reinstate without exam", carryForward: "Not publicly posted — contact West Virginia OIC", lapseConsequence: "Your license lapses and you must complete CE plus pay double the renewal fee within 12 months to reinstate without retesting." },
  Wisconsin: { lateFee: "Not publicly posted — contact Wisconsin OCI", gracePeriod: "12-month reinstatement window after revocation", reinstatementFee: "$140 reinstatement fee", reinstatementWindow: "12 months from expiration to reinstate", carryForward: "Not publicly posted — contact Wisconsin OCI", lapseConsequence: "Your license is revoked and you have 12 months to complete CE and pay a $140 fee before you must retake prelicensing and the exam." },
  Wyoming: { lateFee: "100% of the renewal fee (doubles your total)", gracePeriod: "One-year reinstatement period after expiration", reinstatementFee: "Renewal fee + equal late fee (e.g., $150 + $150 = $300)", reinstatementWindow: "12 months from expiration to reinstate", carryForward: "Not publicly posted — contact Wyoming DOI", lapseConsequence: "Your license expires and you must finish CE and pay double the renewal fee within 12 months to reinstate." },
};

function findStateCeCloseMissingCompliance(stateName) {
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

  let hasCompliance = false;
  let ceCloseIdx = -1;
  for (let i = ceOpenIdx + 1; i < ceOpenIdx + 60; i++) {
    if (/^\s{6}compliance:\s*\{/.test(lines[i])) hasCompliance = true;
    if (/^\s{4}\},\s*$/.test(lines[i])) {
      ceCloseIdx = i;
      break;
    }
  }
  if (ceCloseIdx === -1) throw new Error(`ce close not found for ${stateName}`);
  return { ceCloseIdx, hasCompliance };
}

function buildComplianceBlock(c) {
  return [
    `      compliance: {`,
    `        lateFee: ${JSON.stringify(c.lateFee)},`,
    `        gracePeriod: ${JSON.stringify(c.gracePeriod)},`,
    `        reinstatementFee: ${JSON.stringify(c.reinstatementFee)},`,
    `        reinstatementWindow: ${JSON.stringify(c.reinstatementWindow)},`,
    `        carryForward: ${JSON.stringify(c.carryForward)},`,
    `        lapseConsequence: ${JSON.stringify(c.lapseConsequence)},`,
    `      },`,
  ];
}

const targets = Object.entries(data)
  .map(([name, c]) => {
    const info = findStateCeCloseMissingCompliance(name);
    return { name, c, ...info };
  })
  .filter((t) => {
    if (t.hasCompliance) {
      console.log(`SKIP ${t.name} — already has compliance`);
      return false;
    }
    return true;
  })
  .sort((a, b) => b.ceCloseIdx - a.ceCloseIdx);

for (const t of targets) {
  const block = buildComplianceBlock(t.c);
  lines.splice(t.ceCloseIdx, 0, ...block);
  console.log(`Inserted compliance for ${t.name} before line ${t.ceCloseIdx + 1}`);
}

fs.writeFileSync(filePath, lines.join("\n"));
console.log(`\nDone. ${targets.length} states updated.`);
