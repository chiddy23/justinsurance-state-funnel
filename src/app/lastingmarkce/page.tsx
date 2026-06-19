import type { Metadata } from "next";
import Image from "next/image";
import LastingMarkStateSelect from "@/components/LastingMarkStateSelect";

// ---------------------------------------------------------------------------
// Private CE landing page — JustInsurance × Lasting Mark partnership.
// UNLISTED on purpose. "Google must never find this." How that's enforced:
//   1. robots: noindex,nofollow below — the authoritative signal. Overrides the
//      root layout's "index, follow" (Next.js merges metadata child-over-parent).
//   2. NOT in the sitemap (src/lib/sitemap-data.ts is a curated list; omitted).
//   3. NOT linked from nav/footer/internal links — direct URL only.
//   4. NOT robots.txt-disallowed, so Googlebot can fetch and HONOR the noindex
//      (a disallow would risk a bare-URL index).
// For true privacy (hide the content, not just the listing), put it behind auth.
// ---------------------------------------------------------------------------

const CATALOG_URL =
  "https://yourinsurancelicense.myabsorb.com/#/catalog/8b752ab9-df9c-45f2-bd07-5dc0b85ca4e2";
const COUPON_CODE = "LASTINGMARK";

export const metadata: Metadata = {
  title: "Continuing Education Courses",
  description:
    "Complete your state-approved insurance continuing education online — fast, self-paced, and the lowest prices in the industry.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

const VALUE_PROPS = [
  {
    title: "Complete CE Faster",
    body: "Finish your CE quickly with no forced seat time — move at your own pace and get credits sooner.",
  },
  {
    title: "Self-Paced Learning",
    body: "Start anytime, pause anytime. Complete your CE without interrupting your work or sales schedule.",
  },
  {
    title: "State-Approved & Compliant",
    body: "Every course is fully approved by state insurance departments, so you can renew with confidence.",
  },
  {
    title: "Fast, Reliable Support",
    body: "Need help? Our support team responds quickly to keep you moving and get you certified without delays.",
  },
];

const WHY = [
  "We continually evolve our courses using technology and data to make learning more efficient, personalized, and impactful.",
  "We strive to deliver top-tier content, up-to-date exam preparation, and engaging instruction that exceeds industry standards.",
  "We uphold honesty, transparency, and ethics in all aspects of our business and teaching, ensuring trust between our company, instructors, and students.",
];

export default function LastingMarkCEPage() {
  return (
    <>
      {/* Co-brand partnership bar */}
      <div className="bg-white py-4 border-b border-gray-200">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4">
          <Image
            src="/lastingmarkce/cobrand-logo.png"
            alt="JustInsurance in partnership with Lasting Mark"
            width={300}
            height={86}
            priority
            className="h-auto w-[260px] sm:w-[300px]"
          />
        </div>
      </div>

      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <Image
          src="/lastingmarkce/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center -z-10"
        />
        <div className="absolute inset-0 -z-10 bg-navy/85" />
        <div className="mx-auto max-w-5xl px-4 py-20 sm:py-28 text-center text-white">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold">
            JustInsurance Continuing Education
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Need CE Credits Fast?
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/90">
            Complete your state-approved insurance CE online — quick, easy, and
            hassle-free. Move at your own pace and report the same day.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <a
              href={CATALOG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-gold px-8 py-4 text-lg font-bold text-navy-dark shadow-lg transition hover:bg-gold-light"
            >
              View Course Catalog
            </a>
            <p className="text-sm text-white/80">
              Just{" "}
              <span className="font-semibold text-white">
                $1.50 per credit hour
              </span>{" "}
              — already the lowest prices in the industry.
            </p>
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-gray-200 bg-gray-bg p-6"
              >
                <h2 className="text-lg font-bold text-navy">{v.title}</h2>
                <p className="mt-2 text-sm text-gray-dark/80">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Find your courses: state picker + coupon + how-to */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold">
              Find Your State-Approved CE Courses
            </h2>
            <p className="mt-3 text-white/80">
              Select your state to browse its CE catalog, or watch the quick
              video below for step-by-step instructions.
            </p>
          </div>

          {/* State picker */}
          <div className="mt-8">
            <LastingMarkStateSelect />
          </div>

          {/* Coupon callout */}
          <div className="mx-auto mt-10 max-w-2xl rounded-xl border border-gold/40 bg-white/5 p-6 text-center">
            <p className="text-white/90">
              🏷️ Use this coupon code at checkout to get{" "}
              <span className="font-bold text-gold">$10 OFF</span> your CE
              courses:
            </p>
            <p className="mt-3 text-3xl font-extrabold tracking-wider text-gold">
              {COUPON_CODE}
            </p>
          </div>

          {/* How-to graphic */}
          <div className="mx-auto mt-10 max-w-3xl">
            <Image
              src="/lastingmarkce/coupon-steps.webp"
              alt={`How to apply your ${COUPON_CODE} coupon: 1) enter the code in the Coupon Code box, 2) click Apply, 3) click Proceed to Checkout.`}
              width={1200}
              height={675}
              className="h-auto w-full rounded-xl shadow-lg"
            />
          </div>

          {/* Video */}
          <div className="mx-auto mt-10 max-w-3xl">
            <p className="mb-3 text-center text-white/80">
              Watch this quick video to see how to find CE packages and purchase
              individual courses.
            </p>
            <div
              className="relative w-full overflow-hidden rounded-xl shadow-lg"
              style={{ paddingTop: "56.25%" }}
            >
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/pt5O4plYy-A"
                title="How to find CE packages and purchase individual courses"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-white/60">
            Note: Some states require an additional reporting or submission fee
            paid directly to the state. Final pricing may vary by state.
          </p>
        </div>
      </section>

      {/* Why choose */}
      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center text-3xl font-bold text-navy">
            Why Choose JustInsurance
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {WHY.map((w, i) => (
              <p
                key={i}
                className="rounded-xl border border-gray-200 p-6 text-sm text-gray-dark/80"
              >
                {w}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-navy-dark text-white">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Ready to knock out your CE?
          </h2>
          <p className="mt-3 text-white/80">
            Self-paced, state-approved, and the lowest prices in the industry.
          </p>
          <a
            href={CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-lg bg-gold px-8 py-4 text-lg font-bold text-navy-dark shadow-lg transition hover:bg-gold-light"
          >
            View Course Catalog
          </a>
          <p className="mt-6 text-sm text-white/70">
            Questions? Call{" "}
            <a href="tel:+17542239744" className="font-semibold text-gold">
              754-223-9744
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
