import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Endorsement & Affiliate Disclosure | JustInsurance" },
  description:
    "JustInsurance LLC's disclosure regarding testimonials, reviews, and our partner/affiliate referral program, consistent with the FTC Endorsement Guides.",
  alternates: { canonical: "https://justinsuranceco.com/disclosures" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Disclosures", url: "https://justinsuranceco.com/disclosures" },
]);

const LAST_UPDATED = "July 7, 2026";

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function Section({
  id,
  number,
  title,
  children,
  altBg = false,
}: {
  id: string;
  number: string;
  title: string;
  children: React.ReactNode;
  altBg?: boolean;
}) {
  return (
    <section
      id={id}
      className="py-12 px-4"
      style={altBg ? { backgroundColor: "#F5F7FA" } : { backgroundColor: "#ffffff" }}
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-navy mb-6 flex items-baseline gap-3">
          <span className="text-gold font-bold text-lg">{number}.</span>
          {title}
        </h2>
        <div className="prose-policy">{children}</div>
      </div>
    </section>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="text-gray-600 text-sm leading-relaxed mb-4">{children}</p>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function DisclosuresPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Disclosures" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Endorsement &amp; Affiliate Disclosure
          </h1>
          <p className="text-blue-100 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="text-blue-100 text-sm leading-relaxed mt-4 max-w-2xl">
            This page discloses how JustInsurance LLC (&ldquo;JustInsurance,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or
            &ldquo;our&rdquo;) handles testimonials and reviews, and our partner/affiliate referral
            program, consistent with the FTC Endorsement Guides (16 CFR Part 255).
          </p>
        </div>
      </section>

      {/* Quick-jump nav */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <div className="flex gap-3 min-w-max text-xs font-medium text-navy">
            {[
              ["#testimonials", "Testimonials & Reviews"],
              ["#affiliate-program", "Affiliate Program"],
              ["#contact", "Contact"],
            ].map(([href, label]) => (
              <a
                key={href}
                href={href}
                className="whitespace-nowrap hover:text-gold transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Testimonials & Reviews */}
      <Section id="testimonials" number="1" title="Testimonials &amp; Reviews" altBg={false}>
        <P>
          Our website, marketing materials, and course pages may feature testimonials, reviews, or
          success stories from students and customers. These reflect the individual experiences,
          opinions, and results of the specific person described and are not necessarily typical
          or guaranteed for any other person.
        </P>
        <P>
          Factors such as your state&rsquo;s licensing requirements, prior education, study habits,
          and effort will affect your individual results. Testimonials and reviews should not be
          interpreted as a promise or guarantee that you will achieve the same or similar results,
          including with respect to passing a state licensing exam.
        </P>
        <P>
          Students are not paid, discounted, or otherwise compensated in exchange for providing a
          review or testimonial &mdash; reviews reflect genuine, unincentivized student feedback.
          (This is separate from our partner/affiliate referral program described below, in which
          third parties who refer new customers may receive compensation.)
        </P>
      </Section>

      {/* 2. Partner / Affiliate Program */}
      <Section id="affiliate-program" number="2" title="Partner &amp; Affiliate Program" altBg={true}>
        <P>
          JustInsurance operates a partner/affiliate referral program under which certain
          third parties (&ldquo;partners&rdquo; or &ldquo;affiliates&rdquo;) may refer prospective
          students to JustInsurance and receive compensation, such as a commission or referral
          fee, for enrollments that result from their referral.
        </P>
        <P>
          Partners and affiliates who endorse, recommend, or promote JustInsurance &mdash; whether
          in a blog post, video, social media post, advertisement, or any other communication
          &mdash; are required to clearly and conspicuously disclose their material connection to
          JustInsurance (i.e., that they may receive compensation for the referral) whenever they
          do so. This requirement is intended to be consistent with the FTC&rsquo;s Guides
          Concerning the Use of Endorsements and Testimonials in Advertising (16 CFR Part 255).
        </P>
        <P>
          If you believe a partner or affiliate has promoted JustInsurance without making this
          disclosure, please let us know using the contact information below so we can look into
          it.
        </P>
      </Section>

      {/* 3. Contact */}
      <Section id="contact" number="3" title="Contact Information" altBg={false}>
        <P>
          Questions about this disclosure, our partner/affiliate program, or a testimonial on our
          site should be directed to:
        </P>
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-sm text-gray-700 space-y-2">
          <p className="font-bold text-navy">JustInsurance LLC</p>
          <p>PO BOX 1025<br />Rincon, PR 00677</p>
          <p>
            Email:{" "}
            <a
              href="mailto:support@justinsuranceco.com"
              className="text-navy underline hover:text-gold transition-colors"
            >
              support@justinsuranceco.com
            </a>
          </p>
          <p>
            Phone:{" "}
            <a href="tel:7542239744" className="text-navy underline hover:text-gold transition-colors">
              754-223-9744
            </a>
          </p>
        </div>
      </Section>
    </>
  );
}
