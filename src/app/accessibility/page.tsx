import type { Metadata } from "next";
import BreadcrumbNav from "@/components/BreadcrumbNav";
import { SchemaMarkup, generateBreadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: { absolute: "Accessibility Statement | JustInsurance" },
  description:
    "JustInsurance LLC's commitment to digital accessibility, our ongoing efforts toward WCAG 2.1 Level AA conformance, and how to request assistance.",
  alternates: { canonical: "https://justinsuranceco.com/accessibility" },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Home", url: "https://justinsuranceco.com/" },
  { name: "Accessibility", url: "https://justinsuranceco.com/accessibility" },
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

function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="list-disc list-outside pl-5 space-y-2 text-gray-600 text-sm leading-relaxed mb-4">
      {children}
    </ul>
  );
}

function LI({ children }: { children: React.ReactNode }) {
  return <li>{children}</li>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────────

export default function AccessibilityPage() {
  return (
    <>
      <SchemaMarkup schema={breadcrumbSchema} />

      <BreadcrumbNav
        crumbs={[
          { name: "Home", href: "/" },
          { name: "Accessibility" },
        ]}
      />

      {/* Hero */}
      <section className="bg-navy text-white py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-gold font-semibold text-sm uppercase tracking-widest mb-4">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            Accessibility Statement
          </h1>
          <p className="text-blue-100 text-sm">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="text-blue-100 text-sm leading-relaxed mt-4 max-w-2xl">
            JustInsurance LLC (&ldquo;JustInsurance,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to
            making our website and learning platform accessible to everyone, including people with
            disabilities.
          </p>
        </div>
      </section>

      {/* Quick-jump nav */}
      <div className="bg-white border-b border-gray-200 py-4 px-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto overflow-x-auto">
          <div className="flex gap-3 min-w-max text-xs font-medium text-navy">
            {[
              ["#our-commitment", "Our Commitment"],
              ["#conformance-standard", "Standard"],
              ["#ongoing-efforts", "Ongoing Efforts"],
              ["#feedback", "Feedback"],
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

      {/* 1. Our Commitment */}
      <Section id="our-commitment" number="1" title="Our Commitment" altBg={false}>
        <P>
          JustInsurance is committed to digital accessibility for people of all abilities. We
          believe that everyone &mdash; including people who use assistive technologies such as
          screen readers, screen magnifiers, or voice-recognition software &mdash; should be able
          to access our insurance prelicensing and continuing education courses, our website
          content, and our support resources.
        </P>
        <P>
          Accessibility is an ongoing effort. We continue to work to identify and address barriers
          and to improve the usability of our website and learning platform for all visitors and
          students.
        </P>
      </Section>

      {/* 2. Conformance Standard */}
      <Section id="conformance-standard" number="2" title="Conformance Standard" altBg={true}>
        <P>
          We work toward conformance with the{" "}
          <strong>Web Content Accessibility Guidelines (WCAG) 2.1, Level AA</strong>, the widely
          recognized set of recommendations for improving web accessibility published by the World
          Wide Web Consortium (W3C). These guidelines address accessibility for people with visual,
          auditory, physical, speech, cognitive, and neurological disabilities.
        </P>
        <P>
          We do not claim full or guaranteed conformance at this time. Because our website
          includes hundreds of pages and our courses are delivered through a third-party learning
          management platform (Absorb LMS), some content or features may not yet fully meet every
          WCAG 2.1 AA success criterion. We are working toward that goal on an ongoing basis.
        </P>
      </Section>

      {/* 3. Ongoing Efforts */}
      <Section id="ongoing-efforts" number="3" title="Ongoing Efforts" altBg={false}>
        <P>
          As part of our ongoing commitment to accessibility, we:
        </P>
        <UL>
          <LI>
            Regularly review our website design and content with accessibility best practices in
            mind, including color contrast, keyboard navigation, and alternative text for images.
          </LI>
          <LI>
            Work with our third-party platform providers (such as our LMS and payment processor)
            to encourage accessible design in the tools we rely on.
          </LI>
          <LI>
            Train our team to consider accessibility when creating new pages, blog content, and
            course materials.
          </LI>
          <LI>
            Prioritize and remediate accessibility barriers as they are identified, whether through
            internal review or visitor feedback.
          </LI>
        </UL>
      </Section>

      {/* 4. Feedback & Alternate Formats */}
      <Section id="feedback" number="4" title="Feedback &amp; Alternate Formats" altBg={true}>
        <P>
          If you encounter a barrier while using justinsuranceco.com or our learning platform, or
          if you need information in an alternate format, please let us know. We want to hear
          about any accessibility issues so we can work to address them.
        </P>
        <P>
          Please include the web address (URL) or a description of the page or feature involved,
          along with a description of the issue you experienced, so we can better assist you.
        </P>
      </Section>

      {/* 5. Contact */}
      <Section id="contact" number="5" title="Contact Information" altBg={false}>
        <P>
          For accessibility assistance, to report a barrier, or to request an alternate format,
          please contact us:
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
