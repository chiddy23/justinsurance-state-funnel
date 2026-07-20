// Live Google Business Profile rating + review count for the TrustBar.
//
// Fetched server-side from the Google Places API (New) Place Details endpoint and
// cached with ISR revalidation, so the number auto-updates as reviews come in
// WITHOUT a code change or redeploy. HTML display only — we deliberately do NOT
// emit this as AggregateRating/Review JSON-LD (self-serving review schema on our
// own Organization violates Google's structured-data guidelines; same stance as
// the Trustpilot data in ./trustpilot.ts).
//
// To activate, set two server-side env vars (never NEXT_PUBLIC_*, so the key is
// not exposed to the browser):
//   GOOGLE_PLACES_API_KEY  — a Google Cloud API key with the "Places API (New)"
//                            enabled (billing on; restrict the key to that API).
//   GOOGLE_PLACE_ID        — the JustInsurance Google Business Profile place_id
//                            (e.g. "ChIJif0rmven2YgRDrPDfn-JP8w").
//
// If either is missing or the request fails, getGoogleReviews() returns FALLBACK
// so the site never breaks (degrades to the last-known-good numbers).

export interface GoogleReviews {
  /** Average rating, one decimal, e.g. "4.9". */
  rating: string;
  /** Total number of Google reviews (0 when unknown/unavailable). */
  count: number;
  /** True only when the numbers came from the live API (vs. the fallback). */
  live: boolean;
}

// Last-known-good snapshot (verified via Places API 2026-07-06). Used only when
// the API key / place ID are absent or the request fails.
const FALLBACK: GoogleReviews = { rating: "4.9", count: 22, live: false };

// Google review counts change slowly; refresh twice a day. One cached fetch is
// shared across every page render (Next dedupes + revalidates), so this is ~2
// API calls/day regardless of traffic.
const REVALIDATE_SECONDS = 60 * 60 * 12;

export async function getGoogleReviews(): Promise<GoogleReviews> {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!key || !placeId) return FALLBACK;

  try {
    const res = await fetch(
      `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}`,
      {
        headers: {
          "X-Goog-Api-Key": key,
          "X-Goog-FieldMask": "rating,userRatingCount",
        },
        next: { revalidate: REVALIDATE_SECONDS },
      }
    );
    if (!res.ok) return FALLBACK;
    const data = await res.json();
    if (typeof data?.rating !== "number") return FALLBACK;
    return {
      rating: data.rating.toFixed(1),
      count: typeof data.userRatingCount === "number" ? data.userRatingCount : 0,
      live: true,
    };
  } catch {
    return FALLBACK;
  }
}
