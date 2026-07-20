// src/app/api/collect/route.ts
// ---------------------------------------------------------------------------
// Attribution collector: receives fire-and-forget visit records POSTed by the
// middleware (see src/middleware.ts logRequest) and streams them into
// BigQuery justinsurance-seo.justinsurance_analytics.site_requests
// (day-partitioned on ts, 90d expiry). Powers IP+time purchase attribution
// against Authorize.net customerIP/submitTimeUTC.
//
// Contract:
//   * 401 when x-collect-key doesn't match COLLECT_KEY (or COLLECT_KEY unset
//     — fail closed).
//   * After auth passes, ALWAYS 200 — {ok:true} on insert success, {ok:false}
//     if the BQ insert throws. Never a 5xx: the middleware fires and forgets,
//     and error statuses would only invite retry/hammering behavior.
//   * All strings coerced + length-capped to match the site_requests schema.
// ---------------------------------------------------------------------------

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { BigQuery } from "@google-cloud/bigquery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATASET = "justinsurance_analytics";
const TABLE = "site_requests";

// --- Singleton BigQuery client (same defensive pattern as the dashboard's
// lib/bigquery.ts getBQ) --------------------------------------------------

let _bq: BigQuery | null = null;

function getBQ(): BigQuery {
  if (_bq) return _bq;

  const projectId = process.env.GCP_PROJECT_ID || "justinsurance-seo";
  const rawKey = process.env.GCP_SA_KEY;

  if (!rawKey) {
    // No explicit key — fall back to ADC / GOOGLE_APPLICATION_CREDENTIALS.
    // The insert is wrapped in try/catch, so misconfig degrades to {ok:false}
    // instead of crashing the route module at import time.
    _bq = new BigQuery({ projectId });
    return _bq;
  }

  let credentials: Record<string, unknown> | undefined;
  try {
    credentials = JSON.parse(rawKey);
  } catch {
    // Malformed key JSON — build the client anyway; insert will catch/degrade.
    _bq = new BigQuery({ projectId });
    return _bq;
  }

  _bq = new BigQuery({ projectId, credentials });
  return _bq;
}

// --- Helpers ---------------------------------------------------------------

const BOT_REGEX =
  /bot|crawl|spider|slurp|bingpreview|headless|python|curl|wget|gpt/i;

/** Coerce any value to a length-capped string ('' for non-scalars/null). */
function str(v: unknown, max: number): string {
  if (typeof v === "string") return v.slice(0, max);
  if (typeof v === "number" || typeof v === "boolean") {
    return String(v).slice(0, max);
  }
  return "";
}

/** Use the body's ts if it's a valid ISO-parseable timestamp, else now. */
function tsOrNow(v: unknown): string {
  if (typeof v === "string" && v.length <= 40 && !Number.isNaN(Date.parse(v))) {
    return v;
  }
  return new Date().toISOString();
}

// --- Handlers ----------------------------------------------------------------

export async function POST(req: NextRequest) {
  // Auth: shared secret header. Fail closed when COLLECT_KEY is unset.
  const expected = process.env.COLLECT_KEY;
  const provided = req.headers.get("x-collect-key") ?? "";
  if (!expected || provided !== expected) {
    return NextResponse.json(
      { ok: false, error: "unauthorized" },
      { status: 401 }
    );
  }

  // Parse body defensively — a malformed body still yields a (mostly empty)
  // row rather than an error response.
  let body: Record<string, unknown> = {};
  try {
    const parsed: unknown = await req.json();
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      body = parsed as Record<string, unknown>;
    }
  } catch {
    // Unparseable JSON — proceed with the empty body.
  }

  const user_agent = str(body.user_agent, 400);

  // HTTP status the middleware served this request (200 pass-through, 503
  // maintenance, 403 geo-block, etc.). Lets us tell whether a scraper is
  // actually harvesting content (200) or bouncing off the maintenance page
  // (503). Nullable INT64; older callers that omit it write NULL.
  const status =
    typeof body.status === "number" && Number.isFinite(body.status)
      ? Math.trunc(body.status)
      : null;

  // Row shaped EXACTLY to the site_requests schema (ts REQUIRED, rest nullable).
  const row = {
    ts: tsOrNow(body.ts),
    ip: str(body.ip, 400),
    path: str(body.path, 1500),
    query: str(body.query, 1500),
    referrer: str(body.referrer, 1500),
    utm_source: str(body.utm_source, 400),
    utm_medium: str(body.utm_medium, 400),
    utm_campaign: str(body.utm_campaign, 400),
    gclid: str(body.gclid, 400),
    fbclid: str(body.fbclid, 400),
    ji_vid: str(body.ji_vid, 400),
    city: str(body.city, 400),
    region: str(body.region, 400),
    country: str(body.country, 400),
    postal: str(body.postal, 400),
    user_agent,
    is_bot: BOT_REGEX.test(user_agent),
    status,
  };

  try {
    await getBQ().dataset(DATASET).table(TABLE).insert([row]);
    return NextResponse.json({ ok: true });
  } catch {
    // Insert failed (quota, transient, schema drift...) — still 200 so the
    // caller never retries/hammers. The row is lost by design.
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "method not allowed" },
    { status: 405 }
  );
}
