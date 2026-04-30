// Maps blog clusters to their associated state slug.
// State-specific clusters get linked to the relevant state's money pages
// (state hub + prelicensing + CE) from the bottom of every post and cluster
// hub. Generic clusters (career guide, exam prep) return null and show a
// "browse all states" CTA instead.

export const CLUSTER_TO_STATE_MAP: Record<string, string> = {
  // Florida
  "florida-ce-requirements": "florida",
  "florida-insurance-license": "florida",

  // Texas
  "texas-ce-requirements": "texas",
  "texas-insurance-license": "texas",

  // Standard state-license-* clusters
  "state-license-arizona": "arizona",
  "state-license-california": "california",
  "state-license-colorado": "colorado",
  "state-license-georgia": "georgia",
  "state-license-illinois": "illinois",
  "state-license-indiana": "indiana",
  "state-license-maryland": "maryland",
  "state-license-michigan": "michigan",
  "state-license-minnesota": "minnesota",
  "state-license-new-jersey": "new-jersey",
  "state-license-new-york": "new-york",
  "state-license-north-carolina": "north-carolina",
  "state-license-ohio": "ohio",
  "state-license-pennsylvania": "pennsylvania",
  "state-license-tennessee": "tennessee",
  "state-license-virginia": "virginia",
  "state-license-washington": "washington",

  // April 27 batch
  "state-license-alabama": "alabama",
  "state-license-connecticut": "connecticut",
  "state-license-massachusetts": "massachusetts",
  "state-license-nevada": "nevada",
  "state-license-oregon": "oregon",
  "state-license-south-carolina": "south-carolina",

  // April 30 batch
  "state-license-kentucky": "kentucky",
  "state-license-louisiana": "louisiana",
  "state-license-missouri": "missouri",
  "state-license-wisconsin": "wisconsin",
};

// Display-name lookup so the link UI doesn't need to import states.ts
// (avoids a heavy import for a small piece of data)
export const STATE_DISPLAY_NAMES: Record<string, string> = {
  "arizona": "Arizona",
  "california": "California",
  "colorado": "Colorado",
  "florida": "Florida",
  "georgia": "Georgia",
  "illinois": "Illinois",
  "indiana": "Indiana",
  "maryland": "Maryland",
  "michigan": "Michigan",
  "minnesota": "Minnesota",
  "new-jersey": "New Jersey",
  "new-york": "New York",
  "north-carolina": "North Carolina",
  "ohio": "Ohio",
  "pennsylvania": "Pennsylvania",
  "tennessee": "Tennessee",
  "texas": "Texas",
  "virginia": "Virginia",
  "washington": "Washington",
  "alabama": "Alabama",
  "connecticut": "Connecticut",
  "massachusetts": "Massachusetts",
  "nevada": "Nevada",
  "oregon": "Oregon",
  "south-carolina": "South Carolina",
  "kentucky": "Kentucky",
  "louisiana": "Louisiana",
  "missouri": "Missouri",
  "wisconsin": "Wisconsin",
};

export function getStateForCluster(clusterSlug: string): { slug: string; name: string } | null {
  const slug = CLUSTER_TO_STATE_MAP[clusterSlug];
  if (!slug) return null;
  const name = STATE_DISPLAY_NAMES[slug];
  if (!name) return null;
  return { slug, name };
}
