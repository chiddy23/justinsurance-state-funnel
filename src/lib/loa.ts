export type LOASlug = "life" | "health" | "life-and-health";

export interface LOADefinition {
  slug: LOASlug;
  name: string;
  shortName: string;
  description: string;
}

export const LOA_DEFINITIONS: Record<LOASlug, LOADefinition> = {
  life: {
    slug: "life",
    name: "Life Insurance",
    shortName: "Life",
    description:
      "Life insurance licenses authorize agents to sell policies that pay a death benefit to beneficiaries upon the insured's passing. This line of authority covers term life, whole life, universal life, variable life, and annuity products. Anyone who sells, solicits, or negotiates life insurance contracts for compensation must hold a valid life insurance license in each state where they do business.",
  },
  health: {
    slug: "health",
    name: "Health Insurance",
    shortName: "Health",
    description:
      "Health insurance licenses authorize agents to sell policies that cover medical expenses, hospitalization, disability income, long-term care, and related health benefits. This line of authority includes individual and group health plans, Medicare supplement policies, dental and vision coverage, and accident and sickness policies. A health insurance license is required for any agent who sells or solicits health coverage for compensation.",
  },
  "life-and-health": {
    slug: "life-and-health",
    name: "Life & Health Insurance",
    shortName: "Life & Health",
    description:
      "The combined life and health license authorizes agents to sell both life insurance and health insurance products under a single license. This is the most common license sought by new agents because it opens the broadest range of product opportunities—from term and whole life policies to major medical, Medicare, and long-term care coverage. Prelicensing is certified by line of authority, so the Life and Health prelicensing courses are completed separately; many states then offer a single combined Life & Health exam, while others require a separate exam for each line.",
  },
};

export const ALL_LOA_SLUGS: LOASlug[] = ["life", "health", "life-and-health"];

/**
 * Strip a trailing " Insurance" from an LOA display name so composed strings
 * like `${loaName} Insurance Prelicensing` don't render "Insurance Insurance".
 * Use this when a downstream template appends its own "Insurance"/"insurance"
 * word — meta descriptions, schema fields, FAQ prose, etc.
 *
 * Examples:
 *   loaShortName("Life Insurance")          → "Life"
 *   loaShortName("Health Insurance")        → "Health"
 *   loaShortName("Life & Health Insurance") → "Life & Health"
 *   loaShortName("Life")                    → "Life"  (idempotent)
 */
export function loaShortName(loaName: string): string {
  return loaName.replace(/\s+Insurance$/i, "");
}
