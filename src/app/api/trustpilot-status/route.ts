import { NextResponse } from "next/server";
import { getTrustpilot } from "@/lib/trustpilot";

// Diagnostic endpoint for the Trustpilot API integration (see src/lib/trustpilot.ts).
//
// GET /api/trustpilot-status -> { score, count, live }
//   live: true  => TRUSTPILOT_API_KEY is set and the Business Units API responded;
//                  score/count are the live profile numbers.
//   live: false => using the static fallback (no key set, or the request failed /
//                  returned something out of range).
//
// Public aggregate data only (the same score/count shown on the site), not linked
// anywhere. Use it once after adding the key in Vercel to confirm auto-update is
// actually live rather than silently falling back.
export const dynamic = "force-dynamic";

export async function GET() {
  const tp = await getTrustpilot();
  return NextResponse.json(tp, {
    headers: { "cache-control": "no-store" },
  });
}
